import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LoyaltyRulesPage from '@/components/LoyaltyRulesPage';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { buildMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const copy = t.loyaltyRules;
  return buildMetadata({
    locale,
    path: '/loyalty',
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  return <LoyaltyRulesPage locale={locale as Locale} />;
}
