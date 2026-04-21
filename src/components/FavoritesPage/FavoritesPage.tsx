'use client';

import { styled } from '@pigment-css/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { favoritesRestaurantsList, favoritesRestaurantsRemoveDestroy } from '@/api/generated/api';
import type { FavoriteRestaurant } from '@/api/generated/interfaces';
import CategoryFilterTabs from '@/components/CategoryFilterTabs/CategoryFilterTabs';
import Footer from '@/components/Footer/Footer';
import HeaderPrimary from '@/components/HeaderPrimary/HeaderPrimary';
import RestaurantCardPrimary from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';
import PageHeader from '@/components/RestaurantsSearchPage/PageHeader';
import Pagination from '@/components/RestaurantsSearchPage/Pagination';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from '@/context/LocaleContext';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/routing';
import {
  border,
  foreground,
  muted,
  shadowCard,
  slate50,
  slate100,
  slate200,
  slate400,
  slate500,
  white,
} from '@/tokens';

// ── Styled ────────────────────────────────────────────────────────────────────

const PageWrapper = styled('div')({
  minHeight: '100vh',
  background: slate50,
  display: 'flex',
  flexDirection: 'column',
});

const MainContent = styled('main')({
  flex: 1,
});

const TabsSection = styled('div')({
  background: slate50,
  padding: '16px 0',
});

const TabsInner = styled('div')({
  maxWidth: '1120px',
  margin: '0 auto',
  padding: 0,
});

const FiltersRow = styled('div')({
  background: 'transparent',
  paddingTop: '16px',
  paddingBottom: '8px',
});

const FiltersCard = styled('div')({
  maxWidth: '1120px',
  margin: '0 auto',
  background: white,
  borderRadius: '14px',
  boxShadow: shadowCard,
  padding: '14px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  '@media (max-width: 640px)': {
    padding: '12px 16px',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '8px',
  },
});

const FiltersLabel = styled('span')({
  fontSize: '11px',
  fontWeight: 700,
  color: slate500,
  flexShrink: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  lineHeight: 1,
});

const CitySelect = styled('select')({
  flex: 1,
  maxWidth: '280px',
  padding: '10px 36px 10px 14px',
  border: `1px solid ${border}`,
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  background: white,
  cursor: 'pointer',
  outline: 'none',
  fontFamily: 'inherit',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2362748e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  '&:hover:not(:disabled)': {
    borderColor: slate400,
  },
  '&:focus': {
    borderColor: slate400,
    boxShadow: `0 0 0 3px rgba(148, 163, 184, 0.15)`,
  },
  '@media (max-width: 640px)': {
    maxWidth: '100%',
    width: '100%',
  },
});

const ContentWrapper = styled('div')({
  padding: '0 16px',
});

const GridWrapper = styled('div')({
  maxWidth: '1120px',
  margin: '0 auto',
  padding: '32px 0 80px',
  '@media (min-width: 768px)': {
    padding: '48px 0 100px',
  },
});

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 24,
  '@media (max-width: 1024px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  '@media (max-width: 640px)': {
    gridTemplateColumns: '1fr',
    gap: 16,
  },
  marginTop: 24,
});

const CardWrapper = styled('div')({
  position: 'relative',
  '& > div': {
    width: '100%',
  },
});

const SkeletonCard = styled('div')({
  width: '100%',
  height: '280px',
  borderRadius: '14px',
  background: `linear-gradient(90deg, ${slate100} 0%, ${slate200} 50%, ${slate100} 100%)`,
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
  padding: '80px 24px',
  color: slate500,
  fontSize: '15px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
});

const LoadingWrapper = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  color: muted,
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

// ── Component ─────────────────────────────────────────────────────────────────

interface FavoritesPageProps {
  locale: Locale;
}

