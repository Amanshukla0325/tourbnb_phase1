# Tourbnb - Phase 1 API Specification (MVP)

## Base URL
- For local development: http://localhost:7000/api
- For production: https://api.tourbnb.com/api (TBD)

## Authentication
- JWT stored in httpOnly cookie `auth_token`; endpoints use `credentials: include` from frontend.
- Roles: `SUPER_ADMIN`, `MANAGER`, `GUEST` (GUEST may not need a JWT but acceptable for sign-in flows)

## Endpoints
### Auth
- POST /api/auth/login
  - Body: { email, password }
  - Response: 200 OK { userId }
  - Sets cookie `auth_token`.

- POST /api/auth/logout
  - Clears cookie.

### Admin (requires SUPER_ADMIN)
- GET /api/admin/hotels
  - Response: list of hotels with assigned managers.
- POST /api/admin/hotels
  - Body: { name, subdomain, timezone, currency }
  - Response: 201 Created
- POST /api/admin/hotels/:hotelId/assign-manager
  - Body: { managerUserId }
  - Response: 200 OK

### Manager
- GET /api/hotels/:hotelId/rooms
  - Returns rooms for a hotel (MANAGER only for their hotels or SUPER_ADMIN for all)
- POST /api/hotels/:hotelId/rooms
  - Body: { code, name, capacity, pricePerNight, images? }
  - Response: 201 Created
- POST /api/hotels/:hotelId/availability
  - Body: { roomId, startDate, endDate, isBlocked? }
  - Response: 201 / 200

### Public / Guest
- GET /api/hotels/:hotelId
  - Returns hotel info + rooms + pricing summary
- POST /api/hotels/:hotelId/bookings/payment-intent
  - Body: { roomId, checkIn, checkOut, guestDetails: {firstName, lastName, email, phone}, numberOfNights }
  - Response: { paymentIntentId, clientSecret, totalCost }
- POST /api/hotels/:hotelId/bookings
  - Body: { paymentIntentId, roomId, checkIn, checkOut, guest details }
  - Flow: server retrieves/validates payment intent; if succeeded, create booking (atomic DB op) and return `status=CONFIRMED`.

### Admin/Manager booking views
- GET /api/hotels/:hotelId/bookings
  - Filter by date range, status.

## Error Codes
- 401 Unauthorized: missing/invalid JWT
- 403 Forbidden: RBAC access denied
- 400 Bad Request: validation errors
- 409 Conflict: Double-booking / booking concurrency error
- 500 Internal Server Error: server error

## Notes
- All timestamps sent to API are ISO 8601 UTC; backend stores in `timestamptz` and formats for hotel timezone on response.
- All create/update endpoints validate role permissions via middleware.
