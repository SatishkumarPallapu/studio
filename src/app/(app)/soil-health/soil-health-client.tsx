'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const initialData = [
  { month: 'Jan', nitrogen: 120, phosphorus: 50, ph: 6.8 },
  { month: 'Feb', nitrogen: 110, phosphorus: 55, ph: 6.7 },
  { month: 'Mar', nitrogen: 115, phosphorus: 52, ph: 6.9 },
  { month: 'Apr', nitrogen: 130, phosphorus: 60, ph: 6.5 },
  { month: 'May', nitrogen: 125, phosphorus: 58, ph: 6.6 },
  { month: 'Jun', nitrogen: 140, phosphorus: 62, ph: 7.0 },
];

export default function SoilHealthClient() {
  const { toast } = useToast();
  const [soilData, setSoilData] = useState(initialData);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newData = {
      nitrogen: Number(formData.get('nitrogen')),
      phosphorus: Number(formData.get('phosphorus')),
      ph: Number(formData.get('ph')),
      month: new Date().toLocaleString('default', { month: 'short' }),
    };

    if (newData.nitrogen && newData.phosphorus && newData.ph) {
        // In a real app, this would be a database mutation.
        // Here, we'll just update the local state for demonstration.
        // To prevent the chart from growing indefinitely, we'll cap it at 6 entries.
        setSoilData(prevData => [...prevData.slice(1), newData]);
        
        toast({
            title: 'Success',
            description: 'New soil health reading has been recorded.',
        });
        event.currentTarget.reset();
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please fill in all fields with valid numbers.',
        });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Soil Health History</CardTitle>
            <CardDescription>Visualizing key soil metrics over the past months.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer>
                <BarChart data={soilData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="nitrogen" fill="hsl(var(--chart-1))" name="Nitrogen (kg/ha)" />
                  <Bar dataKey="phosphorus" fill="hsl(var(--chart-2))" name="Phosphorus (kg/ha)" />
                  <Bar dataKey="ph" fill="#82ca9d" name="pH Level" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Reading</CardTitle>
            <CardDescription>Record your latest soil test results.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nitrogen">Nitrogen (kg/ha)</Label>
                <Input id="nitrogen" name="nitrogen" type="number" step="0.1" placeholder="e.g., 125.5" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phosphorus">Phosphorus (kg/ha)</Label>
                <Input id="phosphorus" name="phosphorus" type="number" step="0.1" placeholder="e.g., 55.2" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ph">pH Level</Label>
                <Input id="ph" name="ph" type="number" step="0.1" placeholder="e.g., 6.8" required />
              </div>
              <Button type="submit" className="w-full">
                Save Reading
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
