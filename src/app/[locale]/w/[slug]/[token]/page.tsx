import type { Metadata } from 'next';

import WaitlistJoin from '@/components/WaitlistJoin';

interface Props {
  params: Promise<{ locale: string; slug: string; token: string }>;
}

export function generateMetadata(): Metadata {
  return { title: 'Waitlist', robots: { index: false, follow: false } };
}

export default async function Page({ params }: Props) {
  const { locale, slug, token } = await params;
  return <WaitlistJoin slug={slug} token={token} locale={locale} />;
}
