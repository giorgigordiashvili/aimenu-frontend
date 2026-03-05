'use client';

import { styled } from '@pigment-css/react';

import { useTranslations } from '@/context/LocaleContext';
import CreditCardIcon from '@/icons/CreditCard';
import People from '@/icons/People';
import { border, foreground, primary, slate500, white, rose50, iconStroke } from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentMethod = 'iWillPay' | 'everyonePays';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

// ─── Styled components ────────────────────────────────────────────────────────

const SectionLabel = styled('span')({
  fontSize: '13px',
  fontWeight: 500,
  color: slate500,
  marginBottom: '16px',
  display: 'block',
});

const PaymentMethodGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '16px',
  marginBottom: '24px',
  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 1fr',
  },
});

const PaymentCard = styled('button')<{ 'data-selected'?: boolean }>({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '16px',
  borderRadius: '12px',
  border: `1px solid ${border}`,
  backgroundColor: white,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textAlign: 'left',
  position: 'relative',
  '&:hover': {
    borderColor: slate500,
  },
  '&[data-selected="true"]': {
    borderColor: primary,
    backgroundColor: rose50,
    borderWidth: '2px',
  },
});

const PaymentCardIcon = styled('div')({
  marginBottom: '12px',
});

const PaymentCardTitle = styled('span')({
  fontSize: '16px',
  fontWeight: 600,
  color: foreground,
  marginBottom: '4px',
  display: 'block',
  lineHeight: '22px',
});

const PaymentCardDescription = styled('span')({
  fontSize: '13px',
  fontWeight: 400,
  color: slate500,
  lineHeight: '18px',
});

const CheckmarkCircle = styled('div')<{ 'data-selected'?: boolean }>({
  position: 'absolute',
  top: '16px',
  right: '16px',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: `2px solid ${border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: white,
  '&[data-selected="true"]': {
    borderColor: primary,
    backgroundColor: primary,
  },
});

function CheckIcon() {
  return (
    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M20 6L9 17L4 12'
        stroke='white'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const t = useTranslations();

  return (
    <>
      <SectionLabel>{t.orderReview.paymentMethod}</SectionLabel>
      <PaymentMethodGrid>
        <PaymentCard
          type='button'
          data-selected={value === 'iWillPay'}
          onClick={() => onChange('iWillPay')}
        >
          <PaymentCardIcon>
            <CreditCardIcon color={value === 'iWillPay' ? foreground : iconStroke} />
          </PaymentCardIcon>
          <PaymentCardTitle>{t.orderReview.iWillPay}</PaymentCardTitle>
          <PaymentCardDescription>{t.orderReview.iWillPayDescription}</PaymentCardDescription>
          <CheckmarkCircle data-selected={value === 'iWillPay'}>
            {value === 'iWillPay' && <CheckIcon />}
          </CheckmarkCircle>
        </PaymentCard>

        <PaymentCard
          type='button'
          data-selected={value === 'everyonePays'}
          onClick={() => onChange('everyonePays')}
        >
          <PaymentCardIcon>
            <People />
          </PaymentCardIcon>
          <PaymentCardTitle>{t.orderReview.everyonePays}</PaymentCardTitle>
          <PaymentCardDescription>{t.orderReview.everyonePaysDescription}</PaymentCardDescription>
          <CheckmarkCircle data-selected={value === 'everyonePays'}>
            {value === 'everyonePays' && <CheckIcon />}
          </CheckmarkCircle>
        </PaymentCard>
      </PaymentMethodGrid>
    </>
  );
}
