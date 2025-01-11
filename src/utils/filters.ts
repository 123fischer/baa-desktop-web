import { CarAuction, Filters } from '@/types/types';
import { mockAuctions } from './mock';

type FilterKey = keyof Pick<
  CarAuction,
  'year' | 'mileage' | 'location' | 'brand'
>;

export const getUniqueValues = (key: FilterKey): string[] => {
  return Array.from(
    new Set(
      mockAuctions.map((auction) => {
        const value = auction[key];
        return typeof value === 'number' ? String(value) : value;
      })
    )
  ).sort();
};

export const filterAuctions = (
  auctions: CarAuction[],
  filters: Filters
): CarAuction[] => {
  let filtered = auctions.filter((auction) => {
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim().toLowerCase();
      const brand = auction.brand.toLowerCase();
      const model = auction.model.toLowerCase();

      // Check if search term matches either brand or model
      const matchesBrand = brand.includes(searchTerm);
      const matchesModel = model.includes(searchTerm);

      // Also check if search term matches "brand model" combined
      const fullName = `${brand} ${model}`;
      const matchesFullName = fullName.includes(searchTerm);

      if (!matchesBrand && !matchesModel && !matchesFullName) {
        return false;
      }
    }

    if (
      filters.make &&
      filters.make !== 'all' &&
      auction.brand !== filters.make
    ) {
      return false;
    }

    if (
      filters.year &&
      filters.year !== 'all' &&
      String(auction.year) !== filters.year
    ) {
      return false;
    }

    if (filters.mileage && filters.mileage !== 'all') {
      const auctionMiles = parseInt(auction.mileage.replace(/[^0-9]/g, ''));
      const filterMiles = parseInt(filters.mileage);
      if (auctionMiles > filterMiles) {
        return false;
      }
    }

    if (
      filters.location &&
      filters.location !== 'all' &&
      auction.location.toLowerCase() !== filters.location.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  if (filters.sortBy && filters.sortBy !== 'all') {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.currentBid - b.currentBid;
        case 'price-desc':
          return b.currentBid - a.currentBid;
        case 'year-desc':
          return b.year - a.year;
        case 'year-asc':
          return a.year - b.year;
        default:
          return 0;
      }
    });
  }

  return filtered;
};
