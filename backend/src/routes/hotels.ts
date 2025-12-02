import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET all hotels (public, with optional city filter)
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    
    const where: any = {};
    if (city) where.city = { contains: city, mode: 'insensitive' };

    const hotels = await prisma.hotel.findMany({
      where,
      include: { rooms: true, _count: { select: { bookings: true } } }
    });
    return res.json(hotels);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// GET single hotel details (public)
router.get('/:id', async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: req.params.id },
      include: { rooms: { include: { bookings: { select: { checkIn: true, checkOut: true } } } } }
    });
    if (!hotel) return res.status(404).json({ error: 'hotel not found' });
    return res.json(hotel);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

export default router;
