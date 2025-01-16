import { Category } from '@/enums';

export type Filters = {
  brand: string | null;
  location: string | null;
  sortBy: string | null;
  firstRegistration?: number[] | null;
  mileage?: number[];
};

export type Selections = {
  yearTo: string | null;
  yearFrom: string | null;
  mileageTo: string | null;
  mileageFrom: string | null;
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

export type BidList = {
  bid: number;
  bidAgent: number;
  createdAt: Date;
  username: string;
};

export type Auction = {
  id: string;
  title: string;
  details: Details;
  active: boolean;
  canceled?: boolean;
  bid?: number;
  bidList: BidList[];
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
  filters: {
    brands: string[];
  };
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
  cursor?: number;
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
