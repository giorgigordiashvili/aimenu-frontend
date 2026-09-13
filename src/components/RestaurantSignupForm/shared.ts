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
  restaurantPhone?: string;
  website?: string;
}

/**
 * How step 1 behaves:
 *  - new:      collect name, email, password -> register
 *  - existing: the email already has an AiMenu account -> ask for its password, sign in
 *  - signedIn: the visitor is already logged in -> the restaurant joins that account
 */
export type OwnerMode = 'new' | 'existing' | 'signedIn';

export type SignupT = Dictionary['restaurantSignup'];
