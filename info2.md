## Core Features:

- Guest Manager: Guest list creation and management: easily add, edit, and track RSVPs.
- Theme Inspiration: Browse curated baby shower themes and decoration ideas for inspiration.
- Game Suggestions: Receive customized baby shower game suggestions based on guest preferences and theme. Uses an LLM tool to reason about appropriateness of specific options given various parameters.
- Checklist: An interactive checklist ensuring all tasks are tracked, managed, and completed for a flawless shower.
- Budget Tracker: Helps hosts to allocate expenses appropriately so there are no surprises as the party date approaches
- Registry Integration: Allow users to add/view wishlists or sync with platforms like Amazon, Target, etc.
- Digital Invitations: Add customizable invite templates & sending directly from the app
- Photo Sharing / Gallery: Let hosts/guests upload photos or create a memory album
- Seating Arrangement: Add optional guest grouping or seating layout feature
- Reminders & Notifications: Implement smart reminders via app or email/text
- Multi-host Collaboration: Enable role-based access and shared checklists/budgets
- Offline Mode: Basic offline functionality for checklist/RSVP
- Data Storage/Sync: Define database and sync strategy (Firebase? Supabase?)
- Analytics: Integrate user behavior tracking for optimization and insights
- AI Decor Assistant: Suggest décor layouts or mockups based on photos of the venue
- Live Polling or Quizzes: Fun real-time guest interactions during the event
- Post-Event Thank You Helper: Track gifts and auto-generate thank-you messages

## Style Guidelines:

