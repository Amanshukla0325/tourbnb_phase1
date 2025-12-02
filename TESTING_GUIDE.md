# 🧪 Testing Guide & Quick Reference

## 🚀 Live Demo URLs

### Login Pages
- **Admin Login**: http://localhost:5175/admin/login
- **Manager Login**: http://localhost:5175/manager/login

### Dashboards
- **Admin Dashboard**: http://localhost:5175/admin
- **Manager Dashboard**: http://localhost:5175/manager

### Backend API
- **API Base**: http://localhost:7000
- **API Health**: http://localhost:7000/api/health (if available)

---

## 👤 Test Accounts

### Admin Account
```
Email: admin@tourbnb.local
Password: password123
Role: SUPER_ADMIN
Expected Dashboard: /admin
```

### Manager Account
```
Email: manager@tourbnb.local
Password: password123
Role: MANAGER
Expected Dashboard: /manager
```

**Pre-filled**: Both credentials are already filled in the login forms for easy testing!

---

## ✅ Login Page Test Checklist

### Admin Login Page (`/admin/login`)
- [ ] Page loads without errors
- [ ] Split screen layout visible on desktop (branding left, form right)
- [ ] Mobile view shows full-width form only
- [ ] Email field pre-filled with "admin@tourbnb.local"
- [ ] Password field pre-filled with "password123"
- [ ] Password visibility toggle works (eye icon)
- [ ] "Forgot password" link present and clickable
- [ ] "Remember me" checkbox available
- [ ] Error message displays when login fails
- [ ] Success: Can log in and redirects to `/admin`
- [ ] Social login buttons visible (Google, GitHub)
- [ ] "Create account" footer link present
- [ ] All text properly styled with Figma color system
- [ ] Blue gradient colors visible (not just gray)
- [ ] Decorative circles visible on desktop left section
- [ ] Stats cards visible at bottom of left section on desktop
  - [ ] "100+ Hotels"
  - [ ] "₹50L+ Revenue"
  - [ ] "99.9% Uptime"
- [ ] Focus states show on inputs (blue ring)
- [ ] Responsive behavior: Resize browser and check layout
- [ ] Mobile: Form takes full width
- [ ] Desktop (1024px+): 50/50 split layout

### Manager Login Page (`/manager/login`)
- [ ] Page loads without errors
- [ ] Split screen layout with emerald/teal gradient
- [ ] Email field pre-filled with "manager@tourbnb.local"
- [ ] Password field pre-filled with "password123"
- [ ] All functionality same as admin login
- [ ] Color scheme: Emerald instead of Blue
- [ ] Stats cards at bottom:
  - [ ] "50+ Hotels"
  - [ ] "₹25L+ Revenue"
  - [ ] "24/7 Support"
- [ ] Focus states show green/emerald ring
- [ ] Button color is emerald (not blue)
- [ ] Success: Can log in and redirects to `/manager`

---

## 📊 Dashboard Test Checklist

### Admin Dashboard (`/admin` after admin login)
- [ ] Page loads with admin's hotel data
- [ ] Header shows "Tourbnb Admin" branding
- [ ] Logout button present and functional
- [ ] Stats cards display:
  - [ ] Total Hotels count
  - [ ] Total Rooms count
  - [ ] Managers count
  - [ ] Revenue amount
- [ ] Stats cards have correct icons:
  - [ ] Blue icon for Hotels
  - [ ] Green icon for Rooms
  - [ ] Purple icon for Managers
  - [ ] Amber icon for Revenue
- [ ] Charts render properly:
  - [ ] Line chart shows booking trend
  - [ ] Pie chart shows booking status
- [ ] Tabs work correctly:
  - [ ] Overview tab shows hotels table
  - [ ] Create Hotel tab shows form
  - [ ] Managers tab shows managers list
- [ ] Hotels table shows:
  - [ ] Hotel name
  - [ ] City
  - [ ] Number of rooms (badge)
  - [ ] Status badge
  - [ ] View action button
  - [ ] Delete action button
- [ ] Search functionality works on Overview tab
- [ ] Can create new hotel via form
- [ ] Can delete hotel (with confirmation)
- [ ] Responsive: View on mobile, tablet, desktop
- [ ] All buttons have hover effects
- [ ] Cards have proper shadows

