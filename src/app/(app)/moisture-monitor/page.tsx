import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Thermometer, Sun, Sprout, TrendingUp } from 'lucide-react';

const iotData = {
  temperature: 28.5,
  humidity: 65,
  soilMoisture: 45,
  lightIntensity: 55000,
};

const sensorCards = [
  {
    title: 'Soil Moisture',
    value: `${iotData.soilMoisture}%`,
    icon: <Sprout className="w-5 h-5 text-green-600" />,
    description: 'Good level',
    color: 'text-green-600'
  },
  {
    title: 'Temperature',
    value: `${iotData.temperature}°C`,
    icon: <Thermometer className="w-5 h-5 text-red-500" />,
    description: 'Optimal',
    color: 'text-red-500'
  },
  {
    title: 'Humidity',
    value: `${iotData.humidity}%`,
    icon: <Droplets className="w-5 h-5 text-blue-500" />,
    description: 'Normal',
    color: 'text-blue-500'
  },
  {
    title: 'Light Intensity',
    value: `${iotData.lightIntensity} lux`,
    icon: <Sun className="w-5 h-5 text-yellow-500" />,
    description: 'Bright',
    color: 'text-yellow-500'
  },
];

export default function MoistureMonitorPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>IoT Sensor Dashboard</CardTitle>
          <CardDescription>
            Real-time data from your on-field ESP32 sensors (Mock Data).
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        {sensorCards.map((sensor) => (
          <Card key={sensor.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">{sensor.title}</p>
                {sensor.icon}
              </div>
              <p className={`text-3xl font-bold ${sensor.color}`}>{sensor.value}</p>
              <p className="text-xs text-muted-foreground">{sensor.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Historical Data
            </CardTitle>
            <CardDescription>Visualizing sensor data over the last 24 hours (Placeholder).</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Chart placeholder</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
