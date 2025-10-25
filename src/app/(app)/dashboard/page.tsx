'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FileText, Bell, Calendar, Carrot, LineChart, Combine, Droplets, Landmark, Leaf, ShoppingBasket, ThermometerSun, User, Bot, CloudSun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

// Mock user profile
const userProfile = {
  district: 'Anantapur',
  crops: ['Paddy', 'Groundnut'],
};

// Mock subsidy data (as we can't call APIs directly)
const allSubsidies = [
  {
    id: 1,
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible.',
    deadline: '2024-12-31',
    link: '#',
    tags: { districts: ['All'], crops: ['All'] },
  },
  {
    id: 2,
    title: 'Rythu Bharosa',
    description: 'Financial assistance to farmers for investment in crops.',
    eligibility: 'Farmers owning cultivable land in Andhra Pradesh.',
    deadline: '2025-01-15',
    link: '#',
    tags: { districts: ['Anantapur', 'Chittoor', 'Kadapa'], crops: ['All'] },
  },
  {
    id: 3,
    title: 'Drip Irrigation Subsidy',
    description: '70% subsidy on the cost of drip irrigation systems to promote water conservation.',
    eligibility: 'Farmers in drought-prone areas.',
    deadline: '2024-11-30',
    link: '#',
    tags: { districts: ['Anantapur'], crops: ['Groundnut', 'Maize', 'Horticulture crops'] },
  },
  {
    id: 4,
    title: 'National Food Security Mission (NFSM) - Pulses',
    description: 'Assistance for purchasing high-yielding variety seeds for pulses.',
    eligibility: 'All farmers cultivating pulses.',
    deadline: '2024-12-10',
    link: '#',
    tags: { districts: ['All'], crops: ['Pulses', 'Lentils'] },
  },
];

const matchedSubsidies = allSubsidies.filter(subsidy => {
    const districtMatch = subsidy.tags.districts.includes('All') || subsidy.tags.districts.includes(userProfile.district);
    const cropMatch = subsidy.tags.crops.includes('All') || userProfile.crops.some(crop => subsidy.tags.crops.includes(crop));
    return districtMatch && cropMatch;
});

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
  ];

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
            {translations.dashboard.greeting}
        </h1>
        <p className="text-muted-foreground">{translations.dashboard.welcome}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Government Schemes & Subsidies</h2>
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
          <CarouselContent>
            {matchedSubsidies.map((subsidy) => (
              <CarouselItem key={subsidy.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="flex flex-col h-full overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-xl">{subsidy.title}</CardTitle>
                      <CardDescription>{subsidy.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm">Benefits</h4>
                            <p className="text-sm text-muted-foreground">{subsidy.eligibility}</p>
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0">
                         <Button asChild className="w-full">
                            <Link href={subsidy.link}>Apply Now</Link>
                        </Button>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
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
