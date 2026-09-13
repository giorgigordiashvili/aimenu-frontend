import axiosInstance from '@/api/axios';

export interface WaitlistJoinInfo {
  restaurant: string;
  open: boolean;
  waiting: number;
  max_party_size: number;
  estimate: number;
}

export interface WaitlistPublicStatus {
  name: string;
  party_size: number;
  status: 'waiting' | 'notified' | 'seated' | 'left' | 'cancelled' | 'no_show';
  position: number;
  ahead: number;
  quoted_minutes: number;
  estimated_ready_at: string | null;
  restaurant: string;
  restaurant_slug: string;
}

export async function fetchWaitlistInfo(slug: string, token: string): Promise<WaitlistJoinInfo> {
  return (await axiosInstance.get<WaitlistJoinInfo>(`/api/v1/waitlist/${slug}/${token}/`)).data;
}

export async function joinWaitlist(
  slug: string,
  token: string,
  body: { name: string; phone: string; party_size: number }
): Promise<WaitlistPublicStatus & { token: string }> {
  return (
    await axiosInstance.post<WaitlistPublicStatus & { token: string }>(
      `/api/v1/waitlist/${slug}/${token}/`,
      body
    )
  ).data;
}

export async function fetchWaitlistStatus(token: string): Promise<WaitlistPublicStatus> {
  return (await axiosInstance.get<WaitlistPublicStatus>(`/api/v1/waitlist/status/${token}/`)).data;
}

export async function leaveWaitlist(token: string): Promise<WaitlistPublicStatus> {
  return (await axiosInstance.delete<WaitlistPublicStatus>(`/api/v1/waitlist/status/${token}/`))
    .data;
}

export function waitlistError(err: unknown): string | null {
  const data = (err as { response?: { data?: { error?: { code?: string } } } })?.response?.data;
  return data?.error?.code ?? null;
}
