# Frontend

This is the Vite + React + TypeScript frontend skeleton for Tourbnb.

## Setup

```powershell
cd frontend
npm ci
npm run dev
```

## Scripts
- `npm run dev` — start dev server (Vite)
- `npm run build` — build
- `npm run preview` — preview production build

## shadcn UI
We use a small set of shadcn-style components (Card, Input, Label, Button, ThemeToggle) in `src/components/ui/`.

Pages are organized under `src/pages/admin` and `src/pages/manager` for separate admin & manager dashboards and login pages.

Example routes (dev server):
- `/admin/login` — Admin login page
- `/manager/login` — Hotel Manager login page (responsive & illustrative)

To add more UI components, follow the shadcn UI patterns and export them under `src/components/ui`.
