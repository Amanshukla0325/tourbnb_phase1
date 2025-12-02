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
      const res = await _fetch(`${SERVER_URL}/api/health`);
      if (res.ok) return true;
    } catch (e) {
      // ignore
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

function parseSetCookie(headers) {
  const raw = headers.get('set-cookie');
  if (!raw) return null;
  return raw.split(',').map(s => s.split(';', 1)[0]).join('; ');
}

async function runTest(){
  console.log('Building server...');
  const build = spawn('npm', ['run', 'build'], { cwd: __dirname + '/..', shell: true });
  build.stdout.on('data', d => process.stdout.write(d));
  build.stderr.on('data', d => process.stderr.write(d));
  await new Promise((resolve, reject) => build.on('exit', code => code === 0 ? resolve() : reject(new Error('build failed'))));

  console.log('Starting server...');
  const server = spawn('node', ['dist/index.js'], { cwd: __dirname + '/..', shell: true });
  server.stdout.on('data', d => process.stdout.write(`SERVER: ${d}`));
  server.stderr.on('data', d => process.stdout.write(`SERVER-ERR: ${d}`));

  const ok = await waitForServer();
  if (!ok) { server.kill(); console.error('Server did not start'); process.exit(1); }

  // Ensure DB seeded
  const admin = await prisma.user.findUnique({ where: { email: 'admin@tourbnb.local' } });
  if (!admin) {
    // seed
    console.log('Seeding DB...');
    const spawnSeed = spawn('npm', ['run', 'seed'], { cwd: __dirname + '/..', shell: true });
    await new Promise((res, rej) => spawnSeed.on('exit', code => code === 0 ? res() : rej(new Error('seed failed'))));
  }

  // Admin login
  const adminLogin = await _fetch(`${SERVER_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@tourbnb.local', password: 'password123' })
  });
  const adminCookie = parseSetCookie(adminLogin.headers);
  const adminJson = await adminLogin.json();
  if (!adminJson.accessToken || !adminJson.expiresAt) { console.error('Admin login did not return accessToken/expiresAt'); server.kill(); process.exit(1); }
  if (!adminCookie) { console.error('Admin cookie not set'); server.kill(); process.exit(1); }

  // Create hotel as admin
  const hotelRes = await _fetch(`${SERVER_URL}/api/admin/hotels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ name: 'Admin Created Hotel', subdomain: `admin-hotel-${Date.now()}`, timezone: 'UTC', currency: 'USD' })
  });

  console.log('Create hotel status:', hotelRes.status);
  if (hotelRes.status !== 201) {
    console.error('Admin could not create hotel');
    server.kill(); process.exit(1);
  }
  const hotelJson = await hotelRes.json();
  const hotelId = hotelJson.id;
  console.log('Hotel created:', hotelId);

  // Manager login
  const mgrLogin = await _fetch(`${SERVER_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'manager@tourbnb.local', password: 'password123' })
  });
  const managerCookie = parseSetCookie(mgrLogin.headers);
  const managerJson = await mgrLogin.json();
  if (!managerJson.accessToken || !managerJson.expiresAt) { console.error('Manager login did not return accessToken/expiresAt'); server.kill(); process.exit(1); }
  if (!managerCookie) { console.error('Manager cookie not set'); server.kill(); process.exit(1); }

  // Assign manager to hotel via DB (seed doesn't assign this admin-created hotel, so assign)
  const manager = await prisma.user.findUnique({ where: { email: 'manager@tourbnb.local' } });
  if (!manager) { console.error('No manager user'); server.kill(); process.exit(1); }
  await prisma.hotelManager.create({ data: { hotelId, managerId: manager.id } });

  // Manager create room for hotel
  const roomRes = await _fetch(`${SERVER_URL}/api/manager/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: managerCookie },
    body: JSON.stringify({ hotelId, code: '201', name: 'Room 201', capacity: 2, pricePerNight: 200 })
  });
  console.log('Manager create room status:', roomRes.status);
  if (roomRes.status !== 201) {
    console.error('Manager could not create room for assigned hotel');
    server.kill(); process.exit(1);
  }
  const roomJson = await roomRes.json();
  console.log('Manager created room id:', roomJson.id);

  // Ensure manager cannot create room for a hotel they don't manage
  const orphanHotel = await prisma.hotel.create({ data: { ownerId: admin.id, name: `OrphanHotel-${Date.now()}`, subdomain: `orphan-${Date.now()}`, timezone: 'UTC', currency: 'USD' } });
  const roomOrphanRes = await _fetch(`${SERVER_URL}/api/manager/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: managerCookie },
    body: JSON.stringify({ hotelId: orphanHotel.id, code: '301', name: 'Room 301' })
  });
  console.log('Manager create room for orphan hotel status:', roomOrphanRes.status);
  if (roomOrphanRes.status === 201) { console.error('Manager incorrectly created room for a hotel they do not manage.'); server.kill(); process.exit(1); }

  console.log('Auth & RBAC test completed successfully');

  // Cleanup - delete rooms and bookings/payments first to avoid FK errors
  const rooms = await prisma.room.findMany({ where: { hotelId }, select: { id: true } });
  const roomIds = rooms.map(r => r.id);
  if (roomIds.length > 0) {
    const bookings = await prisma.booking.findMany({ where: { roomId: { in: roomIds } }, select: { id: true } });
    const bookingIds = bookings.map(b => b.id);
    if (bookingIds.length) {
      await prisma.payment.deleteMany({ where: { bookingId: { in: bookingIds } } }).catch(() => {});
      await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } }).catch(() => {});
    }
    await prisma.room.deleteMany({ where: { id: { in: roomIds } } });
  }

  // orphan hotel rooms
  const orphanRooms = await prisma.room.findMany({ where: { hotelId: orphanHotel.id }, select: { id: true } });
  const orphanRoomIds = orphanRooms.map(r => r.id);
  if (orphanRoomIds.length > 0) {
    const orphanBookings = await prisma.booking.findMany({ where: { roomId: { in: orphanRoomIds } }, select: { id: true } });
    const orphanBookingIds = orphanBookings.map(b => b.id);
    if (orphanBookingIds.length) {
      await prisma.payment.deleteMany({ where: { bookingId: { in: orphanBookingIds } } }).catch(() => {});
      await prisma.booking.deleteMany({ where: { id: { in: orphanBookingIds } } }).catch(() => {});
    }
    await prisma.room.deleteMany({ where: { id: { in: orphanRoomIds } } });
  }

  await prisma.hotelManager.deleteMany({ where: { hotelId } });
  await prisma.hotel.delete({ where: { id: hotelId } });
  await prisma.hotel.delete({ where: { id: orphanHotel.id } });

  server.kill('SIGTERM');
  process.exit(0);
}

runTest().catch(e => { console.error(e); process.exit(1); });