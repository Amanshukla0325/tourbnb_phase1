import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { hotelId, roomId, guestEmail, guestName, checkIn, checkOut } = req.body;

    if (!hotelId || !roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'hotelId, roomId, checkIn, checkOut are required' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ error: 'checkIn and checkOut must be valid ISO date strings' });
    }

    const booking = await prisma.booking.create({
      data: {
        hotelId,
        roomId,
        guestEmail: guestEmail ?? undefined,
        guestName: guestName ?? undefined,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        status: 'PENDING'
      }
    });

    return res.status(201).json(booking);
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    console.error('Booking creation error:', e);
    return res.status(500).json({ error: 'Internal server error', detail: msg });
  }
});

export default router;
