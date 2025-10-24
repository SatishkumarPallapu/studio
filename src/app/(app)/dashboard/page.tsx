import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FileText, Bell, Calendar, Carrot, LineChart, Combine, Droplets, Landmark, Leaf, ShoppingBasket, ThermometerSun, User, Bot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const featureCards = [
  // Phase 1
  {
    title: 'Profile',
    description: 'Manage your farm and personal details.',
    href: '/profile',
    icon: <User className="w-8 h-8 text-primary" />,
    imageId: 'login-hero',
  },
  {
    title: 'Subsidy Alerts',
    description: 'Get notified about relevant government subsidies.',
    href: '/subsidies',
    icon: <Bell className="w-8 h-8 text-primary" />,
    imageId: 'subsidy-alerts',
  },
  {
    title: 'Soil Analysis',
    description: 'Analyze soil reports and track health over time.',
    href: '/soil-analysis',
    icon: <Droplets className="w-8 h-8 text-primary" />,
    imageId: 'soil-health',
  },
  // Phase 2
  {
    title: 'Crop Recommendation',
    description: 'Get AI-powered suggestions for the best crops to plant.',
    href: '/crop-recommendation',
    icon: <Carrot className="w-8 h-8 text-primary" />,
    imageId: 'crop-recommendation',
  },
  {
    title: 'Multi-Crop Planner',
    description: 'Plan intercropping strategies to boost farm health and yield.',
    href: '/crop-planner',
    icon: <Combine className="w-8 h-8 text-primary" />,
    imageId: 'crop-recommendation',
  },
  // Phase 3
  {
    title: 'IoT Monitor',
    description: 'View real-time data from your on-field IoT sensors.',
    href: '/moisture-monitor',
    icon: <ThermometerSun className="w-8 h-8 text-primary" />,
    imageId: 'iot-dashboard',
  },
  {
    title: 'Crop Health',
    description: 'Upload a photo to identify crop issues and get organic remedies.',
    href: '/crop-health',
    icon: <Leaf className="w-8 h-8 text-primary" />,
    imageId: 'pest-detection',
  },
  {
    title: 'Calendar',
    description: 'Manage your farming schedule and reminders.',
    href: '/calendar',
    icon: <Calendar className="w-8 h-8 text-primary" />,
    imageId: 'reminders',
  },
  // Phase 4
  {
    title: 'Marketplace',
    description: 'Browse and list produce in the community marketplace.',
    href: '/marketplace',
    icon: <ShoppingBasket className="w-8 h-8 text-primary" />,
    imageId: 'market-prices',
  },
  // Phase 5
  {
    title: 'Analytics',
    description: 'Review yield, profit, and other farm analytics.',
    href: '/analytics',
    icon: <LineChart className="w-8 h-8 text-primary" />,
    imageId: 'reminders', // Placeholder
  },
  // Other
   {
    title: 'Traceability',
    description: 'Track your produce from farm to market with blockchain.',
    href: '/traceability',
    icon: <Bot className="w-8 h-8 text-primary" />, 
    imageId: 'market-prices', 
  },
];

export default function DashboardPage() {
  const sortedFeatureCards = featureCards.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome back, Farmer!</h1>
        <p className="text-muted-foreground">Here&apos;s your farm&apos;s command center.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedFeatureCards.map((feature) => {
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
