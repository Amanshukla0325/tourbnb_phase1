import request from 'supertest';
import app from '../../src/index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Integration', () => {
  beforeAll(async () => {
    // ensure seeded users exist in DB - optional: run seed script programmatically
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('logs in admin and returns accessToken + cookie and /me returns user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@tourbnb.local', password: 'password123' })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('expiresAt');
    expect(res.headers['set-cookie']).toBeDefined();

    // call /me using cookie
    const me = await request(app).get('/api/auth/me').set('Cookie', res.headers['set-cookie']).expect(200);
    expect(me.body.email).toBe('admin@tourbnb.local');
  });
});
