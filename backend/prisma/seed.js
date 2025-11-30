const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main(){
  const adminEmail = 'admin@tourbnb.local';
  const managerEmail = 'manager@tourbnb.local';

  const adminPass = 'password123';
  const managerPass = 'password123';

  const adminHash = await bcrypt.hash(adminPass, 8);
  const managerHash = await bcrypt.hash(managerPass, 8);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: adminHash, role: 'SUPER_ADMIN' }
  });

  const manager = await prisma.user.upsert({
    where: { email: managerEmail },
    update: {},
    create: { email: managerEmail, passwordHash: managerHash, role: 'MANAGER' }
  });

  const hotel = await prisma.hotel.create({
    data: {
      ownerId: admin.id,
      name: 'Demo Hotel',
      subdomain: 'demo-hotel',
      timezone: 'Asia/Kolkata',
      currency: 'INR'
    }
  });

  const room = await prisma.room.create({
    data: {
      hotelId: hotel.id,
      code: '101',
      name: 'Room 101',
      capacity: 2,
      pricePerNight: 100
    }
  });

  await prisma.hotelManager.create({
    data: {
      hotelId: hotel.id,
      managerId: manager.id
    }
  });

  console.log('Seed complete. Admin credentials:', adminEmail, 'password:', adminPass);
  console.log('Manager credentials:', managerEmail, 'password:', managerPass);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
