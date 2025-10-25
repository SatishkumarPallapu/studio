
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IndianRupee, Search, PlusCircle, ArrowUp, ArrowDown, Carrot, Apple, Wheat, Grape, Flower2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

type Category = 'Vegetable' | 'Fruit' | 'Pulse' | 'Grain' | 'Paddy' | 'Flower';

type Crop = {
    name: string;
    category: Category;
    price: number;
    yesterdayPrice: number;
    unit: string;
    discount?: string;
};

const mockCrops: Crop[] = [
    // Vegetables (30)
    { name: 'Tomato', category: 'Vegetable', price: 35, yesterdayPrice: 32, unit: 'kg' },
    { name: 'Onion', category: 'Vegetable', price: 28, yesterdayPrice: 30, unit: 'kg', discount: '10% off' },
    { name: 'Potato', category: 'Vegetable', price: 22, yesterdayPrice: 22, unit: 'kg' },
    { name: 'Carrot', category: 'Vegetable', price: 45, yesterdayPrice: 40, unit: 'kg' },
    { name: 'Spinach', category: 'Vegetable', price: 18, yesterdayPrice: 20, unit: 'bunch' },
    { name: 'Brinjal (Eggplant)', category: 'Vegetable', price: 30, yesterdayPrice: 30, unit: 'kg' },
    { name: 'Cauliflower', category: 'Vegetable', price: 25, yesterdayPrice: 28, unit: 'piece' },
    { name: 'Cabbage', category: 'Vegetable', price: 20, yesterdayPrice: 20, unit: 'piece' },
    { name: 'Bell Pepper (Capsicum)', category: 'Vegetable', price: 60, yesterdayPrice: 55, unit: 'kg' },
    { name: 'Cucumber', category: 'Vegetable', price: 25, yesterdayPrice: 25, unit: 'kg' },
    { name: 'Broccoli', category: 'Vegetable', price: 80, yesterdayPrice: 85, unit: 'kg' },
    { name: 'Radish', category: 'Vegetable', price: 20, yesterdayPrice: 18, unit: 'kg' },
    { name: 'Lady Finger (Okra)', category: 'Vegetable', price: 40, yesterdayPrice: 42, unit: 'kg' },
    { name: 'Green Beans', category: 'Vegetable', price: 50, yesterdayPrice: 50, unit: 'kg' },
    { name: 'Pumpkin', category: 'Vegetable', price: 25, yesterdayPrice: 25, unit: 'kg' },
    { name: 'Beetroot', category: 'Vegetable', price: 35, yesterdayPrice: 33, unit: 'kg' },
    { name: 'Bottle Gourd', category: 'Vegetable', price: 30, yesterdayPrice: 30, unit: 'kg' },
    { name: 'Ridge Gourd', category: 'Vegetable', price: 40, yesterdayPrice: 45, unit: 'kg' },
    { name: 'Bitter Gourd', category: 'Vegetable', price: 45, yesterdayPrice: 45, unit: 'kg' },
    { name: 'Green Peas', category: 'Vegetable', price: 70, yesterdayPrice: 65, unit: 'kg' },
    { name: 'Sweet Potato', category: 'Vegetable', price: 30, yesterdayPrice: 30, unit: 'kg' },
    { name: 'Coriander Leaves', category: 'Vegetable', price: 10, yesterdayPrice: 12, unit: 'bunch' },
    { name: 'Mint Leaves', category: 'Vegetable', price: 8, yesterdayPrice: 8, unit: 'bunch' },
    { name: 'Ginger', category: 'Vegetable', price: 120, yesterdayPrice: 110, unit: 'kg' },
    { name: 'Garlic', category: 'Vegetable', price: 150, yesterdayPrice: 150, unit: 'kg' },
    { name: 'Chilli', category: 'Vegetable', price: 80, yesterdayPrice: 75, unit: 'kg' },
    { name: 'Lemon', category: 'Vegetable', price: 5, yesterdayPrice: 6, unit: 'piece' },
    { name: 'Mushroom', category: 'Vegetable', price: 40, yesterdayPrice: 40, unit: 'pack' },
    { name: 'Corn', category: 'Vegetable', price: 15, yesterdayPrice: 15, unit: 'piece' },
    { name: 'Lettuce', category: 'Vegetable', price: 50, yesterdayPrice: 55, unit: 'head' },

    // Fruits (30)
    { name: 'Apple', category: 'Fruit', price: 150, yesterdayPrice: 145, unit: 'kg' },
    { name: 'Banana', category: 'Fruit', price: 40, yesterdayPrice: 40, unit: 'dozen' },
    { name: 'Mango', category: 'Fruit', price: 80, yesterdayPrice: 90, unit: 'kg', discount: 'Seasonal' },
    { name: 'Orange', category: 'Fruit', price: 70, yesterdayPrice: 70, unit: 'kg' },
    { name: 'Grapes', category: 'Fruit', price: 100, yesterdayPrice: 110, unit: 'kg' },
    { name: 'Watermelon', category: 'Fruit', price: 30, yesterdayPrice: 30, unit: 'kg' },
    { name: 'Pineapple', category: 'Fruit', price: 50, yesterdayPrice: 48, unit: 'piece' },
    { name: 'Pomegranate', category: 'Fruit', price: 120, yesterdayPrice: 120, unit: 'kg' },
    { name: 'Guava', category: 'Fruit', price: 60, yesterdayPrice: 65, unit: 'kg' },
    { name: 'Papaya', category: 'Fruit', price: 40, yesterdayPrice: 40, unit: 'kg' },
    { name: 'Muskmelon', category: 'Fruit', price: 40, yesterdayPrice: 38, unit: 'kg' },
    { name: 'Chikoo', category: 'Fruit', price: 50, yesterdayPrice: 50, unit: 'kg' },
    { name: 'Litchi', category: 'Fruit', price: 180, yesterdayPrice: 190, unit: 'kg' },
    { name: 'Strawberry', category: 'Fruit', price: 250, yesterdayPrice: 250, unit: 'box' },
    { name: 'Fig', category: 'Fruit', price: 200, yesterdayPrice: 210, unit: 'kg' },
    { name: 'Kiwi', category: 'Fruit', price: 40, yesterdayPrice: 40, unit: 'piece' },
    { name: 'Sweet Lime (Mosambi)', category: 'Fruit', price: 60, yesterdayPrice: 55, unit: 'kg' },
    { name: 'Jackfruit', category: 'Fruit', price: 40, yesterdayPrice: 40, unit: 'kg' },
    { name: 'Plum', category: 'Fruit', price: 140, yesterdayPrice: 130, unit: 'kg' },
    { name: 'Peach', category: 'Fruit', price: 160, yesterdayPrice: 160, unit: 'kg' },
    { name: 'Pear', category: 'Fruit', price: 130, yesterdayPrice: 135, unit: 'kg' },
    { name: 'Cherry', category: 'Fruit', price: 400, yesterdayPrice: 400, unit: 'kg' },
    { name: 'Custard Apple', category: 'Fruit', price: 80, yesterdayPrice: 80, unit: 'kg' },
    { name: 'Black Jamun', category: 'Fruit', price: 100, yesterdayPrice: 110, unit: 'kg' },
    { name: 'Indian Gooseberry (Amla)', category: 'Fruit', price: 50, yesterdayPrice: 50, unit: 'kg' },
    { name: 'Tamarind', category: 'Fruit', price: 80, yesterdayPrice: 80, unit: 'kg' },
    { name: 'Coconut', category: 'Fruit', price: 30, yesterdayPrice: 30, unit: 'piece' },
    { name: 'Sugarcane', category: 'Fruit', price: 20, yesterdayPrice: 20, unit: 'piece' },
    { name: 'Jujube (Ber)', category: 'Fruit', price: 60, yesterdayPrice: 60, unit: 'kg' },
    { name: 'Star Fruit', category: 'Fruit', price: 70, yesterdayPrice: 75, unit: 'kg' },

    // Pulses (15)
    { name: 'Tur Dal (Arhar)', category: 'Pulse', price: 150, yesterdayPrice: 148, unit: 'kg' },
    { name: 'Moong Dal', category: 'Pulse', price: 130, yesterdayPrice: 130, unit: 'kg' },
    { name: 'Urad Dal', category: 'Pulse', price: 140, yesterdayPrice: 142, unit: 'kg' },
    { name: 'Chana Dal', category: 'Pulse', price: 90, yesterdayPrice: 90, unit: 'kg' },
    { name: 'Masoor Dal', category: 'Pulse', price: 110, yesterdayPrice: 105, unit: 'kg' },
    { name: 'Kabuli Chana (Chickpeas)', category: 'Pulse', price: 120, yesterdayPrice: 120, unit: 'kg' },
    { name: 'Kala Chana (Black Chickpeas)', category: 'Pulse', price: 100, yesterdayPrice: 100, unit: 'kg' },
    { name: 'Rajma (Kidney Beans)', category: 'Pulse', price: 160, yesterdayPrice: 155, unit: 'kg' },
    { name: 'Lobia (Black-eyed Peas)', category: 'Pulse', price: 110, yesterdayPrice: 110, unit: 'kg' },
    { name: 'Green Moong (Whole)', category: 'Pulse', price: 120, yesterdayPrice: 125, unit: 'kg' },
    { name: 'Soya Bean', category: 'Pulse', price: 80, yesterdayPrice: 80, unit: 'kg' },
    { name: 'Horse Gram (Kulthi)', category: 'Pulse', price: 90, yesterdayPrice: 90, unit: 'kg' },
    { name: 'Moth Beans (Matki)', category: 'Pulse', price: 100, yesterdayPrice: 98, unit: 'kg' },
    { name: 'Cowpea', category: 'Pulse', price: 115, yesterdayPrice: 115, unit: 'kg' },
    { name: 'Yellow Peas (Vatana)', category: 'Pulse', price: 70, yesterdayPrice: 72, unit: 'kg' },

    // Grains & Paddy (15)
    { name: 'Basmati Rice', category: 'Paddy', price: 120, yesterdayPrice: 120, unit: 'kg' },
    { name: 'Sona Masoori Rice', category: 'Paddy', price: 60, yesterdayPrice: 58, unit: 'kg' },
    { name: 'Wheat', category: 'Grain', price: 30, yesterdayPrice: 30, unit: 'kg' },
    { name: 'Maize (Corn)', category: 'Grain', price: 25, yesterdayPrice: 26, unit: 'kg' },
    { name: 'Jowar (Sorghum)', category: 'Grain', price: 40, yesterdayPrice: 40, unit: 'kg' },
    { name: 'Bajra (Pearl Millet)', category: 'Grain', price: 35, yesterdayPrice: 35, unit: 'kg' },
    { name: 'Ragi (Finger Millet)', category: 'Grain', price: 45, yesterdayPrice: 48, unit: 'kg' },
    { name: 'Barley (Jau)', category: 'Grain', price: 40, yesterdayPrice: 40, unit: 'kg' },
    { name: 'Oats', category: 'Grain', price: 90, yesterdayPrice: 90, unit: 'kg' },
    { name: 'Quinoa', category: 'Grain', price: 300, yesterdayPrice: 290, unit: 'kg' },
    { name: 'Red Rice', category: 'Paddy', price: 80, yesterdayPrice: 80, unit: 'kg' },
    { name: 'Black Rice', category: 'Paddy', price: 150, yesterdayPrice: 150, unit: 'kg' },
    { name: 'Brown Rice', category: 'Paddy', price: 90, yesterdayPrice: 95, unit: 'kg' },
    { name: 'Foxtail Millet', category: 'Grain', price: 80, yesterdayPrice: 80, unit: 'kg' },
    { name: 'Kodo Millet', category: 'Grain', price: 70, yesterdayPrice: 70, unit: 'kg' },
    
    // Flowers (10+)
    { name: 'Rose', category: 'Flower', price: 80, yesterdayPrice: 75, unit: 'kg' },
    { name: 'Marigold', category: 'Flower', price: 50, yesterdayPrice: 55, unit: 'kg', discount: 'Festival offer' },
    { name: 'Jasmine', category: 'Flower', price: 200, yesterdayPrice: 200, unit: 'kg' },
    { name: 'Chrysanthemum', category: 'Flower', price: 100, yesterdayPrice: 110, unit: 'kg' },
    { name: 'Tuberose (Rajanigandha)', category: 'Flower', price: 150, yesterdayPrice: 150, unit: 'kg' },
    { name: 'Lily', category: 'Flower', price: 30, yesterdayPrice: 30, unit: 'stem' },
    { name: 'Gerbera', category: 'Flower', price: 15, yesterdayPrice: 12, unit: 'stem' },
    { name: 'Carnation', category: 'Flower', price: 20, yesterdayPrice: 20, unit: 'stem' },
    { name: 'Orchid', category: 'Flower', price: 50, yesterdayPrice: 50, unit: 'stem' },
    { name: 'Lotus', category: 'Flower', price: 25, yesterdayPrice: 25, unit: 'piece' },
    { name: 'Hibiscus', category: 'Flower', price: 5, yesterdayPrice: 5, unit: 'piece' },
];

