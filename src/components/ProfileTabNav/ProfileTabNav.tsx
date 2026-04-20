'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import CalendarIcon from '@/icons/Calendar';
import CreditCardIcon from '@/icons/CreditCard';
import UserIcon from '@/icons/User';
import { background, border, foreground, radiusMd, radiusSm, slate500, white } from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const TabNavRoot = styled('div')({
  backgroundColor: background,
  padding: '32px 16px',
  '@media (min-width: 768px)': {
    padding: '32px 24px',
  },
});

const TabNavInner = styled('div')({
  maxWidth: '1100px',
  margin: '0 auto',
  display: 'flex',
  gap: '0',
  backgroundColor: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '4px',
});

const TabItem = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  flex: 1,
  padding: '10px 16px',
  fontSize: '14px',
  fontWeight: 500,
  color: slate500,
  background: 'transparent',
  border: 'none',
  borderRadius: radiusSm,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  transition: 'background 0.15s, color 0.15s',
  '&[data-active="true"]': {
    color: white,
    background: foreground,
  },
});

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProfileTabNav() {
  const t = useTranslations();
  const { locale } = useLocale();
  const pathname = usePathname();

  const reservationsHref = localePath(locale, '/profile/reservations');
  const settingsHref = localePath(locale, '/profile/settings');
  const paymentHref = localePath(locale, '/profile/payment');

  const isReservations = pathname === reservationsHref || pathname.startsWith(reservationsHref);
  const isSettings = pathname === settingsHref || pathname.startsWith(settingsHref);
  const isPayment = pathname === paymentHref || pathname.startsWith(paymentHref);

  return (
    <TabNavRoot>
      <TabNavInner>
        <TabItem href={reservationsHref} data-active={isReservations ? 'true' : undefined}>
          <CalendarIcon />
          {t.profile.tabs.reservations}
        </TabItem>

        <TabItem href={settingsHref} data-active={isSettings ? 'true' : undefined}>
          <UserIcon />
          {t.profile.tabs.profile}
        </TabItem>

        <TabItem href={paymentHref} data-active={isPayment ? 'true' : undefined}>
          <CreditCardIcon />
          {t.profile.tabs.payment}
        </TabItem>
      </TabNavInner>
    </TabNavRoot>
  );
}
