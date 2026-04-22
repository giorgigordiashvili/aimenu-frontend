'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { restaurantsList } from '@/api/generated/api';
import type { RestaurantList } from '@/api/generated/interfaces';
import RestaurantCardPrimary from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import { foreground } from '@/tokens';
import { getTranslation } from '@/utils/translations';

// ── Styles ────────────────────────────────────────────────────────────────────

const Section = styled('section')({
  marginBottom: '24px',
  overflow: 'visible',
  '@media (min-width: 768px)': {
    marginBottom: '40px',
  },
});

const SectionTitle = styled('h2')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '32px',
  margin: '0 0 16px',
  '@media (min-width: 768px)': {
    fontSize: '24px',
    marginBottom: '20px',
  },
});

const ScrollRow = styled('div')({
  display: 'flex',
  gap: '16px',
  overflowX: 'auto',
  padding: '8px 8px 16px',
  margin: '0 -8px',
  // hide scrollbar
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '@media (max-width: 767px)': {
    flexDirection: 'column',
    overflowX: 'visible',
  },
});

const CardWrapper = styled('div')({
  flexShrink: 0,
  cursor: 'pointer',
  width: '264px',
  '@media (max-width: 767px)': {
    width: '100%',
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

interface SimilarRestaurantsProps {
  cuisineType: string;
  currentSlug: string;
  locale: Locale;
}

export default function SimilarRestaurants({
  cuisineType,
  currentSlug,
  locale,
}: SimilarRestaurantsProps) {
  const t = getDictionary(locale);
  const router = useRouter();
  // Slot is an always-rendered empty sentinel used purely as the
  // IntersectionObserver anchor so the fetch can be deferred until the
  // user is near it — without reserving any vertical space in the
  // document. This is what keeps CLS at ~0: before we know whether the
  // section will have content we commit zero layout, and once we do
  // know we render the final height in a single paint.
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantList[] | null>(null);
  // Defer the network request until the user scrolls the section near the
  // viewport. Keeps the restaurant-detail page feeling like it loads top-
  // to-bottom rather than every below-the-fold fetch firing at hydration.
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShouldFetch(true);
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      // Start fetching a little before the section is actually visible so
      // the skeleton gets replaced with real cards around the time the
      // user arrives at it.
      { rootMargin: '400px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldFetch) return;
    let cancelled = false;
    async function fetchRestaurants() {
      try {
        // Pass pageSize=20 to reduce over-fetching; filter client-side for category/exclude
        const data = await restaurantsList(
          undefined, // acceptsPlatformLoyalty
          undefined, // acceptsRemoteOrders
          undefined, // acceptsReservations
          undefined, // acceptsTakeaway
          undefined, // city
          undefined, // country
          undefined, // minRating
          undefined, // name
          undefined, // ordering
          1, // page
          20 // pageSize
        );
        if (cancelled) return;
        const filtered = data.results
          .filter(r => r.slug !== currentSlug && r.category?.slug === cuisineType)
          .slice(0, 4);
        setRestaurants(filtered);
      } catch {
        // silently fail - similar restaurants are non-critical
        if (!cancelled) setRestaurants([]);
      }
    }
    fetchRestaurants();
    return () => {
      cancelled = true;
    };
  }, [shouldFetch, cuisineType, currentSlug]);

  // Before we know whether there are similar restaurants, render a
  // zero-height observer anchor — NOT a visible skeleton. Showing a
  // fat skeleton and then collapsing to `null` when the list is empty
  // was the page's single biggest CLS contributor (0.47 of total CLS
  // on slow 3G). This trades a brief skeleton for a stable layout;
  // the section only paints once real data has arrived.
  if (restaurants === null || restaurants.length === 0) {
    return <div ref={sectionRef} aria-hidden='true' />;
  }

  return (
    <Section>
      <SectionTitle>{t.restaurant.similar}</SectionTitle>
      <ScrollRow>
        {restaurants.map(restaurant => {
          const categoryName = restaurant.category
            ? getTranslation(restaurant.category.translations, 'name', locale)
            : undefined;
          return (
            <CardWrapper
              key={restaurant.id}
              onClick={() => router.push(localePath(locale, `/restaurant/${restaurant.slug}`))}
            >
              <RestaurantCardPrimary
                variant='default'
                imageSrc={restaurant.logo ?? '/RestaurantCardImage.jpg'}
                imageBlurhash={(restaurant as { logo_blurhash?: string }).logo_blurhash}
                restaurantTitle={restaurant.name}
                locationText={restaurant.city}
                filterText={categoryName}
                rating={parseFloat(restaurant.average_rating ?? '0')}
                showDetailsButton={false}
                showBookButton={false}
                showFavoriteYellow={false}
                showFavoriteButton={false}
              />
            </CardWrapper>
          );
        })}
      </ScrollRow>
    </Section>
  );
}
