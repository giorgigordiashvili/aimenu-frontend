import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import LoginForm from '@/components/LoginForm';
import { Locale, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return { title: 'Login' };
  }

  const t = getDictionary(locale);

  return {
    title: `${t.login.title} | AiMenu`,
    description: t.login.subtitle,
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <LoginForm locale={locale as Locale} />
    </Suspense>
  );
}
