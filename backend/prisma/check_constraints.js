const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  const constRes = await prisma.$queryRaw`SELECT conname, contype FROM pg_constraint WHERE conname = 'bookings_no_overlap';`;
  console.log('Constraint:', constRes);

  const colRes = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='Booking' AND column_name IN ('booking_interval','checkIn','checkOut');`;
  console.log('Columns:', colRes);
}

main().finally(()=> prisma.$disconnect());
