import axiosInstance from '@/api/axios';

// Types mirror apps/reviews/serializers.py. Kept hand-written for now
// because drf-spectacular emits `Promise<any>` for the multipart media
// endpoint; once the generated client types are comfortable we can swap
// every read to the generated interfaces.

export interface ReviewMedia {
  id: string;
  kind: 'image' | 'video';
  file_url: string;
  blurhash: string;
  duration_s: number | null;
  position: number;
  created_at: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  restaurant_slug: string;
  order_number: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  title: string;
  body: string;
  media: ReviewMedia[];
  is_hidden: boolean;
  edited_at: string | null;
  edit_locks_at: string;
  is_editable: boolean;
  is_mine: boolean;
  can_report: boolean;
  open_reports: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  average: number;
  total: number;
  distribution: Record<'1' | '2' | '3' | '4' | '5', number>;
}

export interface EligibleOrder {
  id: string;
  order_number: string;
  restaurant: string;
  restaurant_slug: string;
  restaurant_name: string;
  restaurant_logo: string;
  total: string;
  status: string;
  completed_at: string | null;
  created_at: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const REVIEW_MEDIA_LIMITS = {
  maxImages: 5,
  maxImageBytes: 5 * 1024 * 1024,
  maxVideos: 1,
  maxVideoBytes: 30 * 1024 * 1024,
  maxVideoDurationS: 30,
};

export async function listRestaurantReviews(slug: string, page = 1): Promise<Paginated<Review>> {
  const { data } = await axiosInstance.get<Paginated<Review>>(
    `/api/v1/reviews/restaurant/${slug}/`,
    { params: { page } }
  );
  return data;
}

export async function getRestaurantReviewStats(slug: string): Promise<ReviewStats> {
  const { data } = await axiosInstance.get<ReviewStats>(
    `/api/v1/reviews/restaurant/${slug}/stats/`
  );
  return data;
}

export async function listEligibleOrders(): Promise<Paginated<EligibleOrder> | EligibleOrder[]> {
  const { data } = await axiosInstance.get<Paginated<EligibleOrder> | EligibleOrder[]>(
    '/api/v1/reviews/eligible-orders/'
  );
  return data;
}

export async function listMyReviews(page = 1): Promise<Paginated<Review>> {
  const { data } = await axiosInstance.get<Paginated<Review>>('/api/v1/reviews/mine/', {
    params: { page },
  });
  return data;
}

export async function createReview(payload: {
  order: string;
  rating: number;
  title?: string;
  body?: string;
}): Promise<Review> {
  const { data } = await axiosInstance.post<Review>('/api/v1/reviews/', payload);
  return data;
}

export async function updateReview(
  id: string,
  payload: { rating?: number; title?: string; body?: string }
): Promise<Review> {
  const { data } = await axiosInstance.patch<Review>(`/api/v1/reviews/${id}/`, payload);
  return data;
}

export async function deleteReview(id: string): Promise<void> {
  await axiosInstance.delete(`/api/v1/reviews/${id}/`);
}

export interface UploadProgress {
  loaded: number;
  total: number;
}

export async function uploadReviewMedia(
  reviewId: string,
  file: File,
  kind: 'image' | 'video',
  durationS: number | undefined,
  onProgress?: (p: UploadProgress) => void
): Promise<ReviewMedia> {
  const form = new FormData();
  form.append('kind', kind);
  form.append('file', file);
  if (kind === 'video' && durationS !== undefined) {
    form.append('duration_s', String(Math.round(durationS)));
  }
  const { data } = await axiosInstance.post<ReviewMedia>(
    `/api/v1/reviews/${reviewId}/media/`,
    form,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        if (onProgress && e.total) onProgress({ loaded: e.loaded, total: e.total });
      },
    }
  );
  return data;
}

export async function deleteReviewMedia(reviewId: string, mediaId: string): Promise<void> {
  await axiosInstance.delete(`/api/v1/reviews/${reviewId}/media/${mediaId}/`);
}

export async function reportReview(
  reviewId: string,
  payload: { reason: string; notes?: string }
): Promise<{ id: string; open_reports: number }> {
  const { data } = await axiosInstance.post<{ id: string; open_reports: number }>(
    `/api/v1/reviews/${reviewId}/report/`,
    payload
  );
  return data;
}
