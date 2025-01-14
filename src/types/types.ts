export type Filters = {
  search: string | undefined;
  make: string | undefined;
  year: string | undefined;
  mileage: string | undefined;
  location: string | undefined;
  sortBy: string | undefined;
};

export interface Auction {
  id: string;
  image: string;
  brand: any;
  model: any;
  year: number;
  mileage: string;
  location: string;
  currentBid: number;
  timeLeft: string;
  isFavorite: boolean;
}

export type Locales = 'de' | 'en' | 'fr' | 'it';
