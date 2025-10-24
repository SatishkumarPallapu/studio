import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Sunrise, Sunset, Wind, Umbrella } from 'lucide-react';

const weatherData = {
  current: { temp: 32, condition: 'Sunny', icon: <CloudSun className="w-16 h-16 text-yellow-500" /> },
  forecast: [
    { day: 'Tomorrow', temp: 33, condition: 'Partly Cloudy' },
    { day: 'Day after', temp: 30, condition: 'Light Rain' },
  ],
  details: { sunrise: '6:05 AM', sunset: '6:45 PM', wind: '12 km/h', rainChance: '10%' },
};

export default function WeatherPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weather Details</CardTitle>
          <CardDescription>Current conditions and forecast for your farm location.</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Now</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center gap-4">
                {weatherData.current.icon}
                <p className="text-6xl font-bold">{weatherData.current.temp}°C</p>
                <p className="text-xl text-muted-foreground">{weatherData.current.condition}</p>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>3-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {weatherData.forecast.map(day => (
                    <div key={day.day} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                        <p className="font-semibold">{day.day}</p>
                        <p className="text-muted-foreground">{day.condition}</p>
                        <p className="font-bold">{day.temp}°C</p>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Detailed Conditions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Sunrise className="w-8 h-8 text-orange-500"/>
                <p className="font-semibold">Sunrise</p>
                <p className="text-muted-foreground">{weatherData.details.sunrise}</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Sunset className="w-8 h-8 text-orange-700"/>
                <p className="font-semibold">Sunset</p>
                <p className="text-muted-foreground">{weatherData.details.sunset}</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Wind className="w-8 h-8 text-gray-500"/>
                <p className="font-semibold">Wind</p>
                <p className="text-muted-foreground">{weatherData.details.wind}</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Umbrella className="w-8 h-8 text-blue-500"/>
                <p className="font-semibold">Chance of Rain</p>
                <p className="text-muted-foreground">{weatherData.details.rainChance}</p>
            </div>
          </CardContent>
        </Card>

    </div>
  );
}
