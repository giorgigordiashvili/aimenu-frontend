'use client';

import { styled } from '@pigment-css/react';
import useSWR from 'swr';

import { fetchGiftCard } from '@/api/giftcards';
import { useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import { border, foreground, muted, primary, slate50, white } from '@/tokens';

const Page = styled('main')({
  minHeight: '80vh',
  background: slate50,
  padding: '32px 16px',
  display: 'flex',
  justifyContent: 'center',
});
const Card = styled('div')({
  width: '100%',
  maxWidth: 440,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  textAlign: 'center',
});
const Face = styled('div')({
  borderRadius: 20,
  padding: 28,
  background: 'linear-gradient(135deg, #EC003F, #7c3aed)',
  color: white,
});
const Code = styled('code')({
  display: 'block',
  fontSize: 26,
  letterSpacing: 3,
  margin: '12px 0',
  userSelect: 'all',
});
const Box = styled('div')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: 16,
  padding: 16,
  color: foreground,
});
const Sub = styled('p')({ margin: 0, fontSize: 14, color: muted });
const A = styled('a')({ color: primary, fontWeight: 600 });

export default function GiftCardView({ token, locale }: { token: string; locale: string }) {
  const t = useTranslations();
  const { data, error } = useSWR(['gift-card', token], () => fetchGiftCard(token));
  if (error) {
    return (
      <Page>
        <Card>
          <Box>{t.giftCard.notFound}</Box>
        </Card>
      </Page>
    );
  }
  if (!data)
    return (
      <Page>
        <Card>
          <Sub>…</Sub>
        </Card>
      </Page>
    );
  return (
    <Page>
      <Card data-testid='gift-card-view'>
        <Face>
          <div style={{ fontSize: 14, opacity: 0.85 }}>{data.restaurant}</div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>
            {parseFloat(data.balance).toFixed(2)} {data.currency}
          </div>
          <Code>{data.code}</Code>
          {data.message ? <div style={{ fontStyle: 'italic' }}>“{data.message}”</div> : null}
          {data.recipient_name ? (
            <div style={{ marginTop: 8 }}>
              {t.giftCard.forName.replace('{name}', data.recipient_name)}
            </div>
          ) : null}
        </Face>
        <Box>
          <Sub>{t.giftCard.howToUse}</Sub>
          {data.expires_at ? (
            <Sub>
              {t.giftCard.validUntil.replace(
                '{date}',
                new Date(data.expires_at).toLocaleDateString(locale)
              )}
            </Sub>
          ) : null}
        </Box>
        <A href={localePath(locale, `/restaurant/${data.restaurant_slug}`)}>
          {t.waitlist.viewMenu} →
        </A>
      </Card>
    </Page>
  );
}
