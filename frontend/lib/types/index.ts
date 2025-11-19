import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isPremium: boolean;
  createdAt: Timestamp | Date;
}

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

export type GuestStatus = 'invited' | 'going' | 'maybe' | 'not_going';

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  status: GuestStatus;
  note?: string;
  createdAt: Timestamp | Date;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  isCompleted: boolean;
  dueDate?: Timestamp | Date;
  createdAt: Timestamp | Date;
}

export interface Expense {
  id: string;
  eventId: string;
  title: string;
  category: 'decor' | 'food' | 'venue' | 'gifts' | 'other';
  amount: number;
  isPaid: boolean;
  createdAt: Timestamp | Date;
}

export interface RegistryItem {
  id: string;
  eventId: string;
  title: string;
  storeName?: string;
  url?: string;
  isClaimed: boolean;
  claimedBy?: string;
  claimedByName?: string;
  createdAt: Timestamp | Date;
}

export interface CreateEventInput {
  name: string;
  date: Date;
  budgetTotal: number;
  theme: AppEvent['theme'];
}

export interface CreateTaskInput {
  title: string;
  dueDate?: Date;
}

export interface CreateExpenseInput {
  title: string;
  category: Expense['category'];
  amount: number;
  isPaid: boolean;
}

export interface CreateGuestInput {
  name: string;
  email?: string;
  note?: string;
}

export interface CreateRegistryItemInput {
  title: string;
  storeName?: string;
  url?: string;
}

