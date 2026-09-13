'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';
import useSWR from 'swr';

import { fetchWaitlistStatus, leaveWaitlist } from '@/api/waitlist';
import { useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import { border, foreground, muted, primary, slate50, white } from '@/tokens';

const Page = styled('main')({
  minHeight: '100vh',
  background: slate50,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '32px 16px',
});
const Card = styled('div')({
  width: '100%',
  maxWidth: 440,
  background: white,
  borderRadius: 20,
  border: `1px solid ${border}`,
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  textAlign: 'center',
});
const Title = styled('h1')({ margin: 0, fontSize: 20, fontWeight: 700, color: foreground });
const Big = styled('div')({ fontSize: 64, fontWeight: 800, color: primary, lineHeight: 1 });
const Sub = styled('p')({ margin: 0, fontSize: 15, color: muted });
const Ready = styled('div')({
  fontSize: 22,
  fontWeight: 800,
  color: '#15803d',
  padding: '12px 0',
});
const Ghost = styled('button')({
  padding: '10px 14px',
  borderRadius: 12,
  border: `1px solid ${border}`,
  background: white,
  color: foreground,
  cursor: 'pointer',
});
const A = styled('a')({ color: primary, fontWeight: 600 });

interface Props {
  token: string;
  locale: string;
}

/** The guest's place in line; refreshes every 20 s, celebrates when the table is ready. */
export default function WaitlistStatus({ token, locale }: Props) {
  const t = useTranslations();
  const [leaving, setLeaving] = useState(false);
  const { data, error, mutate } = useSWR(
    ['waitlist-status', token],
    () => fetchWaitlistStatus(token),
    {
      refreshInterval: 20_000,
    }
  );

  if (error) {
    return (
      <Page>
        <Card>
          <Title>{t.waitlist.notFound}</Title>
        </Card>
      </Page>
    );
  }
  if (!data) {
    return (
      <Page>
        <Card>
          <Sub>…</Sub>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card data-testid='waitlist-status'>
        <Title>{data.restaurant}</Title>
        <Sub>
          {data.name} · {data.party_size} {t.waitlist.guests}
        </Sub>
        {data.status === 'waiting' ? (
          <>
            <Big>{data.position}</Big>
            <Sub>
              {t.waitlist.ahead.replace('{ahead}', String(data.ahead))} ·{' '}
              {t.waitlist.about.replace('{minutes}', String(data.quoted_minutes))}
            </Sub>
            <Ghost
              type='button'
              disabled={leaving}
              onClick={async () => {
                setLeaving(true);
                await leaveWaitlist(token).catch(() => undefined);
                mutate();
                setLeaving(false);
              }}
            >
              {t.waitlist.leave}
            </Ghost>
          </>
        ) : data.status === 'notified' ? (
          <Ready>🎉 {t.waitlist.ready}</Ready>
        ) : data.status === 'seated' ? (
          <Ready>✅ {t.waitlist.seated}</Ready>
        ) : (
          <Sub>{(t.waitlist.status as Record<string, string>)[data.status] ?? data.status}</Sub>
        )}
        <A href={localePath(locale, `/restaurant/${data.restaurant_slug}`)}>
          {t.waitlist.viewMenu} →
        </A>
      </Card>
    </Page>
  );
}
