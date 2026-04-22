'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath, stripLocale } from '@/i18n/routing';
import CalendarIcon from '@/icons/Calendar';
import HouseIcon from '@/icons/House';
import SearchIcon from '@/icons/Search';
import UserIcon from '@/icons/User';
import { border, foreground, slate500, white } from '@/tokens';

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

// ─── Component ─────────────────────────────────────────────────────────────────

export default function BottomTabBar() {
  const t = useTranslations();
  const { locale } = useLocale();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const { pathWithoutLocale } = stripLocale(pathname);
  const hidden = HIDDEN_PATHS.some(
    p => pathWithoutLocale === p || pathWithoutLocale.startsWith(`${p}/`)
  );

  const accountHref = isAuthenticated
    ? localePath(locale, '/profile')
    : localePath(locale, '/login');
  const bookingsHref = isAuthenticated
    ? localePath(locale, '/profile/reservations')
    : localePath(locale, '/login');

  const tabs = useMemo(
    () => [
      {
        id: 'home',
        href: localePath(locale, '/'),
        label: t.bottomNav.home,
        match: (p: string) => p === '/',
        icon: (
          <IconWrap>
            <HouseIcon width={22} height={22} />
          </IconWrap>
        ),
      },
      {
        id: 'search',
        href: localePath(locale, '/restaurants'),
        label: t.bottomNav.search,
        // Discovery + restaurant detail pages both belong to Search, since
        // that's how users reach a restaurant page.
        match: (p: string) => p.startsWith('/restaurants') || p.startsWith('/restaurant/'),
        icon: (
          <IconWrap>
            <SearchIcon width={22} height={22} />
          </IconWrap>
        ),
      },
      {
        id: 'bookings',
        href: bookingsHref,
        label: t.bottomNav.bookings,
        match: (p: string) =>
          p === '/profile/reservations' ||
          p.startsWith('/profile/reservations/') ||
          p.startsWith('/orders') ||
          p.startsWith('/order-review'),
        icon: (
          <IconWrap>
            <CalendarIcon width={22} height={22} />
          </IconWrap>
        ),
      },
      {
        id: 'account',
        href: accountHref,
        label: t.bottomNav.account,
        // Anything under /profile that isn't Bookings, plus standalone
        // Favorites, lives under Account.
        match: (p: string) => {
          if (p.startsWith('/profile/reservations')) return false;
          return p.startsWith('/profile') || p === '/favorites' || p.startsWith('/favorites/');
        },
        icon: (
          <IconWrap>
            <UserIcon width={22} height={22} />
          </IconWrap>
        ),
      },
    ],
    [locale, accountHref, bookingsHref, t.bottomNav]
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
