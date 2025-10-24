import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function HarvestPage() {
  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CheckCircle className="w-8 h-8 text-green-500" />
            Harvest Confirmation
          </CardTitle>
          <CardDescription>
            Your AI has predicted the optimal harvest window is now. Confirm your harvest and enter the details to proceed to the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-semibold text-blue-800">Harvest Window: 3 days left</p>
          </div>
          <form className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="yield">Total Yield (in quintals)</Label>
              <Input id="yield" type="number" placeholder="e.g., 150" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Selling Price (if already sold)</Label>
              <Input id="price" type="number" placeholder="e.g., 2500 per quintal" />
            </div>
            <Button asChild className="w-full text-lg py-6">
                <Link href="/marketplace">Harvest Done ✅</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
