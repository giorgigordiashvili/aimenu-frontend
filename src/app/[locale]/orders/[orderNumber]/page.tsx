import OrderStatusPage from '@/components/OrderStatusPage';
import type { Locale } from '@/i18n/config';

interface OrderPageProps {
  params: Promise<{ locale: string; orderNumber: string }>;
}

export default async function Page({ params }: OrderPageProps) {
  const { locale, orderNumber } = await params;
  return <OrderStatusPage locale={locale as Locale} orderNumber={orderNumber} />;
}
