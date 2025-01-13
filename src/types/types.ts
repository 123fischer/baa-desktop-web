import { Category } from '@/enums';

export type Filters = {
  brand: string | null;
  year: string | null;
  location: string | null;
  mileage: string | null;
  search: string | null;
  sortBy: string | null;
};

export type Details = {
  bodyType: string;
  displacement: number;
  firstRegistration: string;
  availableFrom: string;
  fuel: string;
  gear: string;
  mileage: number;
  seats: string;
  wheelDrive: string;
  interiorColor: string;
  interiorType: string;
  exteriorColor: string;
  exteriorType: string;
  desiredPrice: number;
  location: string;
};

export type Auction = {
  id: string;
  title: string;
  details: Details;
  active: boolean;
  canceled?: boolean;
  bid?: number;
  bidList: any[];
  createdAt: Date;
  scheduledAt?: Date;
  endsAt: Date;
  lastBidPlacedAt?: Date;
  articleId: string;
  images: string[];
  seller: string;
  brand: string;
  extendedBy?: number;
  isPrivateSeller: boolean;
  isHighestBid: boolean;
  isFavorite: boolean;
};

export type AuctionList = {
  content: Auction[];
  filters: Filters;
  totals: {
    favorite: number;
    running: number;
    scheduled: number;
  };
};

export type FilterElement = {
  key: string;
  value: any;
};

export type RunningAuctionBody = {
  order: string;
  category: Category;
  size: number;
  filters: {
    brand?: FilterElement[];
    location?: FilterElement[];
    fuel?: FilterElement[];
    gear?: FilterElement[];
    bodyType?: FilterElement[];
    firstRegistration?: FilterElement[];
    desiredPrice?: FilterElement[];
    mileage?: FilterElement[];
    owner: FilterElement[];
  };
};

export type Locales = 'de' | 'en' | 'fr' | 'it';
