'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { restaurantsList } from '@/api/generated/api';
import type { RestaurantList } from '@/api/generated/interfaces';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { slate50 } from '@/tokens';

import HeroSection from './HeroSection';
import RestaurantGrid from './RestaurantGrid';
import { SearchFiltersValue } from './SearchFilters';

// ── Styled ────────────────────────────────────────────────────────────────────

const PageWrapper = styled('div')({
  minHeight: '100vh',
  background: slate50,
  display: 'flex',
  flexDirection: 'column',
});

const Main = styled('main')({
  flex: 1,
});

// ── Component ─────────────────────────────────────────────────────────────────

export default function RestaurantsListPage() {
  const { locale } = useLocale();
  const t = useTranslations();
  const router = useRouter();

  const [filters, setFilters] = useState<SearchFiltersValue>({
    city: undefined,
    date: null,
    time: '',
    guests: 2,
  });

  const [restaurants, setRestaurants] = useState<RestaurantList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(
    async (city?: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await restaurantsList(
          undefined, // acceptsRemoteOrders
          undefined, // acceptsReservations
          undefined, // acceptsTakeaway
          city, // city
          undefined, // country
          undefined, // minRating
          undefined, // name
          '-average_rating', // ordering — popular first
          1, // page
          12 // pageSize
        );
        setRestaurants(data.results);
      } catch {
        setError(t.restaurantsList.noResults);
      } finally {
        setLoading(false);
      }
    },
    [t.restaurantsList.noResults]
  );

  // Initial load
  useEffect(() => {
    fetchRestaurants(filters.city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger search and update URL with city param
  const handleSearch = useCallback(() => {
    fetchRestaurants(filters.city);
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    const query = params.toString();
    router.push(`/${locale}/restaurants${query ? `?${query}` : ''}`);
  }, [fetchRestaurants, filters.city, locale, router]);

  return (
    <PageWrapper>
      <HeaderPrimary />

      <Main>
        <HeroSection filters={filters} onFiltersChange={setFilters} onSearch={handleSearch} />
        <RestaurantGrid restaurants={restaurants} loading={loading} error={error} />
      </Main>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
