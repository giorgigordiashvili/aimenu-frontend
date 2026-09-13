'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import { checkGiftCard, giftCardError, type GiftCardBalance } from '@/api/giftcards';
import { useTranslations } from '@/context/LocaleContext';

const Wrap = styled('div')({ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0' });
const Label = styled('p')({ margin: 0, fontSize: 14, fontWeight: 600 });
const Row = styled('div')({ display: 'flex', gap: 8 });
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
  value: string;
  onChange: (code: string) => void;
}

/** Gift card at checkout: balance is checked before the order is placed; the backend redeems it. */
export default function GiftCardField({ slug, value, onChange }: Props) {
  const t = useTranslations();
  const [draft, setDraft] = useState(value);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<GiftCardBalance | null>(null);
  const [error, setError] = useState('');

  const apply = async () => {
    const code = draft.trim().toUpperCase();
    if (!code) return;
    setChecking(true);
    setError('');
    try {
      const res = await checkGiftCard(slug, code);
      setResult(res);
      const usable = res.status === 'active' && parseFloat(res.balance) > 0;
      onChange(usable ? code : '');
      if (!usable)
        setError(
          (t.giftCard.errors as Record<string, string>)[res.status] ?? t.giftCard.errors.generic
        );
    } catch (err) {
      setResult(null);
      onChange('');
      const code2 = giftCardError(err);
      setError(
        (t.giftCard.errors as Record<string, string>)[code2 ?? ''] ?? t.giftCard.errors.generic
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <Wrap data-testid='gift-card-field'>
      <Label>{t.giftCard.title}</Label>
      <Row>
        <Input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder={t.giftCard.placeholder}
          disabled={!!value}
          data-testid='gift-card-input'
        />
        {value ? (
          <Btn
            type='button'
            onClick={() => {
              onChange('');
              setResult(null);
              setDraft('');
            }}
          >
            {t.giftCard.remove}
          </Btn>
        ) : (
          <Btn type='button' onClick={apply} disabled={checking || !draft.trim()}>
            {checking ? t.giftCard.checking : t.giftCard.apply}
          </Btn>
        )}
      </Row>
      {value && result ? (
        <Note tone='ok'>
          {t.giftCard.applied.replace('{balance}', parseFloat(result.balance).toFixed(2))}
        </Note>
      ) : error ? (
        <Note tone='error'>{error}</Note>
      ) : (
        <Note tone='muted'>{t.giftCard.hint}</Note>
      )}
    </Wrap>
  );
}
