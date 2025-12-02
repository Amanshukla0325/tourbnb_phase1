# 🚀 TourBnb Deployment Guide - Showcase

## Quick Summary
- **Backend**: Render.com (Free tier) - Node.js
- **Frontend**: Vercel.com (Free tier) - React/Vite
- **Database**: Neon (Already set up)
- **Total Cost**: $0 (Free tier only)
- **Setup Time**: ~15 minutes

---

## ✅ STEP 1: Create GitHub Repository (Required for both Render & Vercel)

### 1.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial TourBnb deployment"
git remote add origin https://github.com/YOUR_USERNAME/tourbnb.git
git branch -M main
git push -u origin main
```

### 1.2 Important: Split Backend & Frontend (Optional but recommended)

For Render + Vercel, you can either:
- **Option A** (Easy): Deploy from monorepo (one GitHub repo, both deploy)
- **Option B** (Better): Create separate repos for backend & frontend

For now, we'll use **Option A** (monorepo).

---

## 🔧 STEP 2: Deploy Backend to Render.com

### 2.1 Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub
- Authorize Render to access your GitHub repositories

### 2.2 Create Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repo (`tourbnb`)
3. Configure:
   - **Name**: `tourbnb-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command**: `npm start`
   - **Plan**: Free (yes, free is sufficient for showcase)

### 2.3 Add Environment Variables
Click **Environment** and add:

```
DATABASE_URL=postgresql://neondb_owner:npg_EPRHQSy63tGg@ep-bitter-lab-a171bbxw-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=tourbnb-showcase-secret-key-needs-to-be-long-enough

NODE_ENV=production

FRONTEND_ORIGIN=https://tourbnb-showcase.vercel.app
```

⚠️ **Important**: Copy your Neon connection string from your backend `.env` file

### 2.4 Deploy
- Click **Create Web Service**
- Wait ~5 minutes for build & deployment
- Once deployed, you'll get a URL like: `https://tourbnb-backend.onrender.com`
- ⚠️ **Copy this URL - you need it for frontend!**

### 2.5 Verify Backend
Open in browser: `https://tourbnb-backend.onrender.com/api/health`

You should see: `{"status":"ok"}`

---

## 📱 STEP 3: Deploy Frontend to Vercel.com

### 3.1 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Authorize Vercel to access your GitHub repositories

### 3.2 Import Project
1. Click **Add New** → **Project**
2. Select your `tourbnb` repository from GitHub
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`

### 3.3 Environment Variables
Before deployment, add environment variable:

```
VITE_API_URL=https://tourbnb-backend.onrender.com
```

(Replace with your actual Render URL from Step 2.4)

### 3.4 Deploy
- Click **Deploy**
- Wait ~3-5 minutes for build
- You'll get a URL like: `https://tourbnb-showcase.vercel.app`

### 3.5 Verify Frontend
- Open: `https://tourbnb-showcase.vercel.app`
- You should see the TourBnb landing page
- Try to search for hotels (API should work!)

---

## ⚡ STEP 4: Update API URLs (Important!)

The frontend has hardcoded `localhost:7000` URLs. Search and update all of them:

### Files to update:
- `frontend/src/pages/LandingPage.tsx`
- `frontend/src/pages/HotelDetails.tsx`
- `frontend/src/pages/admin/*.tsx`
- `frontend/src/pages/manager/*.tsx`

### Find & Replace:
**Find**: `http://localhost:7000`
**Replace**: `https://tourbnb-backend.onrender.com`

Or create a config file:

Create `frontend/src/config/api.ts`:
```typescript
const API_URL = process.env.VITE_API_URL || 'http://localhost:7000';
export default API_URL;
```

Then in each file:
```typescript
import API_URL from '@/config/api';
// Use: `${API_URL}/api/bookings`
```

---

## 🧪 STEP 5: Test Everything

### 5.1 Test Public Features
- [ ] Landing page loads
- [ ] Hotel search works
- [ ] Can view hotel details
- [ ] Calendar displays with dates

### 5.2 Test Admin Dashboard
- [ ] Login: `admin@tourbnb.com` / `admin123`
- [ ] Can see hotels, managers, rooms
- [ ] Can add new room
- [ ] Can see bookings

### 5.3 Test Manager Dashboard
- [ ] Login: `manager@tourbnb.com` / `manager123`
- [ ] Can see assigned hotel
- [ ] Can see bookings
- [ ] Can add room

### 5.4 Test Booking Flow
- [ ] Select hotel
- [ ] Choose dates
- [ ] Fill booking form
- [ ] See booking confirmation

---

## 🔄 IMPORTANT: Database Migrations

**First Time Deployment Only:**

### Option 1: Auto-migrate on Render
The build command includes: `npx prisma migrate deploy`

This runs your Prisma migrations automatically.

### Option 2: Manual Migration
If auto-migration fails:
1. Connect to Neon database directly
2. Run migrations manually through Prisma Studio

---

## 📝 Important Notes for Free Tier

### Render Free Tier Limitations:
- ✅ Unlimited deployments
- ⚠️ Spins down after 15 minutes of inactivity (first request will be slow)
- ✅ 0.5 GB RAM (enough for showcase)
- ✅ Shared CPU

### Vercel Free Tier Limitations:
- ✅ Unlimited deployments & bandwidth
- ✅ Fast deployments (10-30s typically)
- ✅ Automatic SSL/HTTPS

---

## 🚨 Troubleshooting

### Backend not starting
```
Check Render logs:
Settings → Logs
```

### Frontend API calls failing
- Check browser Console (F12)
- Verify `VITE_API_URL` is set correctly
- Check CORS headers in backend

### Database migration failed
- SSH into Render container
- Check Prisma CLI output
- Verify DATABASE_URL is correct

---

## 🎯 Showcase URLs (After Deployment)

- **Frontend**: `https://tourbnb-showcase.vercel.app`
- **Backend API**: `https://tourbnb-backend.onrender.com/api`
- **Health Check**: `https://tourbnb-backend.onrender.com/api/health`

---

## 📋 Deployment Checklist

- [ ] GitHub repository created and pushed
- [ ] Backend deployed to Render
- [ ] Render backend URL copied
- [ ] Frontend deployed to Vercel
- [ ] API URLs updated in frontend code
- [ ] Environment variables set correctly
- [ ] Health endpoint responds
- [ ] Landing page loads
- [ ] Admin login works
- [ ] Manager login works
- [ ] Bookings show correctly

---

## Next Steps (If More Features Needed)

- Add custom domain (both free tier support)
- Set up CI/CD auto-deployment (already included)
- Monitor uptime with Uptime Robot (free)
- Add analytics with Vercel Analytics (free)

---

## ❓ Quick Reference

| Service | URL | Cost | Setup Time |
|---------|-----|------|-----------|
| Neon DB | - | Free | 0m |
| Render Backend | onrender.com | Free | 10m |
| Vercel Frontend | vercel.app | Free | 10m |
| **Total** | - | **Free** | **20m** |

Good luck with your showcase! 🎉
