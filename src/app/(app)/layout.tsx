
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Bot,
  Sprout,
  User,
  ShoppingCart,
  Wind,
  FileText,
  ScanEye,
  Tangent,
  Leaf,
  BarChart,
  Calendar,
  CheckCircle,
  Thermometer,
  Bell,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';

const bottomNavItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/soil-analysis', icon: Sprout, label: 'Soil' },
    { href: '/marketplace', icon: ShoppingCart, label: 'Market' },
    { href: '/chat', icon: Bot, label: 'Chat' },
    { href: '/profile', icon: User, label: 'Profile' },
];

const mainNavItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/soil-analysis', icon: Sprout, label: 'Soil Analysis' },
    { href: '/crop-recommendation', icon: Leaf, label: 'Crop Recs' },
    { href: '/crop-planner', icon: Tangent, label: 'Multi-Crop Planner' },
    { href: '/crop-dashboard', icon: Calendar, label: 'Crop Lifecycle' },
    { href: '/drone-hub', icon: Wind, label: 'Drone Hub'},
    { href: '/reports', icon: FileText, label: 'Weekly Reports'},
    { href: '/traceability', icon: ScanEye, label: 'Traceability'},
    { href: '/harvest', icon: CheckCircle, label: 'Harvest' },
    { href: '/marketplace', icon: ShoppingCart, label: 'Marketplace' },
    { href: '/analytics', icon: BarChart, label: 'Analytics' },
    { href: '/subsidies', icon: Bell, label: 'Subsidies' },
    { href: '/weather', icon: Thermometer, label: 'Weather' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/chat', icon: Bot, label: 'AI Assistant' },
];


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <AppSidebar />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <AppHeader />
            <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 mb-16 sm:mb-0">
                {children}
            </main>
          </div>
          <BottomNavBar />
        </div>
      </SidebarProvider>
    </LanguageProvider>
  );
}

function AppHeader() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <div className="sm:hidden">
        <Sheet>
            <SheetTrigger asChild>
            <Button size="icon" variant="outline">
                <Home className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
                <Link
                href="/dashboard"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                <Icons.logo className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">AI Rythu Mitra</span>
                </Link>
                {mainNavItems.map(item => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            </SheetContent>
        </Sheet>
       </div>
      
      <div className="hidden sm:block">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Select onValueChange={setLanguage as (value: string) => void} defaultValue={language}>
            <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
            </SelectContent>
        </Select>
      </div>
    </header>
  );
}

function AppSidebar() {
  const pathname = usePathname();
  const { setOpen, isMobile } = useSidebar();
  
  const handleLinkClick = () => {
    if (!isMobile) {
      setOpen(false);
    }
  }

  return (
    <Sidebar className="border-r h-full" collapsible="icon">
        <SidebarHeader>
            <Link href="/dashboard">
                <Icons.logo className="w-8 h-8 text-primary" />
            </Link>
        </SidebarHeader>
        <SidebarContent className="group-data-[collapsible=icon]:overflow-hidden">
            <SidebarMenu>
                {mainNavItems.map(item => (
                    <SidebarMenuItem key={item.href}>
                         <Link href={item.href} onClick={handleLinkClick}>
                            <SidebarMenuButton
                                tooltip={{children: item.label}}
                                isActive={pathname.startsWith(item.href)}
                            >
                                <item.icon/>
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>
    </Sidebar>
  )
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
