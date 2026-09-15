'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import { type PaymentProvider } from '@/components/PaymentProviderPicker';
import { useTranslations } from '@/context/LocaleContext';
import ArrowRightIcon from '@/icons/ArrowRight';
import CreditCardIcon from '@/icons/CreditCard';
import { border, foreground, radiusMd, slate50, slate500, white } from '@/tokens';

/**
 * One button per acquirer, each going straight to that provider's hosted
 * page. Replaces the old three-step payment screen — pick a provider, pick
 * a method, then press Pay — which asked the guest to make two choices
 * that lead to the same place.
 *
 * Card entry always happens on the provider's own page, so "Bank Card" was
 * never a real choice either.
 */

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const SectionLabel = styled('span')({
  fontSize: '13px',
  fontWeight: 500,
  color: slate500,
  display: 'block',
});

const PayButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  width: '100%',
  padding: '16px 18px',
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',

  '&:hover:not(:disabled)': {
    borderColor: foreground,
    boxShadow: '0 2px 10px rgba(15, 23, 43, 0.08)',
  },
  '&:active:not(:disabled)': {
    transform: 'translateY(1px)',
  },
  '&:disabled': {
    opacity: 0.55,
    cursor: 'not-allowed',
  },
});

const LogoSlot = styled('span')({
  width: '46px',
  height: '32px',
  flex: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: slate50,
  borderRadius: '6px',
  overflow: 'hidden',

  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
});

const Marks = styled('span')({
  display: 'inline-flex',
  gap: '4px',
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  color: slate500,
});

const Body = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: 1,
  minWidth: 0,
});

const Name = styled('span')({
  fontSize: '15px',
  fontWeight: 600,
  color: foreground,
});

const Hint = styled('span')({
  fontSize: '12.5px',
  color: slate500,
});

const Chevron = styled('span')({
  flex: 'none',
  display: 'inline-flex',
  color: slate500,
});

/**
 * Renders the provider's logo from `public/logos/<file>` when present and
 * falls back to a neutral card icon. Dropping the official artwork in makes
 * the button branded without touching this component — we deliberately do
 * not ship hand-drawn approximations of bank marks.
 */
function ProviderLogo({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <LogoSlot>
        <CreditCardIcon />
      </LogoSlot>
    );
  }
  return (
    <LogoSlot>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} onError={() => setFailed(true)} />
    </LogoSlot>
  );
}

interface Props {
  bogAvailable: boolean;
  flittAvailable: boolean;
  /** Fires with the chosen acquirer — the caller goes straight to redirect. */
  onPay: (provider: PaymentProvider) => void;
  isLoading?: boolean;
  /** Formatted total, e.g. "25.00 ₾", appended to each button's hint. */
  amountLabel?: string;
}

export default function PayWithProvider({
  bogAvailable,
  flittAvailable,
  onPay,
  isLoading = false,
  amountLabel,
}: Props) {
  const t = useTranslations();
  const copy = (t as unknown as { payments?: { payWith?: Record<string, string> } }).payments
    ?.payWith;

  if (!bogAvailable && !flittAvailable) return null;

  const suffix = amountLabel ? ` · ${amountLabel}` : '';

  return (
    <Wrap>
      <SectionLabel>{copy?.title ?? 'Pay with'}</SectionLabel>

      {bogAvailable && (
        <PayButton
          type='button'
          disabled={isLoading}
          onClick={() => onPay('bog')}
          data-testid='pay-with-bog'
        >
          <ProviderLogo src='/logos/bog.svg' alt='Bank of Georgia' />
          <Body>
            <Name>{copy?.bogName ?? 'Bank of Georgia'}</Name>
            <Hint>{(copy?.bogHint ?? 'Visa, Mastercard') + suffix}</Hint>
          </Body>
          <Marks>
            <span>VISA</span>
            <span>MC</span>
          </Marks>
          <Chevron>
            <ArrowRightIcon />
          </Chevron>
        </PayButton>
      )}

      {flittAvailable && (
        <PayButton
          type='button'
          disabled={isLoading}
          onClick={() => onPay('flitt')}
          data-testid='pay-with-flitt'
        >
          <ProviderLogo src='/logos/flitt.svg' alt='Flitt' />
          <Body>
            <Name>{copy?.flittName ?? 'Flitt · TBC'}</Name>
            <Hint>{(copy?.flittHint ?? 'Visa, Mastercard, Amex') + suffix}</Hint>
          </Body>
          <Marks>
            <span>VISA</span>
            <span>MC</span>
          </Marks>
          <Chevron>
            <ArrowRightIcon />
          </Chevron>
        </PayButton>
      )}
    </Wrap>
  );
}
