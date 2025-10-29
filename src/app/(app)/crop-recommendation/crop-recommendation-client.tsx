
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cropRecommendationFromSoil, type CropRecommendationFromSoilOutput } from '@/ai/flows/crop-recommendation-from-soil-flow';
import { generateSoilBudgetTips } from '@/ai/flows/soil-budget-tips-flow';
import type { SoilBudgetTipsOutput } from '@/ai/flows/soil-budget-tips-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Sprout, Leaf, Heart, Calendar, TrendingUp, Flame, Droplets, Wallet, Brain, Clock, Zap, Star, Home } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/contexts/language-context';

const formSchema = z.object({
  nitrogen: z.coerce.number().min(0, 'Nitrogen must be positive.'),
  phosphorus: z.coerce.number().min(0, 'Phosphorus must be positive.'),
  potassium: z.coerce.number().min(0, 'Potassium must be positive.'),
  ph: z.coerce.number().min(0).max(14, 'pH must be between 0 and 14.'),
  location: z.string().min(3, 'Location is required.'),
  soilType: z.string({ required_error: "Please select a soil type."}),
  season: z.string({ required_error: "Please select a season." }),
});

type CropInfo = CropRecommendationFromSoilOutput['top_soil_matches'][0];
type Recommendation = CropRecommendationFromSoilOutput;


