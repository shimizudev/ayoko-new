import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MONTH_INDEX_OFFSET } from './constants';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getSeason(month: number): string {
  if (month >= 3 && month <= 5) {
    return 'SPRING';
  }
  if (month >= 6 && month <= 8) {
    return 'SUMMER';
  }
  return month >= 9 && month <= 11 ? 'FALL' : 'WINTER';
}

export function getMonthName(monthNumber: number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const adjustedMonthNumber = monthNumber - MONTH_INDEX_OFFSET;

  if (adjustedMonthNumber < 0 || adjustedMonthNumber >= months.length) {
    return 'Invalid month number';
  }

  return months[adjustedMonthNumber];
}
