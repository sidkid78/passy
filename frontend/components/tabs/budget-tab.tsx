'use client';

import { useEffect, useState } from 'react';
import { FirestoreService } from '@/lib/services/firestore-service';
import type { Expense } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

interface BudgetTabProps {
  eventId: string;
  budgetTotal: number;
}

export default function BudgetTab({ eventId, budgetTotal }: BudgetTabProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('other');

  useEffect(() => {
    const unsubscribe = FirestoreService.subscribeToExpenses(
      eventId,
      setExpenses
    );
    return () => unsubscribe();
  }, [eventId]);

  const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = budgetTotal - spent;
  const percentUsed = (spent / budgetTotal) * 100;

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    await FirestoreService.createExpense(eventId, {
      title,
      amount: parseFloat(amount),
      category,
      isPaid: true,
    });

    setTitle('');
    setAmount('');
    setCategory('other');
    setShowAddDialog(false);
  };

  const handleDelete = async (expenseId: string) => {
    if (confirm('Delete this expense?')) {
      await FirestoreService.deleteExpense(eventId, expenseId);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Spent</span>
              <span className="font-semibold">{formatCurrency(spent)}</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  percentUsed > 100
                    ? 'bg-destructive'
                    : percentUsed > 80
                    ? 'bg-orange-400'
                    : 'bg-secondary'
                }`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(remaining)}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatCurrency(budgetTotal)}
                </div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Expenses</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="space-y-2">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{expense.title}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {expense.category}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">
                  {formatCurrency(expense.amount)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(expense.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {expenses.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No expenses yet. Add your first expense to track your budget!
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>Track your event spending</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Item</label>
              <Input
                placeholder="Decorations"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount ($)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="50.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                title="Category"  
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Expense['category'])
                }
                className="w-full h-11 rounded-xl border border-input bg-background px-4 py-2"
              >
                <option value="decor">Decor</option>
                <option value="food">Food</option>
                <option value="venue">Venue</option>
                <option value="gifts">Gifts</option>
                <option value="other">Other</option>
              </select>
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
                Add Expense
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

