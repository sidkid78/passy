'use client';

import { useEffect, useState } from 'react';
import { FirestoreService } from '@/lib/services/firestore-service';
import type { RegistryItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ExternalLink, Gift } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface RegistryTabProps {
  eventId: string;
}

export default function RegistryTab({ eventId }: RegistryTabProps) {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [storeName, setStoreName] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const unsubscribe = FirestoreService.subscribeToRegistryItems(
      eventId,
      setItems
    );
    return () => unsubscribe();
  }, [eventId]);

  const claimedCount = items.filter((i) => i.isClaimed).length;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await FirestoreService.createRegistryItem(eventId, {
      title,
      storeName: storeName || undefined,
      url: url || undefined,
    });

    setTitle('');
    setStoreName('');
    setUrl('');
    setShowAddDialog(false);
  };

  const handleDelete = async (itemId: string) => {
    if (confirm('Remove this item from registry?')) {
      await FirestoreService.deleteRegistryItem(eventId, itemId);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">
                {claimedCount} of {items.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Items claimed
              </div>
            </div>
            <Gift className="w-12 h-12 text-primary opacity-20" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Registry Items</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} className={item.isClaimed ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {item.title}
                    {item.isClaimed && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Claimed
                      </span>
                    )}
                  </div>
                  {item.storeName && (
                    <div className="text-sm text-muted-foreground">
                      {item.storeName}
                    </div>
                  )}
                  {item.isClaimed && item.claimedByName && (
                    <div className="text-sm text-muted-foreground">
                      Claimed by {item.claimedByName}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View Item
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </CardContent>
          </Card>
        ))}

        {items.length === 0 && (
          <Card className="md:col-span-2">
            <CardContent className="p-8 text-center text-muted-foreground">
              No registry items yet. Add items for guests to claim!
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Registry Item</DialogTitle>
            <DialogDescription>
              Add an item for guests to claim
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Item Name *</label>
              <Input
                placeholder="Stroller"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Store (optional)</label>
              <Input
                placeholder="Amazon"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL (optional)</label>
              <Input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
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
                Add Item
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

