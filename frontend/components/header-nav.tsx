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

