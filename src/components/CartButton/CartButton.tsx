'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';

import { useCart } from '@/context/CartContext';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';

const CartButtonStyled = styled('button')({
  position: 'fixed',
  // Mobile: sit above the fixed BottomTabBar (~56px + safe area) with a
  // 12px breathing gap. Desktop (≥768px): the bottom nav is hidden, so
  // revert to the original 20px offset.
  bottom: 'calc(56px + env(safe-area-inset-bottom, 0px) + 12px)',
  left: '20px',
  right: '20px',
  height: '52px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ec003f',
  borderRadius: '50px',
  color: '#ffffff',
  gap: '12px',
  zIndex: 100,
  boxShadow: '0 4px 20px rgba(236, 0, 63, 0.3)',
  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  border: 'none',
  cursor: 'pointer',
  '@media (min-width: 768px)': {
    bottom: '20px',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 24px rgba(236, 0, 63, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 12px rgba(236, 0, 63, 0.3)',
  },
});

const Badge = styled('div')({
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#7ccf00',
  borderRadius: '50%',
});

const BadgeText = styled('span')({
  fontSize: '12px',
  fontWeight: 600,
  color: '#0f172a',
  letterSpacing: '-0.15px',
});

const Text = styled('span')({
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '-0.15px',
});

const Arrow = styled('div')({
  position: 'absolute',
  right: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

interface CartButtonProps {
  onClick?: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useTranslations();
  const { getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) {
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(localePath(locale, '/order-review'));
    }
  };

  return (
    <CartButtonStyled onClick={handleClick}>
      <Badge>
        <BadgeText>x{totalItems}</BadgeText>
      </Badge>
      <Text>
        {t.common.checkout} • {totalPrice.toFixed(2)} ₾
      </Text>
      <Arrow>
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M9 18L15 12L9 6'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </Arrow>
    </CartButtonStyled>
  );
}
