import { redirect } from 'next/navigation';

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: ProfilePageProps) {
  const { locale } = await params;
  redirect(`/${locale}/profile/reservations`);
}
