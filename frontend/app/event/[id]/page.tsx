'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { FirestoreService } from '@/lib/services/firestore-service';
import type { AppEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Share2, Baby } from 'lucide-react';
import TasksTab from '@/components/tabs/tasks-tab';
import BudgetTab from '@/components/tabs/budget-tab';
import GuestsTab from '@/components/tabs/guests-tab';
import RegistryTab from '@/components/tabs/registry-tab';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default function EventPage({ params }: EventPageProps) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<AppEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!id) return;

    const loadEvent = async () => {
      const eventData = await FirestoreService.getEvent(id);
      setEvent(eventData);
      setLoading(false);
    };

    loadEvent();
  }, [id]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/event/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.name || 'Baby Shower',
          text: `You're invited to ${event?.name}!`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Baby className="w-16 h-16 text-primary animate-pulse" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Event not found</p>
          <Button onClick={() => router.push('/home')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/home')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold">{event.name}</h1>
        </div>
      </header>

      {/* Tabs */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="tasks">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="registry">Registry</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TasksTab eventId={id} />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetTab eventId={id} budgetTotal={event.budgetTotal} />
          </TabsContent>

          <TabsContent value="guests">
            <GuestsTab eventId={id} />
          </TabsContent>

          <TabsContent value="registry">
            <RegistryTab eventId={id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

