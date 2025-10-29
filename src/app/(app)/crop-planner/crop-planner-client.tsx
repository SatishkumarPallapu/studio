
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
import { Bot, Loader2, Plus, Sprout, Tangent, Trash, Recycle, Share2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/language-context';

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

const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );

export default function CropPlannerClient() {
  const [plan, setPlan] = useState<PlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [cropInputs, setCropInputs] = useState<string[]>(['']);
  const { translations } = useLanguage();
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
            title: translations.crop_planner.invalid_input,
            description: translations.crop_planner.invalid_input_desc,
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
        title: translations.crop_planner.error_title,
        description: translations.crop_planner.error_desc,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSharePlan = (plan: IntercroppingPlan) => {
    let message = `*Intercropping Plan for ${plan.primaryCrop}*\n\n`;
    message += "*Companion Crops:*\n";
    plan.companionCrops.forEach(c => {
        message += `- *${c.name}:* ${c.benefits}\n`;
    });
    message += `\n*Layout Suggestion:*\n${plan.layout_suggestion}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{translations.crop_planner.title}</CardTitle>
          <CardDescription>
            {translations.crop_planner.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label>{translations.crop_planner.primary_crops_label}</Label>
                    <div className="space-y-2 mt-2">
                        {cropInputs.map((crop, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input 
                                    suppressHydrationWarning
                                    placeholder="e.g., Maize" 
                                    value={crop}
                                    onChange={(e) => handleCropInputChange(index, e.target.value)}
                                />
                                <Button suppressHydrationWarning type="button" variant="ghost" size="icon" onClick={() => handleRemoveCropInput(index)} disabled={cropInputs.length <= 1}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button suppressHydrationWarning type="button" variant="outline" size="sm" onClick={handleAddCropInput} className="mt-2">
                        <Plus className="mr-2 h-4 w-4" /> {translations.crop_planner.add_crop_button}
                    </Button>
                </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.crop_planner.location_label}</FormLabel>
                    <FormControl><Input suppressHydrationWarning placeholder={translations.crop_planner.location_placeholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button suppressHydrationWarning type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{translations.crop_planner.generating_button}</>
                ) : translations.crop_planner.generate_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <Bot className="w-16 h-16 animate-bounce text-primary" />
            <p className="text-muted-foreground">{translations.crop_planner.ai_designing}</p>
          </div>
        )}

        {!isLoading && plan ? (
            <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Recycle className="w-6 h-6 text-primary"/>
                        {translations.crop_planner.synergy_title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{plan.synergy_benefits}</p>
                </CardContent>
            </Card>

            {plan.plans.map((p, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                            <Sprout className="w-7 h-7 text-green-600"/>
                            {translations.crop_planner.plan_for} {p.primaryCrop}
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={() => handleSharePlan(p)}>
                            <WhatsAppIcon /> {translations.crop_planner.share_button}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold">{translations.crop_planner.companions}</h4>
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
                                {translations.crop_planner.layout_suggestion}
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
                    <p className="text-white text-lg font-semibold text-center p-4">{translations.crop_planner.placeholder}</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
