'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import CalendarIcon from '@/icons/Calendar';
import CreditCardIcon from '@/icons/CreditCard';
import EditIcon from '@/icons/Edit';
import PeopleIcon from '@/icons/People';
import StarIcon from '@/icons/Star';
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
  gap: '4px',
  backgroundColor: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '4px',
  // Below the desktop breakpoint, allow horizontal scroll so 4+ tabs never
  // squish. Hide the scrollbar; snap each item to the viewport edge.
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'none',
  WebkitOverflowScrolling: 'touch',
  scrollSnapType: 'x mandatory',
  '&::-webkit-scrollbar': { display: 'none' },
  '@media (min-width: 768px)': {
    overflowX: 'visible',
    scrollSnapType: 'none',
  },
});

const TabItem = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  flex: '0 0 auto',
  padding: '10px 14px',
  fontSize: '14px',
  fontWeight: 500,
  color: slate500,
  background: 'transparent',
  border: 'none',
  borderRadius: radiusSm,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  scrollSnapAlign: 'start',
  transition: 'background 0.15s, color 0.15s',
  '&[data-active="true"]': {
    color: white,
    background: foreground,
  },
  '@media (min-width: 768px)': {
    flex: 1,
    padding: '10px 16px',
  },
});

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProfileTabNav() {
  const t = useTranslations();
  const { locale } = useLocale();
  const pathname = usePathname();

  const reservationsHref = localePath(locale, '/profile/reservations');
  const loyaltyHref = localePath(locale, '/profile/loyalty');
  const reviewsHref = localePath(locale, '/profile/reviews');
  const settingsHref = localePath(locale, '/profile/settings');
  const paymentHref = localePath(locale, '/profile/payment');
  const referralHref = localePath(locale, '/profile/referral');

  const isReservations = pathname === reservationsHref || pathname.startsWith(reservationsHref);
  const isLoyalty = pathname === loyaltyHref || pathname.startsWith(loyaltyHref);
  const isReviews = pathname === reviewsHref || pathname.startsWith(reviewsHref);
  const isSettings = pathname === settingsHref || pathname.startsWith(settingsHref);
  const isPayment = pathname === paymentHref || pathname.startsWith(paymentHref);
  const isReferral = pathname === referralHref || pathname.startsWith(referralHref);

  return (
    <TabNavRoot>
      <TabNavInner>
        <TabItem href={reservationsHref} data-active={isReservations ? 'true' : undefined}>
          <CalendarIcon />
          {t.profile.tabs.reservations}
        </TabItem>

        <TabItem href={loyaltyHref} data-active={isLoyalty ? 'true' : undefined}>
          <StarIcon />
          {t.profile.tabs.loyalty}
        </TabItem>

        <TabItem href={reviewsHref} data-active={isReviews ? 'true' : undefined}>
          <EditIcon />
          {t.profile.tabs.reviews}
        </TabItem>

        <TabItem href={settingsHref} data-active={isSettings ? 'true' : undefined}>
          <UserIcon />
          {t.profile.tabs.profile}
        </TabItem>

        <TabItem href={paymentHref} data-active={isPayment ? 'true' : undefined}>
          <CreditCardIcon />
          {t.profile.tabs.payment}
        </TabItem>

        <TabItem href={referralHref} data-active={isReferral ? 'true' : undefined}>
          <PeopleIcon />
          {t.profile.tabs.referral}
        </TabItem>
      </TabNavInner>
    </TabNavRoot>
  );
}
