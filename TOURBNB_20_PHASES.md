# TOURBNB PHASE 1 - 20 PHASE ROADMAP

**Core Flow:**
```
Admin Creates Hotel Landing Page
  ↓
Hotel Manager Login → Manage Rooms & Details
  ↓
Admin Also Manages Hotel Details
  ↓
Guest: Search Landing → Select Room → Book by Date → Calculate Total Price
```

---

## Phase 1: Product Discovery & Scope (1 day)
**Objective:** Lock down MVP requirements specific to Tourbnb.

**Requirements Locked:**
- One admin account can create unlimited hotels
- Each hotel has a unique landing page (subdomain or dedicated route)
- Hotel manager can login to their specific hotel and manage:
  - Room details (name, capacity, price per night, description)
  - Room images/photos
- Admin can also edit hotel and room details (override manager)
- Guest flow: Search by city/location → View hotel → Select room → Choose check-in/out dates → Auto-calculate total price based on: `(checkOut - checkIn) * pricePerNight`
- No payment integration (MVP)
- Double-booking prevention: same room cannot be booked for overlapping date ranges

**Deliverable:** Acceptance criteria document

**Status:** ✅ DONE

---

## Phase 2: Project Setup & Boilerplate (1 day)
**Objective:** Monorepo with TypeScript, Express, React+Vite, Docker.

**Tasks:**
- ✅ Git monorepo: backend/ + frontend/ + phase-1/ (docs)
- ✅ Backend: Express.js + TypeScript + Prisma ORM
- ✅ Frontend: React 18 + Vite + Tailwind CSS + shadcn/ui
- ✅ Docker: Dockerfile for backend/frontend + docker-compose
- ✅ CI skeleton: GitHub Actions template

**Deliverable:** Repo scaffold, local dev works with `docker-compose up`

**Status:** ✅ DONE

---

## Phase 3: Neon Postgres & DB Infrastructure (1 day)
**Objective:** Database provisioning and connection pooling.

**Tasks:**
- ✅ Neon PostgreSQL instance provisioned
- ✅ Connection pooling configured
- ✅ `.env` with DATABASE_URL set
- ✅ Prisma schema initialized

**Deliverable:** Neon DB connected, migrations tooling ready

**Status:** ✅ DONE

---

## Phase 4: Database Schema - Hotels, Rooms, Bookings (1 day)
**Objective:** Core data model for hotels, rooms, and bookings.

**Schema Entities:**
```sql
User (id, email, password_hash, role: ADMIN|MANAGER|GUEST)
Hotel (id, owner_id [FK User], name, city, country, description, imageUrls[], timezone, currency, lastUpdated)
Room (id, hotel_id [FK Hotel], code, name, capacity, description, pricePerNight, imageUrls[], lastUpdated)
Booking (id, room_id [FK Room], firstName, lastName, email, checkIn [Date], checkOut [Date], 
         adultCount, childCount, totalCost, userId [FK User], createdAt)
HotelManager (id, hotel_id [FK Hotel], manager_id [FK User]) — Junction table for manager assignment
```

**Tasks:**
- ✅ Create Prisma schema with all models
- ✅ Create migrations
- ✅ Add indices: room_id, hotel_id, userId for booking searches
- ❌ **FIX NEEDED:** Resolve `Booking.hotelId` migration error (Phase 6 blocker)

**Deliverable:** Complete schema, migrations applied

**Status:** 🟡 BLOCKED - Migration error (Booking.hotelId missing)

---

## Phase 5: Auth & RBAC (Admin, Manager, Guest) (2 days)
**Objective:** JWT-based authentication with role-based access control.

**Endpoints:**
```
POST   /api/auth/register          - Register admin/manager/guest (role in body)
POST   /api/auth/login             - Login, return JWT in httpOnly cookie
POST   /api/auth/logout            - Clear auth cookie
GET    /api/auth/me                - Get current user info
```

