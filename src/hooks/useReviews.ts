import useSWR from 'swr';

import {
  EligibleOrder,
  getRestaurantReviewStats,
  listEligibleOrders,
  listMyReviews,
  listRestaurantReviews,
  Paginated,
  Review,
  ReviewStats,
} from '@/api/reviews';
import { useAuth } from '@/context/AuthContext';

// Coerce the eligible-orders response shape. Axios's envelope unwrapper
// strips `{success, data}`, but DRF list views paginated vs not-paginated
// differ, so handle both.
function normaliseList<T>(raw: Paginated<T> | T[] | undefined): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return raw.results ?? [];
}

export function useRestaurantReviews(slug: string | undefined, page = 1) {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Review>>(
    slug ? ['reviews:restaurant', slug, page] : null,
    () => listRestaurantReviews(slug!, page),
    { revalidateOnFocus: false }
  );
  return {
    results: data?.results ?? [],
    count: data?.count ?? 0,
    hasMore: !!data?.next,
    error,
    isLoading,
    mutate,
  };
}

export function useRestaurantReviewStats(slug: string | undefined) {
  const { data, isLoading, mutate } = useSWR<ReviewStats>(
    slug ? ['reviews:stats', slug] : null,
    () => getRestaurantReviewStats(slug!),
    { revalidateOnFocus: false }
  );
  return { stats: data, isLoading, mutate };
}

export function usePendingReviews() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, mutate } = useSWR(
    isAuthenticated ? 'reviews:eligible-orders' : null,
    async () => normaliseList<EligibleOrder>(await listEligibleOrders()),
    { revalidateOnFocus: true, dedupingInterval: 60 * 1000 }
  );
  return { orders: data ?? [], isLoading, mutate };
}

export function useMyReviews(page = 1) {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, mutate } = useSWR<Paginated<Review>>(
    isAuthenticated ? ['reviews:mine', page] : null,
    () => listMyReviews(page),
    { revalidateOnFocus: false }
  );
  return {
    results: data?.results ?? [],
    count: data?.count ?? 0,
    hasMore: !!data?.next,
    isLoading,
    mutate,
  };
}
