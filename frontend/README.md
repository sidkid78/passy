# Passy - Baby Shower Planning App

The simplest way to plan a beautiful baby shower. Built with Next.js 15, React 19, TypeScript, and Firebase.

## Features

- 👶 **Event Management** - Create and manage multiple baby shower events
- ✅ **Task Tracking** - Keep track of todos with progress visualization
- 💰 **Budget Planning** - Monitor expenses and stay within budget
- 👥 **Guest Management** - Manage invitations and RSVPs
- 🎁 **Gift Registry** - Create and share a registry with guests
- 🎨 **Beautiful Themes** - Choose from soft pink, classic blue, neutral, and modern themes
- 🔐 **Secure Authentication** - Firebase authentication with email/password
- 📱 **Responsive Design** - Works seamlessly on all devices

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** Custom UI components (shadcn/ui inspired)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Icons:** Lucide React

## Quick Start

### Prerequisites

- Node.js 20 or later
- npm or pnpm
- Firebase account

### Installation

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Setup Firebase**

Create a Firebase project at [Firebase Console](https://console.firebase.google.com/):
- Enable Authentication (Email/Password)
- Enable Cloud Firestore
- Enable Cloud Storage
- Copy your Firebase configuration

3. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Deploy Firestore rules** (from root directory)
```bash
cd ..
firebase login
firebase init
firebase deploy --only firestore:rules
```

5. **Run development server**
```bash
cd frontend
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing/Auth page
│   ├── globals.css         # Global styles
│   ├── home/
│   │   └── page.tsx        # Home dashboard
│   └── event/[id]/
│       └── page.tsx        # Event detail page
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── pages/              # Page-level components
│   ├── tabs/               # Tab components
│   └── dialogs/            # Dialog components
├── lib/
│   ├── firebase/
│   │   └── config.ts       # Firebase initialization
│   ├── services/
│   │   └── firestore-service.ts  # Firestore operations
│   ├── hooks/
│   │   └── use-auth.ts     # Authentication hook
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── utils.ts            # Utility functions
└── scripts/
    └── setup-check.js      # Setup verification
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup` - Check setup status

## Documentation

- See `../SETUP.md` for detailed setup instructions
- See `../DEPLOYMENT.md` for production deployment guide
- See `../PROJECT_SUMMARY.md` for technical documentation

## Key Features

### Authentication
- Email/password authentication
- Protected routes
- Session management

### Event Management
- Create multiple events
- 4 theme options
- Budget tracking
- Event sharing

### Task Management
- Add/complete/delete tasks
- Progress visualization
- Auto-created starter tasks

### Budget Tracking
- Expense categories
- Visual budget utilization
- Warning indicators

### Guest Management
- RSVP tracking
- Guest summaries
- Contact information

### Gift Registry
- Add items with links
- Claim tracking
- Store information

## Color Scheme

- **Primary (Pink):** Soft baby pink
- **Secondary (Blue):** Powder blue
- **Surface:** Light gray
- **Background:** White with gradients

## Support

For issues or questions:
- Check the documentation in the root directory
- Review Firebase documentation
- Open an issue in the repository

---

Built with ❤️ for expecting parents everywhere.
