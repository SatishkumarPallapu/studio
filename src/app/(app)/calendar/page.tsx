
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const { translations } = useLanguage();
  const router = useRouter();

  // This page is now a simple redirector to the main dashboard
  // since the calendar functionality is integrated there.
  if (typeof window !== 'undefined') {
    router.replace('/crop-dashboard');
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{translations.calendar.title}</CardTitle>
          <CardDescription>
            Redirecting to the Crop Dashboard...
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p>The calendar is now part of the Crop Lifecycle Dashboard.</p>
        </CardContent>
      </Card>
    </div>
  );
}
