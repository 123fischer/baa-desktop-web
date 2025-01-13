export type Filters = {
  bodyTypes: string[] | null;
  brands: string[] | null;
  desiredPrices: number[] | null;
  firstRegistrations: number[] | null;
  fuels: string[] | null;
  locations: string[] | null;
  mileage: string[] | null;
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

export type Locales = 'de' | 'en' | 'fr' | 'it';
