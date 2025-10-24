'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cropRecommendationFromSoil } from '@/ai/flows/crop-recommendation-from-soil-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Info, Sprout } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formSchema = z.object({
  nitrogen: z.coerce.number().min(0, 'Nitrogen must be positive.'),
  phosphorus: z.coerce.number().min(0, 'Phosphorus must be positive.'),
  potassium: z.coerce.number().min(0, 'Potassium must be positive.'),
  ph: z.coerce.number().min(0).max(14, 'pH must be between 0 and 14.'),
  location: z.string().min(3, 'Location is required.'),
});

type CropInfo = {
  name: string;
  vitamins: string;
  medicinal_value: string;
};

type Recommendation = {
  recommended_crops: CropInfo[];
  intercropping_suggestions: string;
};

export default function CropRecommendationClient() {
  const searchParams = useSearchParams();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const cropImage = PlaceHolderImages.find(img => img.id === 'crop-recommendation');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nitrogen: searchParams.get('N') ? parseFloat(searchParams.get('N')!) : '',
      phosphorus: searchParams.get('P') ? parseFloat(searchParams.get('P')!) : '',
      potassium: searchParams.get('K') ? parseFloat(searchParams.get('K')!) : '',
      ph: searchParams.get('pH') ? parseFloat(searchParams.get('pH')!) : '',
      location: '',
    },
  });

  useEffect(() => {
    form.reset({
      nitrogen: searchParams.get('N') ? parseFloat(searchParams.get('N')!) : '',
      phosphorus: searchParams.get('P') ? parseFloat(searchParams.get('P')!) : '',
      potassium: searchParams.get('K') ? parseFloat(searchParams.get('K')!) : '',
      ph: searchParams.get('pH') ? parseFloat(searchParams.get('pH')!) : '',
      location: form.getValues('location') || '',
    });
  }, [searchParams, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await cropRecommendationFromSoil(values);
      setRecommendation(result);
      toast({
        title: "Recommendations Ready!",
        description: "We've found some suitable crops for your farm.",
      })
    } catch (error) {
      console.error('Error getting crop recommendation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get crop recommendation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleStartTracking = (cropName: string) => {
    // In a real app, this would likely involve a database mutation
    // to create a new crop tracking entry for the current user.
    toast({
        title: "Tracking Started!",
        description: `You are now tracking the progress of ${cropName}.`,
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Crop Recommendation</CardTitle>
          <CardDescription>
            Enter your soil data and location to get personalized crop suggestions from our AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="nitrogen" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nitrogen (ppm)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 120" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phosphorus" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phosphorus (ppm)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="potassium" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potassium (ppm)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 75" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="ph" render={({ field }) => (
                  <FormItem>
                    <FormLabel>pH Level</FormLabel>
                    <FormControl><Input type="number" step="0.1" placeholder="e.g., 6.8" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Location</FormLabel>
                    <FormControl><Input placeholder="e.g., Anantapur, Andhra Pradesh" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Getting Recommendations...</>
                ) : 'Get Recommendations'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <Bot className="w-16 h-16 animate-bounce text-primary" />
                <p className="text-muted-foreground">Our AI is analyzing your farm data to find the perfect crops...</p>
            </div>
        )}
        {!isLoading && recommendation ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Recommended Crops</CardTitle>
                <CardDescription>Based on your soil, location, and market demand.</CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendation.recommended_crops.map((crop) => (
                      <Tooltip key={crop.name} delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2 hover:bg-accent hover:shadow-md transition-all">
                              <Sprout className="w-8 h-8 text-primary"/>
                              <p className="font-semibold">{crop.name}</p>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs text-center">
                          <p className="font-bold mb-2">Nutritional Info</p>
                          <p><strong>Vitamins:</strong> {crop.vitamins}</p>
                          <p><strong>Medicinal Value:</strong> {crop.medicinal_value}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Intercropping Suggestions</CardTitle>
                    <CardDescription>Boost yield and soil health by planting these together.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{recommendation.intercropping_suggestions}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendation.recommended_crops.map((crop) => (
                       <div key={crop.name} className="flex flex-col gap-2 rounded-md border p-4">
                         <h3 className="font-semibold">{crop.name}</h3>
                         <div className="flex gap-2 mt-auto">
                            <Button asChild size="sm" className="flex-1">
                                <Link href={`/crop-roadmap/${crop.name.toLowerCase().replace(/ /g, '-')}`}>
                                    View Complete Roadmap
                                </Link>
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => handleStartTracking(crop.name)}>Start Tracking</Button>
                         </div>
                       </div>
                    ))}
                  </div>
                </CardContent>
            </Card>
          </>
        ) : !isLoading && !recommendation && cropImage && (
             <div className="w-full h-full relative aspect-video rounded-lg overflow-hidden">
                <Image
                    src={cropImage.imageUrl}
                    alt={cropImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={cropImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <p className="text-white text-lg font-semibold text-center p-4">Your crop recommendations will appear here.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

    