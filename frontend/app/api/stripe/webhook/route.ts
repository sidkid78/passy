import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

// ✅ CRITICAL: Update Firestore when subscription created
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;
  
  const userRef = doc(db!, 'users', userId);
  
  await updateDoc(userRef, {
    isPremium: true,
    subscriptionId: session.subscription,
    customerId: session.customer,
    subscriptionPlatform: 'web',
    subscriptionTier: 'premium',
    subscriptionStartDate: new Date(),
    updatedAt: new Date(),
  });
  
  console.log('✅ Premium activated for user:', userId);
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;
  
  const userRef = doc(db!, 'users', userId);
  
  const isPremium = subscription.status === 'active' || subscription.status === 'trialing';
  
  await updateDoc(userRef, {
    isPremium,
    subscriptionStatus: subscription.status,
    subscriptionEndDate: new Date((subscription as any).current_period_end * 1000),
    updatedAt: new Date(),
  });
  
  console.log(`Subscription ${subscription.status} for user:`, userId);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Log successful payment, send receipt email, etc.
  console.log('Payment succeeded:', invoice.id);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Notify user of payment failure
  console.log('Payment failed:', invoice.id);
}