import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProfileHubPage from '@/components/ProfileHubPage';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return { title: 'Profile' };
  const t = getDictionary(locale);
  return { title: `${t.profile.tabs.profile} | AiMenu` };
}

export default async function Page({ params }: ProfilePageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  return <ProfileHubPage locale={locale as Locale} />;
}
