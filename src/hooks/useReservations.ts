import { useMemo } from 'react';
import useSWR from 'swr';

import { reservationsMyList, reservationsMyRetrieve } from '@/api/generated';
import { ReservationDetail, ReservationList } from '@/api/generated/interfaces';

const PAGE_SIZE = 20;
const MOCK_PAGE_SIZE = 3;
const TODAY = new Date().toISOString().split('T')[0];

// ─── Mock ─────────────────────────────────────────────────────────────────────
// Set to false to use real API data
export const MOCK_MODE = true;

const MOCK_ACTIVE: ReservationList[] = [
  {
    id: 'mock-1',
    confirmation_code: 'AIM-2847',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2026-03-05',
    reservation_time: '19:00',
    party_size: 2,
    status: { value: 'confirmed' },
    status_display: 'დადასტურებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-1',
    table_number: '5',
    can_cancel: true,
    can_modify: true,
    created_at: '2026-02-20T10:00:00Z',
  },
  {
    id: 'mock-2',
    confirmation_code: 'AIM-3391',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2026-03-15',
    reservation_time: '13:30',
    party_size: 4,
    status: { value: 'pending' },
    status_display: 'მოლოდინში',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-2',
    table_number: '12',
    can_cancel: true,
    can_modify: false,
    created_at: '2026-02-24T14:22:00Z',
  },
  {
    id: 'mock-6',
    confirmation_code: 'AIM-4412',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2026-03-22',
    reservation_time: '20:00',
    party_size: 3,
    status: { value: 'confirmed' },
    status_display: 'დადასტურებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-6',
    table_number: '7',
    can_cancel: true,
    can_modify: true,
    created_at: '2026-02-25T09:00:00Z',
  },
  {
    id: 'mock-7',
    confirmation_code: 'AIM-5503',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2026-04-01',
    reservation_time: '21:00',
    party_size: 5,
    status: { value: 'pending' },
    status_display: 'მოლოდინში',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-7',
    table_number: '9',
    can_cancel: true,
    can_modify: false,
    created_at: '2026-02-26T08:30:00Z',
  },
  {
    id: 'mock-8',
    confirmation_code: 'AIM-6677',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2026-04-10',
    reservation_time: '18:30',
    party_size: 2,
    status: { value: 'confirmed' },
    status_display: 'დადასტურებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-8',
    table_number: '4',
    can_cancel: true,
    can_modify: true,
    created_at: '2026-02-26T11:00:00Z',
  },
  {
    id: 'mock-9',
    confirmation_code: 'AIM-7891',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2026-04-18',
    reservation_time: '19:30',
    party_size: 6,
    status: { value: 'confirmed' },
    status_display: 'დადასტურებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-9',
    table_number: '15',
    can_cancel: false,
    can_modify: false,
    created_at: '2026-02-26T12:00:00Z',
  },
  {
    id: 'mock-10',
    confirmation_code: 'AIM-8002',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2026-05-02',
    reservation_time: '20:30',
    party_size: 3,
    status: { value: 'pending' },
    status_display: 'მოლოდინში',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-10',
    table_number: '11',
    can_cancel: true,
    can_modify: true,
    created_at: '2026-02-26T13:00:00Z',
  },
];

