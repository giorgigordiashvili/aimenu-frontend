import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PasswordResetConfirm } from '@/components/PasswordReset';
import { Locale, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface PasswordResetConfirmPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PasswordResetConfirmPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return { title: 'Reset Password' };
  }

  const t = getDictionary(locale);

  return {
    title: `${t.passwordReset.confirmTitle} | AiMenu`,
    description: t.passwordReset.confirmSubtitle,
  };
}

export default async function PasswordResetConfirmPage({ params }: PasswordResetConfirmPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return <PasswordResetConfirm locale={locale as Locale} />;
}
