import { notFound } from 'next/navigation';

export const locales = ['ru', 'en', 'kz'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

export default async function getRequestConfig({ locale }: { locale: string }) {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
}
