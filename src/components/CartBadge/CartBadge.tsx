'use client';

import { styled } from '@pigment-css/react';

import { useCart } from '@/context/CartContext';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { plural } from '@/i18n/plural';
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
  const { locale } = useLocale();

  const total = getTotalItems();

  if (total === 0) return null;

  // en has one/other, ru has one/few/other, ka takes the singular noun after
  // any numeral — see i18n/plural.ts. Falls back to the plural string when a
  // locale doesn't define the narrower form.
  const copy = t.restaurant as unknown as {
    selectedItems: string;
    selectedItemsOne?: string;
    selectedItemsFew?: string;
  };

  return (
    <Pill>
      {plural(locale, total, {
        one: copy.selectedItemsOne,
        few: copy.selectedItemsFew,
        other: copy.selectedItems,
      })}
    </Pill>
  );
}
