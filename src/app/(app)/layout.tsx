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
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const bottomNavItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/soil-analysis', icon: Sprout, label: 'Soil' },
  { href: '/chat', icon: Bot, label: 'AI' },
  { href: '/moisture-monitor', icon: Droplets, label: 'IoT' },
  { href: '/profile', icon: User, label: 'Profile' },
];

const mainNavItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/soil-analysis', label: 'Soil Analysis' },
    { href: '/crop-recommendation', label: 'Crop Recommendation' },
    { href: '/crop-dashboard', label: 'Crop Lifecycle' },
    { href: '/harvest', label: 'Harvest' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/subsidies', label: 'Subsidies' },
    { href: '/weather', label: 'Weather' },
    { href: '/profile', label: 'Profile' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AppHeader />
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 mb-16">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
}

function AppHeader() {
  const pathname = usePathname();
  const currentNavItem = mainNavItems.find(item => pathname.startsWith(item.href));
  const title = currentNavItem ? currentNavItem.label : 'AI Rythu Mitra';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <Icons.logo className="h-6 w-6" />
        <span className="">AI Rythu Mitra</span>
      </Link>

      <div className="relative flex-1 md:grow-0">
        <h1 className="font-semibold text-xl font-headline hidden sm:block">{title}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/avatar/32/32" alt="@user" />
              <AvatarFallback>FM</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
