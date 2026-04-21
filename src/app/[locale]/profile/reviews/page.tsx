import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import MyReviewsPage from '@/components/MyReviewsPage';
import { isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return { title: 'Reviews' };
  }
  const t = getDictionary(locale);
  return { title: `${t.reviews.sectionTitle} | AiMenu` };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }
  return <MyReviewsPage />;
}