export default function CropRecommendationClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, translations } = useLanguage();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [budgetTips, setBudgetTips] = useState<SoilBudgetTipsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTipsLoading, setIsTipsLoading] = useState(false);
  const { toast } = useToast();
  const cropImage = PlaceHolderImages.find(img => img.id === 'crop-recommendation');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nitrogen: searchParams.get('N') ? parseFloat(searchParams.get('N')!) : undefined,
      phosphorus: searchParams.get('P') ? parseFloat(searchParams.get('P')!) : undefined,
      potassium: searchParams.get('K') ? parseFloat(searchParams.get('K')!) : undefined,
      ph: searchParams.get('pH') ? parseFloat(searchParams.get('pH')!) : undefined,
      location: '',
      soilType: undefined,
      season: undefined,
    },
  });

  const getRecommendations = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setRecommendation(null);
    setBudgetTips(null);
    setFlippedCards({});
    try {
      const result = await cropRecommendationFromSoil({
          ...values,
          language: language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English',
      });
      setRecommendation(result);
      toast({
        title: translations.crop_recommendation.recs_ready,
        description: translations.crop_recommendation.recs_ready_desc,
      });

      if (result.top_soil_matches.length > 0) {
        setIsTipsLoading(true);
        const tips = await generateSoilBudgetTips({
            ...values,
            cropName: result.top_soil_matches[0].name
        });
        setBudgetTips(tips);
        setIsTipsLoading(false);
      }

    } catch (error) {
      console.error('Error getting crop recommendation:', error);
      toast({
        variant: 'destructive',
        title: translations.crop_recommendation.error_title,
        description: translations.crop_recommendation.error_desc,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Effect to run recommendation if all params are present in URL
  useEffect(() => {
    const N = searchParams.get('N');
    const P = searchParams.get('P');
    const K = searchParams.get('K');
    const pH = searchParams.get('pH');
    
    // Only auto-submit if the values in the form (from defaultValues) are ready
    const formValues = form.getValues();
    if (N && P && K && pH && formValues.location && formValues.soilType && formValues.season) {
        // We use a timeout to ensure the form has fully initialized before submitting
        setTimeout(() => {
            form.handleSubmit(getRecommendations)();
        }, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, form.getValues]); // Depend on getValues to re-check when form state might change
  

  // Re-fetch recommendations when language changes
  useEffect(() => {
      if(recommendation && form.formState.isSubmitted) {
          getRecommendations(form.getValues());
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    await getRecommendations(values);
  }

  const handleCropSelection = (e: React.MouseEvent, crop: CropInfo) => {
    e.stopPropagation(); // Prevent card flip when clicking button
    const cropName = crop.name.toLowerCase().replace(/ /g, '-');
    const farmingType = crop.farming_type;
    router.push(`/crop-roadmap/${cropName}?farmingType=${farmingType}`);
};


  const handleCardFlip = (cropName: string) => {
    setFlippedCards(prev => ({
        ...prev,
        [cropName]: !prev[cropName]
    }));
  };

  const renderCropCard = (crop: CropInfo) => (
    <Card 
        key={crop.name} 
        onClick={() => handleCardFlip(crop.name)}
        className="p-4 flex flex-col items-center text-center space-y-3 hover:bg-accent hover:shadow-md transition-all cursor-pointer"
    >
        <Sprout className="w-10 h-10 text-primary"/>
        <p className="font-semibold text-lg">{crop.name}</p>

        {flippedCards[crop.name] ? (
            <div className="space-y-3 text-xs text-left w-full animate-in fade-in-50">
                <div>
                    <p className="font-bold flex items-center gap-1"><Leaf className="w-3 h-3 text-green-500" /> {translations.crop_recommendation.vitamins}</p>
                    <p className="text-muted-foreground">{crop.vitamins}</p>
                </div>
                <div>
                    <p className="font-bold flex items-center gap-1"><Heart className="w-3 h-3 text-red-500" /> {translations.crop_recommendation.health_benefits}</p>
                    <p className="text-muted-foreground">{crop.medicinal_value}</p>
                </div>
                 <div>
                    <p className="font-bold flex items-center gap-1"><Home className="w-3 h-3 text-blue-500" /> {translations.crop_recommendation.farming_type}</p>
                    <p className="text-muted-foreground">{crop.farming_type}</p>
                </div>
            </div>
        ) : (
            <div className="text-xs text-muted-foreground animate-in fade-in-50 space-y-1">
                <div className="flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{translations.crop_recommendation.harvest}: <b>{crop.harvesting_duration}</b></span>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{translations.crop_recommendation.demand}: <b>{crop.peak_demand_month}</b></span>
                </div>
            </div>
        )}

        <div className="w-full pt-2">
            <Button size="sm" className="w-full text-xs sm:text-sm" onClick={(e) => handleCropSelection(e, crop)}>{translations.crop_recommendation.view_roadmap}</Button>
        </div>
    </Card>
  );

  const soilTypes = useMemo(() => [
    { value: 'Alluvial', label: translations.crop_recommendation.soil_alluvial },
    { value: 'Black', label: translations.crop_recommendation.soil_black },
    { value: 'Red', label: translations.crop_recommendation.soil_red },
    { value: 'Laterite', label: translations.crop_recommendation.soil_laterite },
    { value: 'Desert', label: translations.crop_recommendation.soil_desert },
    { value: 'Mountain', label: translations.crop_recommendation.soil_mountain },
  ], [translations]);

  const seasons = useMemo(() => [
    { value: 'Kharif', label: translations.crop_recommendation.season_kharif },
    { value: 'Rabi', label: translations.crop_recommendation.season_rabi },
    { value: 'Zaid', label: translations.crop_recommendation.season_zaid },
  ], [translations]);


  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{translations.crop_recommendation.title}</CardTitle>
            <CardDescription>
              {translations.crop_recommendation.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="nitrogen" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.crop_recommendation.nitrogen}</FormLabel>
                      <FormControl><Input suppressHydrationWarning type="number" placeholder="e.g., 120" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phosphorus" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.crop_recommendation.phosphorus}</FormLabel>
                      <FormControl><Input suppressHydrationWarning type="number" placeholder="e.g., 50" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="potassium" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.crop_recommendation.potassium}</FormLabel>
                      <FormControl><Input suppressHydrationWarning type="number" placeholder="e.g., 75" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="ph" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.crop_recommendation.ph}</FormLabel>
                      <FormControl><Input suppressHydrationWarning type="number" step="0.1" placeholder="e.g., 6.8" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="soilType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.crop_recommendation.soil_type}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={translations.crop_recommendation.soil_type_placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {soilTypes.map(type => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="season"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.crop_recommendation.season}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={translations.crop_recommendation.season_placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {seasons.map(season => <SelectItem key={season.value} value={season.value}>{season.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.crop_recommendation.location}</FormLabel>
                      <FormControl><Input suppressHydrationWarning placeholder={translations.crop_recommendation.location_placeholder} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <Button suppressHydrationWarning type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{translations.crop_recommendation.getting_recs_button}</>
                  ) : translations.crop_recommendation.get_recs_button}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          {isLoading && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <Bot className="w-16 h-16 animate-bounce text-primary" />
                  <p className="text-muted-foreground">{translations.crop_recommendation.ai_analyzing}</p>
              </div>
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
                      <p className="text-white text-lg font-semibold text-center p-4">{translations.crop_recommendation.placeholder}</p>
                  </div>
              </div>
          )}
        </div>
      </div>

      {!isLoading && recommendation && (
        <div className='space-y-8'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><Sprout className="text-primary"/> {translations.crop_recommendation.soil_matches}</CardTitle>
              <CardDescription>{translations.crop_recommendation.soil_matches_desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendation.top_soil_matches.map(renderCropCard)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><Clock className="text-primary"/> {translations.crop_recommendation.fast_roi}</CardTitle>
              <CardDescription>{translations.crop_recommendation.fast_roi_desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendation.short_duration_crops.map(renderCropCard)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><Zap className="text-primary"/> {translations.crop_recommendation.high_demand}</CardTitle>
              <CardDescription>{translations.crop_recommendation.high_demand_desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendation.high_demand_at_harvest_crops.map(renderCropCard)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><Star className="text-primary"/> {translations.crop_recommendation.high_profit}</CardTitle>
              <CardDescription>{translations.crop_recommendation.high_profit_desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendation.high_profit_demand_crops.map(renderCropCard)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><Home className="text-primary"/> {translations.crop_recommendation.indoor}</CardTitle>
              <CardDescription>{translations.crop_recommendation.indoor_desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendation.indoor_farming_crops.map(renderCropCard)}
              </div>
            </CardContent>
          </Card>


          <Card>
              <CardHeader>
                  <CardTitle>{translations.crop_recommendation.intercropping}</CardTitle>
                  <CardDescription>{translations.crop_recommendation.intercropping_desc}</CardDescription>
              </CardHeader>
              <CardContent>
                  <p>{recommendation.intercropping_suggestions}</p>
              </CardContent>
          </Card>
        </div>
      )}
      
      {(isTipsLoading || budgetTips) && (
        <Card>
          <CardHeader>
            <CardTitle>{translations.crop_recommendation.soil_tips_title}</CardTitle>
            <CardDescription>{translations.crop_recommendation.soil_tips_desc}</CardDescription>
          </CardHeader>
          <CardContent>
            {isTipsLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : budgetTips && (
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold">{budgetTips.interpretation_guide.title}</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <p className="text-muted-foreground">{budgetTips.interpretation_guide.intro}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <NutrientCard data={budgetTips.interpretation_guide.nitrogen} icon={<Leaf className="text-green-500" />}/>
                        <NutrientCard data={budgetTips.interpretation_guide.phosphorus} icon={<Sprout className="text-purple-500" />}/>
                        <NutrientCard data={budgetTips.interpretation_guide.potassium} icon={<Flame className="text-orange-500" />}/>
                        <NutrientCard data={budgetTips.interpretation_guide.ph} icon={<Droplets className="text-blue-500" />}/>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold">{budgetTips.balancing_recommendations.title}</AccordionTrigger>
                  <AccordionContent className="prose prose-sm max-w-none text-card-foreground">
                    <h4>If Nitrogen is low:</h4><p>{budgetTips.balancing_recommendations.nitrogen_low}</p>
                    <h4>If Phosphorus is low:</h4><p>{budgetTips.balancing_recommendations.phosphorus_low}</p>
                    <h4>If Potassium is low:</h4><p>{budgetTips.balancing_recommendations.potassium_low}</p>
                    <h4>If pH is imbalanced:</h4><p>{budgetTips.balancing_recommendations.ph_imbalance}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold">{budgetTips.dosing_advice.title}</AccordionTrigger>
                  <AccordionContent className="prose prose-sm max-w-none text-card-foreground">
                     <p>{budgetTips.dosing_advice.intro}</p>
                     <h4>Micro-dosing:</h4><p>{budgetTips.dosing_advice.micro_dosing}</p>
                     <h4>Natural Alternatives:</h4><p>{budgetTips.dosing_advice.natural_alternatives}</p>
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-semibold flex items-center gap-2"><Wallet/> {translations.crop_recommendation.budget_rules_title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {budgetTips.budget_principles.principles.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-semibold flex items-center gap-2"><Brain /> {translations.crop_recommendation.farmer_mindset_title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                       {budgetTips.best_practices.practices.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
}


const NutrientCard = ({data, icon}: {data: { heading: string, normal_range: string, diy_check: string, visual_clues: string }, icon: React.ReactNode}) => {
    return (
        <Card className="bg-muted/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    {icon} {data.heading}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
                <p><strong>Normal Range:</strong> {data.normal_range}</p>
                <p><strong>DIY Check:</strong> {data.diy_check}</p>
                <p><strong>Visual Clues:</strong> {data.visual_clues}</p>
            </CardContent>
        </Card>
    )
}

    