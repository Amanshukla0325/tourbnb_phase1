# Tourbnb Phase 1 Backlog (Prioritized)

Priority 1 (MVP - Must Have)
- Project setup (backend + frontend + docker + CI)
- Neon Postgres provisioning and migration tooling
- Auth & RBAC: Admin/Manager/Guest
- Admin console: hotel create + assign manager
- Hotel Team: subdomain & landing page
- Manager portal: add rooms, edit availability
- Booking API + Stripe integration
- DB-level double booking constraint (EXCLUDE/GIST)
- E2E tests for main flows

Priority 2 (Should Have)
- Manager UI for bookings & export
- Basic audit logs & reconciliation tools
- Manager invite & email flows
- Basic dashboards for adoption metrics

Priority 3 (Nice to have)
- Cloudinary integration for media
- Basic reporting & CSV exports
- Retry logic / idempotency for payments & booking webhook

---

## Spike/Research Tasks
- Confirm Postgres range + EXCLUDE approach for booking range and edge cases with multi-night bookings.
- Spike: Implement small test harness to simulate concurrent booking requests and validate lock & constraint behavior.

## Notes
- Prioritize unit & integration tests early (booking & double-book logic).
- Keep each item small enough to deliver in a single sprint (2 weeks) or less.
