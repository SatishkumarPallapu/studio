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
import { IndianRupee, Search, Sprout, ShoppingCart, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const mockCrops = [
  { name: 'Tomato', price: '₹30/kg', healthBenefits: 'Rich in Vitamin C and antioxidants.' },
  { name: 'Onion', price: '₹25/kg', healthBenefits: 'Good for heart health and immunity.' },
  { name: 'Potato', price: '₹20/kg', healthBenefits: 'Excellent source of potassium and Vitamin B6.' },
  { name: 'Carrot', price: '₹40/kg', healthBenefits: 'High in Vitamin A, good for vision.' },
  { name: 'Spinach', price: '₹15/bunch', healthBenefits: 'Packed with iron, Vitamin K, and folate.' },
  { name: 'Brinjal', price: '₹28/kg', healthBenefits: 'Contains fiber and antioxidants.' },
];


export default function MarketplaceClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);

  const filteredCrops = mockCrops.filter((crop) =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
            <div>
                <CardTitle>Community Marketplace</CardTitle>
                <CardDescription>
                    Browse fresh produce directly from local farmers or list your own harvest for sale.
                </CardDescription>
            </div>
            <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        List for Sale
                    </Button>
                </DialogTrigger>
                 <DialogContent>
                    <DialogHeader>
                        <DialogTitle>List Your Produce for Sale</DialogTitle>
                        <DialogDescription>Fill in the details below to add your harvest to the marketplace.</DialogDescription>
                    </DialogHeader>
                    <form id="list-produce-form" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="crop-name">Crop Name</Label>
                            <Input id="crop-name" name="crop-name" placeholder="e.g., Tomato" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input id="quantity" name="quantity" placeholder="e.g., 150 quintals" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input id="price" name="price" placeholder="e.g., ₹2500 / quintal" required />
                        </div>
                    </form>
                    <DialogFooter>
                        <Button type="submit" form="list-produce-form" onClick={() => setIsListDialogOpen(false)}>List Produce</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex-row items-center gap-4 bg-muted/30">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10">
                        <Sprout className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{crop.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="flex items-center text-lg font-bold">
                            <IndianRupee className="mr-1 h-5 w-5" />
                            {crop.price}
                        </p>
                    </div>
                    <TooltipTrigger asChild>
                         <Button className="w-full">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Contact Seller via WhatsApp
                        </Button>
                    </TooltipTrigger>
                  </CardContent>
                </Card>
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
