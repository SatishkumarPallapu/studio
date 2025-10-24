'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateCropPlan } from '@/ai/flows/crop-planner-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Plus, Sprout, Tangent, Trash, Recycle } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  crops: z.array(z.string().min(2, "Crop name must be at least 2 characters.")).min(1, "Please enter at least one crop."),
  location: z.string().min(3, 'Location is required.'),
});

type CompanionCrop = {
  name: string;
  benefits: string;
};

type IntercroppingPlan = {
  primaryCrop: string;
  companionCrops: CompanionCrop[];
  layout_suggestion: string;
};

type PlanOutput = {
  plans: IntercroppingPlan[];
  synergy_benefits: string;
};

export default function CropPlannerClient() {
  const [plan, setPlan] = useState<PlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [cropInputs, setCropInputs] = useState<string[]>(['']);
  const cropImage = PlaceHolderImages.find(img => img.id === 'crop-recommendation');

  const form = useForm<{ location: string }>({
    resolver: zodResolver(z.object({ location: z.string().min(3, 'Location is required.') })),
    defaultValues: {
      location: '',
    },
  });

  const handleAddCropInput = () => {
    setCropInputs([...cropInputs, '']);
  };

  const handleRemoveCropInput = (index: number) => {
    const newCrops = cropInputs.filter((_, i) => i !== index);
    setCropInputs(newCrops);
  };
  
  const handleCropInputChange = (index: number, value: string) => {
    const newCrops = [...cropInputs];
    newCrops[index] = value;
    setCropInputs(newCrops);
  };


  async function onSubmit(values: { location: string }) {
    const validatedCrops = cropInputs.map(c => c.trim()).filter(c => c.length >= 2);
    if (validatedCrops.length === 0) {
        toast({
            variant: 'destructive',
            title: 'Invalid Input',
            description: 'Please enter at least one valid crop name.',
        });
        return;
    }

    setIsLoading(true);
    setPlan(null);
    try {
      const result = await generateCropPlan({ primaryCrops: validatedCrops, location: values.location });
      setPlan(result);
    } catch (error) {
      console.error('Error generating crop plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate a crop plan. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Multi-Crop Planner</CardTitle>
          <CardDescription>
            Get smart intercropping and companion planting suggestions to boost your farm's health and yield.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label>Primary Crops</Label>
                    <div className="space-y-2 mt-2">
                        {cropInputs.map((crop, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input 
                                    placeholder="e.g., Maize" 
                                    value={crop}
                                    onChange={(e) => handleCropInputChange(index, e.target.value)}
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveCropInput(index)} disabled={cropInputs.length <= 1}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddCropInput} className="mt-2">
                        <Plus className="mr-2 h-4 w-4" /> Add another crop
                    </Button>
                </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Location</FormLabel>
                    <FormControl><Input placeholder="e.g., Anantapur, Andhra Pradesh" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Plan...</>
                ) : 'Generate Intercropping Plan'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <Bot className="w-16 h-16 animate-bounce text-primary" />
            <p className="text-muted-foreground">Our AI is designing a synergistic planting strategy...</p>
          </div>
        )}

        {!isLoading && plan ? (
            <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Recycle className="w-6 h-6 text-primary"/>
                        Overall Synergy Benefits
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{plan.synergy_benefits}</p>
                </CardContent>
            </Card>

            {plan.plans.map((p, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Sprout className="w-7 h-7 text-green-600"/>
                            Plan for {p.primaryCrop}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold">Companion Crops:</h4>
                            <div className="grid grid-cols-2 gap-4">
                            {p.companionCrops.map(cc => (
                                <div key={cc.name} className="p-3 border rounded-md bg-muted/50">
                                    <p className="font-bold">{cc.name}</p>
                                    <p className="text-sm text-muted-foreground">{cc.benefits}</p>
                                </div>
                            ))}
                            </div>
                        </div>
                        <div>
                           <h4 className="font-semibold flex items-center gap-2">
                                <Tangent className="w-5 h-5"/>
                                Layout Suggestion:
                            </h4>
                           <p className="text-muted-foreground mt-1">{p.layout_suggestion}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
            </>
        ) : !isLoading && cropImage && (
             <div className="w-full h-full relative aspect-video rounded-lg overflow-hidden">
                <Image
                    src={cropImage.imageUrl}
                    alt={cropImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={cropImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <p className="text-white text-lg font-semibold text-center p-4">Your multi-crop plan will appear here.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
