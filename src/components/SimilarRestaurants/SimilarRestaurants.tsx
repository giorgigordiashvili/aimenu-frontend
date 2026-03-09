'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { restaurantsList } from '@/api/generated/api';
import type { RestaurantList } from '@/api/generated/interfaces';
import RestaurantCardPrimary from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { foreground } from '@/tokens';
import { getTranslation } from '@/utils/translations';

// ── Styles ────────────────────────────────────────────────────────────────────

const Section = styled('section')({
  marginBottom: '24px',
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
  paddingBottom: '8px',
  // hide scrollbar
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const CardWrapper = styled('div')({
  flexShrink: 0,
  cursor: 'pointer',
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
  const [restaurants, setRestaurants] = useState<RestaurantList[]>([]);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const data = await restaurantsList();
        const filtered = data.results
          .filter(r => r.slug !== currentSlug && r.category.slug === cuisineType)
          .slice(0, 4);
        setRestaurants(filtered);
      } catch {
        // silently fail - similar restaurants are non-critical
      }
    }
    fetchRestaurants();
  }, [cuisineType, currentSlug]);

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
              onClick={() => router.push(`/${locale}/restaurant/${restaurant.slug}`)}
            >
              <RestaurantCardPrimary
                variant='default'
                imageSrc={restaurant.logo ?? '/RestaurantCardImage.jpg'}
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
