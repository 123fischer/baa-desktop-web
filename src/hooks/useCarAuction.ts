'use client';

import { useState, useEffect } from 'react';
import { useFilters } from '@/contexts/FilterContext';
import { Auction } from '@/types/types';
import { useDebounce } from './useDebounce';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getRunningAuctions } from '@/api/api';
import { DEFAULT_FILTERS, DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { Category, SortState } from '@/enums';



const useCarAuction = () => {
  const [allAuctions, setAllAuctions] = useState<Auction[]>([]);
  const { filters, updateFilter } = useFilters();
  const { data: session, status: sessionStatus } = useSession();

  const isLoggedIn = !!session?.accessToken;

  // Debounce the search filter to prevent too many re-renders
  const debouncedFilters = {
    ...filters,
    search: useDebounce(filters?.search, 300),
  };

  const {
    data: auctionsList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auctionList', session?.accessToken],
    queryFn: () => {
      return (
        isLoggedIn &&
        getRunningAuctions(
          {
            size: DEFAULT_PAGE_SIZE,
            category: Category.Running,
            filters: DEFAULT_FILTERS,
            order: SortState.Desc,
          },
          session.accessToken
        )
      );
    },
  });

  useEffect(() => {
    if (auctionsList) {
      setAllAuctions(auctionsList?.content);
    }
  }, [auctionsList]);

  const toggleFavorite = (id: string) => {
    setAllAuctions((auctions) =>
      auctions.map((auction) =>
        auction.id === id
          ? { ...auction, isFavorite: !auction.isFavorite }
          : auction
      )
    );
  };

  // const filteredAuctions = useMemo(() => {
  //   return filterAuctions(allAuctions, debouncedFilters);
  // }, [allAuctions, debouncedFilters]);

  return {
    auctions: allAuctions,
    toggleFavorite,
  };
};

export default useCarAuction;
