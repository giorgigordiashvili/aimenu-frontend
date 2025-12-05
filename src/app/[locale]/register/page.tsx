import { Metadata } from 'next';
import { Locale, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import RegisterForm from '@/components/RegisterForm';
import { notFound } from 'next/navigation';

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
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return <RegisterForm locale={locale as Locale} />;
}
