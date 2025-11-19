'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/auth-context';
import { Baby } from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/account');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-accent">
      <div className="text-center">
        <Baby className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
        <h1 className="text-4xl font-headline text-primary">Passy</h1>
        <p className="text-muted-foreground mt-2">Baby Shower Planner</p>
      </div>
    </div>
  );
}
