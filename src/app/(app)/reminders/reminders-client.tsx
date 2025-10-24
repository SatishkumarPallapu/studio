'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, PlusCircle } from 'lucide-react';

interface Reminder {
  id: number;
  task: string;
  date: string;
  completed: boolean;
}

const initialReminders: Reminder[] = [
  { id: 1, task: 'Sow wheat seeds', date: '2024-11-15', completed: false },
  { id: 2, task: 'Irrigate paddy fields', date: '2024-11-20', completed: false },
  { id: 3, task: 'Apply organic fertilizer', date: '2024-12-01', completed: true },
  { id: 4, task: 'Harvest tomatoes', date: '2024-12-10', completed: false },
];

export default function RemindersClient() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleToggleComplete = (id: number) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleAddReminder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const task = formData.get('task') as string;
    const date = formData.get('date') as string;

    if (task && date) {
      const newReminder: Reminder = {
        id: reminders.length + 1,
        task,
        date,
        completed: false,
      };
      setReminders([...reminders, newReminder]);
      toast({
        title: 'Reminder Added',
        description: `Task "${task}" scheduled for ${date}.`,
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Farming Reminders</CardTitle>
          <CardDescription>Stay on top of your key farming activities.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Reminder</DialogTitle>
              <DialogDescription>
                Set a reminder for an important farming activity.
              </DialogDescription>
            </DialogHeader>
            <form id="add-reminder-form" onSubmit={handleAddReminder} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task" className="text-right">
                  Task
                </Label>
                <Input id="task" name="task" className="col-span-3" placeholder="e.g., Irrigate fields" required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input id="date" name="date" type="date" className="col-span-3" required/>
              </div>
            </form>
            <DialogFooter>
              <Button type="submit" form="add-reminder-form">Save Reminder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {reminders.map((reminder) => (
            <li
              key={reminder.id}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                reminder.completed ? 'bg-muted/50 text-muted-foreground' : 'bg-secondary'
              }`}
            >
              <Checkbox
                id={`reminder-${reminder.id}`}
                checked={reminder.completed}
                onCheckedChange={() => handleToggleComplete(reminder.id)}
                aria-label={`Mark "${reminder.task}" as ${reminder.completed ? 'incomplete' : 'complete'}`}
              />
              <div className="flex-grow">
                <label
                  htmlFor={`reminder-${reminder.id}`}
                  className={`font-medium cursor-pointer ${
                    reminder.completed ? 'line-through' : ''
                  }`}
                >
                  {reminder.task}
                </label>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{new Date(reminder.date).toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
