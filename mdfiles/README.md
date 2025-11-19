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

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm or pnpm
- Firebase account

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "Passy"
3. Enable **Authentication** with Email/Password provider
4. Enable **Cloud Firestore** database
5. Enable **Cloud Storage**
6. Create a web app and copy the configuration

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd passy
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.local.example .env.local
```

4. Add your Firebase configuration to `.env.local`
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Deploy Firestore security rules
```bash
firebase deploy --only firestore:rules
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Firestore Data Structure

### Collections

- **events** - Main event documents
  - Subcollections:
    - **tasks** - Event tasks
    - **expenses** - Budget expenses
    - **registry_items** - Gift registry items
- **guests** - Guest list (root level for easy querying)
- **users** - User profiles

### Security

Firestore security rules ensure:
- Users can only access their own events
- Guests can view but not modify event details
- Registry items can be claimed by authenticated users
- Task and budget data is only accessible to event hosts

## Key Features Implementation

### Authentication
- Email/password authentication via Firebase
- Protected routes with automatic redirects
- User session management with custom hooks

### Real-time Updates
- All data syncs in real-time using Firestore subscriptions
- Changes appear instantly across all connected clients

### Event Management
- Create multiple events with custom themes
- Track event date and budget
- Share events via URL

### Task Management
- Add, complete, and delete tasks
- Visual progress tracking
- Task completion percentage

### Budget Tracking
- Add expenses by category
- Visual budget utilization
- Warning indicators when approaching budget limit

### Guest Management
- Add guests with names, emails, and notes
- Track RSVP status (Going, Maybe, Not Going, Invited)
- Guest count summaries

### Gift Registry
- Add items with store names and URLs
- Track claimed items
- Guest names shown for claimed items

## Project Structure

```
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
└── firestore.rules         # Firestore security rules
```

## Color Scheme

- **Primary (Pink):** #FFC1CC - Soft, baby-themed pink
- **Secondary (Blue):** #B0E0E6 - Powder blue accent
- **Background:** White with gradient overlays
- **Surface:** #FAFAFA - Light gray surfaces

## Future Enhancements

- [ ] Premium subscription features
- [ ] Email invitations
- [ ] Photo gallery
- [ ] Event templates
- [ ] Push notifications
- [ ] Calendar integration
- [ ] Multi-language support
- [ ] Dark mode

## License

MIT

## Support

For support, please open an issue in the repository.

---

Built with ❤️ for expecting parents everywhere.


