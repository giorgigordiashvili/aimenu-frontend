'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import { giftCardError, initiateGiftCardPurchase } from '@/api/giftcards';
import type { RestaurantDetail } from '@/api/generated/interfaces';
import { useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import { border, foreground, muted, primary, radiusSm, slate50, white } from '@/tokens';

const Page = styled('main')({
  minHeight: '80vh',
  background: slate50,
  padding: '32px 16px',
  display: 'flex',
  justifyContent: 'center',
});
const Card = styled('div')({
  width: '100%',
  maxWidth: 520,
  background: white,
  borderRadius: 20,
  border: `1px solid ${border}`,
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});
const Title = styled('h1')({ margin: 0, fontSize: 24, fontWeight: 700, color: foreground });
const Sub = styled('p')({ margin: 0, fontSize: 14, color: muted });
const Chips = styled('div')({ display: 'flex', flexWrap: 'wrap', gap: 8 });
const Chip = styled('button')({
  padding: '10px 16px',
  borderRadius: 999,
  border: `1px solid ${border}`,
  background: white,
  fontWeight: 600,
  cursor: 'pointer',
  '&[data-active="true"]': { background: primary, color: white, borderColor: primary },
});
const Input = styled('input')({
  padding: '12px 14px',
  borderRadius: radiusSm,
  border: `1px solid ${border}`,
  fontSize: 16,
});
const Textarea = styled('textarea')({
  padding: '12px 14px',
  borderRadius: radiusSm,
  border: `1px solid ${border}`,
  fontSize: 15,
  minHeight: 70,
});
const Preview = styled('div')({
  borderRadius: 16,
  padding: 20,
  background: 'linear-gradient(135deg, #EC003F, #7c3aed)',
  color: white,
  textAlign: 'center',
});
const Btn = styled('button')({
  padding: '14px 16px',
  borderRadius: 14,
  border: 'none',
  background: primary,
  color: white,
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
  '&:disabled': { opacity: 0.5, cursor: 'default' },
});
const Err = styled('p')({ margin: 0, color: '#b91c1c', fontSize: 14 });

const AMOUNTS = [25, 50, 100, 200];

interface Props {
  restaurant: RestaurantDetail;
  locale: string;
}

/** Buy a digital gift card for this restaurant; paid through BOG / Flitt, delivered by SMS / email. */
export default function GiftCardShop({ restaurant, locale }: Props) {
  const t = useTranslations();
  const flags = restaurant as unknown as {
    accepts_bog_payments?: boolean;
    accepts_flitt_payments?: boolean;
  };
  const provider: 'bog' | 'flitt' | null = flags.accepts_bog_payments
    ? 'bog'
    : flags.accepts_flitt_payments
      ? 'flitt'
      : null;
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [purchaserName, setPurchaserName] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const value = custom ? parseFloat(custom) || 0 : amount;

  const buy = async () => {
    if (!provider || value <= 0) return;
    setBusy(true);
    setError('');
    try {
      const returnUrl = `${window.location.origin}${localePath(locale, '/payments/return')}?flow=gift_card`;
      const res = await initiateGiftCardPurchase(
        provider,
        {
          restaurant_slug: restaurant.slug,
          amount: value.toFixed(2),
          recipient_name: recipientName,
          recipient_phone: recipientPhone,
          recipient_email: recipientEmail,
          purchaser_name: purchaserName,
          message,
        },
        returnUrl
      );
      window.location.assign(res.redirect_url);
    } catch (err) {
      setError(giftCardError(err) ?? t.giftCard.errors.generic);
      setBusy(false);
    }
  };

  return (
    <Page>
      <Card data-testid='gift-card-shop'>
        <Title>{t.giftCard.shopTitle.replace('{restaurant}', restaurant.name)}</Title>
        <Sub>{t.giftCard.shopIntro}</Sub>
        <Preview>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{restaurant.name}</div>
          <div style={{ fontSize: 36, fontWeight: 800 }}>{value.toFixed(2)} ₾</div>
          {recipientName ? <div>{t.giftCard.forName.replace('{name}', recipientName)}</div> : null}
        </Preview>
        <Chips>
          {AMOUNTS.map(a => (
            <Chip
              key={a}
              type='button'
              data-active={!custom && amount === a}
              onClick={() => {
                setAmount(a);
                setCustom('');
              }}
            >
              {a} ₾
            </Chip>
          ))}
          <Input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder={t.giftCard.customAmount}
            type='number'
            min={5}
            style={{ width: 130 }}
          />
        </Chips>
        <Input
          value={recipientName}
          onChange={e => setRecipientName(e.target.value)}
          placeholder={t.giftCard.recipientName}
        />
        <Input
          value={recipientPhone}
          onChange={e => setRecipientPhone(e.target.value)}
          placeholder={t.giftCard.recipientPhone}
          type='tel'
        />
        <Input
          value={recipientEmail}
          onChange={e => setRecipientEmail(e.target.value)}
          placeholder={t.giftCard.recipientEmail}
          type='email'
        />
        <Input
          value={purchaserName}
          onChange={e => setPurchaserName(e.target.value)}
          placeholder={t.giftCard.yourName}
        />
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={t.giftCard.message}
          maxLength={300}
        />
        {error ? <Err>{error}</Err> : null}
        {provider ? (
          <Btn
            type='button'
            disabled={busy || value <= 0 || (!recipientPhone && !recipientEmail)}
            onClick={buy}
            data-testid='gift-card-buy'
          >
            {t.giftCard.buy.replace('{amount}', value.toFixed(2))}
          </Btn>
        ) : (
          <Err>{t.giftCard.noOnlinePayments}</Err>
        )}
        <Sub>{t.giftCard.deliveryNote}</Sub>
      </Card>
    </Page>
  );
}
