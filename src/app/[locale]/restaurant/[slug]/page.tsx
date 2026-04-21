import { styled } from '@pigment-css/react';
import type { Metadata } from 'next';

import { restaurantsRetrieve } from '@/api/generated/api';
import type { RestaurantDetail } from '@/api/generated/interfaces';
import { ReservationWidget } from '@/components';
import CartBadge from '@/components/CartBadge';
import ContactInfo from '@/components/ContactInfo';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MenuSection from '@/components/MenuSection';
import RestaurantCartScopeBanner from '@/components/RestaurantCartScopeBanner';
import RestaurantDetailInfo from '@/components/RestaurantDetailInfo';
import SharedTableBanner from '@/components/SharedTableBanner';
import SimilarRestaurants from '@/components/SimilarRestaurants';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { buildMetadata, localeUrl } from '@/lib/seo';
import { getTranslation } from '@/utils/translations';

import BelowFold from './BelowFold';
import TableValidator from './TableValidator';

// This page is intentionally a Server Component. Previously it was
// `'use client'` and kicked off `restaurantsRetrieve(slug)` only after
// React hydration, which meant the hero image on slow 3G was discovered
// roughly 3–5 seconds after TTFB (script-initiated fetch). Lighthouse
// reported LCP ≈ 13 s on simulated slow 3G.
//
// By fetching server-side we ship the restaurant name + hero image
// `<img srcset>` in the initial HTML response, so the browser's preload
// scanner starts the image download before any JS is parsed.
//
// Interactivity on this page is isolated to:
//   - `TableValidator`: processes ?table=<code> side effects
//   - `PhotoGallery`: lightbox overlay
//   - `ReservationWidget`, `MenuSection`, banners: cart/table context
// Those are still client components; they SSR through the server tree
// just fine.

const Page = styled('div')({
  minHeight: '100vh',
  background: '#ffffff',
});

const Main = styled('main')({
  padding: '20px',
  // Leave room on mobile for the fixed MobileReservationSheet bar so the
  // last bit of content isn't hidden behind it. Desktop has no sticky bar.
  paddingBottom: 'calc(88px + env(safe-area-inset-bottom))',
  // Reserve at least a viewport's worth of vertical space so the Footer
  // sits below the fold on first paint. Without this, the initial render
  // (before MenuSection SWR resolves and flips from skeleton to 27 items)
  // has the Footer high in the viewport, then shifts down by hundreds
  // of pixels once the menu arrives. That shift was accounting for CLS
  // 0.38 on slow 3G.
  minHeight: '100dvh',
  '@media (min-width: 1024px)': {
    paddingBottom: '100px',
  },
  '@media (min-width: 768px)': {
    padding: '32px 80px 100px',
    maxWidth: '1280px',
    margin: '0 auto',
  },
});

const ContentLayout = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  '@media (min-width: 1024px)': {
    flexDirection: 'row',
    gap: '32px',
    alignItems: 'flex-start',
  },
});

const LeftColumn = styled('div')({
  flex: 1,
  minWidth: 0,
});

const RightColumn = styled('div')({
  display: 'none',
  '@media (min-width: 1024px)': {
    display: 'block',
    width: '380px',
    flexShrink: 0,
    position: 'sticky',
    // 64px sticky header height + 24px breathing room — otherwise the widget
    // scrolls under the Header.
    top: '88px',
  },
});

const ErrorContainer = styled('div')({
  textAlign: 'center',
  padding: '40px 20px',
  minHeight: '400px',
});

