# TOURBNB QUICK START GUIDE

## 🟢 Everything is Running

```
Backend:   http://localhost:7000 ✅
Frontend:  http://localhost:5175 ✅
Database:  Neon PostgreSQL (synced) ✅
```

## 📋 Your 20-Phase Roadmap

See full details: `TOURBNB_20_PHASES.md`

```
Phases 1-6  (DONE)   ← Foundation & Admin Console
Phases 7-8  (NEXT)   ← Manager Portal & Room Management  
Phases 9-11 (FAST)   ← Booking Engine with Price Calculation
Phases 12-14(POLISH) ← Guest Views & Hotel Landing Pages
Phases 15-20(OPS)    ← Images, Tests, Monitoring, CI/CD
```

## 🧪 Test the MVP (Right Now)

### 1. Admin Signup
```
Go to: http://localhost:5175/admin/signup
Email: admin@tourbnb.com
Password: TestPass123
→ Redirects to Admin Dashboard
```

### 2. Create Hotel
```
Click "+ Create Hotel"
Fill: Name, City, Address, Subdomain
→ Hotel created ✅
```

### 3. Assign Manager
```
Enter manager email: manager@tourbnb.com
Click "Assign"
→ Manager assigned ✅
```

### 4. Manager Signup & Login
```
Go to: http://localhost:5175/manager/signup
Email: manager@tourbnb.com
Password: TestPass123
→ Login → See assigned hotel ✅
```

## 🔧 How to Add Next Feature

### **Example: Manager Adds Rooms (Phase 8)**

**1. Create Backend Endpoint** (`backend/src/routes/manager.ts`)
```typescript
router.post('/rooms', authenticate, isManager, async (req: AuthRequest, res) => {
  // { hotelId, code, name, capacity, pricePerNight }
  const room = await prisma.room.create({ data: { ...req.body } });
  res.status(201).json(room);
});
```

**2. Create Frontend Form** (`frontend/src/pages/manager/AddRoom.tsx`)
```typescript
const [room, setRoom] = useState({ name: '', capacity: 0, pricePerNight: 0 });

const handleSubmit = async () => {
  const res = await fetch('http://localhost:7000/api/manager/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(room)
  });
  if (res.ok) alert('Room added!');
};
```

**3. Add Route** (`frontend/src/App.tsx`)
```typescript
<Route path="/manager/rooms" element={<AddRoom/>} />
```

## 🎯 Key Files to Know

| File | Purpose |
|------|---------|
| `backend/src/index.ts` | Express server setup |
| `backend/prisma/schema.prisma` | Database schema |
| `backend/src/routes/auth.ts` | Login/signup |
| `backend/src/routes/admin.ts` | Hotel CRUD |
| `backend/src/middleware/auth.ts` | Permission checks |
| `frontend/src/App.tsx` | Route definitions |
| `frontend/src/pages/admin/Dashboard.tsx` | Admin UI |
| `frontend/src/pages/manager/Dashboard.tsx` | Manager UI |
| `frontend/src/pages/LandingPage.tsx` | Guest search |

## 📊 API Endpoints (Ready Now)

### **Auth**
```
POST   /api/auth/register      (email, password, role)
POST   /api/auth/login         (email, password)
POST   /api/auth/logout
GET    /api/auth/me
```

### **Admin Only**
```
POST   /api/admin/hotels       (name, city, address, subdomain)
GET    /api/admin/hotels       (list user's hotels)
GET    /api/admin/hotels/:id   (details)
PUT    /api/admin/hotels/:id   (update)
DELETE /api/admin/hotels/:id   (delete)
POST   /api/admin/hotels/:id/assign-manager (managerEmail)
```

### **Manager (Next Phase)**
```
GET    /api/manager/hotel      (my assigned hotel)
POST   /api/manager/rooms      (create room)
GET    /api/manager/rooms      (list rooms)
PUT    /api/manager/rooms/:id  (update)
DELETE /api/manager/rooms/:id  (delete)
```

### **Guest Public**
```
GET    /api/hotels             (all hotels)
GET    /api/hotels?city=NYC    (search by city)
GET    /api/hotels/:id         (details)
POST   /api/bookings           (create booking, calculates total)
```

## 💾 Database

**Key Tables:**
```
users              (id, email, password_hash, role)
hotels             (id, owner_id, name, city, country, imageUrls[], lastUpdated)
rooms              (id, hotel_id, code, name, capacity, pricePerNight, imageUrls[])
bookings           (id, room_id, hotel_id, checkIn, checkOut, totalCost, userId)
                   ↑ Has EXCLUDE constraint for double-booking prevention
hotel_managers     (id, hotel_id, manager_id)
```

## 🚀 To Build Phase 7-8 (Manager Rooms)

**Estimated time: 1 day**

1. ✅ Add Room CRUD endpoints in `backend/src/routes/manager.ts`
2. ✅ Verify room has `pricePerNight` field (already in schema)
3. ✅ Create Manager room list page
4. ✅ Create "Add Room" form with price input
5. ✅ Test: Manager adds room with $150/night
6. ✅ Test: Room appears in landing page

## 📖 How Total Price Works

**Formula:**
```
days = Math.ceil((checkOut - checkIn) / (24 * 60 * 60 * 1000))
totalPrice = days × room.pricePerNight
```

**Example:**
- Check-in: Dec 15, 2025
- Check-out: Dec 18, 2025
- Room price: $150/night
- Days: 3
- **Total: $450**

When guest books → `totalCost` saved in booking record

## 🐛 If Something Breaks

### Backend won't start?
```bash
cd backend
npx ts-node src/index.ts
```

### Database out of sync?
```bash
cd backend
npx prisma db push
```

### Frontend not updating?
```
Vite auto-reloads. Check browser console for errors.
Port might be 5175 instead of 5174.
```

### Port already in use?
```bash
# Kill process on port 7000 (backend)
netstat -ano | findstr :7000
taskkill /PID <PID> /F

# Kill process on port 5175 (frontend)  
netstat -ano | findstr :5175
taskkill /PID <PID> /F
```

## 🎓 What You're Building

```
TOURBNB = Hotel Booking System

Admin Flow:
  Signup → Create Hotel → Assign Manager

Manager Flow:
  Login → View Hotel → Add Rooms with Pricing

Guest Flow:
  Search by City → Pick Hotel → Pick Room →
  Choose Dates → See Total Price → Book

Admin also manages everything the Manager can manage
(has override permissions)
```

## 📞 Reference Material

- **mern-booking-app patterns:** Image upload (Cloudinary), JWT auth, Stripe flow
- **CAREGRID_LITE patterns:** Timezone handling, subdomain routing, audit logs
- **Full roadmap:** `TOURBNB_20_PHASES.md` (20 detailed phases)
- **Status report:** `MVP_STATUS_REPORT.md` (what's done, what's next)

---

**Ready to code? Pick a phase from the roadmap and go! 🚀**
