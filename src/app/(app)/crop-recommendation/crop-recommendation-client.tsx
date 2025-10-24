'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cropRecommendationFromPrompt } from '@/ai/flows/crop-recommendation-from-prompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Please provide more details about your farm.',
  }),
});

type Recommendation = {
  recommendation: string;
};

export default function CropRecommendationClient() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const cropImage = PlaceHolderImages.find(img => img.id === 'crop-recommendation');


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await cropRecommendationFromPrompt(values);
      setRecommendation(result);
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

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Get Your Crop Recommendation</CardTitle>
          <CardDescription>
            Describe your farm&apos;s location, soil type, and desired yield to get a personalized recommendation from our AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'My farm is in Anantapur, Andhra Pradesh. The soil is red and sandy. I'm looking for a high-yield crop for the Kharif season.'"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Recommendation...
                  </>
                ) : (
                  'Get Recommendation'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center">
        {isLoading && (
            <div className="flex flex-col items-center gap-4">
                <Bot className="w-16 h-16 animate-bounce text-primary" />
                <p className="text-muted-foreground">Our AI is analyzing your farm data...</p>
            </div>
        )}
        {!isLoading && recommendation && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>AI Recommendation</CardTitle>
              <CardDescription>Based on the information you provided.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">{recommendation.recommendation}</p>
            </CardContent>
          </Card>
        )}
        {!isLoading && !recommendation && cropImage && (
             <div className="w-full h-full relative aspect-video rounded-lg overflow-hidden">
                <Image
                    src={cropImage.imageUrl}
                    alt={cropImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={cropImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <p className="text-white text-lg font-semibold text-center p-4">Your recommendation will appear here.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
