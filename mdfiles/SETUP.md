# Quick Setup Guide

Follow these steps to get Passy running on your local machine.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Project Setup

### Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: **passy** (or your preferred name)
4. Disable Google Analytics (optional, can enable later)
5. Click "Create project"

### Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click **Email/Password**
5. Enable the first toggle (Email/Password)
6. Click **Save**

### Enable Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (we'll add rules later)
4. Choose your location (e.g., `us-central`)
5. Click **Enable**

### Enable Storage

1. Go to **Build** → **Storage**
2. Click **Get started**
3. Start in **test mode**
4. Click **Done**

### Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click the web icon (`</>`)
4. Register app with nickname "Passy Web"
5. Copy the configuration values

## Step 3: Environment Configuration

Create `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=passy-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=passy-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=passy-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 4: Deploy Firestore Security Rules

Install Firebase CLI if you haven't already:

```bash
npm install -g firebase-tools
```

Login to Firebase:

```bash
firebase login
```

Initialize Firebase in your project:

```bash
firebase init
```

Select:
- ✅ Firestore
- Choose "Use an existing project"
- Select your Passy project
- Use `firestore.rules` (default)
- Use `firestore.indexes.json` (default)

Deploy the rules:

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Create Your First Account

1. Click "Sign Up" on the landing page
2. Enter an email and password
3. You'll be redirected to the home page
4. Click "Create Event" to create your first baby shower event!

## Troubleshooting

### "Permission denied" Error

**Problem:** Can't read/write to Firestore

**Solution:** Make sure you deployed the Firestore rules:
```bash
firebase deploy --only firestore:rules
```

### "Firebase config is undefined"

**Problem:** Environment variables not loading

**Solutions:**
1. Make sure `.env.local` exists and has all variables
2. Restart the dev server after creating `.env.local`
3. Verify all variables start with `NEXT_PUBLIC_`

### Build Errors

**Problem:** TypeScript or build errors

**Solutions:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run dev
```

### Firebase CLI Errors

**Problem:** Can't deploy rules or initialize Firebase

**Solution:**
```bash
# Make sure you're logged in
firebase login

# Check your project list
firebase projects:list

# Use the correct project
firebase use <project-id>
```

## Next Steps

- ✅ Create your first event
- ✅ Add tasks to your event
- ✅ Track your budget
- ✅ Invite guests
- ✅ Build your registry
- 📤 Share your event with friends and family
- 🎉 Plan an amazing baby shower!

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Open an issue if you encounter problems

---

Enjoy planning your baby shower! 👶✨


