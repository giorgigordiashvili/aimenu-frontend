import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ReservationsPage from '@/components/ReservationsPage';
import { Locale, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface ReservationsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ReservationsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return { title: 'My Reservations' };
  }

  const t = getDictionary(locale);

  return {
    title: `${t.reservations.title} | AiMenu`,
  };
}

export default async function Page({ params }: ReservationsPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return <ReservationsPage locale={locale as Locale} />;
}
