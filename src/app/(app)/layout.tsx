
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { CropLifecycleProvider } from '@/contexts/active-crop-context';


function AppLayoutClient({ children }: { children: React.ReactNode }) {
    const { translations } = useLanguage();

    const mainNavItems = [
        { href: '/dashboard', icon: Home, label: translations.nav.dashboard },
        { href: '/soil-analysis', icon: Sprout, label: translations.nav.soil_analysis },
        { href: '/crop-recommendation', icon: Leaf, label: translations.nav.crop_recs },
        { href: '/crop-planner', icon: Tangent, label: translations.nav.multi_crop_planner },
        { href: '/crop-dashboard', icon: Calendar, label: translations.nav.crop_lifecycle },
        { href: '/drone-hub', icon: Wind, label: translations.nav.drone_hub },
        { href: '/reports', icon: FileText, label: translations.nav.weekly_reports },
        { href: '/traceability', icon: ScanEye, label: translations.nav.traceability },
        { href: '/harvest', icon: CheckCircle, label: translations.nav.harvest },
        { href: '/marketplace', icon: ShoppingCart, label: translations.nav.marketplace },
        { href: '/analytics', icon: BarChart, label: translations.nav.analytics },
        { href: '/subsidies', icon: Bell, label: translations.nav.subsidies },
        { href: '/weather', icon: Thermometer, label: translations.nav.weather },
        { href: '/profile', icon: User, label: translations.nav.profile },
        { href: '/chat', icon: Bot, label: translations.nav.ai_assistant },
    ];

    const bottomNavItems = [
        { href: '/dashboard', icon: Home, label: translations.nav.home },
        { href: '/soil-analysis', icon: Sprout, label: translations.nav.soil },
        { href: '/marketplace', icon: ShoppingCart, label: translations.nav.market },
        { href: '/chat', icon: Bot, label: translations.nav.chat },
        { href: '/profile', icon: User, label: translations.nav.profile },
    ];

    return (
        <SidebarProvider>
            <div className="flex flex-row min-h-screen w-full bg-muted/40">
                <AppSidebar navItems={mainNavItems} />
                <div className="flex flex-col flex-1">
                    <AppHeader navItems={mainNavItems} />
                    <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 mb-16 sm:mb-0">
                        {children}
                    </main>
                </div>
            </div>
            <BottomNavBar navItems={bottomNavItems} />
        </SidebarProvider>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <CropLifecycleProvider>
                <AppLayoutClient>{children}</AppLayoutClient>
            </CropLifecycleProvider>
        </LanguageProvider>
    );
}


function AppHeader({ navItems }: { navItems: { href: string, icon: React.ElementType, label: string }[] }) {
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
                <SheetHeader>
                    <SheetTitle className="sr-only">Main Menu</SheetTitle>
                    <SheetDescription className="sr-only">Navigation links for the application.</SheetDescription>
                </SheetHeader>
                <nav className="grid gap-6 text-lg font-medium">
                    <Link
                    href="/dashboard"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                    <Icons.logo className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">AI Rythu Mitra</span>
                    </Link>
                    {navItems.map(item => (
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

function AppSidebar({ navItems }: { navItems: { href: string, icon: React.ElementType, label: string }[] }) {
  const pathname = usePathname();
  const { setOpen, isMobile } = useSidebar();
  
  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  }

  return (
    <Sidebar className="border-r h-full hidden sm:flex" collapsible="icon">
        <SidebarHeader>
            <Link href="/dashboard">
                <Icons.logo className="w-8 h-8 text-primary" />
            </Link>
        </SidebarHeader>
        <SidebarContent className="h-full group-data-[collapsible=icon]:overflow-hidden">
            <SidebarMenu>
                {navItems.map(item => (
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

function BottomNavBar({ navItems }: { navItems: { href: string, icon: React.ElementType, label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background sm:hidden">
      <div className="grid h-16 grid-cols-5 items-center justify-items-center">
        {navItems.map((item) => (
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
