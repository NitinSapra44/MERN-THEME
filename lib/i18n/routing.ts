import { defineRouting } from 'next-intl/routing';

export const locales = [
  'en', 'ur', 'ar', 'fr', 'es', 'de', 'it', 'ru',
  'vn', 'bd', 'in', 'id', 'jp', 'my', 'br', 'te',
  'ta', 'th', 'tr', 'ph', 'pa'
] as const;

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed', // English has no prefix: / , others: /ur/, /ar/
  localeDetection: false,    // prevent middleware from redirecting based on browser Accept-Language
});
