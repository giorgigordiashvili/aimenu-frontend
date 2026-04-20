import '@pigment-css/react/styles.css';
import '../globals.css';

import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Georgian } from 'next/font/google';
import { notFound } from 'next/navigation';

import ClarityProvider from '@/components/ClarityProvider';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LocaleProvider } from '@/context/LocaleContext';
import { TableProvider } from '@/context/TableContext';
import { locales, Locale, isValidLocale } from '@/i18n/config';
import '@/lib/axiosInterceptor';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-georgian',
});

export const metadata: Metadata = {
  title: 'AiMenu - Restaurant Menu',
  description: 'Digital menu for restaurants',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${inter.variable} ${notoSansGeorgian.variable}`}>
      <head>
        {/* Preconnect to the API origin and image CDN so the first
            restaurant-detail fetch + hero image don't pay a full TLS
            handshake on slow 3G connections. Saves ~600–900ms per origin
            per Lighthouse measurements. */}
        <link rel='preconnect' href='https://admin.aimenu.ge' crossOrigin='anonymous' />
        <link rel='dns-prefetch' href='https://admin.aimenu.ge' />
        <link
          rel='preconnect'
          href='https://restaurant-media.fra1.digitaloceanspaces.com'
          crossOrigin='anonymous'
        />
        <link rel='dns-prefetch' href='https://restaurant-media.fra1.digitaloceanspaces.com' />
      </head>
      <body>
        <ClarityProvider />

        <AuthProvider>
          <LocaleProvider locale={locale as Locale}>
            <TableProvider>
              <CartProvider>{children}</CartProvider>
            </TableProvider>
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
