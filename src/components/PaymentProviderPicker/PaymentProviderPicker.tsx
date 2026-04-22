'use client';

import { styled } from '@pigment-css/react';

import { useTranslations } from '@/context/LocaleContext';
import CreditCardIcon from '@/icons/CreditCard';
import { border, foreground, muted, primary, rose50, slate500, white } from '@/tokens';

export type PaymentProvider = 'bog' | 'flitt';

interface PaymentProviderPickerProps {
  value: PaymentProvider;
  onChange: (provider: PaymentProvider) => void;
  bogAvailable: boolean;
  flittAvailable: boolean;
}

const SectionLabel = styled('span')({
  fontSize: '13px',
  fontWeight: 500,
  color: slate500,
  marginBottom: '12px',
  display: 'block',
});

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '12px',
  marginBottom: '20px',
  '@media (min-width: 480px)': {
    gridTemplateColumns: '1fr 1fr',
  },
});

const ProviderCard = styled('button')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '14px 16px',
  borderRadius: '12px',
  border: `1px solid ${border}`,
  backgroundColor: white,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  textAlign: 'left',
  '&:hover': {
    borderColor: foreground,
  },
  '&[data-selected="true"]': {
    borderColor: primary,
    backgroundColor: rose50,
    borderWidth: '2px',
    padding: '13px 15px',
  },
});

const ProviderHead = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '6px',
});

const ProviderBrand = styled('span')({
  fontSize: '15px',
  fontWeight: 700,
  color: foreground,
});

const ProviderHint = styled('span')({
  fontSize: '12px',
  color: muted,
  lineHeight: 1.4,
});

// Visual marker for each provider — BOG keeps the credit-card glyph so
// the UX on restaurants that only accept BOG doesn't change. Flitt gets
// a rose dot so it reads as a distinct choice even before the label is
// translated.
const FlittDot = styled('span')({
  display: 'inline-block',
  width: '18px',
  height: '18px',
  borderRadius: '999px',
  background: primary,
  flexShrink: 0,
});

/**
 * Two-card radio-style picker for the two card payment providers. Hidden
 * entirely by the calling page when fewer than two providers are
 * configured at the restaurant — this component assumes bogAvailable or
 * flittAvailable is true and returns null only in the pathological both-
 * false case.
 */
export default function PaymentProviderPicker({
  value,
  onChange,
  bogAvailable,
  flittAvailable,
}: PaymentProviderPickerProps) {
  const t = useTranslations();
  const copy = t.payments?.providerPicker;

  // When only one is available, the caller should hide the whole component.
  // Rendering a single-option picker would be visual noise.
  if (!bogAvailable && !flittAvailable) return null;
  if (!(bogAvailable && flittAvailable)) return null;

  const bogTitle = copy?.bogLabel ?? 'Bank of Georgia';
  const bogDesc = copy?.bogDescription ?? 'Pay by card via BOG.';
  const flittTitle = copy?.flittLabel ?? 'Flitt';
  const flittDesc = copy?.flittDescription ?? 'Pay by card via Flitt.';

  return (
    <div>
      <SectionLabel>{copy?.title ?? 'Choose payment provider'}</SectionLabel>
      <Grid>
        <ProviderCard
          type='button'
          data-selected={value === 'bog' ? 'true' : undefined}
          onClick={() => onChange('bog')}
        >
          <ProviderHead>
            <CreditCardIcon />
            <ProviderBrand>{bogTitle}</ProviderBrand>
          </ProviderHead>
          <ProviderHint>{bogDesc}</ProviderHint>
        </ProviderCard>
        <ProviderCard
          type='button'
          data-selected={value === 'flitt' ? 'true' : undefined}
          onClick={() => onChange('flitt')}
        >
          <ProviderHead>
            <FlittDot />
            <ProviderBrand>{flittTitle}</ProviderBrand>
          </ProviderHead>
          <ProviderHint>{flittDesc}</ProviderHint>
        </ProviderCard>
      </Grid>
    </div>
  );
}
