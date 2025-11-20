'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY, PRICE_IDS } from '@/lib/stripe/client-config';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    priceId: null,
    features: [
      '1 active event',
      'Up to 50 guests',
      'Basic checklist & budget',
      '3 AI conversations/month',
      '5 thank you notes/month',
      'Registry links',
    ],
  },
  {
    name: 'Premium Monthly',
    price: '$9.99',
    period: 'per month',
    priceId: PRICE_IDS.monthly,
    popular: true,
    features: [
      '✨ Unlimited events',
      '✨ Unlimited guests',
      '✨ Unlimited AI conversations',
      '✨ Unlimited thank you notes',
      '✨ Unlimited game suggestions',
      '✨ Photo gallery (50 photos)',
      '✨ Priority support',
      '✨ Advanced themes',
    ],
  },
  {
    name: 'Premium Yearly',
    price: '$79.99',
    period: 'per year',
    priceId: PRICE_IDS.yearly,
    badge: 'Save $40',
    features: [
      '✨ Everything in Monthly',
      '✨ 2 months free!',
      '✨ Best value',
    ],
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/account';
      return;
    }

    setLoading(priceId);

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
        }),
      });

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Choose Your Plan"
        description="Unlock premium features and plan unlimited baby showers!"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? 'border-primary border-2 shadow-xl' : ''}`}
          >
            {plan.badge && (
              <div className="absolute -top-3 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                {plan.badge}
              </div>
            )}
            {plan.popular && (
              <div className="absolute -top-3 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">/ {plan.period}</span>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              {plan.priceId ? (
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan.priceId!)}
                  disabled={loading === plan.priceId}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {loading === plan.priceId ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              ) : (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>All plans include a 7-day free trial. Cancel anytime.</p>
        <p className="mt-2">
          Questions? Email us at{' '}
          <a href="mailto:support@passy.app" className="text-primary hover:underline">
            support@passy.app
          </a>
        </p>
      </div>
    </div>
  );
}