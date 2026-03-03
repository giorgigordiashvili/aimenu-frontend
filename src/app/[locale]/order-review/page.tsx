import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { OrderReviewPage } from '@/components';
import { Locale, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface OrderReviewPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: OrderReviewPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return { title: 'Order Review' };
  }

  const t = getDictionary(locale);

  return {
    title: `${t.orderReview.title} | AiMenu`,
  };
}

export default async function Page({ params }: OrderReviewPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return <OrderReviewPage locale={locale as Locale} />;
}