const MOCK_HISTORY: ReservationList[] = [
  {
    id: 'mock-3',
    confirmation_code: 'AIM-1102',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2026-02-10',
    reservation_time: '20:00',
    party_size: 3,
    status: { value: 'completed' },
    status_display: 'დასრულებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-3',
    table_number: '8',
    can_cancel: false,
    can_modify: false,
    created_at: '2026-02-05T09:15:00Z',
  },
  {
    id: 'mock-4',
    confirmation_code: 'AIM-0884',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2026-01-20',
    reservation_time: '18:00',
    party_size: 2,
    status: { value: 'cancelled' },
    status_display: 'გაუქმებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-4',
    table_number: '3',
    can_cancel: false,
    can_modify: false,
    created_at: '2026-01-15T11:30:00Z',
  },
  {
    id: 'mock-5',
    confirmation_code: 'AIM-0521',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2025-12-28',
    reservation_time: '21:00',
    party_size: 6,
    status: { value: 'completed' },
    status_display: 'დასრულებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-5',
    table_number: '2',
    can_cancel: false,
    can_modify: false,
    created_at: '2025-12-20T16:45:00Z',
  },
  {
    id: 'mock-11',
    confirmation_code: 'AIM-0310',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2025-12-05',
    reservation_time: '19:00',
    party_size: 4,
    status: { value: 'completed' },
    status_display: 'დასრულებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-11',
    table_number: '6',
    can_cancel: false,
    can_modify: false,
    created_at: '2025-11-28T10:00:00Z',
  },
  {
    id: 'mock-12',
    confirmation_code: 'AIM-0198',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2025-11-14',
    reservation_time: '13:00',
    party_size: 2,
    status: { value: 'cancelled' },
    status_display: 'გაუქმებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-12',
    table_number: '1',
    can_cancel: false,
    can_modify: false,
    created_at: '2025-11-10T08:00:00Z',
  },
  {
    id: 'mock-13',
    confirmation_code: 'AIM-0077',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2025-10-30',
    reservation_time: '20:30',
    party_size: 5,
    status: { value: 'completed' },
    status_display: 'დასრულებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-13',
    table_number: '14',
    can_cancel: false,
    can_modify: false,
    created_at: '2025-10-22T15:00:00Z',
  },
  {
    id: 'mock-14',
    confirmation_code: 'AIM-9955',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2025-10-10',
    reservation_time: '18:00',
    party_size: 3,
    status: { value: 'completed' },
    status_display: 'დასრულებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-14',
    table_number: '10',
    can_cancel: false,
    can_modify: false,
    created_at: '2025-10-05T09:30:00Z',
  },
  {
    id: 'mock-15',
    confirmation_code: 'AIM-9801',
    guest_name: 'გიორგი ჩილინგარაშვილი',
    guest_phone: '+995 555 123 456',
    reservation_date: '2025-09-18',
    reservation_time: '21:30',
    party_size: 2,
    status: { value: 'completed' },
    status_display: 'დასრულებული',
    source: { value: 'web' },
    source_display: 'Web',
    table: 'table-15',
    table_number: '13',
    can_cancel: false,
    can_modify: false,
    created_at: '2025-09-10T12:00:00Z',
  },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useActiveReservations(page = 1) {
  const { data, error, isLoading, mutate } = useSWR(
    MOCK_MODE ? null : ['reservations', 'active', page],
    () => reservationsMyList('reservation_date', page, PAGE_SIZE),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const reservations = useMemo(() => {
    if (MOCK_MODE) {
      const start = (page - 1) * MOCK_PAGE_SIZE;
      return MOCK_ACTIVE.slice(start, start + MOCK_PAGE_SIZE);
    }
    return (data?.results ?? []).filter(r => r.reservation_date >= TODAY);
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
    () => reservationsMyList('-reservation_date', page, PAGE_SIZE),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const reservations = useMemo(() => {
    if (MOCK_MODE) {
      const start = (page - 1) * MOCK_PAGE_SIZE;
      return MOCK_HISTORY.slice(start, start + MOCK_PAGE_SIZE);
    }
    return (data?.results ?? []).filter(r => r.reservation_date < TODAY);
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

  const mockReservation = useMemo((): ReservationDetail | null => {
    if (!MOCK_MODE || !id) return null;
    const all = [...MOCK_ACTIVE, ...MOCK_HISTORY];
    const found = all.find(r => r.id === id);
    if (!found) return null;
    return {
      ...found,
      restaurant: 'mock-restaurant',
      customer_email: 'guest@example.com',
      confirmed_at: found.created_at,
      cancelled_at: '',
      seated_at: '',
      completed_at: '',
      is_upcoming: found.reservation_date >= TODAY,
      history: [],
      updated_at: found.created_at,
    };
  }, [id]);

  return {
    reservation: MOCK_MODE ? mockReservation : (data ?? null),
    isLoading: MOCK_MODE ? false : isLoading,
    error: MOCK_MODE ? null : error,
  };
}
