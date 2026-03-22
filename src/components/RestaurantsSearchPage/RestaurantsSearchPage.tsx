'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { styled } from '@pigment-css/react';

import { restaurantsList } from '@/api/generated/api';
import type { RestaurantList } from '@/api/generated/interfaces';
import axiosInstance from '@/api/axios';
import CategoryTabs from '@/components/CategoryTabs/CategoryTabs';
import RestaurantCardPrimary from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';
import HeroSection from '@/components/RestaurantsListPage/HeroSection';
import type { SearchFiltersValue } from '@/components/RestaurantsListPage/SearchFilters';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { muted, slate100, slate200, white } from '@/tokens';
import { getTranslation } from '@/utils/translations';
import Pagination from './Pagination';

// ── Styled ────────────────────────────────────────────────────────────────────

const StickyHeader = styled('div')({
  position: 'sticky',
  top: 0,
  zIndex: 100,
});

const PageWrapper = styled('div')({
  minHeight: '100vh',
  background: white,
});

const ContentWrapper = styled('div')({
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '32px 20px 80px',
  '@media (min-width: 768px)': {
    padding: '48px 80px 100px',
  },
});

const CategoryTabsWrapper = styled('div')({
  marginBottom: '32px',
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

  // Local filter form state (mirrors URL)
  const [filters, setFilters] = useState<SearchFiltersValue>({
    city: cityParam,
    date: null,
    time: '',
    guests: 2,
  });

  // Data state
  const [restaurants, setRestaurants] = useState<RestaurantList[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Sync city from URL to local filter state
  useEffect(() => {
    setFilters(prev => ({ ...prev, city: cityParam }));
  }, [cityParam]);

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
      undefined, // name
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
  }, [cityParam, categoryParam, pageParam]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (categoryParam) params.set('category', categoryParam);
    params.set('page', '1');
    router.push(`/${locale}/restaurants-search?${params.toString()}`);
  }, [filters.city, categoryParam, locale, router]);

  const handleCategoryChange = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams();
      if (cityParam) params.set('city', cityParam);
      if (id) params.set('category', id);
      params.set('page', '1');
      router.push(`/${locale}/restaurants-search?${params.toString()}`);
    },
    [cityParam, locale, router]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      const params = new URLSearchParams();
      if (cityParam) params.set('city', cityParam);
      if (categoryParam) params.set('category', categoryParam);
      params.set('page', String(p));
      router.push(`/${locale}/restaurants-search?${params.toString()}`);
    },
    [cityParam, categoryParam, locale, router]
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      <StickyHeader>
        <HeroSection filters={filters} onFiltersChange={setFilters} onSearch={handleSearch} />
      </StickyHeader>

      <ContentWrapper>
        <CategoryTabsWrapper>
          <CategoryTabs
            categories={categories}
            activeCategory={categoryParam}
            onCategoryChange={handleCategoryChange}
          />
        </CategoryTabsWrapper>

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
    </PageWrapper>
  );
}
