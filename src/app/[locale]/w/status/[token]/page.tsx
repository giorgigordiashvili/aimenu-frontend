import type { Metadata } from 'next';

import WaitlistStatus from '@/components/WaitlistStatus';

interface Props {
  params: Promise<{ locale: string; token: string }>;
}

export function generateMetadata(): Metadata {
  return { title: 'Waitlist', robots: { index: false, follow: false } };
}

export default async function Page({ params }: Props) {
  const { locale, token } = await params;
  return <WaitlistStatus token={token} locale={locale} />;
}
