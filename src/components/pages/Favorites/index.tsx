'use client';

import useCarAuction from '@/hooks/useCarAuction';
import Row from '@/components/AuctionTable/Row';
import Pagination from '@/components/AuctionTable/Pagination';
import Header from '@/components/AuctionTable/Header';
import NoResults from '@/components/AuctionTable/NoResults';
import SearchFilters from '@/components/Filters/SearchFilters';

const Favorites = () => {
  const { auctions, toggleFavorite } = useCarAuction();

  if (auctions.length === 0) {
    return <NoResults />;
  }

  return (
    <>
      <h1 className="text-2xl font-medium mb-6">Favorites</h1>
      <SearchFilters auctionsLength={auctions.length} />
      <table className="table-auto w-full">
        <Header />
        <tbody>
          {auctions.map((auction) => (
            <Row
              key={auction.id}
              auction={auction}
              buttons={[
                {
                  name: 'Place bid',
                  onClick: () => {},
                },
              ]}
              onFavouriteClick={toggleFavorite}
            />
          ))}
        </tbody>
      </table>
      <Pagination pages={5} activePage={1} />
    </>
  );
};

export default Favorites;
