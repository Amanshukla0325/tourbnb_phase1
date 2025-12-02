# Frontend Deployment to Vercel

## Status: Ready for Deployment ✅

### What's Been Done
- ✅ All 30+ hardcoded localhost URLs replaced with centralized API config
- ✅ Created `/frontend/src/config/api.ts` for dynamic API URL configuration
- ✅ Frontend builds successfully (14.33s build time)
- ✅ Production dist/ folder created with optimized assets:
  - HTML: 0.65 kB
  - CSS: 94.14 kB (gzip: 15.81 kB)
  - JS: 736.78 kB (gzip: 203.53 kB)

### How API URLs Work
Files modified to use centralized API configuration:
- `frontend/src/pages/LandingPage.tsx`
- `frontend/src/pages/HotelDetails.tsx`
- `frontend/src/pages/BookingConfirmation.tsx`
- `frontend/src/pages/admin/*.tsx` (all admin pages)
- `frontend/src/pages/manager/*.tsx` (all manager pages)

All fetch calls now use:
```typescript
import API_URL from '@/config/api';
// Usage: fetch(`${API_URL}/api/endpoint`, ...)
```

The API_URL reads from `VITE_API_URL` environment variable or defaults to `http://localhost:7000` for local development.

### Deployment Steps to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard

2. **Import Project**
   - Click "Add New" → "Project"
   - Select the `tourbnb_phase1` GitHub repository
   - OR use direct import option

3. **Configure Project Settings**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start` (or leave as default)
   - **Install Command**: `npm ci`
   - **Output Directory**: `dist` (should auto-detect)

4. **Add Environment Variables**
   - Add new environment variable:
     - **Key**: `VITE_API_URL`
     - **Value**: Get your Render backend URL from Render dashboard
       - Example: `https://tourbnb-abc123.onrender.com`
   - This URL should match your live backend from Phase 10

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (~1-2 minutes)
   - Your frontend will be live at: `https://tourbnb-showcase.vercel.app` (or custom domain)

### Post-Deployment Testing

After deployment, test these flows:

1. **Public Landing Page** (no auth)
   - Search for hotels by city
   - View hotel details
   - Verify API calls go to Render backend

2. **Booking Flow**
   - Select hotel → Select dates → Complete booking
   - Verify bookings appear in database

3. **Admin Dashboard**
   - Login: `admin@tourbnb.com` / `admin123`
   - Create hotel, assign manager, view bookings
   - Test all CRUD operations

4. **Manager Dashboard**
   - Login: `manager@tourbnb.com` / `manager123`
   - Add rooms, update availability, view bookings
   - Test room management

### Troubleshooting

**If you see API errors:**
- Verify `VITE_API_URL` environment variable is set correctly
- Check that Render backend is running (not hibernated)
- Verify CORS is enabled in backend (should already be configured)

**If frontend doesn't load:**
- Check Vercel deployment logs
- Verify `frontend` folder is selected as Root Directory
- Check that `npm run build` runs without errors

**If some pages fail:**
- Check browser console for 404s or CORS errors
- Verify all imports of `API_URL` are correct
- Search codebase for any remaining hardcoded localhost URLs

### Environment Variables Reference

- `VITE_API_URL`: Backend API base URL (e.g., `https://tourbnb-abc123.onrender.com`)
- Default: `http://localhost:7000` (for local development)

### Files Modified

**Added:**
- `frontend/src/config/api.ts` - Centralized API configuration

**Modified (URL replacement):**
- All page files in `frontend/src/pages/**/*.tsx`
- All imports updated to include `import API_URL from '@/config/api'`
- All fetch calls updated from hardcoded URLs to `${API_URL}`

### Quick Reference: URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | https://tourbnb-showcase.vercel.app |
| Backend | https://tourbnb-abc123.onrender.com (get from Render) |
| Database | Connected via Render backend |

---

**Next Steps**: 
1. Copy your Render backend URL
2. Go to Vercel dashboard
3. Add `VITE_API_URL` environment variable
4. Deploy! 🚀
