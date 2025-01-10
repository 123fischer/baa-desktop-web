'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Gavel, Heart, Hammer } from 'lucide-react';

import { cn } from '@/utils/utlis';
import { getUserWebToken } from '@/api/api';


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
  const router = useRouter();

  const signInWithCustomToken = async () => {
    try {
      const customToken = await getUserWebToken();

      if (customToken) {
        const res = await signIn('credentials', {
          redirect: false,
          token: customToken.token,
        });
        if (res?.error) {
          return;
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {}
  };

  // will be removed upon auth flow implementation

  useEffect(() => {
    signInWithCustomToken();
  }, []);

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
