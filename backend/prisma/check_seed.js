const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  const hotels = await prisma.hotel.findMany({ include: { rooms: true, managers: true }});
  console.log('Hotels:', JSON.stringify(hotels, null, 2));
  const users = await prisma.user.findMany();
  console.log('Users:', users);
  const rooms = await prisma.room.findMany();
  console.log('Rooms:', rooms);
}

main().finally(()=> prisma.$disconnect());
