import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profit Analytics</CardTitle>
          <CardDescription>
            This page will contain analytics and reports on your farm's performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <LineChart className="w-16 h-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Analytics Page Coming Soon</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
