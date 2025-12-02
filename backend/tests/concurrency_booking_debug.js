const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  const room = await prisma.room.findFirst();
  if(!room){
    console.log('No rooms found');
    return;
  }

  const guest = await prisma.user.create({ data: { email: `guest_${Date.now()}@test.com`, passwordHash: 'test', role: 'GUEST' }});

  const checkIn = new Date();
  checkIn.setUTCDate(checkIn.getUTCDate() + 2);
  checkIn.setUTCHours(14,0,0,0);
  const checkOut = new Date(checkIn.getTime());
  checkOut.setUTCDate(checkOut.getUTCDate() + 1);

  const attempts = 10;
  const results = await Promise.allSettled(
    Array.from({ length: attempts }).map(async (_, idx) => {
      try {
        const booking = await prisma.booking.create({ data: {
          roomId: room.id,
          guestId: guest.id,
          checkIn: checkIn,
          checkOut: checkOut,
          status: 'PENDING'
        }});
        return { success: true, id: booking.id };
      } catch (e) {
        return { success: false, error: e.message, code: e.code };
      }
    })
  );

  console.log(`Attempts: ${attempts}`);
  const successes = results.filter(r => r.status === 'fulfilled' && r.value && r.value.success);
  const fails = results.filter(r => r.status === 'fulfilled' && !(r.value && r.value.success))
    .concat(results.filter(r => r.status === 'rejected'));

  console.log(`Successes: ${successes.length}`);
  console.log(`Failures: ${fails.length}`);
  console.log('Success IDs:', successes.map(s => s.value.id));

  fails.forEach((f, i) => {
    if (f.status === 'fulfilled' && f.value) {
      console.log(`fail ${i}: error=${f.value.error} code=${f.value.code}`);
    } else {
      console.log(`fail ${i}: status=${f.status}`);
    }
  });

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); });