import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function getDayOfWeek(date: number | Date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(date));
}

export function formatDateCaps(date: number | Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date)).toUpperCase();
}

export function formatTime(date: Date | string | number) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
