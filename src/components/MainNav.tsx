'use client';

import Link from "next/link";
import { cn } from '@/utils/utlis';
import { Gavel, Heart, Hammer } from 'lucide-react';

const navItems = [
  {
    title: 'Auctions',
    href: '/',
    icon: Gavel,
    active: true,
  },
  {
    title: 'My Bids',
    href: '/my-bids',
    icon: Hammer,
    color: 'text-red-600',
  },
  {
    title: 'Favorites',
    href: '/favorites',
    icon: Heart,
  },
];

const MainNav = () => {
  return (
    <nav className="flex items-center space-x-8">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-2 text-sm font-medium transition-colors hover:text-red-600',
            item.active ? 'text-red-600' : 'text-gray-600',
            item.color
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
