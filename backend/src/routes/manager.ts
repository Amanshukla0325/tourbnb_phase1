import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, isManager, isHotelOwnerOrManager } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET assigned hotel for manager
router.get('/hotel', authenticate, isManager, async (req: AuthRequest, res) => {
  try {
    const assignment = await prisma.hotelManager.findFirst({
      where: { managerId: req.user!.id },
      include: { hotel: { include: { rooms: true, bookings: true } } }
    });
    if (!assignment) return res.status(404).json({ error: 'no hotel assigned' });
    return res.json(assignment.hotel);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// GET bookings for manager's hotel
router.get('/bookings', authenticate, isManager, async (req: AuthRequest, res) => {
  try {
    const assignment = await prisma.hotelManager.findFirst({
      where: { managerId: req.user!.id }
    });
    if (!assignment) return res.status(404).json({ error: 'no hotel assigned' });

    const bookings = await prisma.booking.findMany({
      where: { hotelId: assignment.hotelId },
      include: { room: true }
    });
    return res.json(bookings);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// UPDATE booking status (manager only)
router.put('/bookings/:id', authenticate, isManager, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const assignment = await prisma.hotelManager.findFirst({
      where: { managerId: req.user!.id }
    });
    if (!assignment) return res.status(404).json({ error: 'no hotel assigned' });

    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, hotelId: assignment.hotelId }
    });
    if (!booking) return res.status(404).json({ error: 'booking not found' });

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status }
    });
    return res.json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// CREATE room for manager's hotel
router.post('/rooms', authenticate, isManager, async (req: AuthRequest, res) => {
  try {
    const { code, name, capacity, pricePerNight } = req.body;
    if (!code || !name || capacity === undefined || pricePerNight === undefined) {
      return res.status(400).json({ error: 'code, name, capacity, pricePerNight required' });
    }

    // Get the hotel assigned to this manager
    const assignment = await prisma.hotelManager.findFirst({
      where: { managerId: req.user!.id }
    });
    if (!assignment) return res.status(404).json({ error: 'no hotel assigned' });

    const room = await prisma.room.create({
      data: {
        hotelId: assignment.hotelId,
        code,
        name,
        capacity: parseInt(capacity),
        pricePerNight: parseFloat(pricePerNight)
      }
    });

    return res.status(201).json(room);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// UPDATE room for manager's hotel
router.put('/rooms/:roomId', authenticate, isManager, async (req: AuthRequest, res) => {
  try {
    const { code, name, capacity, pricePerNight } = req.body;

    const assignment = await prisma.hotelManager.findFirst({
      where: { managerId: req.user!.id }
    });
    if (!assignment) return res.status(404).json({ error: 'no hotel assigned' });

    const room = await prisma.room.findFirst({
      where: { id: req.params.roomId, hotelId: assignment.hotelId }
    });
    if (!room) return res.status(404).json({ error: 'room not found' });

    const updated = await prisma.room.update({
      where: { id: req.params.roomId },
      data: {
        code: code || undefined,
        name: name || undefined,
        capacity: capacity !== undefined ? parseInt(capacity) : undefined,
        pricePerNight: pricePerNight !== undefined ? parseFloat(pricePerNight) : undefined
      }
    });

    return res.json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// DELETE room for manager's hotel
router.delete('/rooms/:roomId', authenticate, isManager, async (req: AuthRequest, res) => {
  try {
    const assignment = await prisma.hotelManager.findFirst({
      where: { managerId: req.user!.id }
    });
    if (!assignment) return res.status(404).json({ error: 'no hotel assigned' });

    const room = await prisma.room.findFirst({
      where: { id: req.params.roomId, hotelId: assignment.hotelId }
    });
    if (!room) return res.status(404).json({ error: 'room not found' });

    await prisma.room.delete({ where: { id: req.params.roomId } });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

export default router;
