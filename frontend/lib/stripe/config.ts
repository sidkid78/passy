import Stripe from 'stripe';

// Server-side Stripe instance 
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
    typescript: true,
});

// Client-side publishable key
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

// ✅ Your actual Price IDs from Stripe
export const PRICE_IDS = {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY || 'price_1SVY9aB4fT5BrCYaPku93uL0',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY || 'price_1SVYAmB4fT5BrCYadbJ7RTfp',
} as const;