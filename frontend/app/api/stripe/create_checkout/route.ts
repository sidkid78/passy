import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_IDS } from '@/lib/stripe/config';
import { auth } from '@/lib/firebase/config';

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId } = await req.json();
    
    // Validate user is authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate price ID
    if (!Object.values(PRICE_IDS).includes(priceId)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      metadata: {
        userId,
        platform: 'web',
      },
      customer_email: undefined, // Optional: pre-fill with user's email
      allow_promotion_codes: true, // Enable promo codes
    });
    
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}