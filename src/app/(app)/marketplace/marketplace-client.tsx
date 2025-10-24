'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IndianRupee, Search, Sprout } from 'lucide-react';

const mockCrops = [
  { name: 'Tomato', price: '₹30/kg', healthBenefits: 'Rich in Vitamin C and antioxidants.' },
  { name: 'Onion', price: '₹25/kg', healthBenefits: 'Good for heart health and immunity.' },
  { name: 'Potato', price: '₹20/kg', healthBenefits: 'Excellent source of potassium and Vitamin B6.' },
  { name: 'Carrot', price: '₹40/kg', healthBenefits: 'High in Vitamin A, good for vision.' },
  { name: 'Spinach', price: '₹15/bunch', healthBenefits: 'Packed with iron, Vitamin K, and folate.' },
  { name: 'Brinjal', price: '₹28/kg', healthBenefits: 'Contains fiber and antioxidants.' },
  { name: 'Cauliflower', price: '₹35/head', healthBenefits: 'Rich in Vitamin C and choline.' },
  { name: 'Lady\'s Finger (Okra)', price: '₹45/kg', healthBenefits: 'Good source of fiber and magnesium.' },
  { name: 'Rice (Sona Masoori)', price: '₹55/kg', healthBenefits: 'Primary source of carbohydrates for energy.' },
  { name: 'Wheat', price: '₹40/kg', healthBenefits: 'Good source of fiber and essential minerals.' },
  { name: 'Mango (Banganapalli)', price: '₹80/kg', healthBenefits: 'High in Vitamin C and A.' },
  { name: 'Banana', price: '₹50/dozen', healthBenefits: 'Rich in potassium and provides quick energy.' },
];


export default function MarketplaceClient() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCrops = mockCrops.filter((crop) =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Marketplace</CardTitle>
          <CardDescription>
            Browse fresh produce directly from local farmers. Admin features for price editing are not available in this demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for a crop..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <TooltipProvider>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCrops.map((crop) => (
            <Tooltip key={crop.name} delayDuration={100}>
              <TooltipTrigger asChild>
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex-row items-center gap-4 bg-muted/30">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10">
                        <Sprout className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{crop.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="flex items-center text-lg font-bold">
                            <IndianRupee className="mr-1 h-5 w-5" />
                            {crop.price}
                        </p>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs text-center">
                <p className="font-bold mb-1">Health Benefits</p>
                <p>{crop.healthBenefits}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {filteredCrops.length === 0 && (
        <div className="text-center py-10">
            <p className="text-lg font-semibold">No crops found</p>
            <p className="text-muted-foreground">Try adjusting your search term.</p>
        </div>
      )}
    </div>
  );
}
