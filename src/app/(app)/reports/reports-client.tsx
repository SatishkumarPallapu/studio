'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateWeeklyReport } from '@/ai/flows/weekly-report-flow';
import { Loader2, FileText, Play, Pause } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type Report = {
    textSummary: string;
    voiceSummaryAudio: string;
};

export default function ReportsClient() {
    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const farmActivities = formData.get('farmActivities') as string;
        const weatherData = formData.get('weatherData') as string;

        if (!farmActivities || !weatherData) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill out both farm activities and weather data.',
            });
            return;
        }

        setIsLoading(true);
        setReport(null);
        if (audio) {
            audio.pause();
            setAudio(null);
            setIsPlaying(false);
        }


        try {
            const result = await generateWeeklyReport({ farmActivities, weatherData });
            setReport(result);
            toast({
                title: 'Report Generated',
                description: 'Your weekly AI summary is ready.',
            });
        } catch (error) {
            console.error('Error generating report:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'Could not generate the weekly report. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePlayAudio = () => {
        if (!report) return;

        if (audio && isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else if (audio && !isPlaying) {
            audio.play();
            setIsPlaying(true);
        } else {
            const newAudio = new Audio(report.voiceSummaryAudio);
            setAudio(newAudio);
            newAudio.play();
            setIsPlaying(true);

            newAudio.onended = () => {
                setIsPlaying(false);
            };
        }
    };


    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Generate Weekly AI Report</CardTitle>
                    <CardDescription>Summarize your week's activities and weather to get an AI-powered report with a voice summary.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="farmActivities">Farm Activities This Week</Label>
                            <Textarea
                                id="farmActivities"
                                name="farmActivities"
                                placeholder="e.g., Watered tomato crops, applied 5kg of organic fertilizer to paddy fields, observed minor pest activity on brinjal..."
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="weatherData">Weather Conditions This Week</Label>
                            <Textarea
                                id="weatherData"
                                name="weatherData"
                                placeholder="e.g., Average temperature 30°C, 2 days of heavy rainfall, mostly sunny otherwise..."
                                rows={3}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Report...</>
                            ) : (
                                'Generate Report'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText /> Your AI-Generated Report
                    </CardTitle>
                    <CardDescription>A summary of your week and actionable recommendations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading && (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                    {!isLoading && !report && (
                        <div className="text-center text-muted-foreground h-48 flex items-center justify-center">
                            <p>Your generated report will appear here.</p>
                        </div>
                    )}
                    {report && (
                        <div>
                             <div className="prose prose-sm max-w-none text-card-foreground">
                                <p>{report.textSummary.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
                            </div>
                            <Button onClick={handlePlayAudio} className="mt-4 w-full" variant="outline">
                                {isPlaying ? (
                                    <><Pause className="mr-2 h-4 w-4" /> Pause Voice Summary</>
                                ) : (
                                    <><Play className="mr-2 h-4 w-4" /> Play Voice Summary</>
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
