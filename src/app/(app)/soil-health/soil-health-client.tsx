'use client';

import { useState } from 'react';
import { extractSoilData } from '@/ai/flows/soil-testing-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Upload, BarChart } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type SoilData = {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  fertility: string;
};

export default function SoilHealthClient() {
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const soilHealthImage = PlaceHolderImages.find(img => img.id === 'soil-health');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
      } else {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please upload a PDF or an image file.',
        });
      }
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a soil test report file.',
      });
      return;
    }

    setIsLoading(true);
    setSoilData(null);

    try {
      const dataUri = await fileToDataUri(file);
      const result = await extractSoilData({ reportDataUri: dataUri, mimeType: file.type });
      setSoilData(result);
      toast({
        title: 'Analysis Complete',
        description: 'Successfully extracted soil health data.',
      });
    } catch (error) {
      console.error('Error extracting soil data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to analyze the report. Please try another file.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const placeholderContent = (
    <div className="text-center">
        {soilHealthImage && (
            <div className="w-full h-full relative aspect-video rounded-lg overflow-hidden mb-4">
                <Image
                    src={soilHealthImage.imageUrl}
                    alt={soilHealthImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={soilHealthImage.imageHint}
                />
            </div>
        )}
        <p className="text-muted-foreground">Soil analysis results will appear here.</p>
    </div>
  );

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Automated Soil Test Analysis</CardTitle>
          <CardDescription>
            Upload your soil test report (PDF or image) to let our AI extract the key metrics for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="soil-report">Soil Report File</Label>
              <div className="flex items-center gap-2">
                <Input id="soil-report" type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
              </div>
            </div>

            {preview && (
              <div>
                <Label>Image Preview</Label>
                <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-lg border">
                  <Image src={preview} alt="Soil report preview" fill className="object-cover" />
                </div>
              </div>
            )}
             {file && !preview && file.type === 'application/pdf' && (
                <div className="mt-2 text-sm text-muted-foreground">
                    PDF file selected: <strong>{file.name}</strong>
                </div>
             )}


            <Button type="submit" disabled={isLoading || !file} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Report...
                </>
              ) : (
                'Analyze Soil Report'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Bot className="w-16 h-16 animate-pulse text-primary" />
                <p className="text-muted-foreground">Our AI is reading your soil report...</p>
            </div>
        ) : soilData ? (
          <>
            <Card>
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                <BarChart className="w-8 h-8 text-primary"/>
                <div>
                    <CardTitle>AI Analysis Results</CardTitle>
                    <CardDescription>Extracted from your soil report.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Nitrogen (N)</p>
                    <p className="text-2xl font-bold">{soilData.nitrogen} ppm</p>
                </div>
                <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Phosphorus (P)</p>
                    <p className="text-2xl font-bold">{soilData.phosphorus} ppm</p>
                </div>
                <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Potassium (K)</p>
                    <p className="text-2xl font-bold">{soilData.potassium} ppm</p>
                </div>
                <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">pH Level</p>
                    <p className="text-2xl font-bold">{soilData.ph}</p>
                </div>
                <div className="col-span-2 flex flex-col space-y-1.5 rounded-lg border bg-accent/20 p-4">
                    <p className="text-sm text-muted-foreground">Fertility Status</p>
                    <p className="text-2xl font-bold">{soilData.fertility}</p>
                </div>
              </CardContent>
            </Card>
            <Button className="w-full" asChild>
                <a href={`/crop-recommendation?N=${soilData.nitrogen}&P=${soilData.phosphorus}&K=${soilData.potassium}&pH=${soilData.ph}`}>
                    Get Crop Recommendations
                </a>
            </Button>
          </>
        ) : (
            placeholderContent
        )}
      </div>
    </div>
  );
}
