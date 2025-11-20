'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter
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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BudgetItem } from '@/lib/types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';

const initialBudgetItems: BudgetItem[] = [
  { id: '1', category: 'Venue', itemName: 'Community Hall Rental', estimatedCost: 200, actualCost: 200, paid: true },
  { id: '2', category: 'Food & Drinks', itemName: 'Catering Service', estimatedCost: 500, actualCost: 480, paid: true },
  { id: '3', category: 'Decorations', itemName: 'Balloons, Banners, Centerpieces', estimatedCost: 150, actualCost: 0, paid: false },
  { id: '4', category: 'Games & Favors', itemName: 'Prizes and Thank You Gifts', estimatedCost: 100, actualCost: 0, paid: false },
];

export default function BudgetTrackerPage() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<BudgetItem> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setBudgetItems(initialBudgetItems);
  }, []);

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + (item.actualCost || 0), 0);

  const handleAddItem = () => {
    setCurrentItem({ category: '', itemName: '', estimatedCost: 0, paid: false });
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: BudgetItem) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== itemId));
    toast({ title: "Item removed", description: "The budget item has been removed." });
  };

  const handleSaveItem = () => {
    if (!currentItem || !currentItem.itemName || !currentItem.category || currentItem.estimatedCost === undefined) {
      toast({ variant: "destructive", title: "Error", description: "Category, item name, and estimated cost are required." });
      return;
    }

    if (currentItem.id) {
      setBudgetItems(budgetItems.map(item => item.id === currentItem.id ? currentItem as BudgetItem : item));
      toast({ title: "Item updated", description: "Budget item details have been updated." });
    } else {
      const newItem = { ...currentItem, id: String(Date.now()) } as BudgetItem;
      setBudgetItems([...budgetItems, newItem]);
      toast({ title: "Item added", description: "New item added to the budget." });
    }
    setIsDialogOpen(false);
    setCurrentItem(null);
  };

  if (!isMounted) {
    return <p>Loading budget...</p>;
  }

  return (
    <div>
      <PageHeader title="Budget Tracker" description="Manage your baby shower expenses and stay on track.">
          <Button onClick={handleAddItem}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </PageHeader>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{currentItem?.id ? 'Edit Budget Item' : 'Add New Budget Item'}</DialogTitle>
              <DialogDescription>
                {currentItem?.id ? 'Update the details for this budget item.' : 'Enter the details for the new budget item.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Input id="category" value={currentItem?.category || ''} onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemName" className="text-right">Item Name</Label>
                <Input id="itemName" value={currentItem?.itemName || ''} onChange={(e) => setCurrentItem({...currentItem, itemName: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estimatedCost" className="text-right">Estimated Cost</Label>
                 <div className="relative col-span-3">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input id="estimatedCost" type="number" value={currentItem?.estimatedCost || 0} onChange={(e) => setCurrentItem({...currentItem, estimatedCost: parseFloat(e.target.value) || 0})} className="pl-7" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="actualCost" className="text-right">Actual Cost</Label>
                <div className="relative col-span-3">
                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input id="actualCost" type="number" value={currentItem?.actualCost || ''} onChange={(e) => setCurrentItem({...currentItem, actualCost: parseFloat(e.target.value) || undefined})} className="pl-7" placeholder="Optional" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paid" className="text-right">Paid?</Label>
                  <Checkbox id="paid" checked={currentItem?.paid || false} onCheckedChange={(checked) => setCurrentItem({...currentItem, paid: !!checked})} className="col-span-3 justify-self-start" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea id="notes" value={currentItem?.notes || ''} onChange={(e) => setCurrentItem({...currentItem, notes: e.target.value})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="button" onClick={handleSaveItem}>Save Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader><CardTitle className="font-headline text-lg">Total Estimated</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-semibold text-primary">{formatCurrency(totalEstimated)}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="font-headline text-lg">Total Actual Spent</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-semibold text-secondary">{formatCurrency(totalActual)}</p></CardContent>
          </Card>
           <Card>
            <CardHeader><CardTitle className="font-headline text-lg">Remaining Budget</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-semibold ${totalEstimated - totalActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(totalEstimated - totalActual)}</p></CardContent>
          </Card>
        </div>
        
        <Card className="shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Est. Cost</TableHead>
                <TableHead className="text-right">Actual Cost</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No budget items added yet. Click "Add Item" to start tracking expenses.
                  </TableCell>
                </TableRow>
              )}
              {budgetItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.estimatedCost)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.actualCost)}</TableCell>
                  <TableCell>{item.paid ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)} className="mr-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="font-semibold">Totals</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(totalEstimated)}</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(totalActual)}</TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Card>
    </div>
  );
}

