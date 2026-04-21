'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';

import type { RestaurantList } from '@/api/generated/interfaces';
import MainButton from '@/components/MainButton/MainButton';
import RestaurantCardPrimary from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import { foreground, muted, rose700 } from '@/tokens';
import { getTranslation } from '@/utils/translations';

// ── Styled ────────────────────────────────────────────────────────────────────

const Section = styled('section')({
  padding: '48px 20px 80px',
  maxWidth: '1280px',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: '64px 80px 100px',
  },
});

const SectionHead = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '32px',
  gap: '16px',
  '@media (max-width: 768px)': { flexDirection: 'column', alignItems: 'stretch' },
});

const TitleGroup = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const SectionTitle = styled('h2')({
  fontSize: '30px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '32px',
  letterSpacing: '-0.3px',
  margin: 0,
});

const SectionSubtitle = styled('p')({
  fontSize: '16px',
  fontWeight: 400,
  color: muted,
  lineHeight: '22px',
  margin: 0,
});

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '20px',
  '@media (min-width: 640px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  '@media (min-width: 1280px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
});

const CardWrapper = styled('div')({
  // Makes DefaultVariant full-width inside the grid cell
  '& > div': {
    width: '100%',
  },
});

const SkeletonCard = styled('div')({
  width: '100%',
  height: '280px',
  borderRadius: '14px',
  background: 'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.4s infinite',
  '@keyframes shimmer': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
});

const EmptyState = styled('div')({
  gridColumn: '1 / -1',
  textAlign: 'center',
  padding: '64px 20px',
  color: muted,
  fontSize: '15px',
});

const ErrorState = styled('div')({
  gridColumn: '1 / -1',
  textAlign: 'center',
  padding: '64px 20px',
  color: rose700,
  fontSize: '15px',
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const parseTranslations = (translations: string | object | undefined): object => {
  if (!translations) return {};
  if (typeof translations === 'string') {
    try {
      return JSON.parse(translations);
    } catch {
      return {};
    }
  }
  return translations;
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface RestaurantGridProps {
  restaurants: RestaurantList[];
  loading: boolean;
  error?: string | null;
  favoritedIds?: Set<string | number>;
  onToggleFavorite?: (restaurantId: string | number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RestaurantGrid({
  restaurants,
  loading,
  error,
  favoritedIds,
  onToggleFavorite,
}: RestaurantGridProps) {
  const t = useTranslations();
  const { locale } = useLocale();
  const router = useRouter();

  return (
    <Section>
      <SectionHead>
        <TitleGroup>
          <SectionTitle>{t.restaurantsList.popularTitle}</SectionTitle>
          <SectionSubtitle>{t.restaurantsList.popularSubtitle}</SectionSubtitle>
        </TitleGroup>
        <MainButton
          variant='outline'
          title={t.restaurantsList.viewAll}
          onClick={() => router.push(localePath(locale, '/restaurants'))}
        />
      </SectionHead>

      <Grid>
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <ErrorState>{error}</ErrorState>
        ) : restaurants.length === 0 ? (
          <EmptyState>{t.restaurantsList.noResults}</EmptyState>
        ) : (
          restaurants.map(restaurant => {
            const categoryName = restaurant.category
              ? getTranslation(
                  parseTranslations(restaurant.category.translations),
                  'name',
                  locale
                ) || restaurant.category.slug
              : undefined;

            const amenityNames = (restaurant.amenities || [])
              .map(a => getTranslation(parseTranslations(a.translations), 'name', locale) || a.slug)
              .filter(Boolean);

            const isFavorited =
              !!favoritedIds &&
              (favoritedIds.has(String(restaurant.id)) || favoritedIds.has(restaurant.id));

            return (
              <CardWrapper key={restaurant.id}>
                <RestaurantCardPrimary
                  variant='default'
                  restaurantTitle={restaurant.name}
                  imageSrc={restaurant.logo || '/RestaurantCardImage.jpg'}
                  imageBlurhash={(restaurant as { logo_blurhash?: string }).logo_blurhash}
                  locationText={restaurant.city}
                  rating={parseFloat(restaurant.average_rating || '0')}
                  filterText={categoryName}
                  priceLevel='₾₾'
                  href={localePath(locale, `/restaurant/${restaurant.slug}`)}
                  detailsLabel={t.restaurantsList.details}
                  showDetailsButton={true}
                  showBookButton={false}
                  showFavoriteYellow={false}
                  showFavoriteButton={true}
                  showRating={!!restaurant.average_rating}
                  showFilterText={!!categoryName}
                  amenities={amenityNames}
                  isFavorited={isFavorited}
                  onFavoriteToggle={
                    onToggleFavorite ? () => onToggleFavorite(restaurant.id) : undefined
                  }
                  showLoyaltyBadge={
                    (restaurant as { accepts_platform_loyalty?: boolean })
                      .accepts_platform_loyalty === true
                  }
                  loyaltyBadgeLabel={t.platformLoyalty.badgeLabel}
                />
              </CardWrapper>
            );
          })
        )}
      </Grid>
    </Section>
  );
}
