'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import type { Guest } from '@/lib/types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { Card } from '@/components/ui/card';

const initialGuests: Guest[] = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', rsvpStatus: 'Accepted', plusOne: true, dietaryRestrictions: 'Vegetarian' },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com', rsvpStatus: 'Pending', notes: 'Might be late' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', rsvpStatus: 'Declined' },
];

export default function GuestManagerPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<Partial<Guest> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setGuests(initialGuests);
  }, []);

  const handleAddGuest = () => {
    setCurrentGuest({ rsvpStatus: 'Pending' });
    setIsDialogOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setCurrentGuest(guest);
    setIsDialogOpen(true);
  };

  const handleDeleteGuest = (guestId: string) => {
    setGuests(guests.filter(g => g.id !== guestId));
    toast({ title: "Guest removed", description: "The guest has been removed from the list." });
  };

  const handleSaveGuest = () => {
    if (!currentGuest || !currentGuest.name) {
      toast({ variant: "destructive", title: "Error", description: "Guest name is required." });
      return;
    }

    if (currentGuest.id) {
      setGuests(guests.map(g => g.id === currentGuest.id ? currentGuest as Guest : g));
      toast({ title: "Guest updated", description: `${currentGuest.name}'s details have been updated.` });
    } else {
      const newGuest = { ...currentGuest, id: String(Date.now()) } as Guest;
      setGuests([...guests, newGuest]);
      toast({ title: "Guest added", description: `${newGuest.name} has been added to the list.` });
    }
    setIsDialogOpen(false);
    setCurrentGuest(null);
  };

  if (!isMounted) {
    return <p>Loading guests...</p>;
  }

  return (
    <div>
      <PageHeader title="Guest Manager" description="Manage your baby shower guest list and track RSVPs.">
          <Button onClick={handleAddGuest}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Guest
          </Button>
        </PageHeader>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{currentGuest?.id ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
              <DialogDescription>
                {currentGuest?.id ? 'Update the details for this guest.' : 'Enter the details for the new guest.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={currentGuest?.name || ''} onChange={(e) => setCurrentGuest({...currentGuest, name: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={currentGuest?.email || ''} onChange={(e) => setCurrentGuest({...currentGuest, email: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" value={currentGuest?.phone || ''} onChange={(e) => setCurrentGuest({...currentGuest, phone: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rsvpStatus" className="text-right">RSVP Status</Label>
                <Select
                  value={currentGuest?.rsvpStatus || 'Pending'}
                  onValueChange={(value) => setCurrentGuest({...currentGuest, rsvpStatus: value as Guest['rsvpStatus']})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select RSVP status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plusOne" className="text-right">Plus One?</Label>
                  <Checkbox id="plusOne" checked={currentGuest?.plusOne || false} onCheckedChange={(checked) => setCurrentGuest({...currentGuest, plusOne: !!checked})} className="col-span-3 justify-self-start" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dietaryRestrictions" className="text-right">Dietary Needs</Label>
                <Input id="dietaryRestrictions" value={currentGuest?.dietaryRestrictions || ''} onChange={(e) => setCurrentGuest({...currentGuest, dietaryRestrictions: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea id="notes" value={currentGuest?.notes || ''} onChange={(e) => setCurrentGuest({...currentGuest, notes: e.target.value})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleSaveGuest}>Save Guest</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card className="shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>RSVP Status</TableHead>
                <TableHead>Plus One</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No guests added yet. Click "Add Guest" to get started!
                  </TableCell>
                </TableRow>
              )}
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.name}</TableCell>
                  <TableCell>{guest.email || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      guest.rsvpStatus === 'Accepted' ? 'bg-green-100 text-green-700' :
                      guest.rsvpStatus === 'Declined' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {guest.rsvpStatus}
                    </span>
                  </TableCell>
                  <TableCell>{guest.plusOne ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditGuest(guest)} className="mr-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteGuest(guest.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
    </div>
  );
}

