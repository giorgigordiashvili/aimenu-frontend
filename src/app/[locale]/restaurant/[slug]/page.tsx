import { styled } from '@pigment-css/react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

import type { RestaurantDetail } from '@/api/generated/interfaces';
import { ReservationWidget } from '@/components';
import CartBadge from '@/components/CartBadge';
import ContactInfo from '@/components/ContactInfo';
import Footer from '@/components/Footer';
import FulfilmentBar from '@/components/FulfilmentBar';
import HeaderPrimary from '@/components/HeaderPrimary';
import MenuSection from '@/components/MenuSection';
import RestaurantCartScopeBanner from '@/components/RestaurantCartScopeBanner';
import RestaurantDetailInfo from '@/components/RestaurantDetailInfo';
import ReviewsSection from '@/components/ReviewsSection';
import SharedTableBanner from '@/components/SharedTableBanner';
import SimilarRestaurants from '@/components/SimilarRestaurants';
import VenueChip from '@/components/VenueChip';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { restaurantModules } from '@/lib/modules';
import { buildMetadata, localeUrl, SITE_URL } from '@/lib/seo';
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
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Generated per-restaurant at request time. We hit the public REST
// endpoint directly with fetch() (avoids the axios client's
// browser-only interceptors) to pull the real name / description /
// logo / cover so social-share previews on Facebook, WhatsApp,
// iMessage, Twitter/X, LinkedIn etc. render the restaurant's own
// branding instead of a slug-derived guess.
const OG_API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://admin.aimenu.ge').replace(
  /\/$/,
  ''
);

interface OgRestaurant {
  name?: string;
  description?: string | null;
  city?: string | null;
  logo?: string | null;
  cover_image?: string | null;
}

