
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sprout, Droplets, Leaf, Calendar, Bot, Satellite, ChevronDown } from 'lucide-react';
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

export default function CropDashboardPage() {
    const mockFarmerPhone = '+919999999999'; 
    const { activeCrop, trackedCrops, setActiveCrop } = useActiveCrop();

    if (!activeCrop) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Crop Lifecycle Dashboard</CardTitle>
                        <CardDescription>
                            You are not tracking any crops yet. Find a crop and start tracking it to see its lifecycle here.
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
                <CardTitle className="text-3xl capitalize">Crop Lifecycle: {activeCrop.name}</CardTitle>
                <CardDescription>
                  Manage everything for your active crop, from monitoring to health alerts.
                </CardDescription>
              </div>
            </div>
            {trackedCrops.length > 1 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Switch Crop <ChevronDown className="ml-2 h-4 w-4" />
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
              <TabsTrigger value="iot"><Droplets className="mr-2 h-4 w-4" />IoT Monitor</TabsTrigger>
              <TabsTrigger value="satellite"><Satellite className="mr-2 h-4 w-4" />Satellite</TabsTrigger>
              <TabsTrigger value="health"><Leaf className="mr-2 h-4 w-4" />Crop Health</TabsTrigger>
              <TabsTrigger value="calendar"><Calendar className="mr-2 h-4 w-4" />Calendar</TabsTrigger>
              <TabsTrigger value="assistant"><Bot className="mr-2 h-4 w-4" />AI Assistant</TabsTrigger>
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
