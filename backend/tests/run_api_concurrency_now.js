const _fetch = (typeof globalThis.fetch === 'function') ? globalThis.fetch : (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  const room = await prisma.room.findFirst();
  if(!room){
    console.log('No room seeded');
    return;
  }
  const roomId = room.id;
  // Clean-up: delete payments first to avoid FK constraints, then delete bookings
  const bookings = await prisma.booking.findMany({ where: { roomId }, select: { id: true } });
  const bookingIds = bookings.map(b => b.id);
  console.log('Found bookings for cleanup:', bookingIds);
  const paymentCountBefore = await prisma.payment.count({ where: { bookingId: { in: bookingIds } } });
  console.log('Payment count for those bookings (before):', paymentCountBefore);
  if (bookingIds.length > 0) {
    await prisma.payment.deleteMany({ where: { bookingId: { in: bookingIds } } }).catch(() => {});
    await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } });
  }
  console.log('Cleared old bookings for', roomId);

  const checkIn = new Date();
  checkIn.setUTCDate(checkIn.getUTCDate() + 2);
  checkIn.setUTCHours(14,0,0,0);
  const checkOut = new Date(checkIn.getTime());
  checkOut.setUTCDate(checkOut.getUTCDate() + 1);

  const attempts = 10;
  const results = await Promise.all(
    Array.from({ length: attempts }).map(async () => {
      const res = await _fetch('http://localhost:7000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString(), createPayment: true })
      });
      const body = await res.json().catch(() => ({}));
      return { status: res.status, body };
    })
  );

  const successes = results.filter(r => r.status === 201).length;
  const conflicts = results.filter(r => r.status === 409).length;
  console.log('Results:', { attempts, successes, conflicts });
  if (bookingIds.length > 0) {
    await prisma.payment.deleteMany({ where: { bookingId: { in: bookingIds } } }).catch(() => {});
    await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } });
  }
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });