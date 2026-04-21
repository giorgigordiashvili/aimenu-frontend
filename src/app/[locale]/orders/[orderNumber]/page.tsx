import type { Metadata } from 'next';

import OrderStatusPage from '@/components/OrderStatusPage';
import type { Locale } from '@/i18n/config';

interface OrderPageProps {
  params: Promise<{ locale: string; orderNumber: string }>;
}

// Order status pages are user-specific transactional URLs. Already
// disallowed in /robots.txt; per-page noindex is a belt-and-braces
// signal for any URL that escapes via screenshot share.
export function generateMetadata(): Metadata {
  return {
    title: 'Order',
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function Page({ params }: OrderPageProps) {
  const { locale, orderNumber } = await params;
  return <OrderStatusPage locale={locale as Locale} orderNumber={orderNumber} />;
}
