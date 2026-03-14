'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';

import RestaurantCardPrimary from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';
import type { RestaurantList } from '@/api/generated/interfaces';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { foreground, muted, primary, slate100, slate200 } from '@/tokens';
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
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  marginBottom: '32px',
  gap: '16px',
});

const TitleGroup = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const SectionTitle = styled('h2')({
  fontSize: '24px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '32px',
  letterSpacing: '-0.3px',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '30px',
  },
});

const SectionSubtitle = styled('p')({
  fontSize: '14px',
  fontWeight: 400,
  color: muted,
  lineHeight: '22px',
  margin: 0,
});

const ViewAllButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  background: 'transparent',
  border: `1px solid ${slate200}`,
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 500,
  color: foreground,
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 0.15s',
  '&:hover': { background: slate100 },
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
  color: primary,
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
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RestaurantGrid({ restaurants, loading, error }: RestaurantGridProps) {
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
        <ViewAllButton onClick={() => router.push(`/${locale}/restaurants`)}>
          {t.restaurantsList.viewAll}
        </ViewAllButton>
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

            return (
              <CardWrapper key={restaurant.id}>
                <RestaurantCardPrimary
                  variant='default'
                  restaurantTitle={restaurant.name}
                  imageSrc={restaurant.logo || '/RestaurantCardImage.jpg'}
                  locationText={restaurant.city}
                  rating={parseFloat(restaurant.average_rating || '0')}
                  filterText={categoryName}
                  priceLevel='₾₾'
                  href={`/${locale}/restaurants/${restaurant.slug}`}
                  detailsLabel={t.restaurantsList.details}
                  showDetailsButton={true}
                  showBookButton={false}
                  showFavoriteYellow={false}
                  showFavoriteButton={true}
                  showRating={!!restaurant.average_rating}
                  showFilterText={!!categoryName}
                />
              </CardWrapper>
            );
          })
        )}
      </Grid>
    </Section>
  );
}
