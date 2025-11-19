'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FirestoreService } from '@/lib/services/firestore-service';
import type { CreateEventInput } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export default function CreateEventDialog({
  open,
  onOpenChange,
  userId,
}: CreateEventDialogProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('500');
  const [theme, setTheme] = useState<CreateEventInput['theme']>('soft_pink');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventId = await FirestoreService.createEvent(userId, {
        name,
        date: new Date(date),
        budgetTotal: parseFloat(budget),
        theme,
      });

      onOpenChange(false);
      router.push(`/event/${eventId}`);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Baby Shower Event</DialogTitle>
          <DialogDescription>
            Plan the perfect celebration for your little one
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Event Name
            </label>
            <Input
              id="name"
              placeholder="Sarah's Baby Shower"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Event Date
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-medium">
              Budget ($)
            </label>
            <Input
              id="budget"
              type="number"
              placeholder="500"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {(['soft_pink', 'classic_blue', 'neutral', 'modern'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    theme === t
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full mx-auto mb-1 ${
                      t === 'soft_pink'
                        ? 'bg-pink-300'
                        : t === 'classic_blue'
                        ? 'bg-blue-300'
                        : t === 'neutral'
                        ? 'bg-amber-200'
                        : 'bg-purple-300'
                    }`}
                  />
                  <p className="text-xs capitalize">{t.replace('_', ' ')}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

