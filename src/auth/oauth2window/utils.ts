import { AuthWindowConfig } from './types';

export function toQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length },
    () => characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('');
}

export function getAuthWindowFeatures({ width, height, left, top }: AuthWindowConfig): string {
  return [
    'menubar=no',
    'location=no',
    'resizable=no',
    'scrollbars=no',
    'status=no',
    `width=${width}`,
    `height=${height}`,
    `top=${top}`,
    `left=${left}`
  ].join(', ');
} 