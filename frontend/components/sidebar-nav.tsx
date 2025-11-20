'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: Icons.Dashboard },
  { title: 'Guest Manager', href: '/guests', icon: Icons.Guests },
  { title: 'Theme Assistant', href: '/themes', icon: Icons.ThemeAssistant },
  { title: 'Game Suggestions', href: '/games', icon: Icons.Games },
  { title: 'Thank You Helper', href: '/thank-you-notes', icon: Icons.ThankYouHelper },
  { title: 'Checklist', href: '/checklist', icon: Icons.Checklist },
  { title: 'Budget Tracker', href: '/budget', icon: Icons.Budget },
  { title: 'Registry Links', href: '/registry', icon: Icons.Registry },
  { title: 'Photo Gallery', href: '/gallery', icon: Icons.Gallery },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-secondary"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}

