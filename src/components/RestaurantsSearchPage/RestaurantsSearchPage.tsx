'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { styled } from '@pigment-css/react';

import { restaurantsList } from '@/api/generated/api';
import type { RestaurantList } from '@/api/generated/interfaces';
import axiosInstance from '@/api/axios';
import CategoryFilterTabs from '@/components/CategoryFilterTabs/CategoryFilterTabs';
import Footer from '@/components/Footer/Footer';
import HeaderPrimary from '@/components/HeaderPrimary/HeaderPrimary';
import RestaurantCardPrimary from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { border, foreground, muted, slate100, slate200, slate400, white } from '@/tokens';
import { getTranslation } from '@/utils/translations';
import PageHeader from './PageHeader';
import Pagination from './Pagination';

// ── Styled ────────────────────────────────────────────────────────────────────

const PageWrapper = styled('div')({
  minHeight: '100vh',
  background: white,
  display: 'flex',
  flexDirection: 'column',
});

const MainContent = styled('main')({
  flex: 1,
});

const TabsSection = styled('div')({
  background: white,
  borderBottom: `1px solid ${slate200}`,
  padding: '16px 20px',
  '@media (min-width: 768px)': {
    padding: '16px 48px',
  },
});

const TabsInner = styled('div')({
  maxWidth: '1120px',
  margin: '0 auto',
});

const FiltersRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
  padding: '12px 20px',
  background: white,
  borderBottom: `1px solid ${slate200}`,
  '@media (min-width: 768px)': {
    padding: '12px 48px',
  },
});

const FiltersInner = styled('div')({
  maxWidth: '1120px',
  margin: '0 auto',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
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

const ContentWrapper = styled('div')({
  maxWidth: '1120px',
  margin: '0 auto',
  padding: '32px 20px 80px',
  '@media (min-width: 768px)': {
    padding: '48px 80px 100px',
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

  // Sync search input when URL param changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch categories once
  useEffect(() => {
    axiosInstance
      .get<{ id: string; name: string; icon?: string; slug: string }[]>(
        '/api/v1/restaurants/categories/'
      )
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setCategories(
          data.map(c => ({
            id: c.id ?? c.slug,
            name: c.name,
            icon: c.icon,
          }))
        );
      })
      .catch(() => {
        // categories are optional, ignore error
      });
  }, []);

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
    restaurantsList(
      undefined, // acceptsRemoteOrders
      undefined, // acceptsReservations
      undefined, // acceptsTakeaway
      cityParam || undefined, // city
      undefined, // country
      undefined, // minRating
      searchParam || undefined, // name
      undefined, // ordering
      pageParam, // page
      PAGE_SIZE, // pageSize
      categoryParam || undefined // search (used as category filter)
    )
      .then(data => {
        setRestaurants(data.results ?? []);
        setTotalCount(data.count ?? 0);
      })
      .catch(() => {
        setRestaurants([]);
        setTotalCount(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cityParam, categoryParam, pageParam, searchParam]);

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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      <HeaderPrimary />

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
          <FiltersInner>
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
          </FiltersInner>
        </FiltersRow>

        <ContentWrapper>
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
                    a => getTranslation(parseTranslations(a.translations), 'name', locale) || a.slug
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
                    />
                  </CardWrapper>
                );
              })
            )}
          </Grid>

          <Pagination page={pageParam} totalPages={totalPages} onPageChange={handlePageChange} />
        </ContentWrapper>
      </MainContent>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
