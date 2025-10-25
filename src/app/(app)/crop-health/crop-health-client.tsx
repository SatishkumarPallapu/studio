'use client';

import { useState } from 'react';
import { diagnosePestDisease } from '@/ai/flows/pest-disease-diagnosis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bot, Leaf, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Diagnosis = {
  diagnosis: string;
  remedies: string;
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

export default function CropHealthClient() {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const pestImage = PlaceHolderImages.find(img => img.id === 'pest-detection');


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !preview) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image of the affected crop.',
      });
      return;
    }

    setIsLoading(true);
    setDiagnosis(null);

    try {
      const result = await diagnosePestDisease({ photoDataUri: preview });
      setDiagnosis(result);
    } catch (error) {
      console.error('Error diagnosing pest/disease:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to diagnose. Please try a different image.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareOnWhatsApp = (diagnosis: Diagnosis) => {
    const message = `*AI Crop Diagnosis:*\n${diagnosis.diagnosis}\n\n*Suggested Organic Remedies:*\n${diagnosis.remedies}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  
  const placeholderContent = (
    <div className="text-center">
        {pestImage && (
            <div className="w-full h-full relative aspect-video rounded-lg overflow-hidden mb-4">
                <Image
                    src={pestImage.imageUrl}
                    alt={pestImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={pestImage.imageHint}
                />
            </div>
        )}
        <p className="text-muted-foreground">Diagnosis results will appear here.</p>
    </div>
  );

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Crop Health Analysis</CardTitle>
          <CardDescription>
            Upload a photo of an affected crop, and our AI will diagnose the issue and suggest organic remedies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Crop Picture</Label>
              <div className="flex items-center gap-2">
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            {preview && (
              <div>
                <Label>Image Preview</Label>
                <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-lg border">
                  <Image src={preview} alt="Crop preview" fill className="object-cover" />
                </div>
              </div>
            )}

            <Button type="submit" disabled={isLoading || !file} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Diagnosing...
                </>
              ) : (
                'Diagnose Crop'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Bot className="w-16 h-16 animate-pulse text-primary" />
                <p className="text-muted-foreground">Our AI is inspecting your crop...</p>
            </div>
        ) : diagnosis ? (
          <>
            {preview && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Uploaded Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image src={preview} alt="Uploaded crop" fill className="object-cover" />
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>AI Diagnosis</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => handleShareOnWhatsApp(diagnosis)}>
                        <WhatsAppIcon />
                    </Button>
                </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{diagnosis.diagnosis}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Suggested Organic Remedies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{diagnosis.remedies}</p>
              </CardContent>
            </Card>
          </>
        ) : (
            placeholderContent
        )}
      </div>
    </div>
  );
}
