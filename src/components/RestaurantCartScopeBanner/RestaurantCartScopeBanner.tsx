'use client';

import { styled } from '@pigment-css/react';
import { useEffect } from 'react';

import MainButton from '@/components/MainButton/MainButton';
import { useCart } from '@/context/CartContext';
import { useTranslations } from '@/context/LocaleContext';
import { border, foreground, rose25, rose600, slate500 } from '@/tokens';

const Banner = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px 20px',
  marginBottom: '16px',
  border: `1px solid ${rose600}`,
  borderRadius: '12px',
  background: rose25,
  '@media (min-width: 768px)': {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const TextBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const Title = styled('strong')({
  fontSize: '15px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '22px',
});

const Body = styled('span')({
  fontSize: '13px',
  color: slate500,
  lineHeight: '18px',
});

const Actions = styled('div')({
  display: 'flex',
  gap: '8px',
  flexShrink: 0,
});

const BorderedWrap = styled('div')({
  // Prevent the surrounding page from styling MainButton weirdly.
  borderRadius: '8px',
  border: `1px solid ${border}`,
  overflow: 'hidden',
});

interface Props {
  slug: string;
}

export default function RestaurantCartScopeBanner({ slug }: Props) {
  const { hasCartFromOtherRestaurant, setRestaurantSlug, clearCart, items, restaurantSlug } =
    useCart();
  const t = useTranslations();

  // Auto-scope when it's safe: empty cart, or already scoped to this slug.
  useEffect(() => {
    if (items.length === 0 || restaurantSlug === slug) {
      setRestaurantSlug(slug);
    }
  }, [items.length, restaurantSlug, slug, setRestaurantSlug]);

  if (!hasCartFromOtherRestaurant(slug)) return null;

  return (
    <Banner role='status'>
      <TextBlock>
        <Title>{t.cart.switchTitle}</Title>
        <Body>{t.cart.switchBody}</Body>
      </TextBlock>
      <Actions>
        <BorderedWrap>
          <MainButton
            variant='rose_cta'
            size='default'
            title={t.cart.switchClear}
            onClick={() => {
              clearCart();
              setRestaurantSlug(slug);
            }}
          />
        </BorderedWrap>
      </Actions>
    </Banner>
  );
}
