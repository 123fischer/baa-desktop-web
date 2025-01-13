'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useFilters } from '@/contexts/FilterContext';
import { useDebounce } from './useDebounce';
import { Auction, Filters } from '@/types/types';
import { getRunningAuctions, toggleFavorites } from '@/api/api';
import { DEFAULT_FILTERS, DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { Category, SortState } from '@/enums';
import { FilterOptions } from '@/types/filters';

const INITIAL_FILTER_OPTIONS = {
  brands: [],
  years: [],
  mileages: [],
  locations: [],
};

const formatFilterOptions = (_options: string[] | number[], key?: string) =>
  _options
    ?.filter((el) => {
      return el !== null;
    })
    ?.map((el) => {
      return {
        label: typeof el === 'number' ? el.toString() : el,
        value: el,
      };
    });

const formatFilters = (_filters: Filters | null) => {
  const result: any = {};
  Object.assign(result, DEFAULT_FILTERS);
  if (_filters) {
    Object.entries(_filters)
      .filter(([key, value]) => !!value)
      .map(([key, value]) => {
        const FILTER_KEY = key === 'year' ? 'firstRegistration' : key;
        if (FILTER_KEY === 'firstRegistration' || FILTER_KEY === 'mileage') {
          result[FILTER_KEY] = [
            {
              key: `${value}`,
              value: value,
            },
            result[FILTER_KEY][1],
          ];
        } else {
          return Object.assign(result, {
            [`${FILTER_KEY}`]: [
              {
                key: `${value}`,
                value,
              },
            ],
          });
        }
      });
  }
  return result;
};

const useCarAuction = () => {
  const [allAuctions, setAllAuctions] = useState<Auction[]>([]);
  const { filters } = useFilters();
  const { data: session } = useSession();
  const [options, setOptions] = useState<FilterOptions>(INITIAL_FILTER_OPTIONS);

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
    refetch,
  } = useQuery({
    queryKey: ['auctionList', session?.accessToken, filters],
    queryFn: () => {
      return (
        isLoggedIn &&
        getRunningAuctions(
          {
            size: DEFAULT_PAGE_SIZE,
            category: Category.Running,
            filters: formatFilters(filters),
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
      setOptions({
        brands: formatFilterOptions(auctionsList?.filters?.brands, 'brand'),
        locations: formatFilterOptions(
          auctionsList?.filters?.locations,
          'location'
        ),
        mileages: formatFilterOptions(
          auctionsList?.filters?.mileages,
          'mileage'
        ),
        years: formatFilterOptions(
          auctionsList?.filters?.firstRegistrations,
          'year'
        ),
      });
    }
  }, [auctionsList]);

  useEffect(() => {
    formatFilters(filters);
  }, [filters]);

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: (id: string) =>
      toggleFavorites({ lotId: id }, session?.accessToken),
    onSuccess(_, id) {
      setAllAuctions((auctions) =>
        auctions.map((auction) =>
          auction.id === id
            ? { ...auction, isFavorite: !auction.isFavorite }
            : auction
        )
      );
    },
    onError(error) {
      return new Error(error.message);
    },
  });

  const onToggleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  return {
    auctions: allAuctions,
    filterOptions: options,
    onToggleFavorite,
    refetch,
  };
};

export default useCarAuction;
