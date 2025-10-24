'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const cropImage = PlaceHolderImages.find(img => img.id === 'crop-recommendation');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nitrogen: searchParams.get('N') ? parseFloat(searchParams.get('N')!) : undefined,
      phosphorus: searchParams.get('P') ? parseFloat(searchParams.get('P')!) : undefined,
      potassium: searchParams.get('K') ? parseFloat(searchParams.get('K')!) : undefined,
      ph: searchParams.get('pH') ? parseFloat(searchParams.get('pH')!) : undefined,
      location: '',
    },
  });

  useEffect(() => {
    const N = searchParams.get('N');
    const P = searchParams.get('P');
    const K = searchParams.get('K');
    const pH = searchParams.get('pH');
    
    form.reset({
      nitrogen: N ? parseFloat(N) : undefined,
      phosphorus: P ? parseFloat(P) : undefined,
      potassium: K ? parseFloat(K) : undefined,
      ph: pH ? parseFloat(pH) : undefined,
      location: form.getValues('location') || '',
    });

    if (N && P && K && pH) {
        // Automatically submit if params are present
        // We wrap this in a timeout to allow the form state to update properly
        setTimeout(() => {
            form.handleSubmit(onSubmit)();
        }, 100);
    }
  }, [searchParams, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await cropRecommendationFromSoil({
          nitrogen: values.nitrogen!,
          phosphorus: values.phosphorus!,
          potassium: values.potassium!,
          ph: values.ph!,
          location: values.location
      });
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

  const handleCropSelection = (cropName: string) => {
    toast({
        title: "Crop Selected!",
        description: `Lifecycle plan for ${cropName} created.`,
    });
    router.push('/crop-dashboard');
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Crop Recommendation</CardTitle>
          <CardDescription>
            Enter your soil data and location to get personalized crop suggestions from our AI. Data from soil analysis is pre-filled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="nitrogen" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nitrogen (ppm)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 120" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phosphorus" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phosphorus (ppm)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 50" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="potassium" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potassium (ppm)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 75" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="ph" render={({ field }) => (
                  <FormItem>
                    <FormLabel>pH Level</FormLabel>
                    <FormControl><Input type="number" step="0.1" placeholder="e.g., 6.8" {...field} value={field.value ?? ''} /></FormControl>
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
                <CardTitle>Top 3 Recommended Crops</CardTitle>
                <CardDescription>Select a crop to create a lifecycle plan and start tracking.</CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendation.recommended_crops.slice(0, 3).map((crop) => (
                       <Card key={crop.name} className="p-4 flex flex-col items-center justify-center text-center space-y-3 hover:bg-accent hover:shadow-md transition-all">
                            <Sprout className="w-10 h-10 text-primary"/>
                            <p className="font-semibold text-lg">{crop.name}</p>
                            <div className="text-xs text-muted-foreground">
                                <p>Yield: High</p>
                                <p>Profit: Good</p>
                                <p>Suitability: 90%</p>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"><Info className="w-4 h-4 mr-1" /> Info</Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-xs text-center">
                                <p className="font-bold mb-2">Nutritional Info</p>
                                <p><strong>Vitamins:</strong> {crop.vitamins}</p>
                                <p><strong>Medicinal Value:</strong> {crop.medicinal_value}</p>
                                </TooltipContent>
                            </Tooltip>
                            <Button size="sm" className="w-full" onClick={() => handleCropSelection(crop.name)}>Select Crop ✅</Button>
                        </Card>
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
