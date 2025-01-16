'use client';

import useCarAuction from '@/hooks/useCarAuction';
import Row from '@/components/AuctionTable/Row';
import Pagination from '@/components/AuctionTable/Pagination';
import Header from '@/components/AuctionTable/Header';
import NoResults from '@/components/AuctionTable/NoResults';
import SearchFilters from '@/components/Filters/SearchFilters';

const Lost = () => {
  const { auctions, onToggleFavorite } = useCarAuction();

  if (auctions.length === 0) {
    return <NoResults />;
  }

  return (
    <>
      <SearchFilters auctionsLength={auctions.length} />
      <table className="table-auto w-full">
        <Header />
        <tbody>
          {auctions.map((auction) => (
            <Row
              key={auction.id}
              auction={auction}
              onFavouriteClick={onToggleFavorite}
            />
          ))}
        </tbody>
      </table>
      <Pagination pages={5} activePage={1} />
    </>
  );
};

export default Lost;
