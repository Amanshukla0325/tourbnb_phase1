const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  const rows = await prisma.$queryRaw`SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'Availability';`;
  console.log('Availability indexes:', rows);
  const rows2 = await prisma.$queryRaw`SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'Booking';`;
  console.log('Booking indexes:', rows2);
}

main().finally(()=> prisma.$disconnect());
