'use client';

import { useState, useMemo } from 'react';
import { useFilters } from '@/contexts/FilterContext';
import { filterAuctions } from '@/utils/filters';
import { Auction } from '@/types/types';
import { useDebounce } from './useDebounce';
import { mockAuctions } from '@/utils/mock';

const useCarAuction = () => {
  const [allAuctions, setAllAuctions] = useState<Auction[]>(mockAuctions);
  const { filters } = useFilters();

  // Debounce the search filter to prevent too many re-renders
  const debouncedFilters = {
    ...filters,
    search: useDebounce(filters.search, 300),
  };

  const toggleFavorite = (id: string) => {
    setAllAuctions((auctions) =>
      auctions.map((auction) =>
        auction.id === id
          ? { ...auction, isFavorite: !auction.isFavorite }
          : auction
      )
    );
  };

  const filteredAuctions = useMemo(() => {
    return filterAuctions(allAuctions, debouncedFilters);
  }, [allAuctions, debouncedFilters]);

  return {
    auctions: filteredAuctions,
    toggleFavorite,
  };
};

export default useCarAuction;
