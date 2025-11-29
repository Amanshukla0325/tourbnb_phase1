# Tourbnb - Phase 1 User Stories & Acceptance Criteria

## Actors
- Super Admin (chain owner)
- Hotel Manager
- Guest (Customer)

---

## User Story 1: Admin creates Hotel
- Description: As a Super Admin, I want to create a Hotel so that it has its own landing page and can be managed by a Manager.
- Acceptance Criteria:
  - Given I am authenticated as a Super Admin, when I submit a new hotel form (name, subdomain, timezone, default currency), the hotel creates and is visible in the Admin list.
  - The hotel includes default timezone and subdomain stored in DB.
  - I can assign a Manager (existing or new user) to the hotel.

---

## User Story 2: Manager adds Room
- Description: As a Hotel Manager, I want to add rooms (e.g. Room 101) to my hotel so that they are available for booking.
- Acceptance Criteria:
  - Given I am authenticated as a Manager with access to Hotel A, when I add a Room with fields (code, name, capacity, price), it appears in the hotel’s room list.
  - Room images can be uploaded (Cloudinary optional)
  - The room’s availability can be edited (default all days available for dates without special rules).

---

## User Story 3: Guest books a Room
- Description: As a Guest, I want to select a room and a date range, then make a payment so that the booking is confirmed.
- Acceptance Criteria:
  - Given a room is available for the requested date range, the booking flow allows the user to select dates and proceed to payment.
  - Payment is processed via Stripe Payment Intent.
  - After successful payment, a booking record is stored and returned to user with booking ID.

---

## User Story 4: Prevent Double Bookings
- Description: As an operator, I want to prevent double bookings for the same room and overlapping date ranges.
- Acceptance Criteria:
  - Given multiple users simultaneously attempt to book the same room for overlapping date ranges, the DB should prevent second insertions and ensure only one booking persists.
  - Guests whose booking attempt fails due to overlap must be notified with a clear error message.

---

## User Story 5: Hotel Landing Page
- Description: As a Guest, I should be able to visit the hotel’s landing page and see basic rooms and booking information.
- Acceptance Criteria:
  - Landing page is accessible via hotel subdomain route and displays hotel name, rooms, and price previews.

---

## User Story 6: Manager & Admin Views
- Description: As a Manager or Admin, I can see a bookings panel listing current and past bookings.
- Acceptance Criteria:
  - Managers only see bookings for hotels they manage; Admins see all hotels.
  - Each booking includes check-in, check-out, room, guest data, and payment status.

---

## Tests to be added
- E2E: Admin create hotel → Manager adds room → Guest books room (local tests)
- Integration: Booking create + DB constraint test for concurrent attempts
- Unit: Validation and RBAC permissions

---

## Notes
- Each suggested story will map to a sprint and acceptance test.
- Keep stories small and atomic: each story should be shippable and testable.