export const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === 'production';

export const DEFAULT_PAGE_SIZE = 20;
export const BID_INCREMENT = 100;

export const DEFAULT_FILTERS = {
  firstRegistration: [
    { key: '1970', value: 1970 },
    { key: '2025', value: 2025 },
  ],
  desiredPrice: [
    { key: '0', value: 0 },
    { key: '999999', value: 999999 },
  ],
  mileage: [
    { key: '0', value: 0 },
    { key: '999999', value: 999999 },
  ],
  owner: [
    { key: 'private', value: true },
    { key: 'dealer', value: true },
  ],
};
