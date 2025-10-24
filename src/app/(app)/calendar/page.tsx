import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Calendar</CardTitle>
          <CardDescription>
            This page will display your farming schedule and allow you to manage tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <CalendarIcon className="w-16 h-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Calendar Page Coming Soon</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
