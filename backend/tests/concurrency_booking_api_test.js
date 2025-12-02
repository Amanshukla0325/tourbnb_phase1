const { spawn } = require('child_process');
const _fetch = (typeof globalThis.fetch === 'function') ? globalThis.fetch : (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SERVER_PORT = process.env.PORT || 7000;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

async function waitForServer() {
  const maxRetries = 30;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${SERVER_URL}/api/health`);
      if (res.ok) return true;
    } catch (e) {
      // ignore
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

async function clearBookingsForSeedRoom() {
  const room = await prisma.room.findFirst();
  if (!room) return;
  const bookings = await prisma.booking.findMany({ where: { roomId: room.id }, select: { id: true } });
  const bookingIds = bookings.map(b => b.id);
  if (bookingIds.length > 0) {
    await prisma.payment.deleteMany({ where: { bookingId: { in: bookingIds } } }).catch(() => {});
    await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } });
  }
  console.log('Cleared bookings for room', room.id);
  return room.id;
}

async function runTest(){
  // Build first to ensure dist exists
  console.log('Running `npm run build` to ensure backend dist is ready...');
  const build = spawn('npm', ['run', 'build'], { cwd: __dirname + '/..', shell: true });
  build.stdout.on('data', d => process.stdout.write(d));
  build.stderr.on('data', d => process.stderr.write(d));
  await new Promise((resolve, reject) => build.on('exit', code => code === 0 ? resolve() : reject(new Error('build failed'))));

  console.log('Starting backend server (dist/index.js)...');
  const server = spawn('node', ['dist/index.js'], { cwd: __dirname + '/..', shell: true });
  server.stdout.on('data', d => process.stdout.write(`SERVER: ${d}`));
  server.stderr.on('data', d => process.stdout.write(`SERVER-ERR: ${d}`));

  const ok = await waitForServer();
  if (!ok) {
    console.error('Server did not start in time');
    server.kill();
    process.exit(1);
  }

  const roomId = await clearBookingsForSeedRoom();
  if (!roomId) {
    console.error('No seeded room found; please seed the DB first and try again');
    server.kill();
    process.exit(1);
  }

  const checkIn = new Date();
  checkIn.setUTCDate(checkIn.getUTCDate() + 2);
  checkIn.setUTCHours(14,0,0,0);
  const checkOut = new Date(checkIn.getTime());
  checkOut.setUTCDate(checkOut.getUTCDate() + 1);

  const attempts = 10;
  const responses = await Promise.all(
    Array.from({ length: attempts }).map(async () => {
      try {
        const r = await _fetch(`${SERVER_URL}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString(), createPayment: true })
        });
        const json = await r.json().catch(_ => ({}));
        return { status: r.status, body: json };
      } catch (e) {
        return { status: 500, error: String(e) };
      }
    })
  );

  const successes = responses.filter(r => r.status === 201);
  const conflicts = responses.filter(r => r.status === 409);
  console.log(`Attempts: ${attempts}`);
  console.log(`Successes: ${successes.length}`);
  console.log(`409 Conflicts: ${conflicts.length}`);
  console.log('Success responses:', successes);
  console.log('Conflict responses (sample):', conflicts.slice(0,3));

  // Cleanup: remove created bookings
  const bookings = await prisma.booking.findMany({ where: { roomId }, select: { id: true } });
  const bookingIds = bookings.map(b => b.id);
  if (bookingIds.length > 0) {
    await prisma.payment.deleteMany({ where: { bookingId: { in: bookingIds } } }).catch(() => {});
    await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } });
  }
  console.log('Cleaned created bookings');

  // Kill server
  server.kill('SIGTERM');
  process.exit(0);
}

runTest().catch(e => { console.error(e); process.exit(1); });