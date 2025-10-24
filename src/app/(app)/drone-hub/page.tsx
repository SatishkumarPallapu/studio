import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Wind, Beaker } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function DroneHubPage() {
    const ndviImage = PlaceHolderImages.find(img => img.id === 'iot-dashboard');
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Drone Operations Hub</CardTitle>
          <CardDescription>
            Manage and view data from your agricultural drone missions. (Placeholder)
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-6 h-6 text-primary" />
              NDVI Field Analysis
            </CardTitle>
            <CardDescription>Visualize crop health and stress using NDVI data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ndviImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image 
                        src={ndviImage.imageUrl} 
                        alt="NDVI map placeholder" 
                        fill
                        className="object-cover"
                        data-ai-hint="NDVI map"
                    />
                     <div className="absolute inset-0 bg-green-900/50 flex items-center justify-center">
                        <p className="text-white font-bold text-xl">NDVI Map Visualization</p>
                    </div>
                </div>
            )}
            <Button className="w-full">View Latest NDVI Scan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-6 h-6 text-primary" />
              Automated Spraying Paths
            </CardTitle>
            <CardDescription>Plan and deploy automated pesticide or fertilizer spraying missions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ndviImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image 
                        src={ndviImage.imageUrl} 
                        alt="Spraying path placeholder"
                        fill
                        className="object-cover brightness-75"
                        data-ai-hint="drone path"
                    />
                    <div className="absolute inset-0 bg-blue-900/50 flex items-center justify-center">
                        <p className="text-white font-bold text-xl">Spraying Path Planner</p>
                    </div>
                </div>
            )}
            <Button className="w-full">Plan New Spraying Mission</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
