import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import CropHealthClient from './crop-health-client';

export default function CropHealthPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Leaf className="w-8 h-8 text-primary"/>
            <div>
              <CardTitle>AI Crop Health Diagnosis</CardTitle>
              <CardDescription>
                Upload an image of a leaf or crop to get an instant diagnosis and treatment plan from our AI.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">This page is also accessible via the "Crop Lifecycle Dashboard" once you've selected a crop to track.</p>
        </CardContent>
      </Card>

      <CropHealthClient />
    </div>
  );
}
