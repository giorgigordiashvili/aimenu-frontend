import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProfilePaymentPage from '@/components/ProfilePaymentPage';
import { isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface PaymentPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PaymentPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return { title: 'Payment Methods' };
  const t = getDictionary(locale);
  return { title: `${t.payment.savedCards} | AiMenu` };
}

export default async function Page({ params }: PaymentPageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  return <ProfilePaymentPage />;
}
