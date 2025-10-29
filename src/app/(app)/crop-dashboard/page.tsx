
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sprout, Droplets, Leaf, Calendar, Bot, Satellite, ChevronDown, Loader2 } from 'lucide-react';
import MoistureMonitorPage from '../moisture-monitor/page';
import CropHealthClient from '../crop-health/crop-health-client';
import CalendarPage from '../calendar/page';
import ChatClient from '../chat/chat-client';
import SatelliteHealthPage from './satellite-health/page';
import { useActiveCrop } from '@/contexts/active-crop-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

export default function CropDashboardPage() {
    const { translations } = useLanguage();
    const mockFarmerPhone = '+919999999999'; 
    const { activeCrop, trackedCrops, setActiveCrop } = useActiveCrop();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (activeCrop || trackedCrops.length === 0) {
            setIsLoading(false);
        }
    }, [activeCrop, trackedCrops]);


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
      
      <Tabs defaultValue="iot" className="w-full">
        <div className="relative">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex items-center justify-start w-max space-x-1.5 h-auto">
              <TabsTrigger value="iot"><Droplets className="mr-2 h-4 w-4" />{translations.crop_dashboard.iot_monitor}</TabsTrigger>
              <TabsTrigger value="satellite"><Satellite className="mr-2 h-4 w-4" />{translations.crop_dashboard.satellite}</TabsTrigger>
              <TabsTrigger value="health"><Leaf className="mr-2 h-4 w-4" />{translations.crop_dashboard.crop_health}</TabsTrigger>
              <TabsTrigger value="calendar"><Calendar className="mr-2 h-4 w-4" />{translations.crop_dashboard.calendar}</TabsTrigger>
              <TabsTrigger value="assistant"><Bot className="mr-2 h-4 w-4" />{translations.crop_dashboard.ai_assistant}</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="iot">
            <MoistureMonitorPage />
        </TabsContent>
        <TabsContent value="satellite">
            <SatelliteHealthPage />
        </TabsContent>
        <TabsContent value="health">
            <CropHealthClient />
        </TabsContent>
        <TabsContent value="calendar">
            <CalendarPage />
        </TabsContent>
        <TabsContent value="assistant">
            <ChatClient farmerPhone={mockFarmerPhone} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
