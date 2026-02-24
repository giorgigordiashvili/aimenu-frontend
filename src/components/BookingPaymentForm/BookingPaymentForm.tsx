'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { useTranslations } from '@/context/LocaleContext';
import CheckmarkIcon from '@/icons/Checkmark';
import CreditCardIcon from '@/icons/CreditCard';
import Mastercard from '@/icons/Mastercard';
import {
  border,
  foreground,
  green50,
  green600,
  primary,
  slate200,
  slate500,
  white,
} from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentMethod = 'card' | 'saved' | 'apple';

type SavedCard = {
  last4: string;
  brand: string;
};

type Props = {
  depositAmount: number;
  savedCard?: SavedCard | null;
  isLoading?: boolean;
  error?: string | null;
  onBack?: () => void;
  onPay: () => void;
};

// ─── Inline icons ─────────────────────────────────────────────────────────────

// Adapter so CreditCardIcon satisfies TextInput's IconComponent type
function CardFieldIcon(_props?: { open?: boolean }) {
  return <CreditCardIcon />;
}

// ─── Styled components ────────────────────────────────────────────────────────

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
});

const Header = styled('div')({
  marginBottom: '20px',
});

const Title = styled('h2')({
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 6px 0',
  letterSpacing: '-0.2px',
  lineHeight: '26px',
});

const Subtitle = styled('p')({
  fontSize: '13px',
  fontWeight: 400,
  color: slate500,
  margin: 0,
  lineHeight: '18px',
});

const MethodList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '20px',
});

const MethodOption = styled('button')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  border: `1.5px solid ${border}`,
  borderRadius: '12px',
  backgroundColor: white,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'border-color 0.15s',
  '&[data-selected="true"]': {
    borderColor: foreground,
  },
  '&[data-selected="false"]:not([data-disabled="true"])': {
    opacity: 0.5,
  },
  '&[data-disabled="true"]': {
    opacity: 0.55,
    cursor: 'not-allowed',
  },
});

const MethodIconWrap = styled('div')({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: `1px solid ${slate200}`,
  backgroundColor: white,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: '20px', height: '20px' },
});

const MethodInfo = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
});

const MethodName = styled('span')({
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  lineHeight: '20px',
});

const MethodSub = styled('span')({
  fontSize: '12px',
  color: slate500,
  lineHeight: '16px',
});

const RadioDot = styled('div')({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: `2px solid ${slate200}`,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'border-color 0.15s',
  '&[data-selected="true"]': {
    borderColor: foreground,
    '&::after': {
      content: '""',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: foreground,
    },
  },
});

const CardForm = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '24px',
  border: `1px solid ${slate200}`,
  borderRadius: '14px',
  padding: '24px',
});

const TwoCol = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
});

const AmountSection = styled('div')({
  paddingTop: '20px',
  borderTop: `1px solid ${border}`,
  marginBottom: '20px',
});

const AmountTitle = styled('p')({
  fontSize: '13px',
  fontWeight: 500,
  color: slate500,
  margin: '0 0 12px 0',
  lineHeight: '18px',
});

const AmountRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '10px',
  borderBottom: `1px solid ${border}`,
  marginBottom: '10px',
});

const AmountLabel = styled('span')({
  fontSize: '14px',
  color: slate500,
  lineHeight: '20px',
});

const AmountValue = styled('span')({
  fontSize: '14px',
  color: foreground,
  lineHeight: '20px',
});

const TotalRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '14px',
});

const TotalLabel = styled('span')({
  fontSize: '16px',
  fontWeight: 600,
  color: foreground,
  lineHeight: '24px',
});

const TotalValue = styled('span')({
  fontSize: '18px',
  fontWeight: 700,
  color: primary,
  lineHeight: '24px',
});

const SecureBadge = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: green50,
  border: `1px solid ${slate200}`,
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '13px',
  fontWeight: 500,
  color: green600,
  lineHeight: '18px',
  marginBottom: '24px',
});

const CheckWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: green600,
  '& svg': { width: '16px', height: '16px' },
});

const ErrorMsg = styled('p')({
  fontSize: '13px',
  color: '#E7000B',
  margin: '0 0 12px 0',
  lineHeight: '18px',
});

