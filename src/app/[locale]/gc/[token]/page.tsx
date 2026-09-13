import type { Metadata } from 'next';

import GiftCardView from '@/components/GiftCardView';

interface Props {
  params: Promise<{ locale: string; token: string }>;
}

export function generateMetadata(): Metadata {
  return { title: 'Gift card', robots: { index: false, follow: false } };
}

export default async function Page({ params }: Props) {
  const { locale, token } = await params;
  return <GiftCardView token={token} locale={locale} />;
}
