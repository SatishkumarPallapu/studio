'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, FileDown, Mic } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export default function AnalyticsPage() {
  const { translations } = useLanguage();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{translations.analytics.title}</CardTitle>
          <CardDescription>
            {translations.analytics.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>{translations.analytics.yieldVsExpected}</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">{translations.analytics.yieldChart}</p>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{translations.analytics.profitVsCost}</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">{translations.analytics.profitChart}</p>
                    </div>
                </CardContent>
            </Card>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>{translations.analytics.aiReport}</CardTitle>
            <CardDescription>{translations.analytics.aiReportDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-muted-foreground flex-1">{translations.analytics.aiReportSample}</p>
            <div className="flex gap-2">
                <Button variant="outline"><Mic className="mr-2 h-4 w-4" /> {translations.analytics.listen}</Button>
                <Button><FileDown className="mr-2 h-4 w-4" /> {translations.analytics.export}</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