- Soft lavender (#D0B8E3) to evoke a sense of calm and gentleness, perfect for celebrating new life.
- Light pastel purple (#F2EFFF) for a soft, clean backdrop.
- Muted rose (#E3B8D0) to add a touch of warmth and sophistication, complementing the lavender tones.
- Headline font: 'Playfair' serif for an elegant, fashionable feel.
- Body font: 'PT Sans' sans-serif; for an easily readable, clean presentation
- Gentle, rounded icons for a soft and welcoming interface.
- Clean, intuitive layout with ample spacing for a stress-free planning experience.
- Subtle animations to create a delightful, engaging user experience.
- Define primary/secondary brand colors for UI consistency
- Include contrast testing, text resizing, and screen reader support
- Consider adding badges or fun unlocks to boost engagement

## functions/lib/index.js

```javascript
"use strict";
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_functions_1 = require("firebase-functions");
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
(0, firebase_functions_1.setGlobalOptions)({ maxInstances: 10 });
// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map
```

## /src/ai/flows/generate-thank-you-notes.ts

```typescript
// src/ai/flows/generate-thank-you-notes.ts
'use server';
/**
 * @fileOverview Generates thank you notes based on gifts received.
 *
 * - generateThankYouNotes - A function that generates thank you notes.
 * - GenerateThankYouNotesInput - The input type for the generateThankYouNotes function.
 * - GenerateThankYouNotesOutput - The return type for the generateThankYouNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThankYouNotesInputSchema = z.object({
  guestName: z.string().describe('The name of the guest who gave the gift.'),
  giftDescription: z.string().describe('A description of the gift received.'),
  personalNote: z.string().optional().describe('Any personal note or memory associated with the guest or gift.'),
  tone: z.enum(['formal', 'informal', 'humorous']).default('informal').describe('The desired tone of the thank you note.'),
});
export type GenerateThankYouNotesInput = z.infer<typeof GenerateThankYouNotesInputSchema>;

const GenerateThankYouNotesOutputSchema = z.object({
  thankYouNote: z.string().describe('The generated thank you note.'),
});
export type GenerateThankYouNotesOutput = z.infer<typeof GenerateThankYouNotesOutputSchema>;

export async function generateThankYouNotes(input: GenerateThankYouNotesInput): Promise<GenerateThankYouNotesOutput> {
  return generateThankYouNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThankYouNotesPrompt',
  input: {schema: GenerateThankYouNotesInputSchema},
  output: {schema: GenerateThankYouNotesOutputSchema},
  prompt: `You are an expert at writing thank you notes.  Generate a thank you note based on the gift received.

  Guest Name: {{{guestName}}}
  Gift Description: {{{giftDescription}}}
  Personal Note: {{{personalNote}}}
  Tone: {{{tone}}}

  Thank You Note:`, 
});

const generateThankYouNotesFlow = ai.defineFlow(
  {
    name: 'generateThankYouNotesFlow',
    inputSchema: GenerateThankYouNotesInputSchema,
    outputSchema: GenerateThankYouNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
```

## /src/ai/flows/suggest-baby-shower-games.ts

```typescript
// The AI flow in this file suggests baby shower game ideas to the user.
// It takes in guest preferences and theme and outputs customized game suggestions.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBabyShowerGamesInputSchema = z.object({
  guestPreferences: z
    .string()
    .describe('A description of the guests attending the baby shower, their ages, and their relationship to the parent(s).'),
  theme: z.string().describe('The theme of the baby shower.'),
});

export type SuggestBabyShowerGamesInput = z.infer<
  typeof SuggestBabyShowerGamesInputSchema
>;

const SuggestBabyShowerGamesOutputSchema = z.object({
  gameSuggestions: z
    .string()
    .describe('A list of baby shower game suggestions that are appropriate for the guests and the theme.'),
});

export type SuggestBabyShowerGamesOutput = z.infer<
  typeof SuggestBabyShowerGamesOutputSchema
>;

export async function suggestBabyShowerGames(
  input: SuggestBabyShowerGamesInput
): Promise<SuggestBabyShowerGamesOutput> {
  return suggestBabyShowerGamesFlow(input);
}

const suggestBabyShowerGamesPrompt = ai.definePrompt({
  name: 'suggestBabyShowerGamesPrompt',
  input: {schema: SuggestBabyShowerGamesInputSchema},
  output: {schema: SuggestBabyShowerGamesOutputSchema},
  prompt: `You are a party planning expert specializing in baby showers.

Suggest baby shower game ideas based on the guest preferences and the chosen theme.

Guest Preferences: {{{guestPreferences}}}
Theme: {{{theme}}}

Respond with game suggestions appropriate for the guests and the theme.
`,
});

const suggestBabyShowerGamesFlow = ai.defineFlow(
  {
    name: 'suggestBabyShowerGamesFlow',
    inputSchema: SuggestBabyShowerGamesInputSchema,
    outputSchema: SuggestBabyShowerGamesOutputSchema,
  },
  async input => {
    const {output} = await suggestBabyShowerGamesPrompt(input);
    return output!;
  }
);
```

## /src/ai/flows/theme-assistant-chats.ts
```typescript
'use server';
/**
 * @fileOverview A conversational AI for brainstorming baby shower themes.
 *
 * - themeAssistantChat - A function that handles the chat conversation.
 * - ThemeAssistantChatInput - The input type for the themeAssistantChat function.
 * - ThemeAssistantChatOutput - The return type for the themeAssistantChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ThemeAssistantChatInputSchema = z.object({
  prompt: z.string().describe("The user's latest message in the conversation."),
  history: z.array(HistoryMessageSchema).optional().describe('The conversation history.'),
});
export type ThemeAssistantChatInput = z.infer<typeof ThemeAssistantChatInputSchema>;

const ThemeAssistantChatOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user."),
});
export type ThemeAssistantChatOutput = z.infer<typeof ThemeAssistantChatOutputSchema>;

export async function themeAssistantChat(
  input: ThemeAssistantChatInput
): Promise<ThemeAssistantChatOutput> {
  return themeAssistantChatFlow(input);
}

const themeAssistantChatFlow = ai.defineFlow(
  {
    name: 'themeAssistantChatFlow',
    inputSchema: ThemeAssistantChatInputSchema,
    outputSchema: ThemeAssistantChatOutputSchema,
  },
  async input => {
    const history = input.history?.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await ai.generate({
      system: `You are a friendly and creative baby shower theme planner. Your goal is to collaborate with the user to brainstorm and develop the perfect baby shower theme. Engage in a natural conversation, ask clarifying questions, and provide imaginative ideas based on the user's input. Use the provided conversation history to maintain context. Keep your responses concise and helpful.`,
      history,
      prompt: input.prompt,
    });

    return {response: response.text};
  }
);
```

## src/ai/genkit.ts
```typescript
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
```

## src/ai/dev.ts
```typescript
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-thank-you-notes.ts';
import '@/ai/flows/suggest-baby-shower-games.ts';
import '@/ai/flows/theme-assistant-chat.ts';
```

## src/app/account/reset-password/page.tsx
```typescript
// src/app/account/reset-password/page.tsx
'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your inbox (and spam folder) for instructions.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Reset Password</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Reset Link'}
            </Button>
          </form>
          <div className="mt-4 text-center">
             <Link href="/account" passHref><Button variant="link">Back to Login</Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## src/app/account/page.tsx 
