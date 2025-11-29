# Glossary (Phase 1)

- Admin / Super Admin: The chain owner who can create hotels and assign managers.
- Manager: Hotel staff who can add rooms and manage availability.
- Guest: Visitor who can book rooms and pay via Stripe.
- Subdomain: Per-hotel subdomain (example: hotelname.tourbnb.com) used for landing page.
- Booking: An entry that covers a room and a date range.
- EXCLUDE constraint: Postgres constraint used to prevent overlapping bookings.
