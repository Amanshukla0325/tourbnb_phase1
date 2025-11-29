# Tourbnb - Phase 1: Product Brief (MVP)

## Objective
Build a minimal, production-ready channel manager MVP that enables a chain Admin to create hotels (each with its own subdomain), a Manager to add rooms for those hotels, and customers to book rooms with payment (Stripe). Prevent double-bookings for the same room + date range.

## Context
We are building Tourbnb as a channel manager implementing key booking flows. For the MVP we will support only direct bookings (no external OTAs yet). We will learn from both the `mern-booking-app-main` repo (hotel CRUD, bookings, Stripe, e2e tests) and `CAREGRID_LITE` repo (timezone handling, admin patterns, data integrity and migration practices) but will not modify or move code from them.

## Scope (MVP)
- Admin console (chain owner): create hotels, assign managers
- Hotel landing page per hotel (subdomain)
- Hotel Manager portal: add/edit rooms and availability
- Booking flow for end users: select room, select date range, payment (Stripe) and booking confirmation
- Prevent double booking at the DB layer (atomicity + constraint)
- Basic authorization: Admin vs Manager vs Customer
- Local development setup + CI and basic tests

## Out-of-Scope (MVP)
- External OTA channel integrations (Airbnb, Booking.com, etc.)
- Complex rate management and channel distribution logic
- Multi-tenant SaaS admin features (team roles) beyond admin/manager

## Success Criteria
1. Super Admin can create a hotel and assign a manager.
2. Manager can add at least one room under the hotel and set availability.
3. Customer can create a booking, pay via Stripe, and the booking is stored in Postgres (Neon).
4. Concurrent attempts to book the same room for overlapping date ranges are prevented at DB-level.
5. Basic tests & CI run on PRs and pass.

## Stakeholders
- Product Owner: (You)
- Developers: (Team)
- Early adopters (chain owners and managers): (Selected testers)

## Key Deliverables for Phase 1
- Product brief (this file)
- User stories and acceptance criteria
- Acceptance tests for main flows
- DB schema (Prisma migration files) and Neon setup
- Project skeleton (backend + frontend + Docker compose)

## Non-Functional Requirements
- Use Postgres (Neon) with timestamptz for time fields
- Use Prisma for ORM and migrations
- JWT cookie-based authentication for the UI (like mern-booking-app-main)
- Use Stripe PaymentIntent flow for payments
- Server timezone-agnostic responses; format times using hotel's timezone

## Risks
- Race conditions causing double-booking; mitigated by DB `EXCLUDE` constraints and transactions.
- Mis-handled timezone conversions — ensure we store UTC and format by hotel's timezone.
- Stripe refunds may be needed if a booking fails after payment — define clean rollback.

## Open questions
1. Do we need manager invite flows via email? (Optional, can seed managers initially)
2. Are we supporting multi-night bookings (yes) and time-of-day checkins? (MVP: date range; no partial-day slots)
3. Any specific compliance requirements (PCI, GDPR) for the first release? (Stripe + minimal card storage; comply with PCI via Stripe)