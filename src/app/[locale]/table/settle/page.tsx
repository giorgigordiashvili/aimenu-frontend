import { Suspense } from 'react';

import SettleTablePage from '@/components/SettleTablePage';
import type { Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <Suspense fallback={null}>
      <SettleTablePage locale={locale as Locale} />
    </Suspense>
  );
}
