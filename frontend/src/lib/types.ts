// src/lib/types.ts
import type { User as FirebaseUser } from 'firebase/auth';

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: 'Pending' | 'Accepted' | 'Declined';
  plusOne?: boolean;
  dietaryRestrictions?: string;
  notes?: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  colorPalette: string[]; // hex codes
  keywords: string[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  dueDate?: string; 
  notes?: string;
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

export interface RegistryLink {
  id: string;
  platformName: string;
  url: string;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  previewImageUrl: string;
  dataAiHint: string;
}

export interface Photo {
  id: string;
  url: string;
  dataAiHint: string;
  caption?: string;
  uploadedBy?: string; 
  uploadDate: string; 
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

// User role definition
export type UserRole = 'host' | 'guest';

// User profile stored in Firestore
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: Date;
}

// Context state for Authentication
export interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

