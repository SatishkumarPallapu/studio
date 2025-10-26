
'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { generateCropRoadmap, CropRoadmapOutput, Activity } from '@/ai/flows/crop-roadmap-flow';
import { CheckCircle2, Sprout, Loader2, BookOpen, ScrollText } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import StartTrackingButton from './start-tracking-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock AI function for certified seeds. In a real app, this would be a Genkit flow.
const getCertifiedSeedInfo = async (cropName: string, language: 'English' | 'Telugu' | 'Hindi') => {
    // This is a placeholder. A real implementation would call an AI flow.
    await new Promise(resolve => setTimeout(resolve, 500)); 
    if (language === 'Telugu') {
         return {
            title: `${cropName} కోసం ధృవీకరించబడిన విత్తనాలు`,
            description: `లాభదాయకమైన పంట కోసం, మీ ప్రాంతానికి సిఫార్సు చేయబడిన ప్రభుత్వ-ధృవీకరించబడిన, అధిక-దిగుబడి ఇచ్చే విత్తన రకాలను ఉపయోగించండి.`,
            seeds: [
                { name: 'Arka Rakshak (F1 Hybrid)', details: 'ఇది ట్రిపుల్ వ్యాధి నిరోధకత కలిగిన అధిక దిగుబడి రకం. బాక్టీరియా వడలు, టమోటా ఆకు ముడత వైరస్, మరియు తొలి ముడత తెగులును నివారిస్తుంది.' },
                { name: 'Pusa Ruby', details: 'ఇది ప్రారంభ రకం, ప్రాసెసింగ్ మరియు తాజా మార్కెట్ రెండింటికీ అనుకూలం. పండ్లు మధ్యస్థ పరిమాణంలో, చదునుగా ఉంటాయి.' },
            ],
            usage_tips_title: 'విత్తన వినియోగ చిట్కాలు',
            usage_tips: [
                'విత్తన శుద్ధి: నాటడానికి ముందు విత్తనాలను ట్రైకోడెర్మా విరిడి @ 4 గ్రా/కేజీ లేదా కార్బెండజిమ్ @ 2 గ్రా/కేజీతో శుద్ధి చేయండి.',
                'నారుమడి యాజమాన్యం: ఆరోగ్యకరమైన నారు కోసం ఎత్తైన నారుమడులను ఉపయోగించండి மற்றும் నీటి ఎద్దడిని నివారించండి.',
                'నాటడం దూరం: మొక్కల మధ్య సరైన గాలి ప్రసరణ మరియు సూర్యరశ్మి కోసం సిఫార్సు చేయబడిన దూరాన్ని పాటించండి.',
            ]
        };
    }
     if (language === 'Hindi') {
        return {
            title: `${cropName} के लिए प्रमाणित बीज`,
            description: `एक लाभदायक फसल के लिए, अपने क्षेत्र के लिए अनुशंसित सरकारी-प्रमाणित, उच्च-उपज वाली किस्मों का उपयोग करें।`,
            seeds: [
                { name: 'अर्का रक्षक (F1 हाइब्रिड)', details: 'यह ट्रिपल रोग प्रतिरोधी उच्च उपज वाली किस्म है। बैक्टीरियल विल्ट, टमाटर लीफ कर्ल वायरस और अर्ली ब्लाइट के प्रतिरोधी।' },
                { name: 'पूसा रूबी', details: 'यह एक प्रारंभिक किस्म है, जो प्रसंस्करण और ताजा बाजार दोनों के लिए उपयुक्त है। फल मध्यम आकार के, चपटे होते हैं।' },
            ],
            usage_tips_title: 'बीज उपयोग युक्तियाँ',
            usage_tips: [
                'बीज उपचार: बुवाई से पहले बीजों को ट्राइकोडर्मा विरिडी @ 4 ग्राम/किलोग्राम या कार्बेन्डाजिम @ 2 ग्राम/किलोग्राम से उपचारित करें।',
                'नर्सरी प्रबंधन: स्वस्थ अंकुरों के लिए उठी हुई क्यारियों का उपयोग करें और जलभराव से बचें।',
                'रोपण दूरी: पौधों के बीच उचित वायु परिसंचरण और सूर्य के प्रकाश के लिए अनुशंसित दूरी बनाए रखें।',
            ]
        };
    }
    return {
        title: `Certified Seeds for ${cropName}`,
        description: `For a profitable harvest, use government-certified, high-yield seed varieties recommended for your region.`,
        seeds: [
            { name: 'Arka Rakshak (F1 Hybrid)', details: 'A high-yielding variety with triple disease resistance against Bacterial wilt, Tomato Leaf Curl Virus, and Early blight.' },
            { name: 'Pusa Ruby', details: 'An early-maturing variety suitable for both processing and fresh market. Fruits are medium-sized and flattened.' },
        ],
        usage_tips_title: 'Seed Usage Tips',
        usage_tips: [
            'Seed Treatment: Before sowing, treat seeds with Trichoderma viride @ 4g/kg or Carbendazim @ 2g/kg.',
            'Nursery Management: Use raised nursery beds for healthy seedlings and to avoid waterlogging.',
            'Planting Distance: Maintain recommended spacing between plants for proper air circulation and sunlight.',
        ]
    };
};
type SeedInfo = Awaited<ReturnType<typeof getCertifiedSeedInfo>>;


