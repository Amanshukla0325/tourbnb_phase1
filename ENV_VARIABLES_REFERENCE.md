# Environment Variables Reference for Deployment

## Backend (.env / Render Environment Variables)

```env
# DATABASE - Your Neon PostgreSQL connection string (KEEP SECURE!)
DATABASE_URL=postgresql://neondb_owner:npg_EPRHQSy63tGg@ep-bitter-lab-a171bbxw-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret - Generate a strong random string for production
JWT_SECRET=tourbnb-showcase-secret-needs-to-be-at-least-32-characters-long

# Environment
NODE_ENV=production

# Port (Render automatically sets this, but good to have)
PORT=10000

# Frontend Origin - Update after Vercel deployment
FRONTEND_ORIGIN=https://tourbnb-showcase.vercel.app

# Stripe (Optional - for payment testing)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Frontend (.env.production / Vercel Environment Variables)

```env
# Backend API URL - Points to your Render deployment
VITE_API_URL=https://tourbnb-backend.onrender.com

# Optional: Other environment variables
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

---

## How to Set in Render

1. Go to your Web Service in Render
2. Click **Environment** tab
3. Click **Add Environment Variable**
4. Copy-paste each variable from above

### Example:
```
KEY: DATABASE_URL
VALUE: postgresql://neondb_owner:npg_EPRHQSy63tGg@ep-bitter-lab-a171bbxw-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## How to Set in Vercel

1. Go to your Project in Vercel
2. Click **Settings** → **Environment Variables**
3. Click **Add New** → **Environment Variable**
4. Fill in:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tourbnb-backend.onrender.com`
   - **Environment**: `Production, Preview, Development`

---

## Important: Production Secrets

⚠️ **NEVER commit these to GitHub:**
- DATABASE_URL
- JWT_SECRET
- Stripe keys
- Any API keys

These should ONLY be in:
- Your local `.env` (git ignored)
- Render dashboard (secure)
- Vercel dashboard (secure)

---

## After Deployment: How to Update

1. **Change JWT_SECRET** → Update Render environment, restart service
2. **Change Frontend URL** → Update Vercel environment variable
3. **Change Backend URL** → Update Vercel, run URL script
4. **Any code change** → Commit & push to GitHub (auto-deploy)

---

## Verify Variables Are Set

### Check Backend (Render)
- Go to Service settings
- Click Environment tab
- All variables should be listed

### Check Frontend (Vercel)
- Go to Project settings
- Click Environment Variables
- `VITE_API_URL` should be listed

---

## Troubleshooting Wrong Variables

**If you see errors like:**
- "Cannot reach API" → Check `VITE_API_URL` is correct
- "Database connection failed" → Check `DATABASE_URL` is correct
- "JWT error" → Check `JWT_SECRET` is set

**Solution:**
1. Verify variable names match exactly (case-sensitive)
2. Check values don't have extra spaces
3. Restart the service (Render) or redeploy (Vercel)

---

## JWT_SECRET Generation

If you want to generate a secure secret:

**PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Bash:**
```bash
openssl rand -base64 32
```

---

## Database Backups

Your Neon database is already backed up automatically. No action needed for showcase!

---

## Security Notes for Showcase

Since this is internal showcase:
- ✅ Free tier is fine
- ✅ Render spinning down is fine (not user-facing)
- ✅ No need for paid scaling
- ⚠️ Still protect DATABASE_URL (contains credentials)
- ⚠️ Don't share JWT_SECRET or DB password publicly

---

## Reference URLs

| Service | URL | What to Put |
|---------|-----|------------|
| Neon | neon.tech | Database (already set up) |
| Render | render.com | Backend env vars & deployment |
| Vercel | vercel.com | Frontend env vars & deployment |

---

Deployment environment setup complete! 🎉
