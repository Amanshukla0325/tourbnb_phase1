# Tourbnb - Phase 1 Test Plan

## Overview
This test plan covers unit, integration, and E2E tests for the Phase 1 MVP flows: admin/manager actions, booking flows, and double-book prevention.

## Test Environments
- Local dev: Docker Compose (Postgres Neon replaceable with local Postgres), Node backend running on 7000, Frontend on 5174.
- CI: GitHub Actions; run tests in parallel in matrix (backend, frontend, e2e).

## Unit Tests (Backend)
- Focus on validation logic, RBAC middleware, helper functions.
- Critical units:
  - Auth middleware (cookie JWT verify)
  - Booking logic (availability checks)
  - Payment helper wrappers (Stripe mocking)
- Tools: Jest + Supertest

## Integration Tests
- Test endpoints with Postgres test instance (in-memory? or test Postgres). Use migrations to create schema then run tests.
- Flow tests:
  - Admin creates hotel -> Manager added -> Manager creates room.
  - Manager creates availability and adds room pricing -> API returns available slots.
  - Guest booking: PaymentIntent creation then booking creation using mocked Stripe.

## E2E Tests
- Use Playwright (as in `mern-booking-app-main`) for end-to-end flows.
- Test Scenarios:
  1. Admin flows: login, create hotel, assign manager.
  2. Manager flows: login, add room, configure availability.
  3. Guest booking flow: landing page, select room/dates, payment via Stripe test card -> booking appears in My Bookings.
  4. Concurrency test harness: simulate N concurrent booking requests for same room/dates to booking endpoint; assert only one booking is confirmed.

## Concurrency & Load Testing
- Use a small harness (k6 or custom script) to simulate concurrent booking attempts.
- For the concurrency harness, we will:
  - Pre-create a room with availability.
  - Launch 10 concurrent calls to reservation endpoint with same date range.
  - Assert one success and others return proper conflict code.

## Test Data
- Use the `data/test-users.json` and `data/test-hotel.json` approach from `mern-booking-app-main` to seed test accounts.
- Setup test fixtures: Admin user, Manager user, sample hotel & room.

## CI Test Matrix (GitHub Actions)
- Steps:
  - Checkout
  - Setup Node + Postgres
  - Install dependencies
  - Apply migrations
  - Run backend unit tests
  - Build frontend and run e2e tests (Playwright)

## Running tests locally
1. Start local services: Postgres, backend, frontend
2. Run: `npm run test` or `npm run test:e2e` for Playwright.

## Acceptance Criteria for tests
- Unit test coverage >= 80% for backend critical modules
- All integration scenarios must pass in CI before merge
- E2E: Main flows must pass consistently in CI (stable flake-free)
