'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import {
  favoritesRestaurantsList,
  favoritesRestaurantsToggleCreate,
  restaurantsList,
} from '@/api/generated/api';
import type { RestaurantList } from '@/api/generated/interfaces';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import { useAuth } from '@/context/AuthContext';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
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
  const { user } = useAuth();

  const [filters, setFilters] = useState<SearchFiltersValue>({
    city: undefined,
    date: null,
    time: '',
    guests: 2,
  });

  const [restaurants, setRestaurants] = useState<RestaurantList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoritedIds, setFavoritedIds] = useState<Set<string | number>>(new Set());

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

  // Hydrate favorited IDs once the user is known (no-op for anonymous users).
  useEffect(() => {
    if (!user) {
      setFavoritedIds(new Set());
      return;
    }
    let cancelled = false;
    favoritesRestaurantsList(undefined, undefined, 1000)
      .then(res => {
        if (cancelled) return;
        setFavoritedIds(new Set<string | number>(res.results.map(f => f.restaurant)));
      })
      .catch(() => {
        // Silent — probably 401/expired session, the interceptor will handle.
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Trigger search and update URL with city param
  const handleSearch = useCallback(() => {
    fetchRestaurants(filters.city);
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    const query = params.toString();
    router.push(`${localePath(locale, '/restaurants')}${query ? `?${query}` : ''}`);
  }, [fetchRestaurants, filters.city, locale, router]);

  const handleToggleFavorite = useCallback(
    async (restaurantId: string | number) => {
      if (!user) {
        router.push(localePath(locale, '/login'));
        return;
      }
      const id = String(restaurantId);
      // Optimistic toggle
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
        // Revert on error by re-fetching the authoritative list.
        try {
          const res = await favoritesRestaurantsList(undefined, undefined, 1000);
          setFavoritedIds(new Set<string | number>(res.results.map(f => f.restaurant)));
        } catch {
          // ignore
        }
      }
    },
    [user, router, locale]
  );

  return (
    <PageWrapper>
      <HeaderPrimary />

      <Main>
        <HeroSection filters={filters} onFiltersChange={setFilters} onSearch={handleSearch} />
        <RestaurantGrid
          restaurants={restaurants}
          loading={loading}
          error={error}
          favoritedIds={favoritedIds}
          onToggleFavorite={handleToggleFavorite}
        />
      </Main>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
