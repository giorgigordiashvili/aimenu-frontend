import { redirect } from 'next/navigation';

import { localePath } from '@/i18n/routing';

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: ProfilePageProps) {
  const { locale } = await params;
  redirect(localePath(locale, '/profile/reservations'));
}
