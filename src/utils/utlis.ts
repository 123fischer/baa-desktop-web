import { DEFAULT_FILTERS } from '@/constants/constants';
import { Filters } from '@/types/types';
import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormatNumberOptions = {
  price?: boolean;
  hiddenFloat?: boolean;
  spaceBetween?: boolean;
  noDecimal?: boolean;
};

const customFormatNumber = (
  number: number,
  maximumFractionDigits?: number,
  thousandSeparator?: string
) => {
  let [integerPart] = number.toFixed(maximumFractionDigits).split('.');
  integerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator || "'"
  );
  return [integerPart].toString();
};

export const formatNumber = (
  number: number,
  options: FormatNumberOptions = {
    price: false,
    hiddenFloat: false,
    noDecimal: false,
  }
) => {
  const thousandSeparator = "'";
  if (!number && number !== 0) {
    return '';
  }

  const { hiddenFloat, price = false } = options;
  let result = customFormatNumber(number, 2, thousandSeparator);

  if (hiddenFloat) {
    result = customFormatNumber(number, 0, thousandSeparator) + '-';
  }
  if (price) {
    result = `${result}`;
  }

  return result;
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const removeLangPrefix = (path: string) => {
  const segments = path.split('/');
  return segments.length > 2 ? `/${segments.slice(2).join('/')}` : '/';
};

export const formatFilterOptions = (
  options: string[] | number[],
  key?: string
) =>
  options.map((el) => ({
    label:
      typeof el === 'number'
        ? key !== 'year'
          ? formatNumber(el, {
              noDecimal: key === 'mileage',
            })
          : el.toString()
        : el,
    value: el,
  }));

export const formatFilters = (_filters: Filters | null) => {
  const result: any = {};
  Object.assign(result, DEFAULT_FILTERS);
  if (_filters) {
    Object.entries(_filters)
      .filter(([_, value]) => !!value)
      .map(([key, value]) => {
        const FILTER_KEY = key;
        if (
          (FILTER_KEY === 'firstRegistration' || FILTER_KEY === 'mileage') &&
          typeof value !== 'string'
        ) {
          const arrValue = value?.map((el: any) => {
            return {
              key: `${el}`,
              value: el,
            };
          });
          Object.assign(result, {
            [`${FILTER_KEY}`]: arrValue,
          });
        } else {
          return Object.assign(result, {
            [`${FILTER_KEY}`]: [
              {
                key: `${value}`,
                value,
              },
            ],
          });
        }
      });
  }
  return result;
};

export const onCountDown = (auctionId: string, endsAt: Date) => {
  const now = dayjs();
  const duration = dayjs(endsAt).diff(now);
  if (duration <= 0) {
    return {
      id: auctionId,
      timeLeft: ``,
    };
  } else {
    const days = dayjs(endsAt).diff(now, 'days');
    const hours = dayjs(endsAt).diff(now, 'hours') % 24;
    const minutes = dayjs(endsAt).diff(now, 'minutes') % 60;
    const seconds = dayjs(endsAt).diff(now, 'seconds') % 60;
    return {
      id: auctionId,
      timeLeft: `-${days}-${hours}-${minutes}-${seconds}`,
    };
  }
};
