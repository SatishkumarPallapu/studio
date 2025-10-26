
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { generateCropRoadmap, type CropRoadmapOutput, type Activity } from '@/ai/flows/crop-roadmap-flow';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useActiveCrop } from '@/contexts/active-crop-context';

type ActivityWithDate = Activity & { date: Date };

export default function CalendarPage() {
  const { activeCrop } = useActiveCrop();
  const [roadmap, setRoadmap] = useState<CropRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const cropName = activeCrop.name;

  useEffect(() => {
    if (!cropName) return;
    const fetchRoadmap = async () => {
      try {
        setIsLoading(true);
        const result = await generateCropRoadmap({ cropName });
        setRoadmap(result);
      } catch (error) {
        console.error("Failed to fetch crop roadmap", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoadmap();
  }, [cropName]);

  const activitiesByDate = roadmap?.activities.reduce((acc, activity) => {
    const activityDate = new Date();
    activityDate.setDate(activityDate.getDate() + activity.day - 1);
    const dateString = format(activityDate, 'yyyy-MM-dd');
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const highlightedDays = activitiesByDate 
    ? Object.keys(activitiesByDate).map(dateStr => new Date(dateStr))
    : [];

  const selectedDayActivities = selectedDate && activitiesByDate 
    ? activitiesByDate[format(selectedDate, 'yyyy-MM-dd')] || [] 
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">Smart Calendar: {cropName} Schedule</CardTitle>
          <CardDescription>
            This calendar displays your AI-generated farming schedule. Days with activities are highlighted.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ highlighted: highlightedDays }}
              modifiersStyles={{
                highlighted: { 
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textDecorationColor: 'hsl(var(--primary))',
                  textUnderlineOffset: '4px',
                },
              }}
              className="rounded-md border"
            />
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Tasks for {selectedDate ? format(selectedDate, 'PPP') : '...'}
            </h3>
            {selectedDayActivities.length > 0 ? (
              <div className="space-y-3">
                {selectedDayActivities.map((activity, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                        <Badge variant="secondary" className="w-fit mb-2 capitalize">{activity.stage.replace(/_/g, ' ')}</Badge>
                        <CardTitle className="text-base flex items-center gap-2">
                           <CheckCircle2 className="w-5 h-5 text-green-500" /> {activity.activity}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground pt-4">No activities scheduled for this day.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
