'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';

import { useFilters } from '@/contexts/FilterContext';
import { Auction } from '@/types/types';
import { getRunningAuctions, toggleFavorites } from '@/api/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { formatFilters } from '@/utils/utlis';
import { Category } from '@/enums';

const useCarAuction = () => {
  const { filters, sorting } = useFilters();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.accessToken;

  const getAuctionsList = ({ page = 0 }: { page?: number }) =>
    getRunningAuctions(
      {
        size: DEFAULT_PAGE_SIZE,
        category: Category.Running,
        filters: formatFilters(filters),
        order: sorting,
        cursor: page,
      },
      session?.accessToken
    );

  const {
    data: auctionsList,
    isLoading,
    refetch,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['auctionList', session?.accessToken, filters, sorting],
    queryFn: ({ pageParam = 0 }) =>
      isLoggedIn && getAuctionsList({ page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const totalPages =
        Math.ceil(
          lastPage.totals?.[`${Category.Running}`] / DEFAULT_PAGE_SIZE
        ) - 1;
      const nextPage =
        totalPages > lastPage.cursor ? lastPage.cursor + 1 : undefined;
      return nextPage;
    },
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: (id: string) =>
      toggleFavorites({ lotId: id }, session?.accessToken),
    onSuccess() {
      refetch();
    },
    onError(error) {
      return new Error(error.message);
    },
  });

  const onToggleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const auctions: Auction[] = useMemo(
    () =>
      auctionsList?.pages.reduce(
        (prev: any, cur: any) => [...prev, ...(cur?.content ?? [])],
        []
      ) ?? [],
    [auctionsList]
  );

  return {
    auctions,
    onToggleFavorite,
    refetch,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetching,
  };
};

export default useCarAuction;
