import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Tractor, Warehouse, ShoppingCart, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const timelineEvents = [
  { icon: <Tractor className="h-6 w-6 text-white" />, title: 'Harvested', description: 'Fresh tomatoes harvested from Krishna Reddy\'s farm.', location: 'Anantapur, AP', date: '2024-07-15', bgColor: 'bg-green-500' },
  { icon: <Warehouse className="h-6 w-6 text-white" />, title: 'Processing & Sorting', description: 'Tomatoes sorted and packed at the local co-operative.', location: 'Anantapur Hub', date: '2024-07-15', bgColor: 'bg-blue-500' },
  { icon: <ShoppingCart className="h-6 w-6 text-white" />, title: 'Market Arrival', description: 'Arrived at Bangalore Rythu Bazaar for sale.', location: 'Bangalore, KA', date: '2024-07-16', bgColor: 'bg-orange-500' },
  { icon: <Home className="h-6 w-6 text-white" />, title: 'Purchased by Consumer', description: 'Bought by a local family for their weekly needs.', location: 'Bangalore, KA', date: '2024-07-17', bgColor: 'bg-purple-500' },
];

export default function TraceabilityPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Produce Traceability Ledger</CardTitle>
          <CardDescription>
            Follow the journey of your food from farm to table. (Placeholder with mock data)
          </CardDescription>
        </CardHeader>
        <CardContent>
             <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold">Product: <span className="font-normal">Tomatoes (Batch #A4B8C2)</span></p>
                <p className="font-semibold">Farmer: <span className="font-normal">Krishna Reddy</span></p>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Journey Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-8">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
            {timelineEvents.map((event, index) => (
              <div key={index} className="mb-8 relative">
                <div className={`absolute -left-[2.1rem] top-1 h-10 w-10 rounded-full flex items-center justify-center ${event.bgColor}`}>
                    {event.icon}
                </div>
                <div className="pl-4">
                  <p className="text-sm text-muted-foreground">{event.date} - {event.location}</p>
                  <h4 className="font-semibold text-lg">{event.title}</h4>
                  <p className="text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
