import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
          <CardDescription>
            This page will allow you to manage your user profile and farm settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <User className="w-16 h-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Profile Page Coming Soon</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
