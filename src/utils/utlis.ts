import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(nmm: number) {
  return nmm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const removeLangPrefix = (path: string) => {
  const segments = path.split('/');
  return segments.length > 2 ? `/${segments.slice(2).join('/')}` : '/';
};
