import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signJwtToken, verifyJwtToken } from '../utils/jwt';

const router = Router();
const prisma = new PrismaClient();

const TOKEN_COOKIE_NAME = 'token';

router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email + password required' });

    const existing = await prisma.user.findUnique({ where: { email }});
    if (existing) return res.status(409).json({ error: 'email already in use' });

    const hash = await bcrypt.hash(password, 8);
    const user = await prisma.user.create({ data: { email, passwordHash: hash, role } });
    const { token, expiresAt } = signJwtToken({ id: user.id, role: user.role });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };
    res.cookie(TOKEN_COOKIE_NAME, token, cookieOptions);
    return res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, accessToken: token, expiresAt });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email + password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'invalid' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid' });

    // Check role if specified in request
    if (role && user.role !== role) {
      return res.status(401).json({ error: 'invalid role' });
    }

    const { token, expiresAt } = signJwtToken({ id: user.id, role: user.role });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };
    res.cookie(TOKEN_COOKIE_NAME, token, cookieOptions);
    return res.json({ user: { id: user.id, email: user.email, role: user.role }, accessToken: token, expiresAt });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

router.post('/logout', async (req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME);
  return res.json({ ok: true });
});

router.get('/me', async (req, res) => {
  try {
    // Support token in cookie or Authorization header for flexibility
    const cookieToken = req.cookies[TOKEN_COOKIE_NAME];
    const headerToken = req.headers.authorization?.split(' ')[1];
    const token = cookieToken || headerToken;
    if (!token) return res.status(401).json({ error: 'unauthenticated' });
    const payload = verifyJwtToken(token) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(404).json({ error: 'not found' });
    return res.json({ id: user.id, email: user.email, role: user.role });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: 'unauthenticated' });
  }
});

export default router;
