# Tourbnb - Phase 1 Acceptance Criteria & Test Cases

## Acceptance List

1. Admin creates a hotel
   - Given an authenticated Admin, a POST /api/admin/hotels with valid payload returns 201 Created and the hotel appears in GET /api/admin/hotels.
   - DB record includes `subdomain` and `timezone`.

2. Manager can add rooms
   - Given a Manager assigned to Hotel A, POST /api/hotels/{id}/rooms returns 201 and the room is available via GET /api/hotels/{id}/rooms.

3. Guest booking + payment
   - Given available room, Guest selects startDate and endDate and posts to POST /api/hotels/{id}/bookings with paymentIntent.
   - A successful Stripe payment leads to booking created with `status=CONFIRMED`.

4. Double-book prevention
   - Simulate 10 concurrent booking attempts for the same room and overlapping date ranges; DB must persist only one booking, others fail with a 409 Conflict or similar error.
   - Unit test should enforce the transactional semantics.

5. Landing page accessible by subdomain
   - Visiting `hotel-subdomain.localhost:8080` or mapped testing domain shows the hotel page with data fetched.
   - The landing page includes Room list and `Book` CTA.

6. RBAC
   - Super Admin can create and assign Managers; Managers only manage assigned hotels.
   - Unauthenticated users receive 401 for protected endpoints.

## Test Cases (Examples)
1. E2E: Admin → create hotel → assign manager: 
   - Login as admin, create hotel, assign manager, check manager dashboard shows hotel in the list.

2. E2E: Manager → add room → set availability
   - Manager logs in → Create room with availability → Confirm GET endpoints return the new room.

3. E2E: Guest booking flow
   - Guest navigates hotel landing page → selects room & date range → completes Stripe payment → booking confirmed → booking displays in My Bookings.

4. Concurrency: Double booking scenario
   - Use a test harness to attempt multiple booking requests concurrently (10) to the booking endpoint for same room and date range; expect 1 success and 9 failures.

## Definition of Done
- All code is covered by unit tests for critical paths.
- End-to-end tests for the main flow pass on CI.
- DB migrations are applied to Neon and documented.
- Acceptance Criteria tests pass on staging environment.

## Out-of-scope acceptance (explicit)
- OTA channel integration acceptance tests.

