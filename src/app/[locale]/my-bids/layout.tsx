'use client';

import Tabs, { Tab } from '@/components/Filters/Tabs';
import { removeLangPrefix } from '@/utils/utlis';
import { usePathname } from 'next/navigation';

const tabs: Tab[] = [
  {
    name: 'Running',
    value: '/my-bids/running',
    info: 'Auctions you have bid on that are still running of for which you have received a counter offer.',
  },
  {
    name: 'Pending',
    value: '/my-bids/pending',
    info: 'Auctions you have bid on  with the highest bid, and are waiting for the seller to make a decision.',
  },
  {
    name: 'Won',
    value: '/my-bids/won',
    info: 'Auctions you have bid on and won.',
  },
  {
    name: 'Lost',
    value: '/my-bids/lost',
    info: 'Auctions you have bid on but haven’t won, where seller rejected your offer or you rejected a counter offer.',
  },
  {
    name: 'Counter offers',
    value: '/my-bids/counter-offers',
    info: 'Counter-offers that  you can still accept or reject.',
  },
];

export default function MyBidsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const activeTabPathname = removeLangPrefix(pathname);

  return (
    <>
      <h1 className="text-2xl font-medium mb-6">My Bids</h1>
      <Tabs tabs={tabs} activeTab={activeTabPathname} />
      <p className="mb-8 text-sm text-dark opacity-70">
        {tabs.find((tab) => tab.value === activeTabPathname)?.info}
      </p>
      {children}
    </>
  );
}