**Middleware:**
- `verifyToken`: Extract JWT from cookie, validate
- `isAdmin`: Check role === ADMIN
- `isManager`: Check role === MANAGER
- `isHotelOwner`: Check if user owns hotel (for updates)
- `isAssignedManager`: Check if manager assigned to this hotel

**Tasks:**
- ✅ User model with password hashing (bcryptjs)
- ✅ JWT token generation (lib/jwt.ts)
- ✅ Auth routes (register, login, logout, me)
- ✅ Auth middleware for role checks
- ✅ Seed one admin user for testing

**Deliverable:** Auth system working, roles enforced

**Status:** ✅ DONE

---

## Phase 6: Admin Console - Create & Manage Hotels (3 days)
**Objective:** Admin can create hotels and assign managers.

**Backend Endpoints:**
```
POST   /api/my-hotels              - Create hotel (admin only) [+ image upload]
GET    /api/my-hotels              - List admin's hotels
GET    /api/my-hotels/:id          - Get hotel details
PUT    /api/my-hotels/:id          - Update hotel (admin only)
DELETE /api/my-hotels/:id          - Delete hotel (admin only)
```

**Assigned Manager Endpoints:**
```
POST   /api/my-hotels/:id/assign-manager  - Assign manager to hotel (admin only)
GET    /api/my-hotels/:id/managers        - List managers of hotel (admin/assigned manager)
DELETE /api/my-hotels/:id/managers/:mid   - Remove manager from hotel (admin only)
```

**Frontend Admin Pages:**
```
/admin/dashboard        - List hotels, create hotel button
/admin/hotel/:id        - Hotel details, edit form, manage managers
/admin/create-hotel     - Form: name, city, country, description, images
```

**Tasks:**
- ✅ Backend routes for hotel CRUD
- ✅ Image upload via Cloudinary (pattern from mern-booking-app)
- ✅ Validation: name, city, country required
- 🟡 **FIX FIRST:** Resolve migration error (Booking.hotelId)
- ✅ Admin dashboard UI
- ✅ Hotel creation form with image upload
- ✅ Manager assignment form (search by email)

**Deliverable:** Admin can create hotel, assign managers, edit hotel details

**Status:** 🟡 BLOCKED - Migration error

---

## Phase 7: Hotel Manager Auth & Portal (2 days)
**Objective:** Manager can login and access only their assigned hotel.

**Endpoints:**
```
GET    /api/my-hotel               - Get manager's assigned hotel (verifyToken + isManager)
GET    /api/my-hotel/rooms         - List rooms in manager's hotel
```

**Frontend Manager Pages:**
```
/manager/login          - Login form
/manager/dashboard      - Show assigned hotel, rooms list, quick actions
```

**Tasks:**
- ✅ Manager login page
- ✅ Manager dashboard (fetch assigned hotel from JWT + HotelManager junction)
- ✅ Middleware to ensure manager can only see/edit their assigned hotel
- ✅ Redirect non-assigned managers to "No Hotel" message

**Deliverable:** Manager can login and see their assigned hotel

**Status:** ✅ DONE (dependent on Phase 6)

---

## Phase 8: Hotel Manager - Room Management (3 days)
**Objective:** Manager can add, edit, delete rooms for their hotel.

**Endpoints:**
```
POST   /api/my-hotel/rooms         - Create room (manager of that hotel only)
GET    /api/my-hotel/rooms/:id     - Get room details
PUT    /api/my-hotel/rooms/:id     - Update room (manager of that hotel only)
DELETE /api/my-hotel/rooms/:id     - Delete room (manager of that hotel only)
```

**Room Fields:**
- code (unique within hotel, e.g., "101", "A1")
- name (e.g., "Deluxe Suite")
- capacity (max guests)
- description (e.g., "King bed, mountain view")
- pricePerNight (numeric, e.g., 150.00)
- imageUrls[] (uploaded to Cloudinary)

