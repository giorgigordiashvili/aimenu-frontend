'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { restaurantsList } from '@/api/generated/api';
import type { RestaurantList } from '@/api/generated/interfaces';
import RestaurantCardPrimary from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';
import { SimilarRestaurantsSkeleton } from '@/components/Skeleton';
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          1,
          20
        );
        if (cancelled) return;
        const filtered = data.results
          .filter(r => r.slug !== currentSlug && r.category?.slug === cuisineType)
          .slice(0, 4);
        setRestaurants(filtered);
      } catch {
        // silently fail - similar restaurants are non-critical
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchRestaurants();
    return () => {
      cancelled = true;
    };
  }, [shouldFetch, cuisineType, currentSlug]);

  if (isLoading) {
    return (
      <Section ref={sectionRef}>
        <SectionTitle>{t.restaurant.similar}</SectionTitle>
        <SimilarRestaurantsSkeleton count={3} />
      </Section>
    );
  }

  if (restaurants.length === 0) return null;

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
              onClick={() => router.push(localePath(locale, `/restaurants/${restaurant.slug}`))}
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
