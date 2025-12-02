import { Router } from 'express';
import type { Request } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Check if any admin exists (no auth required - for signup flow)
router.get('/exists', async (req, res) => {
  try {
    const adminCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
    return res.json({ exists: adminCount > 0 });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// GET all managers (admin only)
router.get('/managers', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const managers = await prisma.user.findMany({
      where: { role: 'MANAGER' },
      select: { id: true, email: true, role: true, createdAt: true }
    });
    return res.json(managers);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// GET all hotels (admin only)
router.get('/hotels', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const hotels = await prisma.hotel.findMany({
      where: { ownerId: req.user!.id },
      include: { managers: true, rooms: true, bookings: true }
    });
    return res.json(hotels);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// GET single hotel (admin only)
router.get('/hotels/:id', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const hotel = await prisma.hotel.findFirst({
      where: { id: req.params.id, ownerId: req.user!.id },
      include: { managers: { include: { manager: { select: { id: true, email: true } } } }, rooms: true }
    });
    if (!hotel) return res.status(404).json({ error: 'hotel not found' });
    return res.json(hotel);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// GET bookings for specific hotel (admin only)
router.get('/hotels/:id/bookings', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const hotel = await prisma.hotel.findFirst({
      where: { id: req.params.id, ownerId: req.user!.id }
    });
    if (!hotel) return res.status(404).json({ error: 'hotel not found' });

    const bookings = await prisma.booking.findMany({
      where: { hotelId: req.params.id },
      include: { room: true }
    });
    return res.json(bookings);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// CREATE hotel (admin only)
router.post('/hotels', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, description, address, city, subdomain } = req.body;
    if (!name || !subdomain) return res.status(400).json({ error: 'name + subdomain required' });

    const hotel = await prisma.hotel.create({
      data: {
        ownerId: req.user!.id,
        name,
        description: description || undefined,
        address: address || undefined,
        city: city || undefined,
        subdomain
      }
    });

    return res.status(201).json(hotel);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// UPDATE hotel (admin only)
router.put('/hotels/:id', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, description, address, city } = req.body;
    
    const hotel = await prisma.hotel.findFirst({
      where: { id: req.params.id, ownerId: req.user!.id }
    });
    if (!hotel) return res.status(404).json({ error: 'hotel not found' });

    const updated = await prisma.hotel.update({
      where: { id: req.params.id },
      data: { name, description, address, city }
    });

    return res.json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// DELETE hotel (admin only)
router.delete('/hotels/:id', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const hotel = await prisma.hotel.findFirst({
      where: { id: req.params.id, ownerId: req.user!.id }
    });
    if (!hotel) return res.status(404).json({ error: 'hotel not found' });

    await prisma.hotel.delete({ where: { id: req.params.id } });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

// ASSIGN manager to hotel
router.post('/hotels/:id/assign-manager', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const { managerEmail } = req.body;
    if (!managerEmail) return res.status(400).json({ error: 'managerEmail required' });

    const hotel = await prisma.hotel.findFirst({
      where: { id: req.params.id, ownerId: req.user!.id }
    });
    if (!hotel) return res.status(404).json({ error: 'hotel not found' });

    const manager = await prisma.user.findUnique({ where: { email: managerEmail } });
    if (!manager) return res.status(404).json({ error: 'manager user not found' });

    const assignment = await prisma.hotelManager.create({
      data: { hotelId: hotel.id, managerId: manager.id }
    });

    return res.status(201).json(assignment);
  } catch (e: any) {
    console.error(e);
    if (e?.code === 'P2002') return res.status(409).json({ error: 'manager already assigned' });
    return res.status(500).json({ error: 'internal' });
  }
});

// CREATE room in hotel (admin only)
router.post('/hotels/:id/rooms', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const { code, name, capacity, pricePerNight } = req.body;
    if (!code || !name || capacity === undefined || pricePerNight === undefined) {
      return res.status(400).json({ error: 'code, name, capacity, pricePerNight required' });
    }

    const hotel = await prisma.hotel.findFirst({
      where: { id: req.params.id, ownerId: req.user!.id }
    });
    if (!hotel) return res.status(404).json({ error: 'hotel not found' });

    const room = await prisma.room.create({
      data: {
        hotelId: hotel.id,
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

// UPDATE room (admin only)
router.put('/hotels/:hotelId/rooms/:roomId', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const { code, name, capacity, pricePerNight } = req.body;

    const hotel = await prisma.hotel.findFirst({
      where: { id: req.params.hotelId, ownerId: req.user!.id }
    });
    if (!hotel) return res.status(404).json({ error: 'hotel not found' });

    const room = await prisma.room.findFirst({
      where: { id: req.params.roomId, hotelId: hotel.id }
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

// DELETE room (admin only)
router.delete('/hotels/:hotelId/rooms/:roomId', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const hotel = await prisma.hotel.findFirst({
      where: { id: req.params.hotelId, ownerId: req.user!.id }
    });
    if (!hotel) return res.status(404).json({ error: 'hotel not found' });

    const room = await prisma.room.findFirst({
      where: { id: req.params.roomId, hotelId: hotel.id }
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
