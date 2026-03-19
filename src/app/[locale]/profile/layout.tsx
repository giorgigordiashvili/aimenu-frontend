import { notFound } from 'next/navigation';

import ProfileShell from '@/components/ProfileShell';
import { Locale, isValidLocale } from '@/i18n/config';

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return <ProfileShell locale={locale as Locale}>{children}</ProfileShell>;
}