export default function CropRoadmapPage({
  params,
}: {
  params: { crop: string };
}) {
  const [roadmap, setRoadmap] = useState<CropRoadmapOutput | null>(null);
  const [seedInfo, setSeedInfo] = useState<SeedInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Safely decode the crop name from params
  const cropName = params.crop ? decodeURIComponent(params.crop.replace(/-/g, ' ')) : '';

  useEffect(() => {
    if (!cropName) return; // Don't fetch if cropName is not available

    const fetchRoadmap = async () => {
      try {
        setIsLoading(true);
        const [roadmapResult, seedResult] = await Promise.all([
             generateCropRoadmap({ cropName }),
             getCertifiedSeedInfo(cropName, 'English') // Placeholder, will use language from context
        ]);
        setRoadmap(roadmapResult);
        setSeedInfo(seedResult);
      } catch (error) {
        console.error("Failed to fetch crop roadmap:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [cropName]);
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    );
  }

  if (!roadmap) {
    return <p>Failed to load roadmap.</p>;
  }

  const activitiesByStage = roadmap.activities.reduce((acc, activity) => {
    const stage = activity.stage;
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(activity);
    return acc;
  }, {} as Record<string, typeof roadmap.activities>);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Sprout className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl capitalize">
                Farming Roadmap for {cropName}
              </CardTitle>
              <CardDescription>
                Your complete guide from sowing to harvest, including seed recommendations.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-end">
          <StartTrackingButton cropName={cropName} />
        </CardContent>
      </Card>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule"><ScrollText className="mr-2 h-4 w-4"/>Farming Schedule</TabsTrigger>
          <TabsTrigger value="seeds"><BookOpen className="mr-2 h-4 w-4"/>Certified Seeds</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule" className="mt-6">
            <Accordion type="single" collapsible defaultValue={Object.keys(activitiesByStage)[0]} className="w-full">
                {Object.entries(activitiesByStage).map(([stage, activities]) => (
                    <AccordionItem key={stage} value={stage}>
                        <AccordionTrigger className="text-xl font-semibold capitalize bg-muted px-4 rounded-md">
                            {stage.replace(/_/g, ' ')}
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="p-4 space-y-4">
                                {activities.map((activity) => (
                                    <Card key={`${activity.day}-${activity.activity}`} className="relative overflow-hidden">
                                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">
                                        {activity.day}
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                {activity.activity}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                        <p className="text-muted-foreground">{activity.details}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </TabsContent>
        <TabsContent value="seeds" className="mt-6">
            {seedInfo ? (
                 <Card>
                    <CardHeader>
                        <CardTitle>{seedInfo.title}</CardTitle>
                        <CardDescription>{seedInfo.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Recommended Varieties</h3>
                            <div className="space-y-4">
                                {seedInfo.seeds.map(seed => (
                                    <div key={seed.name} className="p-4 border rounded-lg bg-muted/50">
                                        <p className="font-bold">{seed.name}</p>
                                        <p className="text-sm text-muted-foreground">{seed.details}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h3 className="font-semibold text-lg mb-2">{seedInfo.usage_tips_title}</h3>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {seedInfo.usage_tips.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <p>Loading seed information...</p>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
