import type { Metadata } from 'next';
import { Suspense } from 'react';

import { defaultLocale, isValidLocale, Locale } from '@/i18n/config';

import SuccessClient from './SuccessClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Transactional confirmation — not a landing page. Don't index.
export function generateMetadata(): Metadata {
  return {
    title: 'Your restaurant is live',
    robots: { index: false, follow: false },
  };
}

export default async function SuccessPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  return (
    <Suspense fallback={null}>
      <SuccessClient locale={locale} />
    </Suspense>
  );
}
