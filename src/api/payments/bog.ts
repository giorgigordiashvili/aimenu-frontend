import axiosInstance from '@/api/axios';
import type { CreateOrderRequest } from '@/api/order-payload';

// Generated `paymentsBogInitiateCreate` / `paymentsBogStatusRetrieve` are typed
// as `any` because drf-spectacular doesn't annotate request bodies for these
// endpoints. We call via axiosInstance directly so the frontend side stays
// typed end-to-end. If a future schema regeneration adds real types, swap.

interface InitiatePaymentResponse {
  bog_order_id: string;
  redirect_url: string;
  order_number?: string;
  reservation_id?: string;
  confirmation_code?: string;
  method_intent_id?: string;
}

interface BackendEnvelope<T> {
  success?: boolean;
  data?: T;
}

function unwrap<T>(body: BackendEnvelope<T> | T | undefined): T {
  if (body && typeof body === 'object' && 'data' in body && body.data !== undefined) {
    return body.data as T;
  }
  return body as T;
}

export interface InitiateOrderPaymentBody {
  // CreateOrderRequest doesn't expose wallet_amount — backend's
  // OrderPayloadSerializer accepts it as an optional decimal string. We pass
  // it through as a sibling field rather than retyping the order payload.
  order_payload: CreateOrderRequest & { wallet_amount?: number };
  return_url: string;
}

export interface ReservationPayloadItem {
  menu_item_id: string;
  quantity: number;
  modifier_ids?: string[];
  special_instructions?: string;
}

export interface ReservationPaymentPayload {
  restaurant_slug: string;
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  special_requests?: string;
  deposit_amount_override?: number;
  /**
   * Wallet credit to apply against the pre-order portion. Backend clamps to
   * min(balance, pre_order subtotal − discount); deposit is never discounted.
   */
  wallet_amount?: number;
  /**
   * Optional pre-order: food the guest wants prepared for arrival. Backend
   * creates a sibling Order and charges deposit + order total in one BOG
   * transaction.
   */
  items?: ReservationPayloadItem[];
}

export interface InitiateReservationPaymentBody {
  reservation_payload: ReservationPaymentPayload;
  return_url: string;
}

export interface SessionSettlePayload {
  restaurant_slug: string;
  session_id: string;
  tip_amount?: number;
}

export interface InitiateSessionSettleBody {
  session_payload: SessionSettlePayload;
  return_url: string;
}

export interface SessionSettleResponse extends InitiatePaymentResponse {
  session_id?: string;
  covered_order_numbers?: string[];
  amount?: string;
}

export async function initiateOrderPayment(
  body: InitiateOrderPaymentBody
): Promise<InitiatePaymentResponse> {
  const response = await axiosInstance.post<BackendEnvelope<InitiatePaymentResponse>>(
    '/api/v1/payments/bog/initiate/',
    { target: 'order', ...body }
  );
  return unwrap(response.data);
}

export async function initiateReservationPayment(
  body: InitiateReservationPaymentBody
): Promise<InitiatePaymentResponse> {
  const response = await axiosInstance.post<BackendEnvelope<InitiatePaymentResponse>>(
    '/api/v1/payments/bog/initiate/',
    { target: 'reservation', ...body }
  );
  return unwrap(response.data);
}

export async function initiateSessionSettle(
  body: InitiateSessionSettleBody
): Promise<SessionSettleResponse> {
  const response = await axiosInstance.post<BackendEnvelope<SessionSettleResponse>>(
    '/api/v1/payments/bog/initiate/',
    { target: 'session', ...body }
  );
  return unwrap(response.data);
}

export async function initiateAddCard(return_url: string): Promise<InitiatePaymentResponse> {
  const response = await axiosInstance.post<BackendEnvelope<InitiatePaymentResponse>>(
    '/api/v1/payments/methods/add/',
    { return_url }
  );
  return unwrap(response.data);
}

export type BogStatus =
  | 'created'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'auth_requested'
  | 'blocked'
  | 'partial_completed'
  | 'refund_requested'
  | 'refunded'
  | 'refunded_partially';

export interface BogStatusResponse {
  status: BogStatus;
  code?: number | null;
  code_description?: string;
  order_number?: string | null;
  reservation_id?: string | null;
  payment_method_id?: string | null;
  session_id?: string | null;
  flow_type?: string;
}

export async function fetchBogStatus(bogOrderId: string): Promise<BogStatusResponse> {
  const response = await axiosInstance.get<BackendEnvelope<BogStatusResponse>>(
    `/api/v1/payments/bog/status/${bogOrderId}/`
  );
  return unwrap(response.data);
}

export const BOG_TERMINAL_STATUSES: ReadonlySet<BogStatus> = new Set([
  'completed',
  'rejected',
  'refunded',
  'refunded_partially',
]);

export const BOG_SUCCESS_STATUSES: ReadonlySet<BogStatus> = new Set([
  'completed',
  'partial_completed',
]);
