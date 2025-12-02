"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../src/index"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe('Auth Integration', () => {
    beforeAll(async () => {
        // ensure seeded users exist in DB - optional: run seed script programmatically
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    it('logs in admin and returns accessToken + cookie and /me returns user', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/login')
            .send({ email: 'admin@tourbnb.local', password: 'password123' })
            .expect(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('expiresAt');
        expect(res.headers['set-cookie']).toBeDefined();
        // call /me using cookie
        const me = await (0, supertest_1.default)(index_1.default).get('/api/auth/me').set('Cookie', res.headers['set-cookie']).expect(200);
        expect(me.body.email).toBe('admin@tourbnb.local');
    });
});