export default function FavoritesPage({ locale }: FavoritesPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const { user, isLoading: authLoading } = useAuth();

  // URL-driven state
  const categoryParam = searchParams.get('category') ?? null;
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10);
  const searchParam = searchParams.get('search') ?? '';

  // Local search input state
  const [searchInput, setSearchInput] = useState(searchParam);

  // Data state
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(localePath(locale, '/login'));
    }
  }, [user, authLoading, locale, router]);

  // Sync search input when URL param changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await favoritesRestaurantsList(
        undefined,
        pageParam,
        PAGE_SIZE,
        searchParam || undefined
      );
      const results: FavoriteRestaurant[] = res?.results ?? [];
      const count: number = res?.count ?? results.length;
      setFavorites(results);
      setTotalCount(count);

      // Derive unique categories from cuisine types
      const seen = new Set<string>();
      const uniqueCategories: Category[] = [];
      for (const fav of results) {
        if (fav.restaurant_cuisine_type && !seen.has(fav.restaurant_cuisine_type)) {
          seen.add(fav.restaurant_cuisine_type);
          uniqueCategories.push({
            id: fav.restaurant_cuisine_type,
            name: fav.restaurant_cuisine_type,
          });
        }
      }
      setCategories(uniqueCategories);
    } catch {
      setFavorites([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [user, pageParam, searchParam]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Filter by category client-side
  const displayedFavorites = categoryParam
    ? favorites.filter(f => f.restaurant_cuisine_type === categoryParam)
    : favorites;

  // ── URL helpers ────────────────────────────────────────────────────────────

  const buildParams = useCallback(
    (overrides: { category?: string | null; page?: number; search?: string }) => {
      const params = new URLSearchParams();
      const category = 'category' in overrides ? overrides.category : categoryParam;
      const page = overrides.page ?? 1;
      const search = 'search' in overrides ? overrides.search : searchParam;

      if (category) params.set('category', category);
      if (search) params.set('search', search);
      params.set('page', String(page));
      return params.toString();
    },
    [categoryParam, searchParam]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSearchSubmit = useCallback(() => {
    const qs = buildParams({ search: searchInput, page: 1 });
    router.push(`${localePath(locale, '/favorites')}?${qs}`);
  }, [buildParams, searchInput, locale, router]);

  const handleCategoryChange = useCallback(
    (id: string | null) => {
      const qs = buildParams({ category: id, page: 1 });
      router.push(`${localePath(locale, '/favorites')}?${qs}`);
    },
    [buildParams, locale, router]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      const qs = buildParams({ page: p });
      router.push(`${localePath(locale, '/favorites')}?${qs}`);
    },
    [buildParams, locale, router]
  );

  const handleRemove = useCallback(
    async (favoriteId: string, restaurantId: string) => {
      // Optimistic removal
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      setTotalCount(prev => Math.max(0, prev - 1));
      try {
        await favoritesRestaurantsRemoveDestroy(restaurantId);
      } catch {
        // On error, re-fetch to restore
        fetchFavorites();
      }
    },
    [fetchFavorites]
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  if (authLoading) {
    return <LoadingWrapper>{t.common.loading}</LoadingWrapper>;
  }

  if (!user) {
    return null;
  }

  const subtitle = `${t.favorites.subtitle} (${totalCount})`;

  return (
    <PageWrapper>
      <HeaderPrimary />

      <ContentWrapper>
        <MainContent>
          <PageHeader
            title={t.favorites.title}
            subtitle={subtitle}
            searchValue={searchInput}
            onSearchChange={setSearchInput}
            onSearchSubmit={handleSearchSubmit}
            searchPlaceholder={t.restaurantsSearch.search}
          />

          <TabsSection>
            <TabsInner>
              <CategoryFilterTabs
                categories={categories}
                activeId={categoryParam}
                allLabel={t.restaurantsSearch.allCategories}
                onChange={handleCategoryChange}
              />
            </TabsInner>
          </TabsSection>

          <FiltersRow>
            <FiltersCard>
              <FiltersLabel>{t.restaurantsSearch.filters}</FiltersLabel>
              <CitySelect disabled value=''>
                <option value=''>{t.restaurantsList.allCities}</option>
              </CitySelect>
            </FiltersCard>
          </FiltersRow>

          <GridWrapper>
            <Grid>
              {loading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
              ) : displayedFavorites.length === 0 ? (
                <EmptyState>
                  <span>{t.favorites.noFavorites}</span>
                </EmptyState>
              ) : (
                displayedFavorites.map(fav => (
                  <CardWrapper key={fav.id}>
                    <RestaurantCardPrimary
                      variant='default'
                      restaurantTitle={fav.restaurant_name}
                      imageSrc={fav.restaurant_logo || '/RestaurantCardImage.jpg'}
                      locationText={fav.restaurant_city}
                      filterText={fav.restaurant_cuisine_type || undefined}
                      priceLevel='₾₾'
                      href={localePath(locale, `/restaurant/${fav.restaurant_slug}`)}
                      detailsLabel={t.restaurantsList.details}
                      showDetailsButton={true}
                      showBookButton={false}
                      showFavoriteYellow={false}
                      showFavoriteButton={true}
                      showRating={false}
                      showFilterText={!!fav.restaurant_cuisine_type}
                      isFavorited={true}
                      onFavoriteToggle={() => handleRemove(fav.id, fav.restaurant)}
                    />
                  </CardWrapper>
                ))
              )}
            </Grid>

            <Pagination page={pageParam} totalPages={totalPages} onPageChange={handlePageChange} />
          </GridWrapper>
        </MainContent>
      </ContentWrapper>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
