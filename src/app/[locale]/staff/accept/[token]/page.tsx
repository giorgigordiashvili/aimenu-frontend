import type { Metadata } from 'next';

import StaffAcceptPage from '@/components/StaffAcceptPage';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { buildMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{ locale: string; token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, token } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  return buildMetadata({
    locale,
    path: `/staff/accept/${token}`,
    title: t.staffInvite.metaTitle,
    description: t.staffInvite.metaDescription,
    noindex: true,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale, token } = await params;
  return <StaffAcceptPage locale={locale as Locale} token={token} />;
}
