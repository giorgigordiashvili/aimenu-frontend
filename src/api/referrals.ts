import axiosInstance from '@/api/axios';

// Hand-written wrapper for /api/v1/referrals/* until the next generated-API
// pass picks it up. Kept tight on purpose — backend is the single source of
// truth for amounts and effective_percent. UI is only responsible for
// rendering numbers, never recomputing them.

export interface ReferralSummary {
  referral_code: string;
  referral_url: string;
  wallet_balance: string;
  total_earned: string;
  total_spent: string;
  referred_users_count: number;
  effective_percent: string;
}

export type WalletTransactionKind =
  | 'referral_credit'
  | 'order_spend'
  | 'refund_credit'
  | 'referral_clawback'
  | 'manual_adjustment';

export interface WalletTransaction {
  id: string;
  kind: WalletTransactionKind;
  amount: string;
  balance_after: string;
  source_order: string | null;
  source_order_number: string | null;
  referred_user: string | null;
  referred_user_email: string | null;
  notes: string;
  created_at: string;
}

export interface ReferredUser {
  id: string;
  email: string;
  full_name: string;
  joined_at: string;
  total_earned: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function fetchReferralSummary(): Promise<ReferralSummary> {
  const { data } = await axiosInstance.get<ReferralSummary>('/api/v1/referrals/me/');
  return data;
}

export async function fetchWalletHistory(
  page = 1
): Promise<Paginated<WalletTransaction> | WalletTransaction[]> {
  const { data } = await axiosInstance.get<Paginated<WalletTransaction> | WalletTransaction[]>(
    '/api/v1/referrals/history/',
    { params: { page } }
  );
  return data;
}

export async function fetchReferredUsers(): Promise<ReferredUser[]> {
  const { data } = await axiosInstance.get<ReferredUser[]>('/api/v1/referrals/referred/');
  return data;
}
