import type { Metadata } from 'next';

import ReactQueryClientProvider from '@/contexts/QueryClientProvider';
import TranslationsProvider from '@/contexts/TranslationsProvider';
import SessionClientProvider from '@/contexts/SessionClientProvider';
import { FilterProvider } from '@/contexts/FilterContext';

import { MobileBanner } from '@/components/MobileBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { i18n } from '@/i18n/routing';
import { Locales } from '@/types/types';

import '@/styles/tailwind.css';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = (await params).locale;

  return (
    <html lang={locale}>
      <body>
        <ReactQueryClientProvider>
          <SessionClientProvider>
            <TranslationsProvider locale={locale as Locales}>
              <FilterProvider>
                <div className="min-h-screen bg-white">
                  <Header />
                  <main className="container mx-auto px-4 py-8">
                    {children}
                  </main>
                  <Footer />
                  <MobileBanner />
                </div>
              </FilterProvider>
            </TranslationsProvider>
          </SessionClientProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
