
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSun } from 'lucide-react';
import {
  Bot, MessageSquare, Layers, Calendar, Droplets, Thermometer, TrendingUp, Atom,
} from 'lucide-react';
import Link from 'next/link';
import type { WeatherData, WeatherCondition } from '@/lib/weather-data';
import { transformOpenWeatherData } from '@/lib/weather-data';
import { format } from 'date-fns';
import { useActiveCrop } from '@/contexts/active-crop-context';

const soilData = {
    moisture: 68,
    ph: 6.8,
    nitrogen: 120,
    potassium: 200,
};

const yieldData = {
    trend: '+12%',
};

const getIconForCondition = (condition: WeatherCondition | undefined, className: string) => {
    if (!condition) return <Sun className={className} />;
    switch (condition) {
        case 'Sunny':
            return <Sun className={className} />;
        case 'Partly Cloudy':
            return <CloudSun className={className} />;
        case 'Cloudy':
            return <Cloud className={className} />;
        case 'Rain':
            return <CloudRain className={className} />;
        case 'Thunderstorm':
            return <CloudLightning className={className} />;
        default:
            return <Sun className={className} />;
    }
};

export default function DashboardPage() {
  const { activeCrop } = useActiveCrop();
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const FALLBACK_LAT = 17.3850;
  const FALLBACK_LON = 78.4867;

  React.useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (!res.ok) {
          throw new Error('Failed to load forecast.');
        }
        const data: WeatherData = await res.json();
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (!navigator.geolocation) {
      setError("Geolocation is not supported. Showing default weather.");
      fetchWeather(FALLBACK_LAT, FALLBACK_LON);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setError("Location access denied. Showing default weather.");
        fetchWeather(FALLBACK_LAT, FALLBACK_LON);
      }
    );
  }, []);

  const currentHourData = weatherData?.daily[0]?.hourly[0];
  const currentTemp = currentHourData?.temp;
  const currentCondition = currentHourData?.condition;


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground">
            Welcome, Farmer! 🌾
        </h1>
        <p className="text-muted-foreground">Monitor your farm and get AI-powered insights</p>
      </div>

      {error && !weatherData && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Weather Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Cloud className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">5-Day Weather Forecast</CardTitle>
            </div>
            <Button asChild variant="link" className="pr-0">
              <Link href="/weather">View Details</Link>
            </Button>
        </CardHeader>
        <CardContent>
            {loading && <p className="text-muted-foreground">Getting location and forecast...</p>}
            
            {error && weatherData && (
              <p className="text-xs text-yellow-600 mb-2">{error}</p>
            )}

            {weatherData && (
              <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
                {weatherData.daily.map((day, index) => (
                  <div key={index} className="flex flex-col items-center gap-1 text-center px-2">
                    <p className="text-sm font-medium whitespace-nowrap">
                      {index === 0 ? 'Today' : format(new Date(day.date), 'EEE')}
                    </p>
                    {getIconForCondition(day.condition, "w-6 h-6 text-muted-foreground")}
                    <p className="text-sm font-semibold">{day.temp.max}°</p>
                    <p className="text-xs text-muted-foreground">{day.temp.min}°</p>
                  </div>
                ))}
              </div>
            )}
        </CardContent>
      </Card>


        <div className="grid grid-cols-2 gap-4">
            <Button asChild className="h-20 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/crop-recommendation" className="flex flex-col items-center justify-center text-center">
                    <Atom className="mb-1 h-5 w-5" />
                    <span className="text-sm sm:text-base">AI Recommendations</span>
                </Link>
            </Button>
            <Button asChild className="h-20 bg-accent hover:bg-accent/90 text-accent-foreground">
                 <Link href="/chat" className="flex flex-col items-center justify-center text-center">
                    <MessageSquare className="mb-1 h-5 w-5" />
                    <span className="text-sm sm:text-base">Voice Chat</span>
                </Link>
            </Button>
            <Button asChild variant="outline" className="h-16">
                 <Link href="/crop-planner">
                    <Layers className="mr-2 h-5 w-5" />
                    Multi-Crop Plan
                </Link>
            </Button>
            <Button asChild variant="outline" className="h-16">
                <Link href="/crop-dashboard">
                    <Calendar className="mr-2 h-5 w-5" />
                    Crop Lifecycle
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
                    <p className="text-2xl font-bold text-primary mt-1">
                      {loading ? '...' : (currentTemp ? `${currentTemp}°C` : 'N/A')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {loading ? 'Loading...' : 'Live'}
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <p>Weather</p>
                        {loading ? <div className="w-4 h-4" /> : (
                            getIconForCondition(currentCondition, "w-4 h-4")
                        )}
                    </div>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {loading ? '...' : currentCondition || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {loading ? 'Loading...' : 'Current'}
                    </p>
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
                    <p className="text-sm text-muted-foreground capitalize">
                        {activeCrop ? `Based on your soil analysis, continue to monitor your ${activeCrop.name} crop. Market demand is predicted to increase by 15%.`
                         : "Get a crop recommendation to see AI insights here."}
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
