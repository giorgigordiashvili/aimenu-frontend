import { venuesMenuRetrieve, venuesRetrieve, venuesValidateRetrieve } from '@/api/generated/api';
import type { MenuCategory, MenuItem } from '@/api/generated/interfaces';

// The generated types describe the `{success, data}` envelope; the axios
// interceptor unwraps it, so these are the shapes the client actually sees.
// Server Components use plain fetch (see fetchVenueDetail) and unwrap here.

export interface VenueCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  logo_blurhash: string;
  restaurants_count: number;
}

export interface VenueRestaurantCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  logo_blurhash: string;
  category: { id: string; slug: string; translations: Record<string, { name: string }> } | null;
  average_rating: string;
  total_reviews: number;
  is_open_now: boolean;
  accepts_remote_orders: boolean;
  primary_color: string;
  secondary_color: string;
  default_currency: 'GEL' | 'USD' | 'EUR' | string;
  display_order: number;
}

export interface VenueDetailData {
  venue: VenueCard;
  restaurants: VenueRestaurantCard[];
}

export interface VenueMemberTable {
  restaurant: VenueRestaurantCard;
  /** That restaurant's own table id/code for this physical table; null when not mirrored. */
  table_id: string | null;
  table_code: string | null;
}

export interface VenueValidateData {
  venue: VenueCard;
  table: {
    id: string;
    number: string;
    name: string;
    capacity: number;
    section: string | null;
    code: string;
  };
  restaurants: VenueMemberTable[];
}

export interface FullMenu {
  categories: { category: MenuCategory; items: MenuItem[] }[];
  uncategorized_items: MenuItem[];
}

export interface VenueMenuData {
  venue: VenueCard;
  restaurants: { restaurant: VenueRestaurantCard; menu: FullMenu }[];
}

export async function getVenue(slug: string): Promise<VenueDetailData> {
  return (await venuesRetrieve(slug)) as unknown as VenueDetailData;
}

export async function validateVenueTable(code: string): Promise<VenueValidateData> {
  return (await venuesValidateRetrieve(code)) as unknown as VenueValidateData;
}

export async function getVenueMenu(slug: string, restaurants?: string[]): Promise<VenueMenuData> {
  const filter = restaurants && restaurants.length ? restaurants.join(',') : undefined;
  return (await venuesMenuRetrieve(slug, filter)) as unknown as VenueMenuData;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://admin.aimenu.ge').replace(/\/$/, '');

/** Server Component fetch: no axios (its http2 import breaks the Pigment build sandbox). */
export async function fetchVenueDetail(slug: string): Promise<VenueDetailData | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/venues/${encodeURIComponent(slug)}/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data: VenueDetailData };
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export const CURRENCY_SYMBOL: Record<string, string> = { GEL: '₾', USD: '$', EUR: '€' };

export function currencySymbol(code?: string): string {
  return (code && CURRENCY_SYMBOL[code]) || '₾';
}
