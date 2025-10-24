import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carrot, Droplets, Landmark, Leaf, CloudSun, CalendarClock, ThermometerSun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const featureCards = [
  {
    title: 'Crop Recommendation',
    description: 'Get AI-powered suggestions for the best crops to plant.',
    href: '/crop-recommendation',
    icon: <Carrot className="w-8 h-8 text-primary" />,
    imageId: 'crop-recommendation',
  },
  {
    title: 'AI Crop Health',
    description: 'Upload a photo to identify crop issues and get organic remedies.',
    href: '/crop-health',
    icon: <Leaf className="w-8 h-8 text-primary" />,
    imageId: 'pest-detection',
  },
   {
    title: 'IoT Dashboard',
    description: 'View real-time data from your on-field IoT sensors.',
    href: '/iot-dashboard',
    icon: <ThermometerSun className="w-8 h-8 text-primary" />,
    imageId: 'iot-dashboard',
  },
  {
    title: 'Soil Health Tracking',
    description: 'Log and visualize your soil health data over time.',
    href: '/soil-health',
    icon: <Droplets className="w-8 h-8 text-primary" />,
    imageId: 'soil-health',
  },
  {
    title: 'Market Prices',
    description: 'Analyze market data to get the best price for your produce.',
    href: '/market-prices',
    icon: <Landmark className="w-8 h-8 text-primary" />,
    imageId: 'market-prices',
  },
  {
    title: 'Weather Alerts',
    description: 'Receive real-time weather alerts and farming tips.',
    href: '/weather-alerts',
    icon: <CloudSun className="w-8 h-8 text-primary" />,
    imageId: 'weather-alerts',
  },
  {
    title: 'Farming Reminders',
    description: 'Set and manage reminders for important farming activities.',
    href: '/reminders',
    icon: <CalendarClock className="w-8 h-8 text-primary" />,
    imageId: 'reminders',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome back, Farmer!</h1>
        <p className="text-muted-foreground">Here&apos;s your farm&apos;s command center.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature) => {
          const image = PlaceHolderImages.find((img) => img.id === feature.imageId);
          return (
            <Card key={feature.title} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {image && (
                <div className="aspect-video relative">
                    <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                    />
                </div>
              )}
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div className="flex-grow">
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={feature.href}>Go to Feature</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
