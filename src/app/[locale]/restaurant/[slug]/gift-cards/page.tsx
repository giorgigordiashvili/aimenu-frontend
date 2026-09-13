import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { restaurantsRetrieve } from '@/api/generated/api';
import GiftCardShop from '@/components/GiftCardShop';
import HeaderPrimary from '@/components/HeaderPrimary';
import { restaurantModules } from '@/lib/modules';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateMetadata(): Metadata {
  return { title: 'Gift cards' };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const restaurant = await restaurantsRetrieve(slug).catch(() => null);
  if (!restaurant) notFound();
  const modules = restaurantModules(restaurant);
  if (!modules.gift_cards) notFound();
  return (
    <>
      <HeaderPrimary />
      <GiftCardShop restaurant={restaurant} locale={locale} />
    </>
  );
}
