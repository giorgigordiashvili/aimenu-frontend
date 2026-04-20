// Request shape for POST /api/v1/orders/create/.
// The generated client (src/api/generated/api.ts → ordersCreateCreate)
// is untyped because the backend isn't exposing drf-spectacular request
// annotations for this endpoint. We model the payload here from the
// response-side Order / OrderItem shapes in src/api/generated/interfaces.ts
// plus Django-order-create conventions used by reservations in this API.
//
// If a future `npm run generate:api` introduces a real CreateOrderRequest
// type, swap callers to that and delete this file.

import type { Order } from '@/api/generated/interfaces';

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export interface OrderItemPayload {
  menu_item: string;
  quantity: number;
  special_instructions?: string;
  modifiers: Array<{ modifier: string }>;
}

export interface CreateOrderRequest {
  restaurant_slug: string;
  order_type: OrderType;
  /** Table UUID; set when ordering from a QR-scanned table without an active session. */
  table?: string;
  /** TableSession UUID; set when the user has joined a live session (host or guest). */
  table_session?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  customer_notes?: string;
  items: OrderItemPayload[];
}

export type CreateOrderResponse = Order;
