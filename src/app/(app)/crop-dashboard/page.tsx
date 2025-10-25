
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sprout, Droplets, Leaf, Calendar, Bot } from 'lucide-react';
import MoistureMonitorPage from '../moisture-monitor/page';
import CropHealthClient from '../crop-health/crop-health-client';
import CalendarPage from '../calendar/page';
import ChatClient from '../chat/chat-client';

export default function CropDashboardPage() {
    // In a real application, you would fetch the authenticated user's
    // phone number from your database (e.g., Firestore).
    const mockFarmerPhone = '+919999999999'; // Replace with a real number for testing

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Sprout className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl">Crop Lifecycle: Tomato</CardTitle>
              <CardDescription>
                Manage everything for your active crop, from monitoring to health alerts.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="iot" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="iot"><Droplets className="mr-2 h-4 w-4" />IoT Monitor</TabsTrigger>
          <TabsTrigger value="health"><Leaf className="mr-2 h-4 w-4" />Crop Health</TabsTrigger>
          <TabsTrigger value="calendar"><Calendar className="mr-2 h-4 w-4" />Calendar</TabsTrigger>
          <TabsTrigger value="assistant"><Bot className="mr-2 h-4 w-4" />AI Assistant</TabsTrigger>
        </TabsList>
        <TabsContent value="iot">
            <MoistureMonitorPage />
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

