import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ReferralPage from '@/components/ReferralPage';
import { isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return { title: 'Referral' };
  }
  const t = getDictionary(locale);
  return { title: `${t.referral.pageTitle} | AiMenu` };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }
  return <ReferralPage />;
}
