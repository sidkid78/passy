'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ChecklistItem } from '@/src/lib/types';
import { PlusCircle, Trash2, Edit2 } from 'lucide-react';
import { useToast } from '@/src/hooks/use-toast';
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
import { Textarea } from '@/components/ui/textarea';

const initialChecklist: ChecklistItem[] = [
  { id: '1', task: 'Set a date and time', completed: true },
  { id: '2', task: 'Choose a venue', completed: true },
  { id: '3', task: 'Create a guest list', completed: false },
  { id: '4', task: 'Send out invitations', completed: false },
  { id: '5', task: 'Plan the menu', completed: false },
  { id: '6', task: 'Organize games and activities', completed: false },
  { id: '7', task: 'Arrange decorations', completed: false },
  { id: '8', task: 'Buy or make party favors', completed: false },
];

export default function ChecklistPage() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setChecklist(initialChecklist);
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() === '') {
      toast({ variant: "destructive", title: "Error", description: "Task cannot be empty." });
      return;
    }
    const newItem: ChecklistItem = {
      id: String(Date.now()),
      task: newTask.trim(),
      completed: false,
    };
    setChecklist([...checklist, newItem]);
    setNewTask('');
    toast({ title: "Task Added", description: `"${newItem.task}" has been added to your checklist.`});
  };

  const toggleComplete = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = checklist.find(item => item.id === id);
    setChecklist(checklist.filter((item) => item.id !== id));
    if (taskToDelete) {
       toast({ title: "Task Removed", description: `"${taskToDelete.task}" has been removed.`});
    }
  };

  const handleEditTask = (item: ChecklistItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (editingItem && editingItem.task.trim() !== '') {
      setChecklist(checklist.map(item => item.id === editingItem.id ? editingItem : item));
      toast({ title: "Task Updated", description: `"${editingItem.task}" has been updated.`});
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } else {
       toast({ variant: "destructive", title: "Error", description: "Task name cannot be empty."});
    }
  };

  if (!isMounted) {
    return <p>Loading checklist...</p>;
  }
  
  const completedTasks = checklist.filter(item => item.completed).length;
  const totalTasks = checklist.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-accent p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="Baby Shower Checklist" 
          description="Stay organized and ensure every detail is covered for a flawless event."
        />
        
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                type="text" 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
                placeholder="e.g., Order cake" 
                className="flex-grow"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <Button onClick={handleAddTask}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-headline">Your Tasks</CardTitle>
              <div className="text-sm text-muted-foreground">
                {completedTasks} / {totalTasks} tasks completed ({progress}%)
              </div>
            </div>
             {totalTasks > 0 && (
              <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {checklist.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Your checklist is empty. Add some tasks to get started!</p>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <ul className="space-y-3">
                  {checklist.map((item) => (
                    <li key={item.id} className={`flex items-center justify-between p-3 rounded-md transition-colors ${item.completed ? 'bg-muted/70 hover:bg-muted' : 'bg-card hover:bg-secondary/30'} border`}>
                      <div className="flex items-center gap-3 flex-grow">
                        <Checkbox 
                          id={`task-${item.id}`} 
                          checked={item.completed} 
                          onCheckedChange={() => toggleComplete(item.id)}
                          aria-label={`Mark task ${item.task} as ${item.completed ? 'incomplete' : 'complete'}`}
                        />
                        <label 
                          htmlFor={`task-${item.id}`} 
                          className={`flex-grow cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                        >
                          {item.task}
                          {item.notes && <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>}
                        </label>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                         <Button variant="ghost" size="icon" onClick={() => handleEditTask(item)} aria-label={`Edit task ${item.task}`}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(item.id)} className="text-destructive hover:text-destructive" aria-label={`Delete task ${item.task}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update the details for this task.
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-task-name" className="text-right">
                    Task
                  </Label>
                  <Input
                    id="edit-task-name"
                    value={editingItem.task}
                    onChange={(e) => setEditingItem({ ...editingItem, task: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-task-notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="edit-task-notes"
                    value={editingItem.notes || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
            )}
          <DialogFooter>
             <DialogClose>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            <Button type="button" onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

