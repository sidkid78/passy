# 👶 Passy - AI-Powered Baby Shower Planning App

The simplest and smartest way to plan a beautiful baby shower. Built with Next.js 15, React 19, TypeScript, Firebase, and Google Gemini AI.

---

## ✨ Features

### 🤖 **AI-Powered Tools**

- **🎨 Theme Assistant** - Conversational AI that brainstorms themes with you and generates 3 beautiful visualization images per idea using Google Imagen 4.0
- **🎮 Game Planner** - Get personalized baby shower game suggestions based on your guests and theme
- **💌 Thank You Note Helper** - Generate elegant, personalized thank you notes in cursive font with AI

### 📋 **Core Planning Features**

- **👥 Guest Manager** - Track RSVPs, manage guest lists, and monitor attendance
- **✅ Checklist** - Comprehensive task management with progress tracking
- **💰 Budget Tracker** - Monitor expenses across categories and stay on budget
- **🎁 Registry Links** - Centralize and share all your baby registry links
- **📸 Photo Gallery** - Share memorable moments from your shower
- **📨 Digital Invitations** - Create and send beautiful digital invites

### 🎯 **User Experience**

- 🔐 **Secure Authentication** - Google Sign-In and email/password with Firebase
- 🎨 **Beautiful Design** - Elegant color palette (soft lavender, muted rose, pastel purple)
- 📱 **Responsive** - Seamless experience on mobile, tablet, and desktop
- 🌙 **Modern UI** - Shadcn/ui components with smooth animations
- 📐 **Sidebar Navigation** - Easy access to all features

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + @tailwindcss/typography
- **Components:** Shadcn/ui + Radix UI primitives
- **Fonts:** Playfair Display (headlines), PT Sans (body), Dancing Script (cursive)
- **Icons:** Lucide React

### Backend & Services

- **Authentication:** Firebase Auth
- **Database:** Cloud Firestore
- **Storage:** Firebase Storage
- **AI/ML:** Google Gemini 2.0 Flash + Google Imagen 4.0
- **AI Framework:** Google Genkit

### Development Tools

- **Form Management:** React Hook Form + Zod
- **Markdown Rendering:** React Markdown + remark-gfm
- **Notifications:** Sonner (toast)
- **Date Handling:** date-fns

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- npm or pnpm
- Firebase account
- Google Cloud account (for Gemini AI API)

### Installation

1. **Clone and navigate to frontend**

```bash
cd frontend
npm install
```

2. **Setup Firebase**

