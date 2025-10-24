'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Icons } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-[350px] text-center">
        <CardHeader>
            <div className="flex items-center justify-center gap-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold font-headline">AI Rythu Mitra</h1>
            </div>
          <CardTitle>Redirecting</CardTitle>
          <CardDescription>Please wait while we take you to the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
