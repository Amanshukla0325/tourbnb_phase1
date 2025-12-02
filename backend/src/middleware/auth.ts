import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyJwtToken } from '../utils/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TOKEN_COOKIE_NAME = 'token';

export interface AuthRequest extends Request {
  user?: { id: string; role: string } | null;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cookieToken = req.cookies[TOKEN_COOKIE_NAME];
    const headerToken = req.headers.authorization?.split(' ')[1];
    const token = cookieToken || headerToken;
    if (!token) return res.status(401).json({ error: 'unauthenticated' });
    const payload = verifyJwtToken(token) as any;
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'unauthenticated' });
  }
}

export function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
  if (req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'forbidden' });
  return next();
}

export function isManager(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
  if (req.user.role !== 'MANAGER') return res.status(403).json({ error: 'forbidden' });
  return next();
}

export async function isHotelOwnerOrManager(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
  const userId = req.user.id;
  // Allow SUPER_ADMIN to proceed
  if (req.user.role === 'SUPER_ADMIN') return next();

  // For MANAGER check they've been assigned to the hotel provided in req.body.hotelId or query
  const hotelId = req.body?.hotelId || req.query?.hotelId || req.params?.hotelId || req.params?.id;
  if (!hotelId) return res.status(400).json({ error: 'hotelId required' });

  const assignment = await prisma.hotelManager.findFirst({ where: { hotelId, managerId: userId } });
  if (!assignment) return res.status(403).json({ error: 'forbidden' });
  return next();
}

export default { authenticate, isAdmin, isManager, isHotelOwnerOrManager };
