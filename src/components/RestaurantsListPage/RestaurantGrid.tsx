'use client';

import { keyframes, styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';

import type { RestaurantList } from '@/api/generated/interfaces';
import MainButton from '@/components/MainButton/MainButton';
import RestaurantCardPrimary from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { useInView } from '@/hooks/useInView';
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
  // minmax(0, 1fr) — not plain 1fr — so columns stay equal even when one
  // card's content has a larger min-width (e.g. the loyalty pill + cuisine
  // tag + rating row competing for space on the hero). Plain 1fr is
  // `minmax(auto, 1fr)` which lets the wider card's column grow.
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '12px',
  '@media (min-width: 640px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '20px',
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
  '@media (min-width: 1280px)': {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
});

// Matches the hero's fade+slide so the grid feels like it belongs to
// the same entrance. Each card uses an inline `animationDelay` below to
// stagger — the first card starts on the hero's trailing edge, later
// cards follow at 50ms intervals (capped so the last visible card
// always lands well before the user could scroll).
const cardFadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const CardWrapper = styled('div')({
  // Makes DefaultVariant full-width inside the grid cell
  '& > div': {
    width: '100%',
  },
  opacity: 0,
  transform: 'translateY(10px)',
  willChange: 'opacity, transform',
  '&[data-in-view="true"]': {
    animation: `${cardFadeIn} 420ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards`,
  },
  '@media (prefers-reduced-motion: reduce)': {
    opacity: 1,
    transform: 'none',
    '&[data-in-view="true"]': { animation: 'none' },
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

// Per-card wrapper that flips `data-in-view` the moment the card crosses
// into the viewport. Extracted to a small component because hooks can't
// be called inside the restaurants.map() iteration.
function AnimatedCard({ children, delayMs }: { children: React.ReactNode; delayMs: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <CardWrapper
      ref={ref}
      data-in-view={inView ? 'true' : undefined}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </CardWrapper>
  );
}

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
          restaurants.map((restaurant, index) => {
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
              <AnimatedCard
                key={restaurant.id}
                // Column-count-agnostic row stagger: cards in the same
                // visible "row" come in together, the next row follows
                // slightly after. Kept within a single viewport-worth
                // (≤300ms) so anything already in view finishes fast.
                delayMs={Math.min(index % 4, 3) * 60}
              >
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
                  loyaltyBadgeHint={t.platformLoyalty.badgeHint}
                />
              </AnimatedCard>
            );
          })
        )}
      </Grid>
    </Section>
  );
}
