'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath, stripLocale } from '@/i18n/routing';
import HeartIcon from '@/icons/Heart';
import HouseIcon from '@/icons/House';
import OrderIcon from '@/icons/Order';
import UserIcon from '@/icons/User';
import { border, foreground, rose600, slate500, white } from '@/tokens';

// Routes where the bottom nav should not render (auth + legal + standalone
// flows). Compared via stripLocale so this works across /ka, /en, /ru.
const HIDDEN_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/data-deletion',
];

// ─── Styled ────────────────────────────────────────────────────────────────────

const Nav = styled('nav')({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 50,
  display: 'flex',
  background: white,
  borderTop: `1px solid ${border}`,
  boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const Tab = styled(Link)({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  padding: '10px 4px',
  minHeight: '56px',
  textDecoration: 'none',
  color: slate500,
  transition: 'color 0.15s',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: '2px',
    borderRadius: '0 0 2px 2px',
    background: 'transparent',
    transition: 'background 0.15s',
  },
  '&[data-active="true"]': {
    color: foreground,
  },
  '&[data-active="true"]::before': {
    background: foreground,
  },
});

const IconWrap = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  color: 'inherit',
});

const Label = styled('span')({
  fontSize: '11px',
  fontWeight: 500,
  lineHeight: 1.1,
  letterSpacing: '-0.1px',
});

const CartIconWrap = styled('span')({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  color: 'inherit',
});

const CartBadge = styled('span')({
  position: 'absolute',
  top: '-4px',
  right: '-8px',
  minWidth: '16px',
  height: '16px',
  padding: '0 4px',
  borderRadius: '999px',
  background: rose600,
  color: white,
  fontSize: '10px',
  fontWeight: 700,
  lineHeight: '16px',
  textAlign: 'center',
  boxShadow: `0 0 0 2px ${white}`,
});

// ─── Component ─────────────────────────────────────────────────────────────────

export default function BottomTabBar() {
  const t = useTranslations();
  const { locale } = useLocale();
  const { isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const pathname = usePathname();

  const { pathWithoutLocale } = stripLocale(pathname);
  const hidden = HIDDEN_PATHS.some(
    p => pathWithoutLocale === p || pathWithoutLocale.startsWith(`${p}/`)
  );

  const totalItems = getTotalItems();

  const profileHref = isAuthenticated
    ? localePath(locale, '/profile/reservations')
    : localePath(locale, '/login');

  const tabs = useMemo(
    () => [
      {
        id: 'home',
        href: localePath(locale, '/'),
        label: t.bottomNav.home,
        match: (p: string) => p === '/' || p === '/restaurants' || p.startsWith('/restaurant'),
        icon: (
          <IconWrap>
            <HouseIcon width={22} height={22} />
          </IconWrap>
        ),
      },
      {
        id: 'favorites',
        href: localePath(locale, '/favorites'),
        label: t.bottomNav.favorites,
        match: (p: string) => p.startsWith('/favorites'),
        icon: (
          <IconWrap>
            <HeartIcon width={22} height={22} />
          </IconWrap>
        ),
      },
      {
        id: 'cart',
        href: localePath(locale, '/order-review'),
        label: t.bottomNav.cart,
        match: (p: string) => p.startsWith('/order-review') || p.startsWith('/orders'),
        icon: (
          <CartIconWrap>
            <OrderIcon width={22} height={22} />
            {totalItems > 0 && <CartBadge>{totalItems > 99 ? '99+' : totalItems}</CartBadge>}
          </CartIconWrap>
        ),
      },
      {
        id: 'profile',
        href: profileHref,
        label: t.bottomNav.profile,
        match: (p: string) => p.startsWith('/profile'),
        icon: (
          <IconWrap>
            <UserIcon width={22} height={22} />
          </IconWrap>
        ),
      },
    ],
    [locale, profileHref, t.bottomNav, totalItems]
  );

  if (hidden) return null;

  return (
    <Nav aria-label='Primary'>
      {tabs.map(tab => {
        const isActive = tab.match(pathWithoutLocale);
        return (
          <Tab
            key={tab.id}
            href={tab.href}
            data-active={isActive ? 'true' : undefined}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.icon}
            <Label>{tab.label}</Label>
          </Tab>
        );
      })}
    </Nav>
  );
}
