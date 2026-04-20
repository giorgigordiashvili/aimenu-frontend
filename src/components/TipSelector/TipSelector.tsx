'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import { useTranslations } from '@/context/LocaleContext';
import { background, border, foreground, muted, primary, radiusSm, white } from '@/tokens';

const Card = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '20px 24px',
  borderRadius: '12px',
  border: `1px solid ${border}`,
  backgroundColor: background,
  marginBottom: '24px',
  gap: '12px',
});

const Title = styled('span')({
  fontSize: '16px',
  fontWeight: 600,
  color: foreground,
});

const Row = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

const Chip = styled('button')({
  padding: '10px 16px',
  borderRadius: radiusSm,
  border: `1px solid ${border}`,
  backgroundColor: white,
  color: foreground,
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  minWidth: '64px',
  transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  '&[data-active="true"]': {
    backgroundColor: primary,
    color: white,
    borderColor: primary,
  },
});

const CustomInputWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '4px',
});

const CustomInput = styled('input')({
  flex: 1,
  padding: '10px 12px',
  borderRadius: radiusSm,
  border: `1px solid ${border}`,
  backgroundColor: white,
  fontSize: '14px',
  outline: 'none',
});

const PreviewLabel = styled('span')({
  fontSize: '13px',
  color: muted,
});

type Preset = 'none' | 10 | 15 | 20 | 'custom';

interface Props {
  subtotal: number; // GEL
  value: number; // GEL tip amount, 0 = no tip
  onChange: (next: number) => void;
}

export default function TipSelector({ subtotal, value, onChange }: Props) {
  const t = useTranslations();
  const [active, setActive] = useState<Preset>('none');
  const [customDraft, setCustomDraft] = useState<string>('');

  // Infer the active preset on mount / subtotal change when `value` was set
  // externally (e.g. reloaded payload). Otherwise the user owns it.
  useEffect(() => {
    if (value === 0) return; // keep current preset
    const pct = subtotal > 0 ? (value / subtotal) * 100 : 0;
    if (Math.abs(pct - 10) < 0.5) setActive(10);
    else if (Math.abs(pct - 15) < 0.5) setActive(15);
    else if (Math.abs(pct - 20) < 0.5) setActive(20);
    else {
      setActive('custom');
      setCustomDraft(value.toFixed(2));
    }
  }, [subtotal, value]);

  function pickPreset(p: Preset) {
    setActive(p);
    if (p === 'none') {
      onChange(0);
    } else if (p === 'custom') {
      const parsed = parseFloat(customDraft);
      onChange(Number.isFinite(parsed) ? Math.max(parsed, 0) : 0);
    } else {
      const tip = subtotal * (p / 100);
      onChange(Math.round(tip * 100) / 100);
    }
  }

  function handleCustomChange(raw: string) {
    setCustomDraft(raw);
    if (active !== 'custom') setActive('custom');
    const parsed = parseFloat(raw);
    onChange(Number.isFinite(parsed) ? Math.max(parsed, 0) : 0);
  }

  return (
    <Card>
      <Title>{(t.tip?.title as string | undefined) ?? 'Tip'}</Title>
      <Row>
        <Chip type='button' onClick={() => pickPreset('none')} data-active={active === 'none'}>
          {(t.tip?.none as string | undefined) ?? 'No tip'}
        </Chip>
        {[10, 15, 20].map(p => (
          <Chip
            key={p}
            type='button'
            onClick={() => pickPreset(p as 10 | 15 | 20)}
            data-active={active === p}
          >
            {p}%
          </Chip>
        ))}
        <Chip type='button' onClick={() => pickPreset('custom')} data-active={active === 'custom'}>
          {(t.tip?.custom as string | undefined) ?? 'Custom'}
        </Chip>
      </Row>
      {active === 'custom' ? (
        <CustomInputWrap>
          <CustomInput
            type='number'
            step='0.01'
            min='0'
            inputMode='decimal'
            placeholder={(t.tip?.customPlaceholder as string | undefined) ?? 'Amount in ₾'}
            value={customDraft}
            onChange={e => handleCustomChange(e.target.value)}
          />
          <PreviewLabel>₾</PreviewLabel>
        </CustomInputWrap>
      ) : null}
      {value > 0 ? (
        <PreviewLabel>
          {((t.tip?.preview as string | undefined) ?? 'Tip').replace(
            '{{amount}}',
            value.toFixed(2)
          )}
        </PreviewLabel>
      ) : null}
    </Card>
  );
}
