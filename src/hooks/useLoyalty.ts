import useSWR from 'swr';

import { loyaltyMyRetrieve } from '@/api/generated';

export interface LoyaltyCounterRow {
  id: string;
  punches: number;
  can_redeem: boolean;
  last_earned_at: string | null;
  restaurant_name?: string;
  restaurant_slug?: string;
  restaurant_logo?: string | null;
  program: {
    id: string;
    name: string;
    description: string;
    threshold: number;
    reward_quantity: number;
    trigger_item_detail?: { id: string; name: string; price: string; image?: string | null };
    reward_item_detail?: { id: string; name: string; price: string; image?: string | null };
  };
}

interface PaginatedCounters {
  count: number;
  results: LoyaltyCounterRow[];
}

export function useLoyaltyCounters() {
  const { data, error, isLoading, mutate } = useSWR<PaginatedCounters>(
    ['loyalty', 'my'],
    () => loyaltyMyRetrieve() as unknown as Promise<PaginatedCounters>,
    { revalidateOnFocus: true, keepPreviousData: true }
  );
  return {
    counters: data?.results ?? [],
    isLoading,
    error,
    mutate,
  };
}
