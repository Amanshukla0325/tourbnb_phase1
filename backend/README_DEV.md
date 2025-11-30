# Backend Dev Notes

## Tools
- Node 20
- Postgres (see docker-compose)
- Prisma (migrations)

## Develop
- Copy `.env.example` to `.env` and set `DATABASE_URL` to local postres
- Install dependencies: `npm ci`
- Apply Prisma migrations: `npx prisma migrate dev` (after setting DATABASE_URL)
- Run dev server: `npm run dev`
 - To apply migrations to dev Neon: `npx prisma migrate deploy`
 - Seed database (after migrations): `npm run seed`
