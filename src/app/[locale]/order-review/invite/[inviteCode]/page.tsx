import type { Metadata } from 'next';

import InviteJoinPage from '@/components/InviteJoinPage';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { buildMetadata } from '@/lib/seo';

interface InvitePageProps {
  params: Promise<{ locale: string; inviteCode: string }>;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://admin.aimenu.ge').replace(/\/$/, '');

interface InvitePreview {
  host_name?: string;
  restaurant_name?: string;
  is_expired?: boolean;
}

async function loadInvitePreview(inviteCode: string): Promise<InvitePreview | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/tables/sessions/join/${inviteCode}/`, {
      // Short cache — invites expire and the title depends on live host name.
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return (await res.json()) as InvitePreview;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const { locale: rawLocale, inviteCode } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const copy = t.inviteJoin;

  const preview = await loadInvitePreview(inviteCode);
  const host = preview?.host_name?.trim() || '';
  const restaurant = preview?.restaurant_name?.trim() || '';

  const title = host ? (restaurant ? `${host} — ${restaurant}` : host) : copy.title;
  const description = host
    ? restaurant
      ? `${host} ${copy.subtitle.replace(/\.$/, '')} (${restaurant})`
      : copy.subtitle
    : copy.subtitle;

  return buildMetadata({
    locale,
    path: `/order-review/invite/${inviteCode}`,
    title,
    description,
    // Private transactional surface — don't let it into the index.
    noindex: true,
  });
}

export default async function Page({ params }: InvitePageProps) {
  const { locale, inviteCode } = await params;
  return <InviteJoinPage locale={locale as Locale} inviteCode={inviteCode} />;
}
