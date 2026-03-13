'use client';

import { styled } from '@pigment-css/react';
import { useCallback, useEffect, useState } from 'react';

import { restaurantsList } from '@/api/generated/api';
import type { RestaurantList } from '@/api/generated/interfaces';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import { useLocale, useTranslations } from '@/context/LocaleContext';

import HeroSection from './HeroSection';
import RestaurantGrid from './RestaurantGrid';
import { SearchFiltersValue } from './SearchFilters';

// ── Styled ────────────────────────────────────────────────────────────────────

const PageWrapper = styled('div')({
  minHeight: '100vh',
  background: '#f8fafc',
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

  const [filters, setFilters] = useState<SearchFiltersValue>({
    city: undefined,
    date: null,
    time: '',
    guests: 2,
  });

  const [restaurants, setRestaurants] = useState<RestaurantList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async (city?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await restaurantsList(
        undefined,   // acceptsRemoteOrders
        undefined,   // acceptsReservations
        undefined,   // acceptsTakeaway
        city,        // city
        undefined,   // country
        undefined,   // minRating
        undefined,   // name
        '-average_rating', // ordering — popular first
        1,           // page
        12           // pageSize
      );
      setRestaurants(data.results);
    } catch {
      setError(t.restaurantsList.noResults);
    } finally {
      setLoading(false);
    }
  }, [t.restaurantsList.noResults]);

  // Initial load
  useEffect(() => {
    fetchRestaurants(filters.city);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger search on city change (immediate, debounce-free — city is a fixed dropdown)
  const handleSearch = useCallback(() => {
    fetchRestaurants(filters.city);
  }, [fetchRestaurants, filters.city]);

  return (
    <PageWrapper>
      <HeaderPrimary />

      <Main>
        <HeroSection
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
        />
        <RestaurantGrid
          restaurants={restaurants}
          loading={loading}
          error={error}
        />
      </Main>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
