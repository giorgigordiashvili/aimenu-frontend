'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { styled } from '@pigment-css/react';

import { favoritesRestaurantsList, favoritesRestaurantsToggleCreate } from '@/api/generated/api';
import type { RestaurantList } from '@/api/generated/interfaces';
import axiosInstance from '@/api/axios';
import CategoryFilterTabs from '@/components/CategoryFilterTabs/CategoryFilterTabs';
import Footer from '@/components/Footer/Footer';
import HeaderPrimary from '@/components/HeaderPrimary/HeaderPrimary';
import RestaurantCardPrimary from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';
import { useAuth } from '@/context/AuthContext';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import {
  border,
  foreground,
  muted,
  shadowCard,
  slate50,
  slate100,
  slate200,
  slate400,
  white,
} from '@/tokens';
import { getTranslation } from '@/utils/translations';
import PageHeader from './PageHeader';
import Pagination from './Pagination';

// ── Styled ────────────────────────────────────────────────────────────────────

const PageWrapper = styled('div')({
  minHeight: '100vh',
  background: slate50,
  display: 'flex',
  flexDirection: 'column',
});

const ContentWrapper = styled('div')({
  padding: '0 16px',
  flex: 1,
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
  padding: '0',
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
  padding: '12px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});

const FiltersLabel = styled('span')({
  fontSize: '14px',
  fontWeight: 500,
  color: muted,
  flexShrink: 0,
});

const CitySelect = styled('select')({
  padding: '8px 12px',
  border: `1px solid ${border}`,
  borderRadius: '8px',
  fontSize: '14px',
  color: foreground,
  background: white,
  cursor: 'pointer',
  outline: 'none',
  fontFamily: 'inherit',
  '&:focus': {
    borderColor: slate400,
  },
});

const GridSection = styled('div')({
  maxWidth: '1120px',
  margin: '0 auto',
  padding: '32px 24px 80px',
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
  padding: '64px 20px',
  color: muted,
  fontSize: '15px',
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CityOption {
  id: number | string;
  slug: string;
  country: string;
  translations: Record<string, { name: string }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

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

// ── Component ─────────────────────────────────────────────────────────────────

export default function RestaurantsSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = useTranslations();
  const { user } = useAuth();

  // URL-driven state
  const cityParam = searchParams.get('city') ?? '';
  const categoryParam = searchParams.get('category') ?? null;
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10);
  const searchParam = searchParams.get('search') ?? '';

  // Local search input state
  const [searchInput, setSearchInput] = useState(searchParam);

  // Data state
  const [restaurants, setRestaurants] = useState<RestaurantList[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<string | number>>(new Set());

  // Sync search input when URL param changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch favorited IDs when user is available
  useEffect(() => {
    if (!user) return;
    const fetchFavIds = async () => {
      try {
        const res = await favoritesRestaurantsList(undefined, undefined, 1000);
        const ids = new Set<string | number>(res.results.map(f => f.restaurant));
        setFavoritedIds(ids);
      } catch {
        // not logged in or error — ignore
      }
    };
    fetchFavIds();
  }, [user]);

  // Fetch cities once
  useEffect(() => {
    axiosInstance
      .get<{ cities: CityOption[] }>('/api/v1/restaurants/cities/')
      .then(res => {
        const data = res.data?.cities;
        if (Array.isArray(data)) {
          setCities(data);
        }
      })
      .catch(() => {
        // cities are optional, ignore error
      });
  }, []);

  // Fetch restaurants when URL params change
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/api/v1/restaurants/', {
        params: {
          ...(cityParam ? { city: cityParam } : {}),
          ...(categoryParam ? { category: categoryParam } : {}),
          ...(searchParam ? { search: searchParam } : {}),
          page: pageParam,
          page_size: PAGE_SIZE,
          ordering: '-average_rating',
        },
      })
      .then(response => {
        const data = response.data;
        const results = Array.isArray(data) ? data : (data?.results ?? []);
        const count = data?.count ?? results.length;
        setRestaurants(results);
        setTotalCount(count);

        // Derive unique categories from the restaurant list
        const uniqueCategories: Category[] = Array.from(
          new Map<string | number, Category>(
            results
              .filter((r: RestaurantList) => r.category)
              .map((r: RestaurantList) => {
                const parsed = parseTranslations(r.category.translations) as Record<
                  string,
                  { name?: string }
                >;
                const name =
                  parsed[locale]?.name ??
                  parsed['ka']?.name ??
                  parsed['en']?.name ??
                  r.category.slug;
                return [
                  r.category.id,
                  {
                    id: String(r.category.id),
                    name,
                    icon: r.category.icon,
                  },
                ];
              })
          ).values()
        );
        setCategories(uniqueCategories);
      })
      .catch(() => {
        setRestaurants([]);
        setTotalCount(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cityParam, categoryParam, searchParam, pageParam, locale]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // ── URL helpers ────────────────────────────────────────────────────────────

  const buildParams = useCallback(
    (overrides: { city?: string; category?: string | null; page?: number; search?: string }) => {
      const params = new URLSearchParams();
      const city = 'city' in overrides ? overrides.city : cityParam;
      const category = 'category' in overrides ? overrides.category : categoryParam;
      const page = overrides.page ?? 1;
      const search = 'search' in overrides ? overrides.search : searchParam;

      if (city) params.set('city', city);
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      params.set('page', String(page));
      return params.toString();
    },
    [cityParam, categoryParam, searchParam]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSearchSubmit = useCallback(() => {
    const qs = buildParams({ search: searchInput, page: 1 });
    router.push(`/${locale}/restaurants-search?${qs}`);
  }, [buildParams, searchInput, locale, router]);

  const handleCategoryChange = useCallback(
    (id: string | null) => {
      const qs = buildParams({ category: id, page: 1 });
      router.push(`/${locale}/restaurants-search?${qs}`);
    },
    [buildParams, locale, router]
  );

  const handleCityChange = useCallback(
    (city: string) => {
      const qs = buildParams({ city, page: 1 });
      router.push(`/${locale}/restaurants-search?${qs}`);
    },
    [buildParams, locale, router]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      const qs = buildParams({ page: p });
      router.push(`/${locale}/restaurants-search?${qs}`);
    },
    [buildParams, locale, router]
  );

  const handleToggleFavorite = useCallback(async (restaurantId: string | number) => {
    const id = String(restaurantId);
    // Optimistic update
    setFavoritedIds(prev => {
      const next = new Set(prev);
      if (next.has(id) || next.has(restaurantId)) {
        next.delete(id);
        next.delete(restaurantId as number);
      } else {
        next.add(id);
      }
      return next;
    });
    try {
      await favoritesRestaurantsToggleCreate(id);
    } catch {
      // revert on error — re-fetch
      try {
        const res = await favoritesRestaurantsList(undefined, undefined, 1000);
        const ids = new Set<string | number>(res.results.map(f => f.restaurant));
        setFavoritedIds(ids);
      } catch {
        // ignore
      }
    }
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      <HeaderPrimary />

      <ContentWrapper>
        <MainContent>
          <PageHeader
            title={t.restaurantsSearch.title}
            subtitle={t.restaurantsSearch.subtitle}
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
              <CitySelect value={cityParam} onChange={e => handleCityChange(e.target.value)}>
                <option value=''>{t.restaurantsSearch.allCities}</option>
                {cities.map(city => (
                  <option key={city.slug} value={city.slug}>
                    {city.translations?.[locale]?.name ??
                      city.translations?.['ka']?.name ??
                      city.slug}
                  </option>
                ))}
              </CitySelect>
            </FiltersCard>
          </FiltersRow>

          <GridSection>
            <Grid>
              {loading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
              ) : restaurants.length === 0 ? (
                <EmptyState>{t.restaurantsSearch.noResults}</EmptyState>
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
                    .map(
                      a =>
                        getTranslation(parseTranslations(a.translations), 'name', locale) || a.slug
                    )
                    .filter(Boolean);

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
                        amenities={amenityNames}
                        isFavorited={
                          favoritedIds.has(String(restaurant.id)) || favoritedIds.has(restaurant.id)
                        }
                        onFavoriteToggle={() => handleToggleFavorite(restaurant.id)}
                      />
                    </CardWrapper>
                  );
                })
              )}
            </Grid>

            <Pagination page={pageParam} totalPages={totalPages} onPageChange={handlePageChange} />
          </GridSection>
        </MainContent>
      </ContentWrapper>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
