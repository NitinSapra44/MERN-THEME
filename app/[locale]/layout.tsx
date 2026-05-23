import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, Locale } from '@/lib/i18n/routing';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import PageViewTracker from '@/components/PageViewTracker';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <PageViewTracker />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteNavbar locale={locale} />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <SiteFooter locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
