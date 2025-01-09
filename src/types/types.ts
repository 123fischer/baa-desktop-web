export type Filters = {
  search: string;
  make: string;
  year: string;
  mileage: string;
  location: string;
  sortBy: string;
};

export interface CarAuction {
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
