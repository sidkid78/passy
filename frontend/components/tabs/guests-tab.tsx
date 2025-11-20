'use client';

import { useEffect, useState } from 'react';
import { FirestoreService } from '@/lib/services/firestore-service';
import type { Guest, GuestStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Mail, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface GuestsTabProps {
  eventId: string;
}

export default function GuestsTab({ eventId }: GuestsTabProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const unsubscribe = FirestoreService.subscribeToGuests(eventId, setGuests);
    return () => unsubscribe();
  }, [eventId]);

  const statusCounts = {
    going: guests.filter((g) => g.status === 'going').length,
    maybe: guests.filter((g) => g.status === 'maybe').length,
    not_going: guests.filter((g) => g.status === 'not_going').length,
    invited: guests.filter((g) => g.status === 'invited').length,
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await FirestoreService.createGuest(eventId, {
      eventId: eventId,
      name: name,
      email: email || undefined,
      note: note || undefined,
    });
    setName('');
    setEmail('');
    setNote('');
    setShowAddDialog(false);
  };

  const handleStatusChange = async (guestId: string, status: GuestStatus) => {
    await FirestoreService.updateGuestStatus(guestId, status);
  };

  const getStatusColor = (status: GuestStatus) => {
    switch (status) {
      case 'going':
        return 'bg-green-100 text-green-700';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-700';
      case 'not_going':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Guest Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statusCounts.going}
              </div>
              <div className="text-sm text-muted-foreground">Attending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {statusCounts.maybe}
              </div>
              <div className="text-sm text-muted-foreground">Maybe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {statusCounts.not_going}
              </div>
              <div className="text-sm text-muted-foreground">Declined</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {statusCounts.invited}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Guest List</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Guest
        </Button>
      </div>

      <div className="space-y-2">
        {guests.map((guest) => (
          <Card key={guest.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{guest.name}</div>
                    {guest.email && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {guest.email}
                      </div>
                    )}
                    {guest.note && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {guest.note}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => FirestoreService.deleteGuest(guest.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {(['going', 'maybe', 'not_going', 'invited'] as GuestStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(guest.id, status)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        guest.status === status
                          ? getStatusColor(status)
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'not_going'
                        ? 'Not Going'
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {guests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No guests yet. Start building your guest list!
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Guest</DialogTitle>
            <DialogDescription>
              Add someone to your guest list
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGuest} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email (optional)</label>
              <Input
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Note (optional)</label>
              <Input
                placeholder="Plus one, dietary restrictions, etc."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Guest
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