```typescript
// src/app/account/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function AccountPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userCredential;
      if (isLoginView) {
        // Login
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Success', description: 'Logged in successfully!' });
      } else {
        // Sign Up
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user profile in Firestore
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'host', // Default new sign-ups to host
          createdAt: new Date(),
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);

        toast({ title: 'Welcome!', description: 'Account created successfully.' });
      }
      router.push('/'); // Redirect to dashboard after login/signup
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Create user profile if it doesn't exist
         const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'host',
          createdAt: new Date(),
        };
        await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });

        toast({ title: 'Success', description: 'Logged in with Google!' });
        router.push('/');

    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Google Sign-In Error',
            description: error.message,
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{isLoginView ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
          <CardDescription>
            {isLoginView ? 'Log in to continue planning.' : 'Sign up to start planning the perfect baby shower.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuthAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              {isLoginView && <Link href="/account/reset-password" passHref><Button variant="link" type="button" className="text-xs p-0 h-auto">Forgot Password?</Button></Link>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isLoginView ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
            <Icons.Google className="mr-2 h-4 w-4" /> Google
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isLoginView ? "Don't have an account?" : 'Already have an account?'}
            <Button
              variant="link"
              className="ml-1 p-0 h-auto"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? 'Sign up' : 'Log in'}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

## src/app/budget/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BudgetItem } from '@/lib/types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialBudgetItems: BudgetItem[] = [
  { id: '1', category: 'Venue', itemName: 'Community Hall Rental', estimatedCost: 200, actualCost: 200, paid: true },
  { id: '2', category: 'Food & Drinks', itemName: 'Catering Service', estimatedCost: 500, actualCost: 480, paid: true },
  { id: '3', category: 'Decorations', itemName: 'Balloons, Banners, Centerpieces', estimatedCost: 150, actualCost: 0, paid: false },
  { id: '4', category: 'Games & Favors', itemName: 'Prizes and Thank You Gifts', estimatedCost: 100, actualCost: 0, paid: false },
];

export default function BudgetTrackerPage() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<BudgetItem> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setBudgetItems(initialBudgetItems);
  }, []);

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + (item.actualCost || 0), 0);

  const handleAddItem = () => {
    setCurrentItem({ category: '', itemName: '', estimatedCost: 0, paid: false });
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: BudgetItem) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== itemId));
    toast({ title: "Item removed", description: "The budget item has been removed." });
  };

  const handleSaveItem = () => {
    if (!currentItem || !currentItem.itemName || !currentItem.category || currentItem.estimatedCost === undefined) {
      toast({ variant: "destructive", title: "Error", description: "Category, item name, and estimated cost are required." });
      return;
    }

    if (currentItem.id) {
      setBudgetItems(budgetItems.map(item => item.id === currentItem.id ? currentItem as BudgetItem : item));
      toast({ title: "Item updated", description: "Budget item details have been updated." });
    } else {
      const newItem = { ...currentItem, id: String(Date.now()) } as BudgetItem;
      setBudgetItems([...budgetItems, newItem]);
      toast({ title: "Item added", description: "New item added to the budget." });
    }
    setIsDialogOpen(false);
    setCurrentItem(null);
  };

  if (!isMounted) {
    return <p>Loading budget...</p>;
  }

  return (
    <div>
      <PageHeader title="Budget Tracker" description="Manage your baby shower expenses and stay on track.">
        <Button onClick={handleAddItem}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </PageHeader>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{currentItem?.id ? 'Edit Budget Item' : 'Add New Budget Item'}</DialogTitle>
            <DialogDescription>
              {currentItem?.id ? 'Update the details for this budget item.' : 'Enter the details for the new budget item.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input id="category" value={currentItem?.category || ''} onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemName" className="text-right">Item Name</Label>
              <Input id="itemName" value={currentItem?.itemName || ''} onChange={(e) => setCurrentItem({...currentItem, itemName: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estimatedCost" className="text-right">Estimated Cost</Label>
               <div className="relative col-span-3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input id="estimatedCost" type="number" value={currentItem?.estimatedCost || 0} onChange={(e) => setCurrentItem({...currentItem, estimatedCost: parseFloat(e.target.value) || 0})} className="pl-7" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="actualCost" className="text-right">Actual Cost</Label>
              <div className="relative col-span-3">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input id="actualCost" type="number" value={currentItem?.actualCost || ''} onChange={(e) => setCurrentItem({...currentItem, actualCost: parseFloat(e.target.value) || undefined})} className="pl-7" placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paid" className="text-right">Paid?</Label>
                <Checkbox id="paid" checked={currentItem?.paid || false} onCheckedChange={(checked) => setCurrentItem({...currentItem, paid: !!checked})} className="col-span-3 justify-self-start" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Notes</Label>
              <Textarea id="notes" value={currentItem?.notes || ''} onChange={(e) => setCurrentItem({...currentItem, notes: e.target.value})} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="button" onClick={handleSaveItem}>Save Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle className="font-headline text-lg">Total Estimated</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold text-primary">{formatCurrency(totalEstimated)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-headline text-lg">Total Actual Spent</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold text-accent">{formatCurrency(totalActual)}</p></CardContent>
        </Card>
         <Card>
          <CardHeader><CardTitle className="font-headline text-lg">Remaining Budget</CardTitle></CardHeader>
          <CardContent><p className={`text-2xl font-semibold ${totalEstimated - totalActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(totalEstimated - totalActual)}</p></CardContent>
        </Card>
      </div>
      
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead className="text-right">Est. Cost</TableHead>
              <TableHead className="text-right">Actual Cost</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No budget items added yet. Click "Add Item" to start tracking expenses.
                </TableCell>
              </TableRow>
            )}
            {budgetItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.category}</TableCell>
                <TableCell className="font-medium">{item.itemName}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.estimatedCost)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.actualCost)}</TableCell>
                <TableCell>{item.paid ? 'Yes' : 'No'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)} className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="font-semibold">Totals</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(totalEstimated)}</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(totalActual)}</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
