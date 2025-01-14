import { Button } from '@/components/UI/Button';
import { cn } from '@/utils/utlis';
import Link from 'next/link';

export type Tab = { name: string; value: string; info: string };

interface Props {
  tabs: Tab[];
  activeTab: string;
}

const Tabs = ({ tabs, activeTab }: Props) => {
  return (
    <div className="flex items-center gap-2 mb-5">
      {tabs.map((tab) => (
        <Link key={tab.value} href={tab.value}>
          <Button
            variant="primary"
            size="sm"
            className={cn(
              'font-normal hover:bg-neutral-tint',
              tab.value === activeTab &&
                'bg-neutral-tint text-primary font-semibold'
            )}
          >
            {tab.name}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default Tabs;
