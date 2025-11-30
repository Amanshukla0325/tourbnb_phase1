# Tourbnb - Phase 1 Database Schema (Postgres / Prisma)

This document sketches the initial relational schema for the Tourbnb MVP. We will store dates using `timestamptz` and use a range/EXCLUDE constraint for bookings.

## Key entities
### users
- id (uuid PK)
- email (string, unique)
- password_hash
- role (enum: SUPER_ADMIN, MANAGER, GUEST)
- created_at, updated_at

### hotels
- id (uuid PK)
- owner_id (user->id)  // chain owner
- name
- subdomain (string, unique)
- timezone (string, e.g. "Asia/Kolkata")
- currency
- created_at, updated_at

### hotel_managers
- id (uuid)
- hotel_id (FK)
- manager_id (FK to users)
- unique(hotel_id, manager_id)

### rooms
- id (uuid PK)
- hotel_id (FK)
- code (string) // e.g., "101"
- name
- capacity (int)
- price_per_night (decimal)
- created_at, updated_at

### room_availability
- id (uuid PK)
- room_id (FK)
- date (date) // day level availability OR start_time/timestamp if we consider partial day
- is_blocked (boolean) // optional for blocking a day
- note, created_at, updated

### bookings
- id (uuid PK)
- room_id (FK)
- guest_id (user id or null if guest checkout)
- check_in (timestamptz)
- check_out (timestamptz)
-- booking_interval (tstzrange)
- status (enum: PENDING, CONFIRMED, CANCELLED)
- created_at, updated_at
- stripe_payment_intent_id (string)

### payments
- id
- booking_id
- stripe_payment_intent_id
- status
- amount
- currency
- created_at

### EXCLUDE constraint for double-booking prevention
- Add `booking_interval` as `tsrange(check_in, check_out)` (exclusive/inclusive semantics per product). Create:

```sql
ALTER TABLE bookings ADD COLUMN booking_interval tstzrange GENERATED ALWAYS AS (tstzrange(check_in, check_out)) STORED;
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlap EXCLUDE USING gist (room_id WITH =, booking_interval WITH &&);
```

This prevents overlapping `tsrange` for the same `room_id`.

## Prisma model (sketch)
```prisma
model User {
  id             String   @id @default(uuid())
  email          String   @unique
  passwordHash   String
  role           Role
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

enum Role {
  SUPER_ADMIN
  MANAGER
  GUEST
}

model Hotel {
  id          String   @id @default(uuid())
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  name        String
  subdomain   String   @unique
  timezone    String
  currency    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Room {
  id          String   @id @default(uuid())
  hotelId     String
  hotel       Hotel    @relation(fields: [hotelId], references: [id])
  code        String
  name        String
  capacity    Int
  pricePerNight Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Booking {
  id      String   @id @default(uuid())
  roomId  String
  room    Room     @relation(fields: [roomId], references: [id])
  guestId String?
  checkIn DateTime
  checkOut DateTime
  status  BookingStatus
  stripePaymentIntentId String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Prisma does not directly support generated tsrange fields or EXCLUDE constraints; those need to be added via raw SQL migration.
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
}
```

## Indices and performance
- Index on `bookings(room_id, check_in)` for quick queries.
- Index on `rooms(hotel_id)`
- Index on `bookings(stripe_payment_intent_id)`

## Notes
- Exclude constraint must be created by raw SQL migration after the Prisma migration.
- Date operations: store UTC in DB; format in API using hotel's timezone.
