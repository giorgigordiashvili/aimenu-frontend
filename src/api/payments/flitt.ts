import axiosInstance from '@/api/axios';

import type { InitiateOrderPaymentBody, InitiateReservationPaymentBody } from './bog';

// Flitt-side wrapper. Mirrors `bog.ts` so the provider picker can swap
// between the two with minimal branching at the call site.

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

export interface InitiateFlittResponse {
  provider: 'flitt';
  flitt_order_id: string;
  flitt_payment_id: string;
  redirect_url: string;
  order_number?: string;
  reservation_confirmation_code?: string;
  amount: string;
  currency: string;
}

export async function initiateOrderFlitt(
  body: InitiateOrderPaymentBody
): Promise<InitiateFlittResponse> {
  const response = await axiosInstance.post<BackendEnvelope<InitiateFlittResponse>>(
    '/api/v1/payments/flitt/initiate/',
    { target: 'order', ...body }
  );
  return unwrap(response.data);
}

export async function initiateReservationFlitt(
  body: InitiateReservationPaymentBody
): Promise<InitiateFlittResponse> {
  const response = await axiosInstance.post<BackendEnvelope<InitiateFlittResponse>>(
    '/api/v1/payments/flitt/initiate/',
    { target: 'reservation', ...body }
  );
  return unwrap(response.data);
}

// Status shape — mirrors the BOG one but with Flitt's status vocabulary.
export type FlittStatus =
  | 'created'
  | 'processing'
  | 'approved'
  | 'declined'
  | 'expired'
  | 'reversed'
  | 'reversed_partially';

export type FlittSettlementStatus = 'not_started' | 'pending' | 'settled' | 'error';

export interface FlittStatusResponse {
  status: FlittStatus;
  settlement_status?: FlittSettlementStatus;
  order_number?: string | null;
  reservation_id?: string | null;
  session_id?: string | null;
  flow_type?: string;
}

export async function fetchFlittStatus(flittOrderId: string): Promise<FlittStatusResponse> {
  const response = await axiosInstance.get<BackendEnvelope<FlittStatusResponse>>(
    `/api/v1/payments/flitt/status/${flittOrderId}/`
  );
  return unwrap(response.data);
}

export const FLITT_TERMINAL_STATUSES: ReadonlySet<FlittStatus> = new Set([
  'approved',
  'declined',
  'expired',
  'reversed',
  'reversed_partially',
]);

export const FLITT_SUCCESS_STATUSES: ReadonlySet<FlittStatus> = new Set(['approved']);
