'use client';

import { useEffect, useState } from 'react';
import { FirestoreService } from '@/lib/services/firestore-service';
import type { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface TasksTabProps {
  eventId: string;
}

export default function TasksTab({ eventId }: TasksTabProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    const unsubscribe = FirestoreService.subscribeToTasks(eventId, setTasks);
    return () => unsubscribe();
  }, [eventId]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDescription.trim()) return;

    await FirestoreService.createTask(eventId, { eventId: eventId, title: newTaskDescription });
    setNewTaskDescription('');
    setShowAddDialog(false);
  };

  const handleToggle = async (task: Task) => {
    await FirestoreService.toggleTask(eventId, task.id);
  };

  const handleDelete = async (taskId: string) => {
    await FirestoreService.deleteTask(eventId, taskId);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Task Progress</CardTitle>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {tasks.length} completed
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Tasks</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4 flex items-center gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleToggle(task)}
              />
              <span
                className={`flex-1 ${
                  task.completed ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {task.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(task.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {tasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No tasks yet. Add your first task to get started!
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              What needs to be done for your event?
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTask} className="space-y-4">
            <Input
              placeholder="Task description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              required
            />
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
                Add Task
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

