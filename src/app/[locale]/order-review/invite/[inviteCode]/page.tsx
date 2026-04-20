import InviteJoinPage from '@/components/InviteJoinPage';
import type { Locale } from '@/i18n/config';

interface InvitePageProps {
  params: Promise<{ locale: string; inviteCode: string }>;
}

export default async function Page({ params }: InvitePageProps) {
  const { locale, inviteCode } = await params;
  return <InviteJoinPage locale={locale as Locale} inviteCode={inviteCode} />;
}
