import { useMemo } from 'react';
import useSWR from 'swr';

import { reservationsMyList, reservationsMyRetrieve } from '@/api/generated';
import { ReservationList } from '@/api/generated/interfaces';
import {
  getMockReservationDetail,
  MOCK_ACTIVE,
  MOCK_HISTORY,
  MOCK_RESTAURANTS,
} from '@/mocks/reservations';

export {
  getMockReservationDetail,
  MOCK_ACTIVE,
  MOCK_HISTORY,
  MOCK_ORDER_ITEMS,
  MOCK_DEPOSIT,
  MOCK_PROFILE,
  MOCK_RESTAURANTS,
} from '@/mocks/reservations';

const PAGE_SIZE = 20;
const MOCK_PAGE_SIZE = 3;
const TODAY = new Date().toISOString().split('T')[0];

// ─── Mock ─────────────────────────────────────────────────────────────────────
export const MOCK_MODE = process.env.NEXT_PUBLIC_USE_MOCK_RESERVATIONS === 'true';

export function getMockRestaurantData(id: string) {
  const num = parseInt(id.replace('mock-', ''), 10);
  if (isNaN(num)) return null;
  return MOCK_RESTAURANTS[(num - 1) % MOCK_RESTAURANTS.length];
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useActiveReservations(page = 1) {
  const { data, error, isLoading, mutate } = useSWR(
    MOCK_MODE ? null : ['reservations', 'active', page],
    () => reservationsMyList('-created_at', page, PAGE_SIZE),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const reservations = useMemo<ReservationList[]>(() => {
    if (MOCK_MODE) {
      const start = (page - 1) * MOCK_PAGE_SIZE;
      return MOCK_ACTIVE.slice(start, start + MOCK_PAGE_SIZE) as unknown as ReservationList[];
    }
    return (data?.results ?? []).filter((r: ReservationList) => r.reservation_date >= TODAY);
  }, [data, page]);

  return {
    reservations,
    count: MOCK_MODE ? MOCK_ACTIVE.length : (data?.count ?? 0),
    hasMore: MOCK_MODE ? page * MOCK_PAGE_SIZE < MOCK_ACTIVE.length : !!data?.next,
    isLoading: MOCK_MODE ? false : isLoading,
    error: MOCK_MODE ? null : error,
    mutate,
  };
}

export function useHistoryReservations(page = 1) {
  const { data, error, isLoading, mutate } = useSWR(
    MOCK_MODE ? null : ['reservations', 'history', page],
    () => reservationsMyList('-created_at', page, PAGE_SIZE),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const reservations = useMemo<ReservationList[]>(() => {
    if (MOCK_MODE) {
      const start = (page - 1) * MOCK_PAGE_SIZE;
      return MOCK_HISTORY.slice(start, start + MOCK_PAGE_SIZE) as unknown as ReservationList[];
    }
    return (data?.results ?? []).filter((r: ReservationList) => r.reservation_date < TODAY);
  }, [data, page]);

  return {
    reservations,
    count: MOCK_MODE ? MOCK_HISTORY.length : (data?.count ?? 0),
    hasMore: MOCK_MODE ? page * MOCK_PAGE_SIZE < MOCK_HISTORY.length : !!data?.next,
    isLoading: MOCK_MODE ? false : isLoading,
    error: MOCK_MODE ? null : error,
    mutate,
  };
}

export function useReservationDetail(id: string | null) {
  const { data, error, isLoading } = useSWR(
    MOCK_MODE || !id ? null : ['reservation', 'detail', id],
    () => reservationsMyRetrieve(id!),
    { revalidateOnFocus: false }
  );

  const mockReservation = useMemo(() => {
    if (!MOCK_MODE || !id) return null;
    return getMockReservationDetail(id, TODAY);
  }, [id]);

  return {
    reservation: MOCK_MODE ? mockReservation : (data ?? null),
    isLoading: MOCK_MODE ? false : isLoading,
    error: MOCK_MODE ? null : error,
  };
}