```

## src/app/checklist/page.tsx

```typescript
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ChecklistItem } from '@/lib/types';
import { PlusCircle, Trash2, Edit2, CheckSquare, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


const initialChecklist: ChecklistItem[] = [
  { id: '1', task: 'Set a date and time', completed: true },
  { id: '2', task: 'Choose a venue', completed: true },
  { id: '3', task: 'Create a guest list', completed: false },
  { id: '4', task: 'Send out invitations', completed: false },
  { id: '5', task: 'Plan the menu', completed: false },
  { id: '6', task: 'Organize games and activities', completed: false },
  { id: '7', task: 'Arrange decorations', completed: false },
  { id: '8', task: 'Buy or make party favors', completed: false },
];

export default function ChecklistPage() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    // In a real app, fetch checklist from a data source
    setChecklist(initialChecklist);
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() === '') {
      toast({ variant: "destructive", title: "Error", description: "Task cannot be empty." });
      return;
    }
    const newItem: ChecklistItem = {
      id: String(Date.now()),
      task: newTask.trim(),
      completed: false,
    };
    setChecklist([...checklist, newItem]);
    setNewTask('');
    toast({ title: "Task Added", description: `"${newItem.task}" has been added to your checklist.`});
  };

  const toggleComplete = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = checklist.find(item => item.id === id);
    setChecklist(checklist.filter((item) => item.id !== id));
    if (taskToDelete) {
       toast({ title: "Task Removed", description: `"${taskToDelete.task}" has been removed.`});
    }
  };

  const handleEditTask = (item: ChecklistItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (editingItem && editingItem.task.trim() !== '') {
      setChecklist(checklist.map(item => item.id === editingItem.id ? editingItem : item));
      toast({ title: "Task Updated", description: `"${editingItem.task}" has been updated.`});
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } else {
       toast({ variant: "destructive", title: "Error", description: "Task name cannot be empty."});
    }
  };


  if (!isMounted) {
    return <p>Loading checklist...</p>; // Or a skeleton loader
  }
  
  const completedTasks = checklist.filter(item => item.completed).length;
  const totalTasks = checklist.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div>
      <PageHeader 
        title="Baby Shower Checklist" 
        description="Stay organized and ensure every detail is covered for a flawless event."
      />
      
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              type="text" 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)} 
              placeholder="e.g., Order cake" 
              className="flex-grow"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button onClick={handleAddTask}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline">Your Tasks</CardTitle>
            <div className="text-sm text-muted-foreground">
              {completedTasks} / {totalTasks} tasks completed ({progress}%)
            </div>
          </div>
           {totalTasks > 0 && (
            <div className="w-full bg-muted rounded-full h-2.5 mt-2">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {checklist.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Your checklist is empty. Add some tasks to get started!</p>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <ul className="space-y-3">
                {checklist.map((item) => (
                  <li key={item.id} className={`flex items-center justify-between p-3 rounded-md transition-colors ${item.completed ? 'bg-muted/70 hover:bg-muted' : 'bg-card hover:bg-secondary/30'} border`}>
                    <div className="flex items-center gap-3 flex-grow">
                      <Checkbox 
                        id={`task-${item.id}`} 
                        checked={item.completed} 
                        onCheckedChange={() => toggleComplete(item.id)}
                        aria-label={`Mark task ${item.task} as ${item.completed ? 'incomplete' : 'complete'}`}
                      />
                      <label 
                        htmlFor={`task-${item.id}`} 
                        className={`flex-grow cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                      >
                        {item.task}
                        {item.notes && <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>}
                      </label>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                       <Button variant="ghost" size="icon" onClick={() => handleEditTask(item)} aria-label={`Edit task ${item.task}`}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(item.id)} className="text-destructive hover:text-destructive" aria-label={`Delete task ${item.task}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the details for this task.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-task-name" className="text-right">
                  Task
                </Label>
                <Input
                  id="edit-task-name"
                  value={editingItem.task}
                  onChange={(e) => setEditingItem({ ...editingItem, task: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-task-notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="edit-task-notes"
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
             <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            <Button type="button" onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

``` 

## src/app/decor-assistant/page.tsx
```typescript
```
## src/app/gallery/page.tsx
```typescript

```
## src/app/invitations/page.tsx
```typescript

```
## src/app/registry/page.tsx
```typescript
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Photo } from '@/lib/types';
import { UploadCloud } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const initialPhotos: Photo[] = [
  { id: '1', url: 'https://placehold.co/600x400.png', dataAiHint: 'baby shower cake', caption: 'The beautiful cake!', uploadDate: '2024-07-15' },
  { id: '2', url: 'https://placehold.co/600x400.png', dataAiHint: 'group photo guests', caption: 'Group photo with everyone.', uploadDate: '2024-07-15' },
  { id: '3', url: 'https://placehold.co/600x400.png', dataAiHint: 'baby shower gifts', caption: 'Opening presents.', uploadDate: '2024-07-15' },
  { id: '4', url: 'https://images.unsplash.com/photo-1622290291165-d341f1938b8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxiYWJ5JTIwc2hvd2VyfGVufDB8fHx8MTc1MTY1NTgwMnww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'baby shower', caption: 'Venue decorations looked amazing!', uploadDate: '2024-07-14' },
  { id: '5', url: 'https://placehold.co/600x400.png', dataAiHint: 'baby shower games', caption: 'Fun times playing games.', uploadDate: '2024-07-14' },
  { id: '6', url: 'https://placehold.co/600x400.png', dataAiHint: 'happy parents', caption: 'Parents-to-be looking radiant.', uploadDate: '2024-07-15' },
];

export default function PhotoGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // State for the upload dialog
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setPhotos(initialPhotos);
  }, []);

  const resetUploadForm = () => {
    setNewPhotoPreview(null);
    setNewPhotoCaption('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 4MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoPreview(reader.result as string);
      };
      reader.onerror = () => {
        toast({ variant: "destructive", title: "Error", description: "Failed to read the image file."});
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (!newPhotoPreview) {
      toast({ variant: "destructive", title: "No Photo Selected", description: "Please select a photo to upload." });
      return;
    }

    const newPhoto: Photo = {
      id: String(Date.now()),
      url: newPhotoPreview,
      dataAiHint: 'user uploaded',
      caption: newPhotoCaption,
      uploadDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
    toast({ title: "Photo Uploaded!", description: "Your memory has been added to the gallery." });
    
    setIsUploadDialogOpen(false);
  };

  useEffect(() => {
    if (!isUploadDialogOpen) {
      resetUploadForm();
    }
  }, [isUploadDialogOpen]);

  if (!isMounted) {
    return <p>Loading gallery...</p>;
  }

  return (
    <div>
      <PageHeader title="Photo Gallery & Memories" description="Relive the joyful moments from the baby shower.">
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UploadCloud className="mr-2 h-4 w-4" /> Upload Photos
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload a New Photo</DialogTitle>
              <DialogDescription>
                Share a memory with everyone. Choose a photo and add an optional caption.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              {newPhotoPreview && (
                <div className="relative w-full h-48 border rounded-md overflow-hidden">
                  <Image src={newPhotoPreview} alt="New photo preview" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain" />
                </div>
              )}
              <div className="grid w-full gap-1.5">
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Textarea 
                  placeholder="e.g., Best baby shower game ever!" 
                  id="caption" 
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleSavePhoto} disabled={!newPhotoPreview}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {photos.length === 0 && (
         <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="font-headline">Gallery is Empty!</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">No photos have been added yet. Start by uploading your favorite moments!</CardDescription>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <UploadCloud className="mr-2 h-4 w-4" /> Upload Photos
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Dialog key={photo.id} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
            <DialogTrigger asChild>
              <Card
                className="overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative w-full aspect-square bg-muted">
                  <Image
                    src={photo.url}
                    alt={photo.caption || 'Baby shower moment'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    data-ai-hint={photo.dataAiHint}
                    className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                {photo.caption && (
                  <CardFooter className="p-3 text-xs">
                    <p className="truncate text-muted-foreground">{photo.caption}</p>
                  </CardFooter>
                )}
              </Card>
            </DialogTrigger>
            {selectedPhoto && selectedPhoto.id === photo.id && (
              <DialogContent className="sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] p-0">
                <DialogHeader className="sr-only">
                  <DialogTitle>{selectedPhoto.caption || 'Photo View'}</DialogTitle>
                </DialogHeader>
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={selectedPhoto.url}
                    alt={selectedPhoto.caption || 'Baby shower moment'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain" />
                </div>
                {selectedPhoto.caption && (
                  <div className="p-4 border-t">
                    <p className="text-sm text-foreground">{selectedPhoto.caption}</p>
                    <p className="text-xs text-muted-foreground">Uploaded on: {new Date(selectedPhoto.uploadDate).toLocaleDateString()}</p>
                  </div>
                )}
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>
    </div>
  );
}
```


## src/app/games/page.tsx
```typescript
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { suggestBabyShowerGames, type SuggestBabyShowerGamesInput, type SuggestBabyShowerGamesOutput } from '@/ai/flows/suggest-baby-shower-games';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  guestPreferences: z.string().min(10, { message: "Please describe your guests (min. 10 characters)." }),
  theme: z.string().min(3, { message: "Please provide a theme (min. 3 characters)." }),
});

export default function GameSuggestionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestBabyShowerGamesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<SuggestBabyShowerGamesInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestPreferences: '',
      theme: '',
    },
  });

  const onSubmit = async (data: SuggestBabyShowerGamesInput) => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestBabyShowerGames(data);
      setSuggestions(result);
      toast({ title: "Suggestions Ready!", description: "Here are some game ideas for your baby shower." });
    } catch (error) {
      console.error("Error generating game suggestions:", error);
      toast({ variant: "destructive", title: "Error", description: (error as Error).message || "Failed to get game suggestions." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="AI Game Planner" 
        description="Get personalized baby shower game suggestions based on your guests and theme." 
      />

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Tell us about your party</CardTitle>
          <CardDescription>The more details you provide, the better the suggestions!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="guestPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Mixed ages, mostly family, love active games / prefer relaxed activities, etc."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baby Shower Theme</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Woodland, Twinkle Little Star, Nautical" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Get Game Ideas
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {suggestions && (
        <Card className="mt-8 bg-primary/5 animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="font-headline text-primary">Game Suggestions</CardTitle>
            <CardDescription>Here are some fun ideas for your baby shower!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {suggestions.gameSuggestions}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## src/app/guests/page.tsx
```typescript
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import type { Guest } from '@/lib/types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialGuests: Guest[] = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', rsvpStatus: 'Accepted', plusOne: true, dietaryRestrictions: 'Vegetarian' },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com', rsvpStatus: 'Pending', notes: 'Might be late' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', rsvpStatus: 'Declined' },
];

export default function GuestManagerPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<Partial<Guest> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    // In a real app, fetch guests from a data source
    setGuests(initialGuests);
  }, []);

  const handleAddGuest = () => {
    setCurrentGuest({ rsvpStatus: 'Pending' });
    setIsDialogOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setCurrentGuest(guest);
    setIsDialogOpen(true);
  };

  const handleDeleteGuest = (guestId: string) => {
    setGuests(guests.filter(g => g.id !== guestId));
    toast({ title: "Guest removed", description: "The guest has been removed from the list." });
  };

  const handleSaveGuest = () => {
    if (!currentGuest || !currentGuest.name) {
      toast({ variant: "destructive", title: "Error", description: "Guest name is required." });
      return;
    }

    if (currentGuest.id) {
      // Update existing guest
      setGuests(guests.map(g => g.id === currentGuest.id ? currentGuest as Guest : g));
      toast({ title: "Guest updated", description: `${currentGuest.name}'s details have been updated.` });
    } else {
      // Add new guest
      const newGuest = { ...currentGuest, id: String(Date.now()) } as Guest;
      setGuests([...guests, newGuest]);
      toast({ title: "Guest added", description: `${newGuest.name} has been added to the list.` });
    }
    setIsDialogOpen(false);
    setCurrentGuest(null);
  };

  if (!isMounted) {
    return <p>Loading guests...</p>; // Or a skeleton loader
  }

  return (
    <div>
      <PageHeader title="Guest Manager" description="Manage your baby shower guest list and track RSVPs.">
        <Button onClick={handleAddGuest}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Guest
        </Button>
      </PageHeader>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{currentGuest?.id ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
            <DialogDescription>
              {currentGuest?.id ? 'Update the details for this guest.' : 'Enter the details for the new guest.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={currentGuest?.name || ''} onChange={(e) => setCurrentGuest({...currentGuest, name: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" value={currentGuest?.email || ''} onChange={(e) => setCurrentGuest({...currentGuest, email: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input id="phone" value={currentGuest?.phone || ''} onChange={(e) => setCurrentGuest({...currentGuest, phone: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rsvpStatus" className="text-right">RSVP Status</Label>
              <Select
                value={currentGuest?.rsvpStatus || 'Pending'}
                onValueChange={(value: Guest['rsvpStatus']) => setCurrentGuest({...currentGuest, rsvpStatus: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select RSVP status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plusOne" className="text-right">Plus One?</Label>
                <Checkbox id="plusOne" checked={currentGuest?.plusOne || false} onCheckedChange={(checked) => setCurrentGuest({...currentGuest, plusOne: !!checked})} className="col-span-3 justify-self-start" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dietaryRestrictions" className="text-right">Dietary Needs</Label>
              <Input id="dietaryRestrictions" value={currentGuest?.dietaryRestrictions || ''} onChange={(e) => setCurrentGuest({...currentGuest, dietaryRestrictions: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Notes</Label>
              <Textarea id="notes" value={currentGuest?.notes || ''} onChange={(e) => setCurrentGuest({...currentGuest, notes: e.target.value})} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveGuest}>Save Guest</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>RSVP Status</TableHead>
              <TableHead>Plus One</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No guests added yet. Click "Add Guest" to get started!
                </TableCell>
              </TableRow>
            )}
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell>{guest.email || '-'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    guest.rsvpStatus === 'Accepted' ? 'bg-green-100 text-green-700' :
                    guest.rsvpStatus === 'Declined' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {guest.rsvpStatus}
                  </span>
                </TableCell>
                <TableCell>{guest.plusOne ? 'Yes' : 'No'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEditGuest(guest)} className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteGuest(guest.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

```
## src/app/invitations/page.tsx
```typescript

```
## src/app/registry/page.tsx
```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { RegistryLink } from '@/lib/types';
import { PlusCircle, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialRegistryLinks: RegistryLink[] = [
  { id: '1', platformName: 'Amazon Baby Registry', url: 'https://www.amazon.com/baby-reg' },
  { id: '2', platformName: 'Target Baby Registry', url: 'https://www.target.com/gift-registry/baby-registry' },
  { id: '3', platformName: 'buybuy BABY', url: 'https://www.buybuybaby.com/store/registry' },
];

export default function RegistryLinksPage() {
  const [registryLinks, setRegistryLinks] = useState<RegistryLink[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<Partial<RegistryLink> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setRegistryLinks(initialRegistryLinks);
  }, []);

  const handleAddLink = () => {
    setCurrentLink({ platformName: '', url: '' });
    setIsDialogOpen(true);
  };

  const handleEditLink = (link: RegistryLink) => {
    setCurrentLink(link);
    setIsDialogOpen(true);
  };

  const handleDeleteLink = (linkId: string) => {
    setRegistryLinks(registryLinks.filter(link => link.id !== linkId));
    toast({ title: "Link removed", description: "The registry link has been removed." });
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  const handleSaveLink = () => {
    if (!currentLink || !currentLink.platformName || !currentLink.url) {
      toast({ variant: "destructive", title: "Error", description: "Platform name and URL are required." });
      return;
    }
    if (!isValidUrl(currentLink.url)) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid URL (e.g., https://example.com)." });
      return;
    }


    if (currentLink.id) {
      setRegistryLinks(registryLinks.map(link => link.id === currentLink.id ? currentLink as RegistryLink : link));
      toast({ title: "Link updated", description: "Registry link details have been updated." });
    } else {
      const newLink = { ...currentLink, id: String(Date.now()) } as RegistryLink;
      setRegistryLinks([...registryLinks, newLink]);
      toast({ title: "Link added", description: "New registry link added." });
    }
    setIsDialogOpen(false);
    setCurrentLink(null);
  };
  
  if (!isMounted) {
    return <p>Loading registry links...</p>;
  }

  return (
    <div>
      <PageHeader title="Registry Links" description="Manage and share your baby registry links.">
        <Button onClick={handleAddLink}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Registry Link
        </Button>
      </PageHeader>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentLink?.id ? 'Edit Registry Link' : 'Add New Registry Link'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platformName" className="text-right">Platform</Label>
              <Input id="platformName" value={currentLink?.platformName || ''} onChange={(e) => setCurrentLink({...currentLink, platformName: e.target.value})} className="col-span-3" placeholder="e.g., Amazon, Target" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">URL</Label>
              <Input id="url" value={currentLink?.url || ''} onChange={(e) => setCurrentLink({...currentLink, url: e.target.value})} className="col-span-3" placeholder="https://www.example.com/registry" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="button" onClick={handleSaveLink}>Save Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {registryLinks.length === 0 && (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="font-headline">No Registry Links Yet!</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Add links to your baby registries from platforms like Amazon, Target, etc.</CardDescription>
            <Button onClick={handleAddLink}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Link
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registryLinks.map((link) => (
          <Card key={link.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline text-lg">{link.platformName}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <Link href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all text-sm flex items-center">
                {link.url} <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </CardContent>
            <CardContent className="pt-0 flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => handleEditLink(link)}>
                <Edit className="mr-1 h-3 w-3" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteLink(link.id)}>
                <Trash2 className="mr-1 h-3 w-3" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

```

## src/app/thank-you-notes/page.tsx
```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateThankYouNotes, type GenerateThankYouNotesInput, type GenerateThankYouNotesOutput } from '@/ai/flows/generate-thank-you-notes';
import { Loader2, Copy } from 'lucide-react';

const formSchema = z.object({
  guestName: z.string().min(2, { message: "Guest name must be at least 2 characters." }),
  giftDescription: z.string().min(5, { message: "Gift description must be at least 5 characters." }),
  personalNote: z.string().optional(),
  tone: z.enum(['formal', 'informal', 'humorous']).default('informal'),
});

export default function ThankYouNotesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<GenerateThankYouNotesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<GenerateThankYouNotesInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: '',
      giftDescription: '',
      personalNote: '',
      tone: 'informal',
    },
  });

  const onSubmit = async (data: GenerateThankYouNotesInput) => {
    setIsLoading(true);
    setGeneratedNote(null);
    try {
      const result = await generateThankYouNotes(data);
      setGeneratedNote(result);
      toast({ title: "Thank You Note Generated!", description: "Your personalized thank you note is ready." });
    } catch (error) {
      console.error("Error generating thank you note:", error);
      toast({ variant: "destructive", title: "Error", description: (error as Error).message || "Failed to generate thank you note." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedNote?.thankYouNote) {
      navigator.clipboard.writeText(generatedNote.thankYouNote)
        .then(() => toast({ title: "Copied!", description: "Thank you note copied to clipboard." }))
        .catch(() => toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy to clipboard." }));
    }
  };

  return (
    <div>
      <PageHeader 
        title="AI Thank You Note Helper" 
        description="Effortlessly generate personalized thank you notes for your baby shower gifts." 
      />

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Gift & Guest Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="guestName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Aunt Mary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="giftDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gift Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., a beautiful handmade blanket, a set of adorable onesies" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Touch (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., So lovely to see you! We really appreciate you coming." {...field} rows={3}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone of Note</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="informal">Informal & Friendly</SelectItem>
                        <SelectItem value="formal">Formal & Elegant</SelectItem>
                        <SelectItem value="humorous">Light & Humorous</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate Note
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {generatedNote && (
        <Card className="mt-8 bg-primary/5 animate-in fade-in duration-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-primary">Generated Thank You Note</CardTitle>
              <CardDescription>Review and copy your personalized note.</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyToClipboard} aria-label="Copy note">
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-background min-h-[150px] whitespace-pre-wrap">
              {generatedNote.thankYouNote}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

```
## src/app/themes/page.tsx
```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { themeAssistantChat, type ThemeAssistantChatInput } from '@/ai/flows/theme-assistant-chat';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function ThemeAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I'm your AI Theme Assistant. What kind of baby shower are you dreaming of? Let's brainstorm some ideas together!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const result = await themeAssistantChat({ prompt: input, history: chatHistory });

      const aiMessage: Message = { role: 'model', content: result.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling AI assistant:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sorry, I couldn't get a response. Please try again.",
      });
       // Restore user message if AI fails
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader 
        title="AI Theme Assistant" 
        description="Collaborate with our AI to brainstorm and create the perfect baby shower theme." 
      />
      
      <Card className="flex-1 flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Icons.ThemeAssistant className="w-6 h-6 text-primary" />
            Chat with your Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {message.content}
                  </div>
                   {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-6">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me about your ideas..." 
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

```
## src/components/header-nav.tsx
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export function HeaderNav() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>
      <Button variant="outline" size="icon" onClick={() => router.push('/')}>
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Button>
    </div>
  );
}

```

## src/components/page-header.tsx
```typescript
import type React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-foreground">{title}</h1>
        {children}
      </div>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
    </div>
  );
}

```

## src/components/sidebar-nav.tsx
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';
import { Icons } from '@/components/icons';
import { sidebarMenuButtonVariants } from '@/components/ui/sidebar';


const navItems: NavItem[] = [
    { title: 'Dashboard', href: '/', icon: Icons.Dashboard },
    { title: 'Guest Manager', href: '/guests', icon: Icons.Guests },
    { title: 'Theme Assistant', href: '/themes', icon: Icons.ThemeAssistant },
    { title: 'Game Suggestions', href: '/games', icon: Icons.Games },
    { title: 'Thank You Helper', href: '/thank-you-notes', icon: Icons.ThankYouHelper },
    { title: 'Checklist', href: '/checklist', icon: Icons.Checklist },
    { title: 'Budget Tracker', href: '/budget', icon: Icons.Budget },
    { title: 'Registry Links', href: '/registry', icon: Icons.Registry },
    { title: 'Photo Gallery', href: '/gallery', icon: Icons.Gallery },
  ];

export function SidebarNav() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <SidebarMenuItem key={item.title}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    sidebarMenuButtonVariants({ variant: 'default', size: 'default' }),
                    isActive && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                  )}
                >
                  <span className="flex items-center gap-2 w-full">
                    <item.icon className="h-4 w-4" />
                    <span
                      className={cn(
                        'truncate',
                        state === 'collapsed' && 'hidden'
                      )}
                    >
                      {item.title}
                    </span>
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                hidden={state !== 'collapsed' || isMobile}
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

```

## src/components/icons.tsx
```typescript
import {
  LayoutDashboard,
  Users,
  Palette,
  Gamepad2,
  ListChecks,
  PiggyBank,
  Gift,
  Mail,
  Image as ImageIcon,
  Wand2,
  HeartHandshake,
  Baby,
  Menu,
  Bot,
  type LucideIcon,
} from 'lucide-react';

export type Icon = LucideIcon;

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.9 2.09-5.12 2.09-6.17 0-10.33-4.42-10.33-10.33s4.16-10.33 10.33-10.33c3.45 0 5.42 1.48 6.68 2.65l2.84-2.84C20.46 1.48 17.22 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c7.34 0 12.04-5.22 12.04-12.04 0-.85-.09-1.54-.18-2.2z"
        fill="currentColor"
        />
  </svg>
);


export const Icons = {
  Logo: Baby,
  Menu: Menu,
  Dashboard: LayoutDashboard,
  Guests: Users,
  Themes: Palette,
  ThemeAssistant: Bot,
  Games: Gamepad2,
  Checklist: ListChecks,
  Budget: PiggyBank,
  Registry: Gift,
  Invitations: Mail,
  Gallery: ImageIcon,
  DecorAssistant: Wand2,
  ThankYouHelper: HeartHandshake,
  Google: GoogleIcon,
};

```

## src/context/auth-context.tsx
```typescript
// src/context/auth-context.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { AuthContextType, UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        } else {
          // Handle case where user exists in Auth but not Firestore (should be rare)
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, userProfile, loading };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

```

## src/hooks/use-mobile.tsx
```typescript
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

```

## src/hooks/use-toast.tsx
```typescript
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

```

## src/lib/firebase.ts
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize App Check
if (typeof window !== 'undefined') {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(''), // IMPORTANT: Replace with your site key
    isTokenAutoRefreshEnabled: true
  });
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
```
## src/lib/types.ts
```typescript
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

```

## src/lib/utils.ts
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

## src/lib/middleware.ts
```typescript
// src/lib/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('firebase-session-token');

  const protectedHostRoutes = ['/dashboard', '/guests', '/checklist', '/budget', '/games', '/themes', '/thank-you-notes', '/gallery', '/registry'];
  const isHostRoute = protectedHostRoutes.some(route => pathname.startsWith(route));

  // If user is not logged in and tries to access a protected host route, redirect to login
  if (!sessionToken && isHostRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/account';
    return NextResponse.redirect(url);
  }

  // If user is logged in and tries to access the account page, redirect to dashboard
  if (sessionToken && pathname === '/account') {
    const url = request.nextUrl.clone();
    url.pathname = '/'; // Or '/dashboard'
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/guests/:path*',
    '/checklist/:path*',
    '/budget/:path*',
    '/games/:path*',
    '/themes/:path*',
    '/thank-you-notes/:path*',
    '/gallery/:path*',
    '/registry/:path*',
    '/account',
  ],
};

```