### Manager Dashboard (`/manager` after manager login)
- [ ] Page loads with manager's hotel data
- [ ] Header shows hotel name and address
- [ ] Logout button present and functional
- [ ] Stats cards display:
  - [ ] Total Rooms count
  - [ ] Total Bookings count
  - [ ] Confirmed Bookings count
  - [ ] Pending Bookings count
- [ ] Stats cards have emerald/teal theme
- [ ] Charts render properly:
  - [ ] Line chart shows booking trend
  - [ ] Bar chart shows revenue distribution
- [ ] Tabs work correctly:
  - [ ] Bookings tab shows booking table
  - [ ] Rooms tab shows room management interface
- [ ] Bookings table shows:
  - [ ] Guest name
  - [ ] Room name
  - [ ] Check-in date
  - [ ] Check-out date
  - [ ] Status badge (green/amber/red)
  - [ ] Confirm button (for PENDING)
  - [ ] Cancel button
- [ ] Status badge colors:
  - [ ] Green for CONFIRMED
  - [ ] Amber for PENDING
  - [ ] Red for CANCELLED
- [ ] Rooms section shows:
  - [ ] Add room form with fields
  - [ ] Existing rooms list
  - [ ] Room code, name, capacity, price display
  - [ ] Edit button for each room
  - [ ] Delete button for each room
- [ ] Can add new room
- [ ] Can edit existing room
- [ ] Can delete room
- [ ] Can confirm pending bookings
- [ ] Can cancel bookings
- [ ] Responsive design on all screen sizes
- [ ] All buttons have hover effects

---

## 🎨 Visual Design Verification

