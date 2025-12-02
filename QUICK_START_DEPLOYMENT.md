# 🚀 TourBnb Deployment Quick Start

## What You're Getting
✅ **FREE** deployment for showcasing TourBnb to your team  
✅ **FAST** - Backend on Render, Frontend on Vercel  
✅ **Database** - Already on Neon (no extra cost)  
✅ **No Users** - Perfect for internal showcase (no scaling needed)

---

## 📋 STEP-BY-STEP (20 minutes total)

### PHASE 1: Prepare Code (5 min)

1. **Update Backend CORS** ✅ (Already done in this session)
   - Your backend now accepts Vercel URLs

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

---

### PHASE 2: Deploy Backend (5 min)

1. **Go to [render.com](https://render.com)**
   - Sign up with GitHub (or login)
   
2. **Click: New → Web Service**

3. **Configure:**
   ```
   Repository: tourbnb
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build && npx prisma migrate deploy
   Start Command: npm start
   Plan: Free
   ```

4. **Add Environment Variables:**
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_EPRHQSy63tGg@ep-bitter-lab-a171bbxw-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=tourbnb-showcase-key-make-it-long-enough
   NODE_ENV=production
   FRONTEND_ORIGIN=https://tourbnb-showcase.vercel.app
   ```

5. **Click Create Web Service → Wait 5 min**
   - Your backend URL will be like: `https://tourbnb-backend.onrender.com`
   - **COPY THIS URL** ⬅️ You need it next!

6. **Test it works:**
   - Open: `https://tourbnb-backend.onrender.com/api/health`
   - Should show: `{"status":"ok"}`

---

### PHASE 3: Update Frontend URLs (3 min)

1. **Open PowerShell in project root:**
   ```powershell
   .\update-api-urls.ps1 -BackendUrl "https://tourbnb-backend.onrender.com"
   ```
   
   *(Replace with your actual Render URL)*

2. **Commit & Push:**
   ```bash
   git add .
   git commit -m "Update API URLs for production"
   git push origin main
   ```

---

### PHASE 4: Deploy Frontend (5 min)

1. **Go to [vercel.com](https://vercel.com)**
   - Sign up with GitHub (or login)

2. **Click: Add New → Project**

3. **Select: tourbnb repository**

4. **Configure:**
   ```
   Root Directory: frontend
   Framework Preset: Vite
   ```

5. **Add Environment Variable:**
   ```
   VITE_API_URL=https://tourbnb-backend.onrender.com
   ```
   *(Same URL from Phase 2)*

6. **Click Deploy → Wait 3-5 min**
   - Your frontend URL will be like: `https://tourbnb-showcase.vercel.app`

7. **Test it works:**
   - Open: `https://tourbnb-showcase.vercel.app`
   - Should see the TourBnb landing page
   - Try searching for hotels

---

## ✅ Verification Checklist

- [ ] Backend health check responds (Phase 2, Step 6)
- [ ] Frontend landing page loads (Phase 4, Step 7)
- [ ] Hotel search works (typing city name)
- [ ] Can click hotel → see details
- [ ] Can select dates in calendar
- [ ] Admin login works (`admin@tourbnb.com` / `admin123`)
- [ ] Manager login works (`manager@tourbnb.com` / `manager123`)
- [ ] Can view bookings on dashboards

---

## 📊 Your Deployment URLs

After completion:
- **Frontend**: `https://tourbnb-showcase.vercel.app`
- **Backend API**: `https://tourbnb-backend.onrender.com`
- **Admin Credentials**: `admin@tourbnb.com` / `admin123`
- **Manager Credentials**: `manager@tourbnb.com` / `manager123`

---

## ⚠️ Important Notes

### Free Tier Limitations
- **Render**: Spins down after 15 min inactivity (first request ~5s slower) ⏳
- **Vercel**: No limitations, always fast ⚡
- **For showcase**: Not an issue since you'll use it continuously

### If Backend Wakes Up
- Just refresh the page
- It will load in 5-10 seconds
- Then everything works normally

---

## 🆘 Troubleshooting

### "API not responding"
→ Check your `VITE_API_URL` matches the Render URL exactly

### "Backend shows error"
→ Go to Render dashboard → Select web service → View logs
→ Check if DATABASE_URL is correct

### "Login doesn't work"
→ Make sure admin/manager users exist in database
→ Check API response in browser F12 → Network tab

### "Slow first request"
→ This is Render free tier waking up (normal!)
→ Wait 5 seconds and refresh

---

## 🎓 What This Deployment Does

```
Team Member Opens: https://tourbnb-showcase.vercel.app
                           ↓
                    (Vercel deploys)
                           ↓
               Frontend makes API call
                           ↓
         https://tourbnb-backend.onrender.com/api
                           ↓
                    (Render backend)
                           ↓
                  Query Neon database
                    (PostgreSQL)
                           ↓
                   Response sent back
                           ↓
              Frontend displays beautifully
```

---

## 🚀 Next Time (Easy Updates)

If you need to change anything:
1. Make changes locally
2. Push to GitHub (`git push`)
3. **Done!** Both Vercel & Render auto-redeploy

No need to touch Render or Vercel dashboards again!

---

## 💡 Pro Tips

### Custom Domain (Free)
- Both Render & Vercel support free custom domains
- Use your domain: `tourbnb.yourcompany.com`

### Show Team Members
- Just give them: `https://tourbnb-showcase.vercel.app`
- No local setup needed! ✨

### Update Demo Data
- Add more hotels/rooms through admin panel
- Changes persist in Neon database forever

---

**Total Cost: $0** 💰  
**Setup Time: 20 minutes** ⏱️  
**Result: Professional Showcase** 🎉
