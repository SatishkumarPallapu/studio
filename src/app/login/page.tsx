'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // This is a temporary mock login to allow app navigation.
    // The original phone auth code can be restored after enabling it in Firebase Console.
    toast({
      title: 'Login Successful',
      description: 'You are now logged in.',
    });
    // Simulate network delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icons.logo className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">AI Rythu Mitra</h1>
          </div>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <p className="text-xs text-center text-muted-foreground p-2 border rounded-md bg-background">
                **Note:** Phone authentication is temporarily disabled. You can log in with any email/password to proceed while you enable Phone Sign-In in your Firebase project settings.
              </p>
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </div>
           <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