### Color Checks
- [ ] Admin Login: Blue gradients (primary #1815F3)
- [ ] Manager Login: Emerald/Teal gradients
- [ ] Input fields: Light gray background (#F3F4F6 or slate-100)
- [ ] Focus states: Colored ring (blue for admin, emerald for manager)
- [ ] Buttons: Gradient colors matching theme
- [ ] Text: Dark gray (#111827) for body, black for headings
- [ ] Cards: White background with subtle shadows
- [ ] Badges: Blue, green, amber, red as specified

### Layout Checks
- [ ] Proper spacing between elements (8px grid)
- [ ] Headings appropriately sized
- [ ] Forms properly aligned
- [ ] Charts properly proportioned
- [ ] Tables scrollable on mobile
- [ ] No content cut off at any breakpoint

### Typography Checks
- [ ] Sans-serif font (Inter) throughout
- [ ] Headings bold (700 weight)
- [ ] Body text regular (400 weight)
- [ ] Labels semibold (600 weight)
- [ ] No text overflow or truncation
- [ ] Readable size at all breakpoints

### Interactive Elements
- [ ] Buttons have hover state (darker shade)
- [ ] Buttons have active state (slight scale)
- [ ] Inputs highlight on focus
- [ ] Icons properly colored
- [ ] Links underline on hover
- [ ] Transitions are smooth (200-300ms)

---

## 🔐 Authentication Flow Testing

### Login Success Flow
1. Navigate to `/admin/login`
2. See pre-filled credentials
3. Click "Sign In" button
4. See loading state (button text changes)
5. Successful redirect to `/admin`
6. Can see admin dashboard

### Login Error Flow
1. Navigate to `/admin/login`
2. Clear email field
3. Enter wrong email: `wrong@example.com`
4. Keep password as is
5. Click "Sign In"
6. See error message: "Login failed..."
7. Remain on login page

### Role Mismatch Testing
1. Navigate to `/admin/login`
2. Try logging in with manager email as admin
3. Should see role error
4. Should redirect to admin login, not dashboard

### Logout Testing
1. Log in successfully
2. Click logout button in header
3. Get redirected to login page
4. Cannot access dashboard without login

---

## 📱 Responsive Testing

### Mobile Testing (375px - 480px)
```
Test Points:
✓ Single column layout
✓ Full-width form (no branding visible)
✓ Buttons sized appropriately
✓ Text readable without zoom
✓ No horizontal scroll
✓ Touch-friendly button sizes (48px minimum)
```

### Tablet Testing (768px - 1024px)
```
Test Points:
✓ 2-3 column layouts
✓ Stats cards in grid
✓ Charts side-by-side
✓ Tables with horizontal scroll if needed
✓ Form inputs properly sized
```

### Desktop Testing (1024px+)
```
Test Points:
✓ Full split-screen layouts
✓ 4 column stat grids
✓ 2 column chart layouts
✓ Full-width tables
✓ All decorative elements visible
✓ Optimal spacing throughout
```

### Specific Responsive Events
- [ ] Desktop (1024px): Branding section becomes visible on login
- [ ] Tablet (768px): Stats cards change from 4 columns to 2
- [ ] Mobile (640px): Stats cards become 1 column
- [ ] Mobile: Navigation tabs may scroll horizontally

---

## 🔄 API Integration Testing

### Admin Endpoints
```
GET /api/admin/hotels
Expected: Array of hotel objects
Status: 200 OK
Used by: Overview tab, stats card

POST /api/admin/hotels
Expected: New hotel created, returns hotel object
Status: 201 Created
Used by: Create Hotel form

DELETE /api/admin/hotels/:id
Expected: Hotel deleted
Status: 200 OK or 204 No Content
Used by: Delete action in table

GET /api/admin/managers
Expected: Array of manager objects
Status: 200 OK
Used by: Managers tab
```

### Manager Endpoints
```
GET /api/manager/hotel
Expected: Hotel object for assigned hotel
Status: 200 OK
Used by: Header info, stats calculation

GET /api/manager/bookings
Expected: Array of booking objects
Status: 200 OK
Used by: Bookings table

PUT /api/manager/bookings/:id
Expected: Updated booking object
Status: 200 OK
Used by: Confirm/Cancel booking buttons

POST /api/manager/rooms
Expected: New room created
Status: 201 Created
Used by: Add Room form

DELETE /api/manager/rooms/:id
Expected: Room deleted
Status: 200 OK or 204
Used by: Delete room button
```

---

## 🐛 Common Issues & Solutions

### Issue: Page shows blank/white screen
**Solution**: Check browser console for errors. Ensure API is running on port 7000.

### Issue: Login redirects back to login page
**Solution**: Check role parameter in login request. Ensure user role matches requested role.

### Issue: Dashboard shows no data
**Solution**: Check API response in Network tab. Ensure hotels/bookings exist in database.

### Issue: Gradient colors not showing
**Solution**: Check CSS is loaded. Ensure tailwind classes are correct in JSX.

### Issue: Responsive layout doesn't change
**Solution**: Hard refresh browser (Ctrl+F5). Check viewport meta tag in HTML.

### Issue: Buttons don't respond to hover
**Solution**: Ensure CSS is compiled. Check for conflicting CSS rules.

### Issue: Images/icons not showing
**Solution**: Check icon library is imported correctly. Verify lucide-react package installed.

---

## 📊 Performance Testing

### Page Load Time
- [ ] Admin Login: < 2 seconds
- [ ] Manager Login: < 2 seconds
- [ ] Admin Dashboard: < 3 seconds (with data)
- [ ] Manager Dashboard: < 3 seconds (with data)

### Responsiveness
- [ ] Page interactive within 3 seconds
- [ ] Charts render within 2 seconds
- [ ] Tables load within 1 second
- [ ] No layout shifts after load

### Memory Usage
- [ ] No memory leaks on navigation
- [ ] Charts clean up properly on unmount
- [ ] No excessive re-renders

---

## ✨ Polish Checks

### Animation & Transitions
- [ ] Smooth hover effects (200-300ms)
- [ ] Button scale feedback on click
- [ ] Form input transitions
- [ ] Page navigation smooth

### Accessibility
- [ ] Tab navigation works
- [ ] Labels associated with inputs
- [ ] Color contrast passes WCAG
- [ ] Screen reader friendly

### Error States
- [ ] Invalid input error messages
- [ ] API error messages
- [ ] Network error handling
- [ ] 404/500 error pages (if added)

---

## 📋 Sign-Off Checklist

When all tests pass, you can sign off:
- [ ] All login pages functional
- [ ] All dashboards functional
- [ ] Responsive design working
- [ ] API integration complete
- [ ] Visual design matches Figma
- [ ] No console errors
- [ ] No network errors
- [ ] Performance acceptable
- [ ] Accessibility compliant
- [ ] Ready for production

---

**Last Updated**: Now
**Status**: Ready for Testing ✅

