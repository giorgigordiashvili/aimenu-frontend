import axiosInstance from '@/api/axios';

import type { CreateOrderRequest, CreateOrderResponse } from './order-payload';

/**
 * POST /api/v1/orders/create/
 *
 * The generated client wraps this without a request body because drf-spectacular
 * doesn't annotate the endpoint; call via axiosInstance directly so the payload
 * stays typed through CreateOrderRequest. Auth and the {success,data} envelope
 * are both handled by the shared axios setup.
 */
export async function submitOrder(body: CreateOrderRequest): Promise<CreateOrderResponse> {
  const response = await axiosInstance.post<CreateOrderResponse>('/api/v1/orders/create/', body);
  return response.data;
}
