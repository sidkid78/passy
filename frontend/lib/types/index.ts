import { Timestamp } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';

// ========== User Types ==========
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isPremium: boolean;
  createdAt: Timestamp | Date;
}

export type UserRole = 'host' | 'guest';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string | null;
  role?: UserRole;
  createdAt?: string | Date;
}

export interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

// ========== Event Types ==========
export interface AppEvent {
  id: string;
  hostUserId: string;
  name: string;
  date: Timestamp | Date;
  theme: 'classic_blue' | 'soft_pink' | 'neutral' | 'modern';
  budgetTotal: number;
  inviteToken?: string;
  createdAt: Timestamp | Date;
}

export interface CreateEventInput {
  name: string;
  date: Date;
  theme: 'classic_blue' | 'soft_pink' | 'neutral' | 'modern';
  budgetTotal: number;
}

// ========== Guest Types ==========
export type GuestStatus = 'invited' | 'going' | 'maybe' | 'not_going';

export interface Guest {
  id: string;
  eventId?: string;
  name: string;
  email?: string;
  phone?: string;
  status?: GuestStatus;
  rsvpStatus?: 'Pending' | 'Accepted' | 'Declined';
  plusOne?: boolean;
  dietaryRestrictions?: string;
  note?: string;
  notes?: string;
  createdAt?: Timestamp | Date;
}

export interface CreateGuestInput {
  eventId: string;
  name: string;
  email?: string;
  note?: string;
}

// ========== Task Types ==========
export interface Task {
  id: string;
  eventId: string;
  title: string;
  completed: boolean;
  dueDate?: Timestamp | Date;
  createdAt: Timestamp | Date;
}

export interface CreateTaskInput {
  eventId: string;
  title: string;
  dueDate?: Date;
}

// ========== Budget/Expense Types ==========
export interface Expense {
  id: string;
  eventId: string;
  category: string;
  description: string;
  amount: number;
  createdAt: Timestamp | Date;
}

export interface CreateExpenseInput {
  eventId: string;
  category: string;
  description: string;
  amount: number;
}

export interface BudgetItem {
  id: string;
  category: string;
  itemName: string;
  estimatedCost: number;
  actualCost?: number;
  paid: boolean;
  notes?: string;
}

// ========== Registry Types ==========
export interface RegistryItem {
  id: string;
  eventId: string;
  name: string;
  isClaimed: boolean;
  claimedBy?: string;
  claimedByName?: string;
  storeName?: string;
  url?: string;
  createdAt: Timestamp | Date;
}

export interface CreateRegistryItemInput {
  eventId: string;
  name: string;
  storeName?: string;
  url?: string;
}

export interface RegistryLink {
  id: string;
  platformName: string;
  url: string;
}

// ========== Checklist Types ==========
export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  dueDate?: string;
  notes?: string;
}

// ========== Theme Types ==========
export interface Theme {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  colorPalette: string[];
  keywords: string[];
}

// ========== Invitation Types ==========
export interface InvitationTemplate {
  id: string;
  name: string;
  previewImageUrl: string;
  dataAiHint: string;
}

// ========== Photo Types ==========
export interface Photo {
  id: string;
  url: string;
  dataAiHint: string;
  caption?: string;
  uploadedBy?: string;
  uploadDate: string;
}

// ========== Navigation Types ==========
export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}
