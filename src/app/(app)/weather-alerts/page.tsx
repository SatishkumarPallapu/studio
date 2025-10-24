'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Cloud, CloudRain, CloudSun, Sun, Windy } from 'lucide-react';

const forecastData = [
  { day: 'Today', temp: '32°C', condition: 'Sunny', icon: <Sun className="w-10 h-10 text-yellow-500" /> },
  { day: 'Tomorrow', temp: '30°C', condition: 'Partly Cloudy', icon: <CloudSun className="w-10 h-10 text-gray-500" /> },
  { day: 'Mon', temp: '28°C', condition: 'Cloudy', icon: <Cloud className="w-10 h-10 text-gray-400" /> },
  { day: 'Tue', temp: '27°C', condition: 'Rainy', icon: <CloudRain className="w-10 h-10 text-blue-500" /> },
  { day: 'Wed', temp: '29°C', condition: 'Windy', icon: <Windy className="w-10 h-10 text-gray-600" /> },
];

export default function WeatherAlertsPage() {
    const { toast } = useToast();

    const handleSubscription = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const phone = formData.get('phone');
        toast({
            title: 'Subscription Successful!',
            description: `Weather alerts will be sent to ${phone}.`
        });
        event.currentTarget.reset();
    }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>5-Day Weather Forecast</CardTitle>
            <CardDescription>Based on your registered location (Mock Data).</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-5">
            {forecastData.map((day) => (
              <Card key={day.day} className="flex flex-col items-center justify-center p-4 text-center">
                <p className="font-semibold">{day.day}</p>
                <div className="my-2">{day.icon}</div>
                <p className="text-2xl font-bold">{day.temp}</p>
                <p className="text-sm text-muted-foreground">{day.condition}</p>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Get WhatsApp Alerts</CardTitle>
            <CardDescription>Receive real-time weather alerts and farming tips directly on your phone.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubscription} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" required />
              </div>
              <Button type="submit" className="w-full">
                Subscribe Now
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
