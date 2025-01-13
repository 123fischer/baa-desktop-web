import { Auction, Filters } from '@/types/types';
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
export type SingleFilterOptions = { label: string; value: any }[];

export type FilterOptions = {
  brands: SingleFilterOptions;
  years: SingleFilterOptions;
  mileages: SingleFilterOptions;
  locations: SingleFilterOptions;
};

