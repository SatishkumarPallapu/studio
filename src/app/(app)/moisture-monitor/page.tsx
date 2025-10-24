import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Thermometer, Sun, Sprout } from 'lucide-react';

const iotData = {
  temperature: 28.5,
  humidity: 65,
  soilMoisture: 45,
  lightIntensity: 55000,
};

const sensorCards = [
  {
    title: 'Temperature',
    value: `${iotData.temperature}°C`,
    icon: <Thermometer className="w-8 h-8 text-red-500" />,
    description: 'Ambient air temperature',
  },
  {
    title: 'Humidity',
    value: `${iotData.humidity}%`,
    icon: <Droplets className="w-8 h-8 text-blue-500" />,
    description: 'Air moisture level',
  },
  {
    title: 'Soil Moisture',
    value: `${iotData.soilMoisture}%`,
    icon: <Sprout className="w-8 h-8 text-green-500" />,
    description: 'Water content in the soil',
  },
  {
    title: 'Light Intensity',
    value: `${iotData.lightIntensity} lux`,
    icon: <Sun className="w-8 h-8 text-yellow-500" />,
    description: 'Sunlight exposure',
  },
];

export default function MoistureMonitorPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>IoT Moisture Monitor</CardTitle>
          <CardDescription>
            Real-time data from your on-field ESP32 sensors (Mock Data).
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sensorCards.map((sensor) => (
          <Card key={sensor.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{sensor.title}</CardTitle>
              {sensor.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensor.value}</div>
              <p className="text-xs text-muted-foreground">{sensor.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Historical Data</CardTitle>
            <CardDescription>Visualizing sensor data over the last 24 hours (Placeholder).</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Chart placeholder</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
