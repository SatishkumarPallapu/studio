
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { generateCropRoadmap } from '@/ai/flows/crop-roadmap-flow';
import { CheckCircle2, CalendarDays, Sprout } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import StartTrackingButton from './start-tracking-button';

export default async function CropRoadmapPage({
  params,
}: {
  params: { crop: string };
}) {
  const cropName = decodeURIComponent(params.crop.replace(/-/g, ' '));
  const roadmap = await generateCropRoadmap({ cropName });

  const activitiesByStage = roadmap.activities.reduce((acc, activity) => {
    const stage = activity.stage;
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(activity);
    return acc;
  }, {} as Record<string, typeof roadmap.activities>);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Sprout className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl capitalize">
                Farming Roadmap for {cropName}
              </CardTitle>
              <CardDescription>
                Your complete day-wise guide from sowing to harvest.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-end">
          <StartTrackingButton cropName={cropName} />
        </CardContent>
      </Card>

      <Accordion type="single" collapsible defaultValue={Object.keys(activitiesByStage)[0]} className="w-full">
        {Object.entries(activitiesByStage).map(([stage, activities]) => (
            <AccordionItem key={stage} value={stage}>
                <AccordionTrigger className="text-xl font-semibold capitalize bg-muted px-4 rounded-md">
                    {stage.replace(/_/g, ' ')}
                </AccordionTrigger>
                <AccordionContent>
                    <div className="p-4 space-y-4">
                        {activities.map((activity) => (
                            <Card key={`${activity.day}-${activity.activity}`} className="relative overflow-hidden">
                                <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">
                                {activity.day}
                                </div>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        {activity.activity}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                <p className="text-muted-foreground">{activity.details}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
