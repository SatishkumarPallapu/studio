import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, FileDown, Mic } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profit Analytics</CardTitle>
          <CardDescription>
            Aggregated yield, expenses, and revenue for your last harvest.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Yield vs Expected</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">Yield Chart</p>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Profit vs Cost</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">Profit Chart</p>
                    </div>
                </CardContent>
            </Card>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>AI Report Summary</CardTitle>
            <CardDescription>Listen to the AI-generated voice summary of your season's performance.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-muted-foreground flex-1">"This season’s profit is ₹48,200, a 15% increase from your forecast."</p>
            <div className="flex gap-2">
                <Button variant="outline"><Mic className="mr-2 h-4 w-4" /> Listen to Voice Summary</Button>
                <Button><FileDown className="mr-2 h-4 w-4" /> Export as PDF</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
