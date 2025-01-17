import dayjs from 'dayjs';

export const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === 'production';

export const DEFAULT_PAGE_SIZE = 20;
export const BID_INCREMENT = 100;
export const USERNAME = 'testMAA';

export const DEFAULT_FILTERS = {
  owner: [
    { key: 'private', value: true },
    { key: 'dealer', value: true },
  ],
};

const CURRENT_YEAR = parseInt(dayjs().format('YYYY'));

export const DEFAULT_YEARS_OPTIONS: number[] = Array.from(
  { length: Math.floor(CURRENT_YEAR - 1970) + 1 },
  (_, index) => index + 1970
);

export const DEFAULT_MILEAGES_OPTIONS: number[] = Array.from(
  { length: Math.floor(999999 / 5000) + 1 },
  (_, index) => index * 5000
)?.concat(999999);