Create a Firebase project at [Firebase Console](https://console.firebase.google.com/):

- Enable **Authentication** (Email/Password + Google Sign-In)
- Enable **Cloud Firestore**
- Enable **Cloud Storage**
- Enable **App Check** (recommended for production)
- Copy your Firebase configuration

3. **Setup Google Gemini AI**

Go to [Google AI Studio](https://aistudio.google.com/):

- Create an API key for Gemini
- Enable Imagen 4.0 API access

4. **Configure environment variables**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key
```

5. **Deploy Firestore security rules**

```bash
cd ..  # Go to root directory
firebase login
firebase init  # If not already initialized
firebase deploy --only firestore:rules
```

6. **Run development server**

```bash
cd frontend
npm run dev
```

7. **Open your browser**

```
http://localhost:3000
```

---

## 📁 Project Structure

```

frontend/
├── app/
│   ├── layout.tsx              # Root layout with sidebar
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles & design system
│   ├── account/                # Authentication pages
│   ├── dashboard/              # Main dashboard
│   ├── themes/                 # AI Theme Assistant
│   ├── games/                  # AI Game Planner
│   ├── thank-you-notes/        # AI Thank You Helper
│   ├── guests/                 # Guest Manager
│   ├── checklist/              # Task Checklist
│   ├── budget/                 # Budget Tracker
│   ├── registry/               # Registry Links
│   └── gallery/                # Photo Gallery
├── components/
│   ├── ui/                     # Shadcn/ui components
│   ├── sidebar-nav.tsx         # Main navigation sidebar
│   ├── page-header.tsx         # Reusable page header
│   └── icons.tsx               # Icon library
├── src/
│   ├── context/
│   │   └── auth-context.tsx    # Authentication context
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Mobile detection hook
│   │   └── use-toast.ts        # Toast notifications hook
│   ├── lib/
│   │   └── types.ts            # TypeScript interfaces
│   └── ai/
│       ├── genkit.ts           # Genkit AI configuration
│       └── flows/              # AI flow definitions
│           ├── theme-assistant-chat.ts
│           ├── suggest-baby-shower-games.ts
│           └── generate-thank-you-notes.ts
├── lib/
│   ├── firebase/
│   │   └── config.ts           # Firebase initialization
│   ├── services/
│   │   └── firestore-service.ts # Firestore CRUD operations
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

---

## 🎨 Design System

### Color Palette

- **Primary:** Soft Lavender `#D0B8E3` - Main brand color
- **Secondary:** Muted Rose `#E3B8D0` - Accents and highlights
- **Accent:** Light Pastel Purple `#F2EFFF` - Backgrounds and surfaces

### Typography

- **Headlines:** Playfair Display (elegant serif)
- **Body Text:** PT Sans (clean sans-serif)
- **Cursive/Script:** Dancing Script (for thank you notes)

### Components

- Modern card-based layouts
- Smooth hover transitions
- Elegant shadows and borders
- Responsive grid systems

---

## 🤖 AI Features Deep Dive

### Theme Assistant

- **Conversational AI** powered by Gemini 2.0 Flash
- **Image Generation** with Google Imagen 4.0
- **3 Visual Variations** per theme idea
- **Markdown Support** for rich text responses
- **Context-Aware** - remembers conversation history

### Game Planner

- Analyzes guest preferences and shower theme
- Generates custom game suggestions
- Provides setup instructions and rules
- Markdown-formatted output for easy reading

### Thank You Note Helper

- Personalizes notes based on gift and guest
- Tone options: Formal, Informal, Humorous
- Beautiful cursive font (Dancing Script)
- One-click copy to clipboard

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Set Root Directory** in Vercel project settings to: `frontend`
2. **Add Environment Variables** (all Firebase + Gemini API keys)
3. **Deploy**

See `../VERCEL_DEPLOYMENT.md` for detailed instructions.

### Other Platforms

- Ensure `frontend` is the build directory
- Set build command: `npm run build`
- Set output directory: `.next`

---

## 🔒 Security

- Firebase Security Rules for Firestore
- Firebase App Check for production
- Environment variables for sensitive keys
- Protected routes with authentication middleware
- Server-side AI operations (`'use server'` directive)

---

## 📖 Documentation

- **Setup Guide:** `../SETUP.md`
- **Deployment Guide:** `../DEPLOYMENT.md`
- **Vercel Deployment:** `../VERCEL_DEPLOYMENT.md`
- **Technical Summary:** `../PROJECT_SUMMARY.md`
- **Specification:** `../info2.md`

---

## 🐛 Troubleshooting

### Firebase Not Configured

The app gracefully handles missing Firebase configuration and runs in "demo mode" for development.

### AI Image Generation Issues

- Ensure `GEMINI_API_KEY` is set in environment variables
- Check Google AI Studio quota limits
- Review `TROUBLESHOOTING_IMAGE_GENERATION.md`

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check Node.js version: `node -v` (should be 18+)

---

## 🎯 Roadmap

- [ ] Mobile app (React Native/Flutter)
- [ ] Premium subscription features
- [ ] More AI-powered tools
- [ ] Social sharing features
- [ ] Vendor recommendations
- [ ] Budget analytics dashboard

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 💖 Support

For issues or questions:

- Check the documentation files in root directory
- Review [Firebase Documentation](https://firebase.google.com/docs)
- Review [Genkit Documentation](https://firebase.google.com/docs/genkit)
- Open an issue in the repository

---

**Built with ❤️ for expecting parents everywhere.**

*Powered by Next.js, Firebase, and Google AI*
