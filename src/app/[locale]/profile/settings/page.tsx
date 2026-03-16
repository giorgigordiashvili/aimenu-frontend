import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProfileSettingsPage from '@/components/ProfileSettingsPage';
import { isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface SettingsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SettingsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return { title: 'Profile Settings' };
  const t = getDictionary(locale);
  return { title: `${t.profile.settingsTitle} | AiMenu` };
}

export default async function Page({ params }: SettingsPageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  return <ProfileSettingsPage />;
}
