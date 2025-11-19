# Getting Started with Passy

Welcome! This guide will get you up and running quickly.

## Prerequisites

- Node.js 20+ installed
- Firebase account
- A code editor (VS Code recommended)

## Quick Setup (5 steps)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Environment File

Create a file named `.env.local` in this directory (`frontend/`) with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Where to get these values:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or select existing)
3. Click the gear icon → Project Settings
4. Scroll down to "Your apps"
5. Click the web icon (`</>`)
6. Copy the config values

### Step 3: Enable Firebase Services

In Firebase Console:

1. **Authentication:**
   - Go to Build → Authentication
   - Click "Get started"
   - Enable "Email/Password"

2. **Firestore:**
   - Go to Build → Firestore Database
   - Click "Create database"
   - Start in "test mode"
   - Choose your location

### Step 4: Deploy Firestore Rules

From the **parent directory** (one level up):

```bash
cd ..
firebase login
firebase init
firebase deploy --only firestore:rules
cd frontend
```

### Step 5: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## First Time Using the App

1. **Sign Up** - Create your account on the landing page
2. **Create Event** - Click the "Create Event" button
3. **Fill Details:**
   - Event name (e.g., "Sarah's Baby Shower")
   - Date of the event
   - Budget amount
   - Choose a theme (Pink, Blue, Neutral, or Modern)
4. **Start Planning!**
   - Add tasks to your checklist
   - Track expenses in the budget tab
   - Add guests and track RSVPs
   - Create a gift registry

## Troubleshooting

### "Module not found" Errors

Make sure you're in the `frontend` directory and have run `npm install`.

### Firebase Errors

1. Check that `.env.local` exists in the `frontend` directory
2. Verify all values in `.env.local` are correct (no `your_` placeholders)
3. Ensure Firebase services (Auth & Firestore) are enabled

### "Permission Denied" in Firestore

Deploy the security rules:
```bash
cd ..
firebase deploy --only firestore:rules
cd frontend
```

### Build Errors

Clear the cache and restart:
```bash
rm -rf .next
npm run dev
```

## File Structure

```
frontend/
├── app/              ← Your pages (home, event, etc.)
├── components/       ← Reusable UI components
├── lib/              ← Services, hooks, and utilities
├── .env.local        ← YOUR FIREBASE CONFIG (create this!)
└── package.json
```

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Check for code issues
- `npm run setup` - Verify your setup

## Features

✅ Create multiple baby shower events
✅ Task checklist with progress tracking
✅ Budget tracker with expense categories
✅ Guest list with RSVP management
✅ Gift registry with claim tracking
✅ Beautiful themes (Pink, Blue, Neutral, Modern)
✅ Real-time updates across all devices
✅ Responsive design for mobile and desktop

## Need More Help?

Check these documentation files in the parent directory:
- `../QUICKSTART.md` - Quick start guide
- `../SETUP.md` - Detailed setup instructions
- `../DEPLOYMENT.md` - Deploy to production
- `../PROJECT_SUMMARY.md` - Technical details

## Support

If you run into issues:
1. Check the troubleshooting section above
2. Review the Firebase documentation
3. Check Next.js documentation
4. Open an issue in the repository

---

Happy planning! 👶💕✨