const categoryIcons: Record<Category, React.ReactNode> = {
    Vegetable: <Carrot className="h-8 w-8 text-orange-500" />,
    Fruit: <Apple className="h-8 w-8 text-red-500" />,
    Pulse: <Grape className="h-8 w-8 text-purple-500" />, // No direct icon, using grape as placeholder
    Grain: <Wheat className="h-8 w-8 text-yellow-600" />,
    Paddy: <Wheat className="h-8 w-8 text-amber-500" />,
    Flower: <Flower2 className="h-8 w-8 text-pink-500" />,
};

const categories: Category[] = ['Vegetable', 'Fruit', 'Pulse', 'Grain', 'Paddy', 'Flower'];


export default function MarketplaceClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);

  const filteredCrops = useMemo(() => {
    return mockCrops.filter((crop) => {
        const matchesCategory = selectedCategory ? crop.category === selectedCategory : true;
        const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);
  
  const getPriceColor = (current: number, yesterday: number) => {
    if (current > yesterday) return 'text-red-600';
    if (current < yesterday) return 'text-green-600';
    return 'text-muted-foreground';
  };

  const getPriceIndicator = (current: number, yesterday: number) => {
    if (current > yesterday) return <ArrowUp className="h-4 w-4" />;
    if (current < yesterday) return <ArrowDown className="h-4 w-4" />;
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
            <div>
                <CardTitle>Community Marketplace</CardTitle>
                <CardDescription>
                    Browse over 100 types of fresh produce from local farmers or list your own harvest.
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                placeholder="Search for a crop..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Button variant={!selectedCategory ? 'default' : 'outline'} onClick={() => setSelectedCategory(null)} className="shrink-0">All</Button>
                {categories.map(category => (
                    <Button key={category} variant={selectedCategory === category ? 'default' : 'outline'} onClick={() => setSelectedCategory(category)} className="shrink-0">
                        {category}
                    </Button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredCrops.map((crop) => (
            <Card key={crop.name} className="overflow-hidden transition-all hover:shadow-lg flex flex-col">
                <CardHeader className="flex-row items-start gap-4 bg-muted/20 pb-4">
                {categoryIcons[crop.category]}
                <div>
                    <CardTitle className="text-lg">{crop.name}</CardTitle>
                    <Badge variant="outline">{crop.category}</Badge>
                </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                            <p className="text-sm text-muted-foreground">Current Price</p>
                            <p className="flex items-center text-2xl font-bold">
                                <IndianRupee className="mr-1 h-5 w-5" />
                                {crop.price}<span className="text-base font-normal text-muted-foreground">/{crop.unit}</span>
                            </p>
                        </div>
                        <div className={`flex items-center justify-between text-xs ${getPriceColor(crop.price, crop.yesterdayPrice)}`}>
                            <p>Yesterday: ₹{crop.yesterdayPrice}/{crop.unit}</p>
                            <div className="flex items-center font-semibold">
                                {getPriceIndicator(crop.price, crop.yesterdayPrice)}
                                {Math.abs(crop.price - crop.yesterdayPrice)}
                            </div>
                        </div>
                         {crop.discount && (
                            <div className="text-center">
                                <Badge variant="destructive" className="uppercase text-xs tracking-wider">{crop.discount}</Badge>
                            </div>
                        )}
                    </div>
                     <Button className="w-full mt-2">
                        Contact Seller
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="text-center py-16 col-span-full">
            <p className="text-xl font-semibold">No crops found</p>
            <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
        </div>
      )}
    </div>
  );
}

    