'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FileText, Bell, Calendar, Carrot, LineChart, Combine, Droplets, Landmark, Leaf, ShoppingBasket, ThermometerSun, User, Bot, CloudSun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export default function DashboardPage() {
  const { translations } = useLanguage();
  const dashboardCards = [
    {
      title: translations.dashboard.weather.title,
      description: translations.dashboard.weather.description,
      href: '/weather',
      icon: <CloudSun className="w-8 h-8 text-primary" />,
      imageId: 'weather-alerts',
    },
    {
      title: translations.dashboard.activeCrop.title,
      description: translations.dashboard.activeCrop.description,
      href: '/crop-dashboard',
      icon: <Carrot className="w-8 h-8 text-primary" />,
      imageId: 'crop-recommendation',
    },
    {
      title: translations.dashboard.subsidyHighlights.title,
      description: translations.dashboard.subsidyHighlights.description,
      href: '/subsidies',
      icon: <Bell className="w-8 h-8 text-primary" />,
      imageId: 'subsidy-alerts',
    },
    {
      title: translations.dashboard.smartTips.title,
      description: translations.dashboard.smartTips.description,
      href: '/chat',
      icon: <Bot className="w-8 h-8 text-primary" />,
      imageId: 'reminders',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
            {translations.dashboard.greeting}
        </h1>
        <p className="text-muted-foreground">{translations.dashboard.welcome}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dashboardCards.map((feature) => {
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
                  <Link href={feature.href}>{translations.dashboard.viewDetails}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
