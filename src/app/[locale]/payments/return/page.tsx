import { Suspense } from 'react';

import PaymentReturnPage from '@/components/PaymentReturnPage';
import type { Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: string }>;
}

// useSearchParams inside PaymentReturnPage needs a Suspense boundary so Next.js
// can bail out of prerender and stream the actual query params client-side.
export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <Suspense fallback={null}>
      <PaymentReturnPage locale={locale as Locale} />
    </Suspense>
  );
}