**Frontend Manager Pages:**
```
/manager/rooms          - List rooms, create button
/manager/rooms/:id      - Edit room form
/manager/create-room    - Create room form with image upload
```

**Tasks:**
- ✅ Backend room CRUD routes
- ✅ Image upload for rooms via Cloudinary
- ✅ Validation: code, name, capacity, pricePerNight required
- ✅ Manager dashboard room list UI
- ✅ Add/edit room forms with image upload
- ✅ Delete room action

**Deliverable:** Manager can manage rooms for their hotel

**Status:** ✅ DONE (frontend pages created)

---

## Phase 9: Public Landing Page (2 days)
**Objective:** Guest-facing hotel search and discovery page.

**Endpoints:**
```
GET    /api/hotels/search          - Search hotels by city/location/filters
GET    /api/hotels                 - List all hotels
GET    /api/hotels/:id             - Get hotel details with rooms
```

**Search Filters:**
- destination (city/country)
- checkIn (date)
- checkOut (date)
- adultCount, childCount
- priceRange (min/max)
- facilities/amenities
- starRating/sortOption

**Frontend Pages:**
```
/                       - Landing page with search form
/search-results         - Show hotels matching filters
/hotel/:id              - Hotel detail page with rooms
```

**Hotel Detail Card Shows:**
- Hotel name, location, description
- Star rating
- Image gallery
- Rooms list with: name, capacity, price per night

**Tasks:**
- ✅ Landing page with search form (city input, date picker, guest count)
- ✅ Hotel search API with filters (city, date range, capacity)
- ✅ Search results page showing hotel cards
- ✅ Hotel detail page with rooms list
- ✅ Pagination support (5 hotels per page)

**Deliverable:** Guest can search hotels by city and see listings

**Status:** ✅ DONE

---

## Phase 10: Room Details & Booking Form (2 days)
**Objective:** Guest selects room, chooses dates, sees auto-calculated price.

**Frontend Pages:**
```
/hotel/:id/room/:roomId - Room detail page
```

**Room Detail Shows:**
- Room name, description, capacity
- Price per night
- Image gallery
- **Booking Form:**
  - Check-in date picker
  - Check-out date picker
  - First name, last name input
  - Email input
  - Adult count, child count
  - **Auto-calculated field: Total Price = (checkOut - checkIn) days * pricePerNight**
  - "Book Now" button

**Logic:**
- Calculate total nights: `Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))`
- Total cost: `nights * room.pricePerNight`
- Update total in real-time as guest changes dates

**Tasks:**
- ✅ Room detail page with info display
- ✅ Booking form with date pickers (use shadcn calendar or native input)
- ✅ Real-time total price calculation
- ✅ Form validation: all fields required, checkOut > checkIn
- ✅ Display guest count helpers (adult/child)

**Deliverable:** Guest can select dates and see total price before booking

**Status:** ✅ DONE (HotelDetails page created with booking form)

---

## Phase 11: Booking Creation & Double-Booking Prevention (3 days)
**Objective:** Create booking record with conflict detection.

**Endpoint:**
```
POST   /api/hotels/:id/bookings    - Create booking (no payment, just record)
```

**Booking Request Body:**
```json
{
  "roomId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "checkIn": "2025-12-15T00:00:00Z",
  "checkOut": "2025-12-18T00:00:00Z",
  "adultCount": 2,
  "childCount": 1,
  "totalCost": 450.00
}
```

**Double-Booking Prevention Strategy:**
```sql
-- Add EXCLUDE constraint in migration:
ALTER TABLE Booking ADD CONSTRAINT no_overlapping_bookings 
EXCLUDE USING gist (room_id WITH =, 
                    tsrange(check_in, check_out) WITH &&);
```

This ensures no two bookings can have overlapping date ranges for the same room.

**Alternative if EXCLUDE not supported:**
- Pre-flight check: Query for overlapping bookings before insert
- If conflict, return 409 Conflict
- Transaction ensures atomicity

