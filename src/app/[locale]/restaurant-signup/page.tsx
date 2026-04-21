import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import RestaurantSignupForm from '@/components/RestaurantSignupForm';
import { defaultLocale, isValidLocale, Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { buildMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  return buildMetadata({
    locale,
    path: '/restaurant-signup',
    title: t.restaurantSignup.pageTitle,
    description: t.restaurantSignup.pageSubtitle,
  });
}

export default async function RestaurantSignupPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  return <RestaurantSignupForm locale={locale as Locale} />;
}
