import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
