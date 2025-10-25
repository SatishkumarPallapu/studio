'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Bot,
  Sprout,
  Droplets,
  User,
  ShoppingCart,
  Wind,
  FileText,
  ScanEye,
  Tangent,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const bottomNavItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/soil-analysis', icon: Sprout, label: 'Soil' },
  { href: '/marketplace', icon: ShoppingCart, label: 'Market' },
  { href: '/moisture-monitor', icon: Droplets, label: 'IoT' },
  { href: '/profile', icon: User, label: 'Profile' },
];

const mainNavItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/soil-analysis', label: 'Soil Analysis' },
    { href: '/crop-recommendation', label: 'Crop Recommendation' },
    { href: '/crop-planner', label: 'Multi-Crop Planner' },
    { href: '/crop-dashboard', label: 'Crop Lifecycle' },
    { href: '/drone-hub', label: 'Drone Hub'},
    { href: '/reports', label: 'Weekly Reports'},
    { href: '/traceability', label: 'Traceability'},
    { href: '/harvest', label: 'Harvest' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/subsidies', label: 'Subsidies' },
    { href: '/weather', label: 'Weather' },
    { href: '/profile', label: 'Profile' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppHeader />
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 mb-16">
            {children}
        </main>
        <BottomNavBar />
        </div>
    </LanguageProvider>
  );
}

function AppHeader() {
  const pathname = usePathname();
  const { language, setLanguage, translations } = useLanguage();
  const currentNavItem = mainNavItems.find(item => pathname.startsWith(item.href));
  const title = currentNavItem ? currentNavItem.label : 'AI Rythu Mitra';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <Icons.logo className="h-6 w-6" />
        <span className="">AI Rythu Mitra</span>
      </Link>
      
      <div className="flex items-center gap-4">
        <Select onValueChange={setLanguage} defaultValue={language}>
            <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
            </SelectContent>
        </Select>
        <div className="relative flex-1 md:grow-0">
            <h1 className="font-semibold text-xl font-headline hidden sm:block">{title}</h1>
        </div>
      </div>
    </header>
  );
}


function BottomNavBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background sm:hidden">
      <div className="grid h-16 grid-cols-5 items-center justify-items-center">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-xs transition-colors ${
              pathname.startsWith(item.href)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
