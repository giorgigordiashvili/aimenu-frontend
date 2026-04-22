'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import { useTranslations } from '@/context/LocaleContext';
import { useReferralSummary } from '@/hooks/useReferral';
import { border, foreground, muted, primary, radiusMd, slate100, slate500, white } from '@/tokens';

interface Props {
  /**
   * Maximum the wallet can cover on this checkout — typically subtotal − discount.
   * Backend re-clamps anyway, but the UI shouldn't let users pick a number that
   * obviously can't apply.
   */
  maxApplicable: number;
  value: number;
  onChange: (next: number) => void;
}

const Card = styled('section')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const Title = styled('h3')({
  fontSize: '15px',
  fontWeight: 600,
  color: foreground,
  margin: 0,
});

const Lead = styled('p')({
  fontSize: '13px',
  color: muted,
  margin: 0,
  lineHeight: '18px',
});

const Row = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexWrap: 'wrap',
});

const Available = styled('span')({
  fontSize: '12px',
  fontWeight: 600,
  color: primary,
});

const Field = styled('input')({
  flex: '1 1 140px',
  padding: '10px 12px',
  borderRadius: '10px',
  border: `1px solid ${border}`,
  background: slate100,
  fontSize: '14px',
  color: foreground,
  outline: 'none',
  '&:focus': { borderColor: primary, background: white },
});

const ApplyAll = styled('button')({
  padding: '10px 14px',
  borderRadius: '10px',
  border: `1px solid ${border}`,
  background: white,
  color: foreground,
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
});

const Disabled = styled('p')({
  fontSize: '13px',
  color: slate500,
  margin: 0,
});

function clamp(value: number, max: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  if (value > max) return max;
  return Number(value.toFixed(2));
}

export default function WalletApplySection({ maxApplicable, value, onChange }: Props) {
  const t = useTranslations();
  const { data: summary } = useReferralSummary();
  const balance = summary ? Number(summary.wallet_balance) : 0;
  const cap = Math.min(balance, Math.max(0, maxApplicable));
  const [text, setText] = useState<string>(value > 0 ? value.toString() : '');

  // Re-clamp the parent's `value` whenever the cap shrinks — e.g. the user
  // changed tip / discount upstream and the spendable amount dropped. Don't
  // touch the input string when it equals the current value to avoid focus
  // jitter mid-edit.
  useEffect(() => {
    if (value > cap) onChange(cap);
  }, [value, cap, onChange]);

  if (balance <= 0) {
    return (
      <Card>
        <Title>{t.referral.walletCheckoutTitle}</Title>
        <Disabled>{t.referral.walletDisabled}</Disabled>
      </Card>
    );
  }

  const handleInput = (raw: string) => {
    setText(raw);
    const parsed = Number(raw.replace(',', '.'));
    if (Number.isNaN(parsed)) {
      onChange(0);
      return;
    }
    onChange(clamp(parsed, cap));
  };

  const applyAll = () => {
    const next = clamp(cap, cap);
    setText(next.toString());
    onChange(next);
  };

  return (
    <Card>
      <Title>{t.referral.walletCheckoutTitle}</Title>
      <Lead>{t.referral.walletCheckoutHint}</Lead>
      <Row>
        <Available>{t.referral.walletAvailable.replace('{amount}', balance.toFixed(2))}</Available>
      </Row>
      <Row>
        <Field
          type='number'
          min={0}
          max={cap}
          step='0.01'
          inputMode='decimal'
          placeholder={t.referral.walletApplyLabel}
          value={text}
          onChange={e => handleInput(e.target.value)}
        />
        <ApplyAll type='button' onClick={applyAll}>
          {t.referral.walletApplyAll}
        </ApplyAll>
      </Row>
    </Card>
  );
}
