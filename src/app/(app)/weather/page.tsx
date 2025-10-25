'use client';

import *import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
// Import TYPES and the icon HELPER, not the mock data object
import type { WeatherData, DailyForecast } from '@/lib/weather-data';
import { getIconForCondition } from '@/lib/weather-data';
import { Thermometer, Umbrella, Wind, Sunrise, Sunset, Clock, Droplets } from 'lucide-react';
import { format } from 'date-fns';

// The HourlyForecastChart component remains the same
const HourlyForecastChart = ({ data }: { data: DailyForecast['hourly'] }) => (
  <div className="h-[200px] w-full">
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false}/>
        <XAxis
          dataKey="time"
          tickFormatter={(time) => format(new Date(time), 'ha')}
          axisLine={false}
          tickLine={false}
          style={{ fontSize: '12px' }}
        />
        <YAxis
          dataKey="temp"
          axisLine={false}
          tickLine={false}
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `${value}°`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 'var(--radius)',
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--background))',
          }}
          labelFormatter={(label) => format(new Date(label), 'p')}
          formatter={(value: number, name: string) => [`${value}${name === 'temp' ? '°' : '%'}`, name === 'temp' ? 'Temperature' : 'Precipitation']}
        />
        <Area
          type="monotone"
          dataKey="temp"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorTemp)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);


export default function WeatherPage() {
  // --- START: Data Fetching State ---
  const [data, setData] = React.useState<WeatherData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/weather'); // Fetch from our new API route
        if (!res.ok) {
          throw new Error('Failed to load weather forecast.');
        }
        const weatherData: WeatherData = await res.json();
        setData(weatherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount
  // --- END: Data Fetching State ---

  // --- START: Loading and Error UI ---
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Weather Forecast</CardTitle>
            <CardDescription>Loading current conditions and 7-day forecast...</CardDescription>
          </CardHeader>
        </Card>
        {/* You could add skeleton loaders here */}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Weather</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return <div>No weather data available.</div>;
  }
  // --- END: Loading and Error UI ---


  // --- Use fetched `data` instead of mock `weatherData` ---
  const today = data.daily[0];
  // Find the current hour, or default to the first hour in the list
  const currentHour = today.hourly.find(h => {
    const hourDate = new Date(h.time);
    return hourDate.getHours() === new Date().getHours();
  }) || today.hourly[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>
            Current conditions and 7-day forecast for your farm location.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Now</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            {getIconForCondition(currentHour.condition, "w-20 h-20 text-primary mb-4")}
            <p className="text-6xl font-bold">{currentHour.temp}°</p>
            <p className="text-muted-foreground">{currentHour.condition}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
           <CardHeader>
            <CardTitle>Today's Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Thermometer className="w-6 h-6 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">High / Low</p>
                  <p className="font-bold">{today.temp.max}° / {today.temp.min}°</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Umbrella className="w-6 h-6 text-blue-500" />
          _React from 'react';
       <div>
                  <p className="text-sm text-muted-foreground">Precipitation</p>
                  <p className="font-bold">{today.precipitation}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind className="w-6 h-6 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Wind</p>
                  <p className="font-bold">{today.wind} km/h</p>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <Droplets className="w-6 h-6 text-sky-500" />
                <div>
      _spacesk-500" />
                 <p className="font-bold">{today.humidity}%</p>
                </div>
              </div>
               <div className="flex items-center gap-3 col-span-2">
nbsp;           <div className="flex items-center gap-2">
                    <Sunrise className="w-6 h-6 text-orange-400" />
                    <div>
                        <p className="text-sm text-muted-foreground">Sunrise</p>
                        <p className="font-bold">{today.sunrise}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <Sunset className="w-6 h-6 text-orange-600" />
                    <div>
                        <p className="text-sm text-muted-foreground">Sunset</p>
                        <p className="font-bold">{today.sunset}</p>
                    </div>
                </div>
              </div>
          </CardContent>
        </Card>
    nbsp; </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5"/>Hourly Forecast (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Use the fetched `data` here */}
          <HourlyForecastChart data={data.daily.flatMap(d => d.hourly).slice(0, 24)} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Use the fetched `data` here */}
          {data.daily.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <p className="font-semibold w-24">{index === 0 ? 'Today' : format(new Date(day.date), 'EEEE')}</p>
              <div className="flex items-center gap-2">
                {getIconForCondition(day.condition, "w-8 h-8 text-muted-foreground")}
                <p className="hidden sm:block text-muted-foreground">{day.condition}</p>
              </div>
              <p className="font-medium text-muted-foreground">{day.temp.min}°</p>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-red-500" 
                    style={{ 
                      // Use the fetched `data` here for min/max temp
                        width: `${((day.temp.max - day.temp.min) / (data.maxTemp - data.minTemp)) * 100}%`,
                        marginLeft: `${((day.temp.min - data.minTemp) / (data.maxTemp - data.minTemp)) * 100}%`
                    }}
                />
              </div>
              <p className="font-medium w-8 text-right">{day.temp.max}°</p>
dot;         </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}