const ErrorText = styled('p')({
  fontSize: '16px',
  color: '#EC003F',
  marginBottom: '20px',
});

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Generated per-restaurant. We deliberately don't call restaurantsRetrieve
// here because Pigment CSS's build-time sandbox can't evaluate the axios
// transport (Node http2 import). For richer per-restaurant titles a
// dedicated /restaurant/[slug]/opengraph-image route + a Server Component
// that hits the API is the right place — this metadata path stays static
// so the build is reliable.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const seo = (t as unknown as { seo?: Record<string, string> }).seo ?? {};
  // Slug → title-cased best guess for the visible name. The API-correct
  // name still lands inside the page itself (h1 + JSON-LD).
  const guessName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const title = (seo.restaurantTitle ?? '{name}').replace('{name}', guessName);
  const description = (seo.restaurantDescription ?? '{name}.')
    .replace('{name}', guessName)
    .replace('{city}', '');
  return buildMetadata({
    locale,
    path: `/restaurant/${slug}`,
    title,
    description,
    ogType: 'restaurant',
  });
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);

  let restaurant: RestaurantDetail | null = null;
  let loadError: string | null = null;
  try {
    restaurant = await restaurantsRetrieve(slug);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[RestaurantDetail SSR]', err);
    }
    loadError = t.restaurantDetail.failedToLoad;
  }

  if (loadError || !restaurant) {
    return (
      <Page>
        <HeaderPrimary />
        <Main>
          <ErrorContainer>
            <ErrorText>{loadError || t.restaurantDetail.notFound}</ErrorText>
          </ErrorContainer>
        </Main>
      </Page>
    );
  }

  const images = [restaurant.cover_image, restaurant.logo].filter(Boolean) as string[];
  // Parallel array of blurhash strings for PhotoGallery — order matches
  // `images` above. Silent fallback when a field isn't populated yet.
  const r = restaurant as unknown as { cover_image_blurhash?: string; logo_blurhash?: string };
  const blurhashes = [
    restaurant.cover_image ? r.cover_image_blurhash : undefined,
    restaurant.logo ? r.logo_blurhash : undefined,
  ].filter((_, i) => (i === 0 ? !!restaurant.cover_image : !!restaurant.logo));
  const categoryName = restaurant.category
    ? getTranslation(restaurant.category.translations, 'name', locale)
    : undefined;

  // Widget is always shown when the restaurant accepts reservations. Its
  // internals switch to "order only" (QR dine-in) when the URL has ?table=
  // — handled inside ReservationWidget itself.
  const showWidget = restaurant.accepts_reservations === true;
  // Master ordering switch. When false, the customer can browse the menu
  // but every order surface is suppressed (cart, checkout, QR dine-in).
  // Defaults to true if the flag is missing from the API response.
  const orderingEnabled = restaurant.accepts_remote_orders !== false;
  // The mobile sticky bar / bottom sheet only makes sense when at least
  // one of the two flows (reservation OR ordering) is active.
  const showMobileSheet = showWidget || orderingEnabled;

  // schema.org/Restaurant JSON-LD for Google's rich result. Optional fields
  // are only emitted when the API populated them so we don't ship empty
  // strings (which Google flags).
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': localeUrl(locale, `/restaurant/${slug}`),
    url: localeUrl(locale, `/restaurant/${slug}`),
    name: restaurant.name,
    image: [restaurant.cover_image, restaurant.logo].filter(Boolean),
    servesCuisine: categoryName,
    address: restaurant.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: restaurant.address,
          addressLocality: restaurant.city,
          addressCountry: restaurant.country || 'GE',
        }
      : undefined,
    geo:
      restaurant.latitude && restaurant.longitude
        ? {
            '@type': 'GeoCoordinates',
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
          }
        : undefined,
    telephone: restaurant.phone || undefined,
    priceRange: '₾₾',
    aggregateRating:
      restaurant.average_rating && parseFloat(restaurant.average_rating) > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: restaurant.average_rating,
            reviewCount: restaurant.total_reviews ?? 0,
          }
        : undefined,
    acceptsReservations: !!restaurant.accepts_reservations,
  };
  // Strip undefined keys so the JSON output is tidy.
  for (const k of Object.keys(jsonLd)) if (jsonLd[k] === undefined) delete jsonLd[k];

  return (
    <Page>
      {/* schema.org/Restaurant for Google rich results. App Router emits
          this server-side; no next/script wrapper needed. */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeaderPrimary />

      {/* ?table=<code> side-effect validator — no UI, no perf cost */}
      <TableValidator />

      <Main>
        <ContentLayout>
          <LeftColumn>
            <SharedTableBanner slug={slug} />
            <RestaurantCartScopeBanner slug={slug} />

            <RestaurantDetailInfo
              name={restaurant.name}
              description={restaurant.description}
              city={restaurant.city}
              averageRating={restaurant.average_rating}
              totalReviews={restaurant.total_reviews}
              categoryName={categoryName}
              amenities={restaurant.amenities}
              locale={locale}
            />

            {/* Mobile reservation is now a sticky bottom bar + bottom
                sheet; see MobileReservationSheet. The old inline widget
                was removed to give the menu more vertical space. */}

            <MenuSection
              slug={slug}
              locale={locale}
              headerRight={<CartBadge />}
              orderingEnabled={orderingEnabled}
            />

            <ContactInfo
              operatingHours={restaurant.operating_hours}
              phone={restaurant.phone}
              website={restaurant.website}
              email={restaurant.email}
              isOpenNow={restaurant.is_open_now}
              locale={locale}
            />

            <SimilarRestaurants
              cuisineType={restaurant.category?.slug ?? ''}
              currentSlug={slug}
              locale={locale}
            />
          </LeftColumn>

          {showWidget && (
            <RightColumn>
              <ReservationWidget slug={slug} locale={locale} orderingEnabled={orderingEnabled} />
            </RightColumn>
          )}
        </ContentLayout>
      </Main>

      {/* Below-the-fold / event-driven: lightbox (PhotoGallery listens for
          a window event to open) + the mobile sticky reservation bar.
          Lazy-loaded to keep the critical path small. */}
      <BelowFold
        slug={slug}
        locale={locale}
        images={images}
        blurhashes={blurhashes}
        restaurantName={restaurant.name}
        showMobileSheet={showMobileSheet}
        orderingEnabled={orderingEnabled}
        reservationsEnabled={showWidget}
      />

      <Footer locale={locale} />
    </Page>
  );
}