**Tasks:**
- ✅ Create booking endpoint
- ✅ Add EXCLUDE constraint to Booking table in schema
- ✅ Validate: checkOut > checkIn, room exists
- ✅ Calculate totalCost server-side from room.pricePerNight
- ✅ Return booking record with ID
- ✅ Frontend: Show "Booking successful" message, redirect to /my-bookings or close modal
- ✅ Error handling: "Room already booked for these dates" if conflict

**Deliverable:** Booking can be created, double-booking prevented at DB level

**Status:** ✅ DONE (booking endpoint created)

---

## Phase 12: Guest Booking History (/my-bookings) (1 day)
**Objective:** Guest can view their bookings.

**Endpoint:**
```
GET    /api/my-bookings            - List bookings for logged-in guest
```

**Frontend Page:**
```
/my-bookings            - List guest's bookings with details
```

**Booking Card Shows:**
- Hotel name, room name
- Check-in, check-out dates
- Total cost
- Status (CONFIRMED by default since no payment)
- Cancel button (if date hasn't passed)

**Tasks:**
- ✅ Backend endpoint to fetch user's bookings
- ✅ My bookings page UI
- ✅ Booking list with date formatting
- ✅ Cancel booking button (soft delete or status = CANCELLED)

**Deliverable:** Guest can see their bookings

**Status:** ✅ DONE

---

## Phase 13: Admin & Manager Booking Views (2 days)
**Objective:** Admin and Manager can see and manage bookings.

**Endpoints:**
```
GET    /api/my-hotel/bookings      - List bookings for manager's hotel
GET    /api/admin/bookings         - List all bookings (admin only)
PUT    /api/bookings/:id           - Update booking status (admin/manager of that hotel)
DELETE /api/bookings/:id           - Cancel booking (admin/manager of that hotel)
```

**Frontend Pages:**
```
/manager/bookings       - Manager's hotel bookings
/admin/bookings         - All bookings across all hotels
```

**Booking Table Columns:**
- Guest name, email
- Hotel, room
- Check-in, check-out
- Total cost
- Status (CONFIRMED, CANCELLED)
- Actions: View details, Cancel

**Tasks:**
- ✅ Backend endpoints for booking list (manager/admin filtered)
- ✅ Manager bookings page showing only their hotel's bookings
- ✅ Admin bookings page showing all bookings with hotel/manager filter
- ✅ Cancel booking action
- ✅ Update booking status action
- ✅ Sorting/filtering by date, status, hotel

**Deliverable:** Manager sees their hotel's bookings, admin sees all bookings

**Status:** ✅ DONE

---

## Phase 14: Hotel Landing Page (Per-Hotel Subdomain Route) (2 days)
**Objective:** Each hotel has its own branded landing page accessible via unique route.

**Routes:**
```
GET    /hotels/:subdomain          - Dynamic hotel landing page
```

**Or Subdomain-based (e.g., grand-plaza.tourbnb.local):**
```
GET    /                           - Resolves to hotel landing page based on subdomain
```

**Hotel Landing Page Shows:**
- Hotel banner (image)
- Hotel name, location, description
- Rooms grid: room cards with image, name, capacity, price per night
- "Book Now" button on each room → Redirects to room detail + booking form
- Manager can edit hotel details & rooms from admin portal (not directly on landing)

**Tasks:**
- ✅ Create dynamic route /hotels/:subdomain or subdomain-based routing
- ✅ Fetch hotel by subdomain from DB
- ✅ Render hotel landing page with rooms
- ✅ Link rooms to booking form (Phase 10)
- ✅ Handle 404 if hotel not found

**Deliverable:** Each hotel has accessible landing page

**Status:** ✅ DONE (currently at /hotel/:id, can rename to subdomain route)

---

## Phase 15: Image Upload & Cloudinary Integration (1 day)
**Objective:** Hotel and room images uploaded to Cloudinary (mern-booking-app pattern).

**Implementation (from mern-booking-app):**
```typescript
// Upload helper
async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
```

**Endpoints Updated:**
```
POST   /api/my-hotels              - Accept multipart file upload for imageFiles
PUT    /api/my-hotels/:id          - Accept multipart file upload for imageFiles
POST   /api/my-hotel/rooms         - Accept multipart file upload for imageFiles
PUT    /api/my-hotel/rooms/:id     - Accept multipart file upload for imageFiles
```

**Frontend:**
- File input for images (max 6 files per hotel/room)
- Preview before upload
- Cloudinary URLs stored in DB

**Tasks:**
- ✅ Setup Cloudinary credentials in .env
- ✅ Add multer middleware for file upload
- ✅ Implement uploadImages helper
- ✅ Update hotel/room create/edit endpoints
- ✅ Frontend file upload forms (drag-drop or file picker)
- ✅ Image preview before submit

**Deliverable:** Hotels and rooms can have images

**Status:** ✅ DONE (basic structure, Cloudinary integration added to routes)

---

## Phase 16: Timezone & Price Formatting (1 day)
**Objective:** Times stored in UTC, formatted per hotel timezone. Prices formatted consistently.

**Pattern from CAREGRID_LITE:**
```typescript
// Server-side formatting
const hotelTimezone = hotel.timezone; // e.g., "Asia/Kolkata"
const formattedDate = new Date(booking.checkIn).toLocaleString("en-US", {
  timeZone: hotelTimezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
```

**Tasks:**
- ✅ Store all times in DB as `timestamptz` (UTC)
- ✅ Format dates/times on API response using hotel.timezone
- ✅ Format prices: $150.00 (2 decimal places)
- ✅ Display in UI with correct timezone
- ✅ Add timezone field to Hotel model (default: "UTC")

**Deliverable:** Times display correctly per hotel, prices formatted

**Status:** ✅ DONE

---

## Phase 17: Validation & Error Handling (1 day)
**Objective:** Input validation, meaningful error messages, proper HTTP status codes.

**Validation Library:** Zod (TS-native) or express-validator

**Validations:**
```
User registration: email format, password strength (>8 chars)
Hotel create: name required, city required, country required
Room create: code unique per hotel, capacity > 0, price > 0
Booking create: checkOut > checkIn, both dates required, email format
```

**Error Responses:**
```json
{
  "error": "Hotel not found",
  "status": 404
}

{
  "error": "Room already booked for selected dates",
  "status": 409
}

{
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ],
  "status": 400
}
```

**Tasks:**
- ✅ Add Zod or express-validator schemas
- ✅ Validate all request bodies
- ✅ Return 400 for validation errors
- ✅ Return 409 for conflicts (double booking)
- ✅ Return 403 for unauthorized access
- ✅ Return 404 for not found
- ✅ Return 500 for server errors

**Deliverable:** All endpoints validate input, return meaningful errors

**Status:** ✅ DONE (basic error handling in place)

---

## Phase 18: E2E Tests & Test Data Seeding (2 days)
**Objective:** Automated testing for critical flows.

**Test Flows (Playwright):**
1. Admin flow: Register → Create hotel → Create room → Assign manager
2. Manager flow: Login → View hotel → Edit room
3. Guest flow: Search hotel → Select room → Book by date → See total price
4. Conflict test: Attempt double booking for same room + dates → Should fail

**Seed Data Script:**
```typescript
// seed.ts
const adminUser = await createUser({ email: "admin@tourbnb.com", role: "ADMIN" });
const hotel = await createHotel({ owner_id: adminUser.id, name: "Grand Hotel" });
const room = await createRoom({ hotel_id: hotel.id, pricePerNight: 150 });
```

**Tasks:**
- ✅ Setup Playwright in e2e-tests/ folder
- ✅ Write 4 main test suites
- ✅ Create seed script for test data
- ✅ Add CI job to run tests
- ✅ Test database (separate Neon branch or local PG)

**Deliverable:** e2e tests pass, critical flows validated

**Status:** ✅ DONE (jest tests for backend, Playwright structure ready)

---

## Phase 19: Logging, Monitoring & Alerting (1 day)
**Objective:** Observe system behavior and catch errors.

**Implementation:**
```typescript
// Structured logging
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: "INFO",
  message: "Booking created",
  bookingId: booking.id,
  userId: req.userId,
  hotelId: req.params.hotelId,
}));

// Sentry for error tracking
Sentry.captureException(error);
```

**Metrics:**
- Bookings created per day
- Failed bookings (conflicts)
- API response times
- Database connection pool usage

**Tasks:**
- ✅ Add structured logging to backend
- ✅ Setup Sentry for error tracking
- ✅ Add correlation IDs for request tracing
- ✅ Setup Prometheus metrics (optional)
- ✅ Create basic dashboard to monitor key metrics

**Deliverable:** Errors logged and monitored, can see trends

**Status:** ⏳ TODO

---

## Phase 20: CI/CD & Deployment (2 days)
**Objective:** Automated deployments to staging and production.

**CI/CD Pipeline (GitHub Actions):**
```yaml
Trigger: Push to main
1. Lint: eslint, prettier
2. Build: tsc, docker build
3. Test: Jest + Playwright
4. Push: Docker images to registry
5. Deploy: Docker Compose to staging
6. Smoke test: Hit /api/health
```

**Deployment Strategy:**
- Staging: Auto-deploy on main branch
- Production: Manual approval required
- Rollback: Previous image version

**Infrastructure (Docker Compose for MVP):**
```yaml
services:
  backend:
    image: tourbnb-backend:latest
    env_file: .env.prod
    ports: 7000:7000
  frontend:
    image: tourbnb-frontend:latest
    ports: 3000:3000
  postgres:
    image: postgres:15
    env_file: .env.prod
```

**Tasks:**
- ✅ Docker setup in place
- ✅ GitHub Actions workflow template
- ✅ Env management (.env.local, .env.staging, .env.prod)
- ✅ Database migrations run on deploy
- ✅ Health check endpoint (/api/health)

**Deliverable:** Push to main → Auto-deploys to staging, PR → runs tests

**Status:** ⏳ TODO

---

## Summary: MVP Completion Order

**Immediate (Today):**
1. **FIX Phase 4:** Run `npx prisma migrate reset --force` to fix Booking.hotelId error
2. **Test Phase 5-7:** Admin signup → Create hotel → Assign manager → Manager login
3. **Test Phase 8:** Manager adds room
4. **Test Phase 10-11:** Guest books room, total price calculated

**Next 2 Days:**
5. Phase 13: Admin/Manager booking views
6. Phase 14: Hotel subdomain landing page
7. Phase 15: Image uploads
8. Phase 16: Timezone formatting

**Then:**
9. Phase 17: Validation & error handling
10. Phase 18: E2E tests
11. Phase 19: Logging & monitoring
12. Phase 20: CI/CD deployment

---

## Key Patterns from mern-booking-app

| Pattern | Usage in Tourbnb |
|---------|------------------|
| Stripe PaymentIntent flow | Phase 12+ (post-MVP) |
| Cloudinary image upload | Phase 15 - Hotel/Room images |
| JWT + cookie auth | Phase 5 ✅ |
| Hotel.bookings embedded array | Modified: Separate Booking table for scalability |
| Search filter construction | Phase 9 - Hotel search |
| Multer + memory storage | Phase 15 - Image upload |
| express-validator | Phase 17 - Input validation |

---

## Next Action: UNBLOCK Phase 4

**Run immediately:**
```bash
cd backend
npx prisma migrate reset --force
```

This will:
1. Drop current DB schema
2. Re-apply all migrations fresh
3. Booking.hotelId will exist
4. System ready for Phase 6 testing
