'use client';

import { styled } from '@pigment-css/react';

import { useCart } from '@/context/CartContext';
import { useTranslations } from '@/context/LocaleContext';
import { rose50, rose600 } from '@/tokens';

const Pill = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: rose50,
  color: rose600,
  fontSize: '13px',
  fontWeight: 600,
  padding: '6px 14px',
  borderRadius: '999px',
  lineHeight: '20px',
  userSelect: 'none',
});

export default function CartBadge() {
  const { getTotalItems } = useCart();
  const t = useTranslations();

  const total = getTotalItems();

  if (total === 0) return null;

  return <Pill>{t.restaurant.selectedItems.replace('{count}', String(total))}</Pill>;
}
