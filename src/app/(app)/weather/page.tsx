import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Sunrise, Sunset, Wind, Umbrella, Droplets, Thermometer, Sun as SunIcon } from 'lucide-react';

const weatherData = {
  current: { temp: 32, condition: 'Sunny', icon: <SunIcon className="w-5 h-5 text-green-600" /> },
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Weather</p>
                {weatherData.current.icon}
              </div>
              <p className="text-3xl font-bold text-green-600">{weatherData.current.condition}</p>
              <p className="text-xs text-muted-foreground">Clear skies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Temperature</p>
                <Thermometer className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-red-500">{weatherData.current.temp}°C</p>
              <p className="text-xs text-muted-foreground">Optimal</p>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Forecast</CardTitle>
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

       <Card>
          <CardHeader>
            <CardTitle>Detailed Conditions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card">
                <Sunrise className="w-8 h-8 text-orange-500"/>
                <p className="font-semibold">Sunrise</p>
                <p className="text-muted-foreground">{weatherData.details.sunrise}</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card">
                <Sunset className="w-8 h-8 text-orange-700"/>
                <p className="font-semibold">Sunset</p>
                <p className="text-muted-foreground">{weatherData.details.sunset}</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card">
                <Wind className="w-8 h-8 text-gray-500"/>
                <p className="font-semibold">Wind</p>
                <p className="text-muted-foreground">{weatherData.details.wind}</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card">
                <Umbrella className="w-8 h-8 text-blue-500"/>
                <p className="font-semibold">Chance of Rain</p>
                <p className="text-muted-foreground">{weatherData.details.rainChance}</p>
            </div>
          </CardContent>
        </Card>

    </div>
  );
}
