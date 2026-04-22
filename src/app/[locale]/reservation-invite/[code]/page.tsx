import type { Metadata } from 'next';

import ReservationInvitePage from '@/components/ReservationInvitePage';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { buildMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{ locale: string; code: string }>;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://admin.aimenu.ge').replace(/\/$/, '');

interface Preview {
  host_name?: string;
  restaurant_name?: string;
  reservation_date?: string;
  reservation_time?: string;
  is_expired?: boolean;
}

async function loadPreview(code: string): Promise<Preview | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/reservations/invite/${code}/`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Preview;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, code } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const copy = t.reservationInvite;

  const preview = await loadPreview(code);
  const host = preview?.host_name?.trim() || '';
  const restaurant = preview?.restaurant_name?.trim() || '';

  const title = host ? (restaurant ? `${host} — ${restaurant}` : host) : copy.metaTitle;
  const description = host
    ? copy.metaDescription.replace('{host}', host).replace('{restaurant}', restaurant)
    : copy.metaDescription.replace('{host}', '').replace('{restaurant}', restaurant).trim();

  return buildMetadata({
    locale,
    path: `/reservation-invite/${code}`,
    title,
    description,
    noindex: true,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale, code } = await params;
  return <ReservationInvitePage locale={locale as Locale} code={code} />;
}
