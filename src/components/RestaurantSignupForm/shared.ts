import type { Dictionary } from '@/i18n/getDictionary';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  restaurantName: string;
  categoryId: string;
  country: string;
  city: string;
  address: string;
  restaurantPhone: string;
  website: string;
  description: string;
  acceptedTerms: boolean;
}

export interface SignupErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
  restaurantName?: string;
  city?: string;
}

export type SignupT = Dictionary['restaurantSignup'];

// Lowercase + ASCII-safe. Backend auto-suffixes on collision; non-ASCII names
// get reduced to an empty string here — that's fine because the backend's
// save() also falls back to slugify(name) and will end up with a sensible
// default (`restaurant-<id>` pattern at worst).
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return base || 'restaurant';
}
