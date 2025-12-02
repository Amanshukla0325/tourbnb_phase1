const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  const room = await prisma.room.findFirst();
  if (!room) {
    console.log('No rooms found. Nothing to delete.');
    return;
  }
  const deleted = await prisma.booking.deleteMany({ where: { roomId: room.id } });
  console.log('Deleted bookings count:', deleted.count);
}

main().finally(()=> prisma.$disconnect());