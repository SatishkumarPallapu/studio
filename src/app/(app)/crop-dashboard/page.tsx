
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sprout, ChevronDown, Loader2, Calendar as CalendarIcon, Check, X, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useCropLifecycle, type TrackedCrop } from '@/contexts/active-crop-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from '@/contexts/language-context';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { format, isToday, isFuture } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';


export default function CropDashboardPage() {
    const { translations } = useLanguage();
    const { activeCrop, trackedCrops, setActiveCrop, updateActivity, isLoading } = useCropLifecycle();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    
    const [feedbackModal, setFeedbackModal] = useState<{isOpen: boolean, activity: any | null}>({isOpen: false, activity: null});


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <span className="sr-only">{translations.crop_dashboard.loading}</span>
            </div>
        );
    }

    if (!activeCrop) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{translations.crop_dashboard.no_crop_title}</CardTitle>
                        <CardDescription>
                            {translations.crop_dashboard.no_crop_description}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    const activitiesByDate = activeCrop.activities.reduce((acc, activity) => {
        const dateString = format(new Date(activity.date), 'yyyy-MM-dd');
        if (!acc[dateString]) {
            acc[dateString] = [];
        }
        acc[dateString].push(activity);
        return acc;
    }, {} as Record<string, TrackedCrop['activities']>);
    
    const highlightedDays = Object.keys(activitiesByDate).map(dateStr => new Date(dateStr));
    const selectedDayActivities = selectedDate ? (activitiesByDate[format(selectedDate, 'yyyy-MM-dd')] || []) : [];

    const handleFeedbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const feedback = formData.get('feedback') as string;
        if(feedbackModal.activity) {
            updateActivity(activeCrop.id, feedbackModal.activity.day, 'skipped', feedback);
        }
        setFeedbackModal({isOpen: false, activity: null});
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sprout className="w-10 h-10 text-primary" />
              <div>
                <CardTitle className="text-3xl capitalize">{translations.crop_dashboard.title}: {activeCrop.name}</CardTitle>
                <CardDescription>
                  {translations.crop_dashboard.description}
                </CardDescription>
              </div>
            </div>
            {trackedCrops.length > 1 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            {translations.crop_dashboard.switch_crop} <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {trackedCrops.map(crop => (
                            <DropdownMenuItem key={crop.id} onSelect={() => setActiveCrop(crop.id)}>
                                {crop.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
          </div>
        </CardHeader>
      </Card>
      
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                    {activeCrop.name} Activity Calendar
                </CardTitle>
                <CardDescription>
                    Here is your full lifecycle plan. Confirm tasks as you complete them.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-2">
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

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        Tasks for {selectedDate ? format(selectedDate, 'PPP') : '...'}
                    </h3>
                    {selectedDayActivities.length > 0 ? (
                    <div className="space-y-3">
                        {selectedDayActivities.map((activity) => (
                        <Card key={activity.day} className={`transition-all ${activity.status === 'completed' ? 'bg-green-50' : activity.status === 'skipped' ? 'bg-red-50' : ''}`}>
                            <CardHeader className="pb-2">
                                <Badge variant="secondary" className="w-fit mb-2 capitalize">{activity.stage.replace(/_/g, ' ')}</Badge>
                                <CardTitle className="text-base flex items-center gap-2">
                                    {activity.activity}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">{activity.details}</p>
                                {activity.status === 'pending' && !isFuture(new Date(activity.date)) && (
                                    <div className='flex items-center gap-2'>
                                        <p className="text-sm font-semibold mr-2">Did you complete this task?</p>
                                        <Button size="sm" variant="outline" className="flex-1" onClick={() => updateActivity(activeCrop.id, activity.day, 'completed')}>
                                            <ThumbsUp className="mr-2 h-4 w-4" /> Yes
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setFeedbackModal({ isOpen: true, activity: activity })}>
                                            <ThumbsDown className="mr-2 h-4 w-4" /> No
                                        </Button>
                                    </div>
                                )}
                                {activity.status === 'completed' && (
                                     <div className="flex items-center gap-2 text-green-600 font-semibold text-sm p-2 bg-green-100 rounded-md">
                                        <Check className="h-4 w-4" />
                                        Task completed on {format(new Date(), 'PPP')}
                                    </div>
                                )}
                                {activity.status === 'skipped' && (
                                     <div className="flex flex-col gap-2 text-red-600 font-semibold text-sm p-2 bg-red-100 rounded-md">
                                        <div className="flex items-center gap-2"><X className="h-4 w-4" /> Task Skipped</div>
                                        {activity.feedback && <p className="text-xs font-normal italic">Reason: "{activity.feedback}"</p>}
                                    </div>
                                )}
                                 {activity.status === 'pending' && isFuture(new Date(activity.date)) && !isToday(new Date(activity.date)) && (
                                     <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm p-2 bg-gray-100 rounded-md">
                                        <CalendarIcon className="h-4 w-4" />
                                        Upcoming Task
                                    </div>
                                )}
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
        
        <Dialog open={feedbackModal.isOpen} onOpenChange={(isOpen) => setFeedbackModal({ isOpen, activity: isOpen ? feedbackModal.activity : null })}>
            <DialogContent>
                <form onSubmit={handleFeedbackSubmit}>
                    <DialogHeader>
                        <DialogTitle>Log Feedback</DialogTitle>
                        <DialogDescription>
                            Please let us know why you couldn't complete this task. This helps us improve future recommendations.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea name="feedback" placeholder="e.g., Heavy rain prevented me from working in the field, I used a different fertilizer, etc." required />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setFeedbackModal({isOpen: false, activity: null})}>Cancel</Button>
                        <Button type="submit">Submit Feedback</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
  );
}
