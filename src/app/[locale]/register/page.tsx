import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import RegisterForm from '@/components/RegisterForm';
import { Locale, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return { title: 'Register' };
  }

  const t = getDictionary(locale);

  return {
    title: `${t.register.createAccount} | AiMenu`,
    description: t.register.userSubtitle,
    robots: { index: false, follow: false },
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  // RegisterForm reads `?ref=` via useSearchParams; Next requires a Suspense
  // boundary around any client component that does that on a statically-rendered
  // page, otherwise the export bails with a CSR-bailout error.
  return (
    <Suspense>
      <RegisterForm locale={locale as Locale} />
    </Suspense>
  );
}
