'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/utils/utlis';
import HammerIcon from 'public/icons/hammer.svg';
import StackIcon from 'public/icons/stack.svg';
import StarIcon from 'public/icons/starOutline.svg';
import UserIcon from 'public/icons/user.svg';
import ArrowIcon from 'public/icons/arrowDown.svg';
import Logo from 'public/logo.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/UI/DropdownMenu';

import { getUserWebToken } from '@/api/api';

const navItems = [
  {
    title: 'Auctions',
    href: '/',
    icon: <StackIcon className="w-[24px]" />,
    active: true,
  },
  {
    title: 'My Bids',
    href: '/my-bids',
    icon: <HammerIcon className="w-[24px]" />,
  },
  {
    title: 'Favorites',
    href: '/favorites',
    icon: <StarIcon className="w-[22px]" />,
  },
];

const Header = () => {
  const pathname = usePathname();

  const removeLangPrefix = (path: string) => {
    const segments = path.split('/');
    return segments.length > 2 ? `/${segments.slice(2).join('/')}` : '/';
  };

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
          return new Error(res?.error);
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
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 w-full flex items-center">
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-1">
            <Logo className="w-[111px]" />
          </Link>
        </div>
        <div className="grow flex justify-center">
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 text-sm hover:text-primary',
                  removeLangPrefix(pathname) === item.href &&
                    'text-primary font-medium'
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-1 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <div className="h-[38px] w-[38px] bg-neutral-100 flex items-center justify-center rounded-full">
                <UserIcon className="w-[24px]" />
              </div>
              <span className="text-sm">Lukas Fisher</span>
              <ArrowIcon className="w-[10px]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
