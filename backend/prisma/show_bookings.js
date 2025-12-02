const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  console.log('Listing booking table rows (raw):');
  const bookingIntervals = await prisma.$queryRaw`SELECT id, "roomId", booking_interval::text as booking_interval_text, "checkIn", "checkOut" FROM "Booking"`;
  console.log(bookingIntervals);
  console.log('booking_interval raw:', bookingIntervals);
}

main().finally(() => prisma.$disconnect());