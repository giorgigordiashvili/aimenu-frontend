import axiosInstance from '@/api/axios';

export interface GiftCardBalance {
  masked_code: string;
  balance: string;
  currency: string;
  status: string;
  expires_at: string | null;
  restaurant: string;
}

export interface GiftCardView {
  restaurant: string;
  restaurant_slug: string;
  code: string;
  initial_value: string;
  balance: string;
  currency: string;
  status: string;
  design: string;
  recipient_name: string;
  purchaser_name: string;
  message: string;
  expires_at: string | null;
}

export async function checkGiftCard(slug: string, code: string): Promise<GiftCardBalance> {
  return (
    await axiosInstance.get<GiftCardBalance>(`/api/v1/gift-cards/${slug}/balance/`, {
      params: { code },
    })
  ).data;
}

export async function fetchGiftCard(token: string): Promise<GiftCardView> {
  return (
    await axiosInstance.get<GiftCardView>(`/api/v1/gift-cards/card/${token}/`, {
      params: { format: 'json' },
    })
  ).data;
}

export interface GiftCardPurchase {
  restaurant_slug: string;
  amount: string;
  purchaser_name?: string;
  purchaser_phone?: string;
  purchaser_email?: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_email?: string;
  message?: string;
  design?: string;
}

export async function initiateGiftCardPurchase(
  provider: 'bog' | 'flitt',
  payload: GiftCardPurchase,
  return_url: string
): Promise<{ redirect_url: string }> {
  const res = await axiosInstance.post<{ redirect_url: string }>(
    `/api/v1/payments/${provider}/initiate/`,
    { target: 'gift_card', gift_card_payload: payload, return_url }
  );
  return res.data;
}

export function giftCardError(err: unknown): string | null {
  const data = (err as { response?: { data?: { error?: { code?: string; message?: string } } } })
    ?.response?.data;
  return data?.error?.code ?? data?.error?.message ?? null;
}
