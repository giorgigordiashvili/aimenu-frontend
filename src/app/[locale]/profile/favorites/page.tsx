import FavoritesPage from '@/components/FavoritesPage/FavoritesPage';
import type { Locale } from '@/i18n/config';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <FavoritesPage locale={locale as Locale} />;
}
