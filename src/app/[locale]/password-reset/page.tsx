import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PasswordResetRequest } from '@/components/PasswordReset';
import { Locale, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface PasswordResetPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PasswordResetPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return { title: 'Password Reset' };
  }

  const t = getDictionary(locale);

  return {
    title: `${t.passwordReset.requestTitle} | AiMenu`,
    description: t.passwordReset.requestSubtitle,
  };
}

export default async function PasswordResetPage({ params }: PasswordResetPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return <PasswordResetRequest locale={locale as Locale} />;
}
