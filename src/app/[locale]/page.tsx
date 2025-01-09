import type { NextPage } from 'next';
import { Logo, MainNav, UserNav } from '@/components';
import AuctionList from '@/components/AuctionList.tsx/AuctionList';
import SearchFilters from '@/components/SearchFilters';
import { FilterProvider } from '@/contexts/FilterContext';

const Home: NextPage = () => {
  return (
    <FilterProvider>
      <div className="min-h-screen bg-white">
        <header className="border-b">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <div className="flex-1">
              <Logo />
            </div>
            <div className="flex-1 flex justify-center">
              <MainNav />
            </div>
            <div className="flex-1 flex justify-end">
              <UserNav username="Lukas Fisher" />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-6">Auctions</h1>
          <SearchFilters />
          <AuctionList />
        </main>

        <footer className="border-t py-6">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm text-gray-600">
            <p>© Copyright 2004 - 2024 CARAUKTION AG</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-900">
                Documentation
              </a>
              <a href="#" className="hover:text-gray-900">
                Help
              </a>
            </div>
          </div>
        </footer>
      </div>
    </FilterProvider>
  );
};

export default Home;
