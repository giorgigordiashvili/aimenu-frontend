import type { Metadata } from 'next';

import { fetchVenueDetail } from '@/api/venues';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import VenuePage from '@/components/VenuePage';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { buildMetadata, localeUrl } from '@/lib/seo';

import VenueTableValidator from './VenueTableValidator';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const data = await fetchVenueDetail(slug);
  if (!data) {
    return buildMetadata({
      locale,
      path: `/venue/${slug}`,
      title: t.venue.notFound,
      noindex: true,
    });
  }
  return buildMetadata({
    locale,
    path: `/venue/${slug}`,
    title: t.seo.venueTitle.replace('{name}', data.venue.name),
    description: t.seo.venueDescription.replace('{name}', data.venue.name),
    image: data.venue.logo ?? undefined,
  });
}

export default async function VenueDetailPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const data = await fetchVenueDetail(slug);

  const jsonLd = data
    ? {
        '@context': 'https://schema.org',
        '@type': 'FoodEstablishment',
        '@id': localeUrl(locale, `/venue/${slug}`),
        url: localeUrl(locale, `/venue/${slug}`),
        name: data.venue.name,
        image: data.venue.logo ?? undefined,
        containsPlace: data.restaurants.map(r => ({
          '@type': 'Restaurant',
          name: r.name,
          url: localeUrl(locale, `/restaurant/${r.slug}`),
        })),
      }
    : null;

  return (
    <>
      {jsonLd ? (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <HeaderPrimary />
      <VenueTableValidator venueSlug={slug} />
      <VenuePage slug={slug} locale={locale} initial={data} />
      <Footer />
    </>
  );
}
