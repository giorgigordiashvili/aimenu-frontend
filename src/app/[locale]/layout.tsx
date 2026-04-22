import '@pigment-css/react/styles.css';
import '../globals.css';

import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Georgian } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ClarityProvider from '@/components/ClarityProvider';
import CookieConsent from '@/components/CookieConsent';
import TopProgressBar from '@/components/TopProgressBar';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LocaleProvider } from '@/context/LocaleContext';
import { TableProvider } from '@/context/TableContext';
import { locales, Locale, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import '@/lib/axiosInterceptor';
import { languageAlternates, localeUrl, SITE_NAME, SITE_URL } from '@/lib/seo';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Lines up the mobile browser chrome with the hero's dark background
  // + the rose accent we use on CTAs.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172b' },
  ],
};

// Per-locale root metadata. Page-level `generateMetadata` further
// specialises title/description/OG images per route.
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isValidLocale(locale) ? locale : 'ka';
  const t = getDictionary(loc);
  const siteDescription =
    (t as unknown as { seo?: { siteDescription?: string } }).seo?.siteDescription ??
    'Discover and book Georgia\u2019s best restaurants. Browse menus, reserve a table, order from your phone.';
  const titleDefault =
    (t as unknown as { seo?: { siteTitle?: string } }).seo?.siteTitle ??
    'aimenu.ge \u2014 restaurants, menus, reservations';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: titleDefault,
      template: `%s \u2014 ${SITE_NAME}`,
    },
    description: siteDescription,
    applicationName: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [{ url: '/favicon.ico' }, { url: '/logo.png', type: 'image/png' }],
      // No dedicated 180x180 apple-touch-icon yet — reuse logo.png so iOS
      // home-screen install shows a brand mark instead of a screenshot.
      apple: [{ url: '/logo.png', sizes: '512x512', type: 'image/png' }],
      shortcut: '/logo.png',
    },
    alternates: {
      canonical: localeUrl(loc, '/'),
      languages: languageAlternates('/'),
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: loc,
      url: localeUrl(loc, '/'),
      title: titleDefault,
      description: siteDescription,
      // Branded social-card placeholder. Drop a 1200×630 designed asset
      // into /public/og-default.png later — when it exists Next will
      // serve it from the same path; until then we fall back to the
      // logo so previews aren't broken.
      images: [{ url: '/logo.png', width: 512, height: 512, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleDefault,
      description: siteDescription,
      images: ['/logo.png'],
    },
    robots: { index: true, follow: true },
  };
}

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

        {/* Thin rose progress bar at the very top during every client
            navigation. Wrapped in <Suspense> because it reads
            useSearchParams(), which Next requires be inside a boundary
            at the root layout level. */}
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>

        <AuthProvider>
          <LocaleProvider locale={locale as Locale}>
            <TableProvider>
              <CartProvider>
                {children}
                <CookieConsent />
              </CartProvider>
            </TableProvider>
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
