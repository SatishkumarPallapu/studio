'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getMarketPriceGuidance } from '@/ai/flows/market-price-guidance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Bot, Landmark, Loader2, IndianRupee } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const formSchema = z.object({
  crop: z.string().min(2, { message: 'Crop name is required.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
});

type Guidance = {
  priceGuidance: string;
  suggestedPrice: string;
  marketAnalysis: string;
};

// Mock data as we cannot call external APIs
const mockMarketData = JSON.stringify({
    "records": [
        { "market": "Bangalore", "price_min": "2200", "price_max": "2500" },
        { "market": "Mysore", "price_min": "2100", "price_max": "2400" },
        { "market": "Hubli", "price_min": "2000", "price_max": "2300" }
    ]
});

export default function MarketPricesClient() {
  const [guidance, setGuidance] = useState<Guidance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const marketImage = PlaceHolderImages.find(img => img.id === 'market-prices');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: '',
      location: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGuidance(null);
    try {
      const result = await getMarketPriceGuidance({
        ...values,
        marketRatesData: mockMarketData,
      });
      setGuidance(result);
    } catch (error) {
      console.error('Error getting market price guidance:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get market guidance. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Market Price Guidance</CardTitle>
          <CardDescription>
            Enter your crop and location to get AI-powered pricing analysis and suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="crop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tomato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bangalore" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Market...
                  </>
                ) : (
                  'Get Price Guidance'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Bot className="w-16 h-16 animate-pulse text-primary" />
            <p className="text-muted-foreground">Our AI is crunching the market numbers...</p>
          </div>
        )}
        {!isLoading && guidance && (
          <>
            <Card className="bg-accent/20 border-accent">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                <IndianRupee className="w-8 h-8 text-accent-foreground" />
                <div>
                  <CardTitle>Suggested Price</CardTitle>
                  <CardDescription>The optimal price to sell your crop.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{guidance.suggestedPrice}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Price Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{guidance.priceGuidance}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{guidance.marketAnalysis}</p>
              </CardContent>
            </Card>
          </>
        )}
        {!isLoading && !guidance && marketImage && (
          <div className="w-full h-full relative aspect-video rounded-lg overflow-hidden">
            <Image
                src={marketImage.imageUrl}
                alt={marketImage.description}
                fill
                className="object-cover"
                data-ai-hint={marketImage.imageHint}
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <p className="text-white text-lg font-semibold text-center p-4">Market analysis will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