const MobileAmountSection = styled('div')({
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const ButtonGroup = styled('div')({
  display: 'none', // mobile overlay footer handles the pay button
  '@media (min-width: 768px)': {
    display: 'grid',
    gridTemplateColumns: '3fr 7fr',
    gap: '10px',
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingPaymentForm({
  depositAmount,
  savedCard,
  isLoading,
  error,
  onBack,
  onPay,
}: Props) {
  const t = useTranslations();
  const [method, setMethod] = useState<PaymentMethod>(savedCard ? 'saved' : 'card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  function formatCardNumber(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  return (
    <Container>
      <Header>
        <Title>{t.booking.payment}</Title>
        <Subtitle>{t.booking.selectPaymentMethod}</Subtitle>
      </Header>

      {/* Payment method selection */}
      <MethodList>
        <MethodOption
          type='button'
          data-selected={method === 'card'}
          onClick={() => setMethod('card')}
        >
          <MethodIconWrap>
            <CreditCardIcon color='#0F172B' />
          </MethodIconWrap>
          <MethodInfo>
            <MethodName>{t.booking.bankCard}</MethodName>
            <MethodSub>{t.booking.bankCardSubtitle}</MethodSub>
          </MethodInfo>
          <RadioDot data-selected={method === 'card'} />
        </MethodOption>

        {savedCard && (
          <MethodOption
            type='button'
            data-selected={method === 'saved'}
            onClick={() => setMethod('saved')}
          >
            <MethodIconWrap>
              <Mastercard />
            </MethodIconWrap>
            <MethodInfo>
              <MethodName>****{savedCard.last4}</MethodName>
              <MethodSub>{savedCard.brand}</MethodSub>
            </MethodInfo>
            <RadioDot data-selected={method === 'saved'} />
          </MethodOption>
        )}

        <MethodOption type='button' data-disabled='true' onClick={() => {}}>
          <MethodIconWrap />
          <MethodInfo>
            <MethodName>{t.booking.applePay}</MethodName>
            <MethodSub>{t.booking.applePaySoon}</MethodSub>
          </MethodInfo>
          <RadioDot data-selected={false} />
        </MethodOption>
      </MethodList>

      {/* Card form — UI placeholder only; fields are collected here but payment processing
          will be handled by a payment gateway (e.g. Stripe/BOG) in a future integration */}
      {method === 'card' && (
        <CardForm>
          <div>
            <TextInput
              label={t.booking.cardNumber}
              type='text'
              inputMode='numeric'
              placeholder={t.booking.cardNumberPlaceholder}
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              autoComplete='cc-number'
              icon={CardFieldIcon}
            />
          </div>
          <TwoCol>
            <div>
              <TextInput
                label={t.booking.expiry}
                type='text'
                inputMode='numeric'
                placeholder={t.booking.expiryPlaceholder}
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                autoComplete='cc-exp'
              />
            </div>
            <div>
              <TextInput
                label={t.booking.cvv}
                type='text'
                inputMode='numeric'
                placeholder={t.booking.cvvPlaceholder}
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                autoComplete='cc-csc'
              />
            </div>
          </TwoCol>
          <div>
            <TextInput
              label={t.booking.cardHolder}
              type='text'
              placeholder={t.booking.cardHolderPlaceholder}
              value={cardHolder}
              onChange={e => setCardHolder(e.target.value.toUpperCase())}
              autoComplete='cc-name'
            />
          </div>
        </CardForm>
      )}

      {/* Amount section — mobile only (desktop already shows it in left column) */}
      <MobileAmountSection>
        <AmountSection>
          <AmountTitle>{t.booking.amountToPay}</AmountTitle>
          <AmountRow>
            <AmountLabel>{t.booking.bookingDeposit}</AmountLabel>
            <AmountValue>{depositAmount.toFixed(2)} ₾</AmountValue>
          </AmountRow>
          <TotalRow>
            <TotalLabel>{t.booking.grandTotal}</TotalLabel>
            <TotalValue>{depositAmount.toFixed(2)} ₾</TotalValue>
          </TotalRow>
        </AmountSection>

        <SecureBadge>
          <CheckWrap>
            <CheckmarkIcon />
          </CheckWrap>
          {t.booking.securePayment}
        </SecureBadge>
      </MobileAmountSection>

      {error && <ErrorMsg>{error}</ErrorMsg>}

      <ButtonGroup>
        {onBack && (
          <MainButton
            variant='outline'
            title={t.common.back}
            size='large'
            fullWidth
            type='button'
            onClick={onBack}
          />
        )}
        <MainButton
          variant='green_cta'
          title={isLoading ? t.common.loading : `${t.booking.pay} ${depositAmount.toFixed(2)} ₾`}
          size='large'
          fullWidth
          disabled={isLoading}
          type='button'
          onClick={onPay}
        />
      </ButtonGroup>
    </Container>
  );
}
