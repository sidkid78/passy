# 🚀 Deploying Passy to Vercel

## Quick Fix for Current Deployment Error

Your deployment is failing because Vercel is looking for `package.json` in the root, but your Next.js app is in the `/frontend` folder.

### ✅ **Solution: Configure Root Directory in Vercel**

1. **Go to your Vercel project dashboard:**
   - Visit https://vercel.com/dashboard
   - Select your "passy" project

2. **Update Project Settings:**
   - Go to **Settings** → **General**
   - Find **Root Directory** section
   - Click **Edit**
   - Set Root Directory to: `frontend`
   - Click **Save**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click the three dots (...) on the latest deployment
   - Click **Redeploy**

---

## 📋 **Alternative: Move Files to Root (Not Recommended)**

If you prefer everything in the root:

```bash
# Move all frontend files to root
mv frontend/* .
mv frontend/.* . 2>/dev/null || true
rmdir frontend
```

**But this breaks the current structure!** The Root Directory approach is better.

---

## 🔑 **Environment Variables Needed**

After fixing the root directory, add these in Vercel:

**Settings → Environment Variables:**

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

---

## ✅ **Deployment Checklist**

- [ ] Set Root Directory to `frontend` in Vercel settings
- [ ] Add all environment variables
- [ ] Redeploy
- [ ] Test authentication
- [ ] Test AI features
- [ ] Enjoy your live app! 🎉

---

## 🐛 **Still Having Issues?**

Check the build logs for:
- Missing dependencies
- Environment variable errors
- Next.js version issues

**Current Setup:**
- Next.js: 15.5.6
- Node: Should use 18.x or later
- Build Command: `npm run build`
- Output Directory: `.next`

