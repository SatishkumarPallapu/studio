
'use client';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cloud, Bot, MessageSquare, Layers, Calendar, Droplets, Thermometer, Sun, TrendingUp, Atom, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { WeatherData } from '@/lib/weather-data';
import { getIconForCondition } from '@/lib/weather-data';


const soilData = {
    moisture: 68,
    ph: 6.8,
    nitrogen: 120,
    potassium: 200,
};

const yieldData = {
    trend: '+12%',
};


export default function DashboardPage() {
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/weather');
        if (!res.ok) {
          throw new Error('Failed to fetch weather data.');
        }
        const data: WeatherData = await res.json();
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeatherData();
  }, []);

  const currentHour = weatherData?.daily[0]?.hourly.find(h => {
    const hourDate = new Date(h.time);
    return hourDate.getHours() === new Date().getHours();
  }) || weatherData?.daily[0]?.hourly[0];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground">
            Welcome, Farmer! 🌾
        </h1>
        <p className="text-muted-foreground">Monitor your farm and get AI-powered insights</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-4">
            <Cloud className="w-6 h-6 text-primary" />
            <CardTitle className="text-lg">7-Day Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
            {isLoading && <p className="text-muted-foreground">Loading forecast...</p>}
            {error && <p className="text-destructive">{error}</p>}
            {weatherData && (
                 <p className="text-muted-foreground">
                    Weather data loaded successfully. View the full forecast on the <Link href="/weather" className="text-primary underline">Weather Page</Link>.
                 </p>
            )}
             {!isLoading && !weatherData && !error && (
                 <p className="text-muted-foreground">No forecast data available</p>
             )}
        </CardContent>
      </Card>

        <div className="grid grid-cols-2 gap-4">
            <Button asChild className="h-20 bg-primary hover:bg-primary/90 text-primary-foreground text-lg">
                <Link href="/crop-recommendation" className="flex flex-col items-center justify-center text-center">
                    <Atom className="mr-2 h-6 w-6" />
                    AI Recommendations
                </Link>
            </Button>
            <Button asChild className="h-20 bg-accent hover:bg-accent/90 text-accent-foreground text-lg">
                 <Link href="/chat" className="flex flex-col items-center justify-center text-center">
                    <MessageSquare className="mr-2 h-6 w-6" />
                    Voice Chat
                </Link>
            </Button>
            <Button asChild variant="outline" className="h-16">
                 <Link href="/crop-planner">
                    <Layers className="mr-2 h-5 w-5" />
                    Multi-Crop Plan
                </Link>
            </Button>
            <Button asChild variant="outline" className="h-16">
                <Link href="/calendar">
                    <Calendar className="mr-2 h-5 w-5" />
                    Calendar
                </Link>
            </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <p>Soil Moisture</p>
                        <Droplets className="w-4 h-4"/>
                    </div>
                    <p className="text-2xl font-bold text-primary mt-1">{soilData.moisture}%</p>
                    <p className="text-xs text-muted-foreground">Good level</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <p>Temperature</p>
                        <Thermometer className="w-4 h-4"/>
                    </div>
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin mt-1" /> : currentHour ? (
                         <>
                            <p className="text-2xl font-bold text-primary mt-1">{currentHour.temp}°C</p>
                            <p className="text-xs text-muted-foreground">Optimal</p>
                         </>
                    ) : (
                         <p className="text-sm text-muted-foreground mt-1">N/A</p>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <p>Weather</p>
                        <Sun className="w-4 h-4"/>
                    </div>
                     {isLoading ? <Loader2 className="w-6 h-6 animate-spin mt-1" /> : currentHour ? (
                         <>
                            <p className="text-2xl font-bold text-primary mt-1">{currentHour.condition}</p>
                            <p className="text-xs text-muted-foreground">Clear skies</p>
                         </>
                     ) : (
                        <p className="text-sm text-muted-foreground mt-1">N/A</p>
                     )}
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <p>Yield Trend</p>
                        <TrendingUp className="w-4 h-4"/>
                    </div>
                    <p className="text-2xl font-bold text-primary mt-1">{yieldData.trend}</p>
                    <p className="text-xs text-muted-foreground">This season</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Soil Analysis</CardTitle>
                    <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Healthy</div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 text-center">
                    <div>
                        <p className="text-muted-foreground text-sm">pH Level</p>
                        <p className="text-xl font-bold">{soilData.ph}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm">Nitrogen</p>
                        <p className="text-xl font-bold">{soilData.nitrogen} kg</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm">Potassium</p>
                        <p className="text-xl font-bold">{soilData.potassium} kg</p>
                    </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/soil-analysis">View Full Report</Link>
                </Button>
            </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-muted p-2 rounded-full">
                    <Bot className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-base mb-1">AI Recommendation</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Based on your soil analysis, consider planting tomatoes this season. Market demand is predicted to increase by 15%.
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
