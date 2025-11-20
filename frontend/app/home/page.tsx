'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { FirestoreService } from '@/lib/services/firestore-service';
import type { AppEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, LogOut, Baby, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import CreateEventDialog from '@/components/dialogs/create-event-dialog';
import { Timestamp } from 'firebase/firestore';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = FirestoreService.subscribeToEvents(
      user.uid,
      (updatedEvents) => {
        setEvents(updatedEvents);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Baby className="w-16 h-16 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Passy</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Events</h2>
            <p className="text-muted-foreground">
              Plan the perfect baby shower with ease
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
        </div>

        {events.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <div className="mx-auto mb-4 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <CardTitle>No events yet</CardTitle>
              <CardDescription>
                Create your first baby shower event to get started!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowCreateDialog(true)} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/event/${event.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="line-clamp-1">{event.name}</span>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        event.theme === 'classic_blue'
                          ? 'bg-blue-300'
                          : event.theme === 'soft_pink'
                          ? 'bg-pink-300'
                          : 'bg-purple-300'
                      }`}
                    />
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date as Timestamp)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Budget: ${event.budgetTotal.toFixed(0)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <CreateEventDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        userId={user.uid}
      />
    </div>
  );
}

