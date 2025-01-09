import type { Metadata } from 'next';
import { ReactQueryClientProvider } from '@/contexts/QueryClientProvider';
import TranslationsProvider from '@/contexts/TranslationspRrovider';
import { i18n } from '@/i18n/routing';
import '@/styles/tailwind.css';
import { Locales } from '@/types/types';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
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
          <TranslationsProvider locale={locale as Locales}>
            {children}
          </TranslationsProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}