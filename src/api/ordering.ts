import axiosInstance from '@/api/axios';

export interface OrderingZone {
  id: string;
  name: string;
  kind: 'radius' | 'polygon';
  radius_km: number;
  polygon: number[][];
  fee: string;
  min_order: string;
  eta_minutes: number;
  color: string;
}

export interface OrderingConfig {
  enabled: boolean;
  pickup: boolean;
  delivery: boolean;
  asap: boolean;
  scheduling: boolean;
  open_now: boolean;
  paused: boolean;
  pause_reason: string;
  resume_at: string | null;
  next_opening: string | null;
  closes_at: string | null;
  lead_minutes: number;
  delivery_lead_minutes: number;
  min_order_pickup: string;
  min_order_delivery: string;
  free_delivery_over: string;
  packaging_fee: string;
  max_days_ahead: number;
  restaurant_location: { lat: number; lng: number } | null;
  zones: OrderingZone[];
}

export interface Slot {
  time: string;
  label: string;
}

export interface DeliveryQuote {
  zone_id: string | null;
  zone_name: string;
  fee: string;
  eta_minutes: number;
  min_order: string;
  free_delivery_over: string;
  distance_km: number | null;
}

export interface OrderingError {
  code: string;
  message: string;
  next_opening?: string | null;
  minimum?: string;
  missing?: string;
  resume_at?: string;
}

/** Public ordering rules for the restaurant page (hours, pickup / delivery, zones). */
export async function fetchOrderingConfig(slug: string): Promise<OrderingConfig> {
  const res = await axiosInstance.get<OrderingConfig>(`/api/v1/ordering/${slug}/config/`);
  return res.data;
}

export async function fetchSlots(
  slug: string,
  kind: 'takeaway' | 'delivery',
  date: string
): Promise<Slot[]> {
  const res = await axiosInstance.get<{ date: string; slots: Slot[] }>(
    `/api/v1/ordering/${slug}/slots/`,
    { params: { kind, date } }
  );
  return res.data.slots;
}

export async function quoteDelivery(
  slug: string,
  lat: number,
  lng: number,
  subtotal: number
): Promise<DeliveryQuote> {
  const res = await axiosInstance.post<DeliveryQuote>(`/api/v1/ordering/${slug}/delivery-quote/`, {
    lat,
    lng,
    subtotal: subtotal.toFixed(2),
  });
  return res.data;
}

/** {success:false, error:{code,...}} → the error block, or null for anything else. */
export function orderingError(err: unknown): OrderingError | null {
  const data = (err as { response?: { data?: { error?: OrderingError } } })?.response?.data;
  return data?.error?.code ? data.error : null;
}
