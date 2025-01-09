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

export const mockAuctions: CarAuction[] = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300&h=200',
    brand: 'honda',
    model: 'civic',
    year: 2023,
    mileage: '12,157 miles',
    location: 'Vaud',
    currentBid: 28500,
    timeLeft: '1d 1h 29m 17s',
    isFavorite: false,
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300&h=200',
    brand: 'mercedes',
    model: 'c-class',
    year: 2024,
    mileage: '5,892 miles',
    location: 'Zurich',
    currentBid: 52000,
    timeLeft: '2d 3h 45m 30s',
    isFavorite: true,
  },
  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=300&h=200',
    brand: 'porsche',
    model: '911',
    year: 2023,
    mileage: '8,234 miles',
    location: 'Geneva',
    currentBid: 125000,
    timeLeft: '12h 15m 45s',
    isFavorite: false,
  },
  {
    id: '4',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=300&h=200',
    brand: 'bmw',
    model: '3-series',
    year: 2023,
    mileage: '15,234 miles',
    location: 'Bern',
    currentBid: 45000,
    timeLeft: '3d 8h 20m 15s',
    isFavorite: false,
  },
  {
    id: '5',
    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=300&h=200',
    brand: 'audi',
    model: 'rs6',
    year: 2024,
    mileage: '3,157 miles',
    location: 'Zurich',
    currentBid: 89000,
    timeLeft: '1d 15h 40m 22s',
    isFavorite: true,
  },
  {
    id: '6',
    image:
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=300&h=200',
    brand: 'volkswagen',
    model: 'golf',
    year: 2023,
    mileage: '22,345 miles',
    location: 'Vaud',
    currentBid: 32500,
    timeLeft: '2d 4h 15m 30s',
    isFavorite: false,
  },
];