async function loadRestaurantForMetadata(slug: string): Promise<OgRestaurant | null> {
  try {
    const res = await fetch(`${OG_API_BASE}/api/v1/restaurants/${slug}/`, {
      // Match the OG-image route's revalidate window so both surfaces
      // refetch together.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as OgRestaurant;
  } catch {
    return null;
  }
}

function truncateSocial(s: string, max: number): string {
  const trimmed = s.trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max - 1).trimEnd() + '…';
}

// Full-detail fetch for the default export. We deliberately skip the
// axios-backed generated client here because its transitive `http2`
// import crashes Pigment CSS's build-time sandbox when it tries to
// evaluate this module to extract styled components. Same JSON, same
// shape — just via plain fetch.
async function loadRestaurantDetail(slug: string): Promise<RestaurantDetail | null> {
  try {
    const res = await fetch(`${OG_API_BASE}/api/v1/restaurants/${slug}/`, {
      // Server Component revalidate — keeps the detail page snappy on
      // repeat visits without getting stale for more than a minute.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as RestaurantDetail;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const seo = (t as unknown as { seo?: Record<string, string> }).seo ?? {};

  const r = await loadRestaurantForMetadata(slug);
  // Title-cased slug fallback when the API is unreachable.
  const fallbackName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const name = r?.name || fallbackName;
  const city = r?.city || '';

  const title = (seo.restaurantTitle ?? '{name}').replace('{name}', name);
  const description = r?.description
    ? truncateSocial(r.description, 180)
    : (seo.restaurantDescription ?? '{name}.').replace('{name}', name).replace('{city}', city);

  // Explicitly point at the file-based opengraph-image route. We used to
  // rely on Next's automatic merge when `openGraph.images` was omitted,
  // but buildMetadata always sets `images: undefined` which overrides the
  // auto-detection — the live HTML ended up with NO og:image. Hard-code
  // the canonical URL so every crawler sees the 1200×630 branded card.
  const ogImageUrl = `${SITE_URL}/restaurant/${slug}/opengraph-image`;

  return buildMetadata({
    locale,
    path: `/restaurant/${slug}`,
    title,
    description,
    image: ogImageUrl,
    ogType: 'restaurant',
  });
}

export default async function RestaurantDetailPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const sp = await searchParams;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);

  const restaurant = await loadRestaurantDetail(slug);
  const loadError = restaurant ? null : t.restaurantDetail.failedToLoad;

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
  // Shared venue (food hall) this restaurant belongs to; the generator
  // flattens the nested object, so narrow it here.
  const venue =
    (restaurant as unknown as { venue?: { slug: string; name: string } | null }).venue ?? null;

  // Widget is always shown when the restaurant accepts reservations. Its
  // internals switch to "order only" (QR dine-in) when the URL has ?table=
  // — handled inside ReservationWidget itself.
  // Modules the restaurant switched on (Settings -> Modules in its admin).
  const modules = restaurantModules(restaurant);
  // A restaurant's own domain (custom domain): no marketplace cross-links.
  const siteMode = (await headers()).get('x-site-mode') === 'restaurant';
  const showWidget = modules.reservations;
  // Master ordering switch. When off, the customer can browse the menu but
  // every order surface is suppressed (cart, checkout, QR dine-in).
  const orderingEnabled = modules.ordering;
  // Reviews module off: no section, no star rating anywhere on the page.
  const reviewsEnabled = modules.reviews;
  // The mobile sticky bar / bottom sheet only makes sense when at least
  // one of the two flows (reservation OR ordering) is active. The desktop
  // right column hosts both the booking widget and the QR order card, so
  // it shows for either.
  // ── Table mode ────────────────────────────────────────────────────────
  // A guest who scanned the QR at a table arrives with ?table=<code>. They
  // are not shopping the marketplace: they are sitting in this restaurant
  // and want the menu. Strip everything that points away from it — the
  // reservation widget (they are already here), reviews, contact details,
  // opening hours, and above all "Similar Restaurants", which advertises
  // competitors to a seated guest on a page the restaurant pays us for.
  // The bottom tab bar hides itself off TableContext; see BottomTabBar.
  const tableMode = orderingEnabled && typeof sp.table === 'string' && sp.table.length > 0;

  const showMobileSheet = !tableMode && (showWidget || orderingEnabled);
  const showRightColumn = !tableMode && (showWidget || orderingEnabled);

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
      reviewsEnabled && restaurant.average_rating && parseFloat(restaurant.average_rating) > 0
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

            {venue ? <VenueChip locale={locale} venue={venue} /> : null}

            <RestaurantDetailInfo
              name={restaurant.name}
              description={restaurant.description}
              city={restaurant.city}
              averageRating={reviewsEnabled ? restaurant.average_rating : undefined}
              totalReviews={reviewsEnabled ? restaurant.total_reviews : undefined}
              categoryName={categoryName}
              amenities={restaurant.amenities}
              locale={locale}
            />

            {/* Mobile reservation is now a sticky bottom bar + bottom
                sheet; see MobileReservationSheet. The old inline widget
                was removed to give the menu more vertical space. */}

            {orderingEnabled && modules.online_ordering ? (
              <FulfilmentBar slug={slug} locale={locale} />
            ) : null}

            <MenuSection
              slug={slug}
              locale={locale}
              headerRight={<CartBadge />}
              orderingEnabled={orderingEnabled}
            />

            {reviewsEnabled && !tableMode && <ReviewsSection slug={slug} />}

            {tableMode ? null : (
              <ContactInfo
                operatingHours={restaurant.operating_hours}
                phone={restaurant.phone}
                website={restaurant.website}
                email={restaurant.email}
                isOpenNow={restaurant.is_open_now}
                locale={locale}
              />
            )}

            {siteMode || tableMode ? null : (
              <SimilarRestaurants
                cuisineType={restaurant.category?.slug ?? ''}
                currentSlug={slug}
                locale={locale}
              />
            )}
          </LeftColumn>

          {showRightColumn && (
            <RightColumn>
              <ReservationWidget
                slug={slug}
                locale={locale}
                orderingEnabled={orderingEnabled}
                reservationsEnabled={showWidget}
              />
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
