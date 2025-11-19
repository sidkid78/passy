# Passy - Quick Start Guide

All the Passy app files have been organized in the `/frontend` directory.

## 🚀 Getting Started

### 1. Navigate to the frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create your environment file

Create a `.env.local` file in the `frontend` directory:

```bash
# On Windows PowerShell:
New-Item -Path ".env.local" -ItemType File

# On Mac/Linux:
touch .env.local
```

Add your Firebase configuration to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Setup Firebase

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "passy" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

#### Enable Authentication
1. Go to **Build** → **Authentication**
2. Click **Get started**
3. Click **Email/Password**
4. Enable it and save

#### Enable Firestore
1. Go to **Build** → **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (we'll add rules next)
4. Choose your location
5. Click **Enable**

#### Get Firebase Config
1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click web icon (`</>`)
4. Register app as "Passy Web"
5. **Copy the config values to your `.env.local` file**

### 5. Deploy Firestore Security Rules

From the **root directory** (not frontend):

```bash
# Go back to root
cd ..

# Login to Firebase
firebase login

# Initialize Firebase (if not done already)
firebase init

# Select Firestore, use existing project, accept defaults

# Deploy the rules
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 6. Run the development server

```bash
cd frontend
npm run dev
```

### 7. Open your browser

Visit: **http://localhost:3000**

## 📁 Project Structure

```
imaging/
├── frontend/              ← All Next.js app files are here
│   ├── app/              ← Next.js pages
│   ├── components/       ← React components
│   ├── lib/              ← Services, hooks, types
│   ├── scripts/          ← Utility scripts
│   ├── package.json
│   └── .env.local        ← Create this file!
│
├── firestore.rules       ← Firestore security rules
├── firestore.indexes.json
├── firebase.json
└── QUICKSTART.md         ← This file
```

## ✅ Verify Setup

Run the setup checker:

```bash
cd frontend
npm run setup
```

## 🎉 First Steps

1. **Sign up** - Create your account
2. **Create Event** - Click "Create Event" button
3. **Add Details** - Fill in event name, date, budget, theme
4. **Start Planning!**
   - Add tasks
   - Track budget
   - Invite guests
   - Build registry

## 🆘 Troubleshooting

### Module not found errors
**Solution:** Make sure you're in the `frontend` directory and ran `npm install`

### Firebase errors
**Solution:** 
1. Check that `.env.local` exists in `frontend/` directory
2. Verify all Firebase config values are correct
3. Make sure you deployed Firestore rules: `firebase deploy --only firestore:rules`

### Build errors with Tailwind
**Solution:** Restart the dev server:
```bash
# Stop the server (Ctrl+C)
# Clear cache
rm -rf .next
# Start again
npm run dev
```

### "Permission denied" in Firestore
**Solution:** Deploy the security rules from the root directory:
```bash
cd ..  # go to root
firebase deploy --only firestore:rules
```

## 📚 More Documentation

- `frontend/README.md` - Detailed app documentation
- `SETUP.md` - Full setup guide
- `DEPLOYMENT.md` - Production deployment
- `PROJECT_SUMMARY.md` - Technical overview

## 🎨 Features

- ✅ Create multiple baby shower events
- ✅ Task management with progress tracking
- ✅ Budget tracking with visual indicators
- ✅ Guest list with RSVP status
- ✅ Gift registry with claim tracking
- ✅ Real-time updates
- ✅ Beautiful, responsive UI
- ✅ Secure authentication

---

Happy planning! 👶✨

