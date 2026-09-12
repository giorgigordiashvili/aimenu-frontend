'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import { validatePromoCode, type PromoCodeCheck } from '@/api/promotions';
import { useTranslations } from '@/context/LocaleContext';

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '12px 0',
});

const Label = styled('p')({
  margin: 0,
  fontSize: 14,
  fontWeight: 600,
});

const Row = styled('div')({
  display: 'flex',
  gap: 8,
});

const Input = styled('input')({
  flex: 1,
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  fontSize: 15,
  letterSpacing: 1,
  textTransform: 'uppercase',
});

const Btn = styled('button')({
  padding: '10px 16px',
  borderRadius: 10,
  border: '1px solid #111',
  background: '#111',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  '&:disabled': { opacity: 0.5, cursor: 'default' },
});

const Note = styled('p')<{ tone: 'ok' | 'error' | 'muted' }>({
  margin: 0,
  fontSize: 13,
  variants: [
    { props: { tone: 'ok' }, style: { color: '#15803d' } },
    { props: { tone: 'error' }, style: { color: '#b91c1c' } },
    { props: { tone: 'muted' }, style: { color: '#6b7280' } },
  ],
});

interface Props {
  slug: string;
  channel: 'web' | 'qr';
  items: Array<{ menu_item_id: string; quantity: number }>;
  value: string;
  onChange: (code: string) => void;
}

/** Promo code at checkout: validated against the basket before the order is placed. */
export default function PromoCodeField({ slug, channel, items, value, onChange }: Props) {
  const t = useTranslations();
  const [draft, setDraft] = useState(value);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<PromoCodeCheck | null>(null);

  const apply = async () => {
    const code = draft.trim().toUpperCase();
    if (!code) return;
    setChecking(true);
    try {
      const res = await validatePromoCode(slug, code, items, channel);
      setResult(res);
      onChange(res.valid ? res.code : '');
    } catch {
      setResult({
        valid: false,
        code,
        name: '',
        mode: '',
        value: null,
        discount: null,
        error: t.common.error,
        error_code: 'network',
      });
      onChange('');
    } finally {
      setChecking(false);
    }
  };

  const remove = () => {
    setDraft('');
    setResult(null);
    onChange('');
  };

  return (
    <Wrap data-testid='promo-code-field'>
      <Label>{t.promo.title}</Label>
      {value && result?.valid ? (
        <Row>
          <Note tone='ok'>
            {result.discount
              ? t.promo.applied.replace('{amount}', parseFloat(result.discount).toFixed(2))
              : t.promo.appliedNoAmount}{' '}
            · {result.name}
          </Note>
          <Btn type='button' onClick={remove}>
            {t.promo.remove}
          </Btn>
        </Row>
      ) : (
        <Row>
          <Input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={t.promo.placeholder}
            aria-label={t.promo.title}
          />
          <Btn type='button' onClick={apply} disabled={checking || !draft.trim()}>
            {checking ? t.promo.checking : t.promo.apply}
          </Btn>
        </Row>
      )}
      {result && !result.valid && <Note tone='error'>{result.error}</Note>}
    </Wrap>
  );
}
