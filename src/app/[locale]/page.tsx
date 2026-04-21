import type { Metadata } from 'next';

import RestaurantsListPage from '@/components/RestaurantsListPage';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { buildMetadata, localeUrl, SITE_NAME } from '@/lib/seo';

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const seo = (t as unknown as { seo?: Record<string, string> }).seo ?? {};
  return buildMetadata({
    locale,
    path: '/',
    title: seo.homeTitle,
    description: seo.homeDescription,
  });
}

// The homepage is a marketing-style landing: dark hero with a
// search/booking strip + a grid of popular restaurants below. The more
// utilitarian search/filter experience lives at /restaurants (see
// src/app/[locale]/restaurants/page.tsx).
export default async function Home({ params }: HomeProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  // schema.org WebSite + SearchAction so Google can render the sitelinks
  // search box pointing at /restaurants?search=...
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: localeUrl(locale, '/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${localeUrl(locale, '/restaurants')}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <RestaurantsListPage />
    </>
  );
}
