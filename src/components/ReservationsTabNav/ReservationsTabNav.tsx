'use client';

import { styled } from '@pigment-css/react';

import { useTranslations } from '@/context/LocaleContext';
import CalendarIcon from '@/icons/Calendar';
import CreditCardIcon from '@/icons/CreditCard';
import PeopleIcon from '@/icons/People';
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

const TabItem = styled('button')<{ active: boolean }>({
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
  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  variants: [
    {
      props: { active: true },
      style: {
        color: white,
        background: foreground,
      },
    },
  ],
});

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ReservationsTabNav() {
  const t = useTranslations();

  return (
    <TabNavRoot>
      <TabNavInner>
        <TabItem active={true}>
          <CalendarIcon />
          {t.reservations.tabs}
        </TabItem>
        <TabItem active={false} disabled>
          <PeopleIcon />
          {t.reservations.profileTab}
        </TabItem>
        <TabItem active={false} disabled>
          <CreditCardIcon />
          {t.reservations.paymentTab}
        </TabItem>
      </TabNavInner>
    </TabNavRoot>
  );
}
