'use client';

import useSWR from 'swr';

import { loyaltyPlatformStatusRetrieve } from '@/api/generated/api';

// Shape the backend returns. Typed client-side because the generator
// emits `Promise<any>` (no @extend_schema response annotation).
export interface PlatformLoyaltyTier {
  slug: string;
  name: string;
  min_points: number;
  discount_percent: number;
}

export interface PlatformLoyaltyStatus {
  current_tier: PlatformLoyaltyTier | null;
  next_tier: PlatformLoyaltyTier | null;
  points: string;
  points_to_next: string;
  window_started: string;
}

async function fetcher(): Promise<PlatformLoyaltyStatus | null> {
  try {
    const res = (await loyaltyPlatformStatusRetrieve()) as PlatformLoyaltyStatus;
    return res ?? null;
  } catch {
    // 401 for anonymous users — swallow and report null so consumers
    // can render "sign in to unlock" copy instead of an error.
    return null;
  }
}

export function usePlatformLoyalty() {
  const { data, isLoading, mutate } = useSWR<PlatformLoyaltyStatus | null>(
    'platform-loyalty-status',
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
    }
  );

  return {
    status: data ?? null,
    isLoading,
    mutate,
  };
}
