import axiosInstance from '@/api/axios';

export interface PromoCodeCheck {
  valid: boolean;
  code: string;
  name: string;
  mode: 'percent' | 'fixed' | '';
  value: string | null;
  discount: string | null;
  error: string;
  error_code: string;
}

/** Checkout preview of a promo code against the basket (public, throttled). */
export async function validatePromoCode(
  slug: string,
  code: string,
  items: Array<{ menu_item_id: string; quantity: number }>,
  channel: 'web' | 'qr' = 'web'
): Promise<PromoCodeCheck> {
  const response = await axiosInstance.post<PromoCodeCheck>(
    `/api/v1/promotions/${slug}/validate/`,
    {
      code,
      items,
      channel,
    }
  );
  return response.data;
}
