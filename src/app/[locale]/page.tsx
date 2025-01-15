import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuctionList from '@/components/AuctionList.tsx/AuctionList';
import SearchFilters from '@/components/AuctionList.tsx/SearchFilters';
import { FilterProvider } from '@/contexts/FilterContext';
import { JSX } from 'react';
import StompClientProvider from '@/contexts/StompClientProvider';

const Home: () => JSX.Element = () => {
  return (
    <StompClientProvider>
      <FilterProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-medium mb-6">Auctions</h1>
            <SearchFilters />
            <AuctionList />
          </main>
          <Footer />
        </div>
      </FilterProvider>
    </StompClientProvider>
  );
};

export default Home;