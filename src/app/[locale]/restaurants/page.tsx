import type { Metadata } from 'next';
import { Suspense } from 'react';

import RestaurantsSearchPage from '@/components/RestaurantsSearchPage';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { buildMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const seo = (t as unknown as { seo?: Record<string, string> }).seo ?? {};
  return buildMetadata({
    locale,
    path: '/restaurants',
    title: seo.searchTitle,
    description: seo.searchDescription,
  });
}

// Search / filter / category-browse experience. The marketing-style hero
// landing lives at the site root (see src/app/[locale]/page.tsx).
export default function RestaurantsRoute() {
  return (
    <Suspense>
      <RestaurantsSearchPage />
    </Suspense>
  );
}
