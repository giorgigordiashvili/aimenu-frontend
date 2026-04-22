import useSWR from 'swr';

import {
  fetchReferralSummary,
  fetchReferredUsers,
  fetchWalletHistory,
  type Paginated,
  type ReferralSummary,
  type ReferredUser,
  type WalletTransaction,
} from '@/api/referrals';

// Three thin SWR wrappers around /api/v1/referrals/*. Kept as separate hooks
// (instead of one mega-hook) so a page that only needs the headline numbers
// doesn't pay for the full ledger fetch.

export function useReferralSummary() {
  return useSWR<ReferralSummary>(['referrals', 'me'], () => fetchReferralSummary(), {
    revalidateOnFocus: true,
    keepPreviousData: true,
  });
}

export function useWalletHistory(page = 1) {
  return useSWR<Paginated<WalletTransaction> | WalletTransaction[]>(
    ['referrals', 'history', page],
    () => fetchWalletHistory(page),
    { revalidateOnFocus: true, keepPreviousData: true }
  );
}

export function useReferredUsers() {
  return useSWR<ReferredUser[]>(['referrals', 'referred'], () => fetchReferredUsers(), {
    revalidateOnFocus: true,
    keepPreviousData: true,
  });
}
