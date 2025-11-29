# Runbook (Local Dev) — Phase 1

## Services
- Postgres: run via `docker compose up db` or via the full compose
- Backend: port `7000`
- Frontend: port `5174`

## Basic Commands
- Start local compose:
```powershell
docker compose up --build
```
- Backend dev:
```powershell
cd backend
cp .env.example .env
# update DATABASE_URL to point at local Postgres
npm ci
npm run dev
```
- Frontend dev
```powershell
cd frontend
npm ci
npm run dev
```

## Seed data
- In the future we’ll add `seed` scripts to populate admin & demo hotel/room data.
