'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';

import { fetchWaitlistInfo, joinWaitlist, waitlistError } from '@/api/waitlist';
import { useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import { border, foreground, muted, primary, radiusSm, slate50, white } from '@/tokens';

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
  gap: 14,
});
const Title = styled('h1')({ margin: 0, fontSize: 22, fontWeight: 700, color: foreground });
const Sub = styled('p')({ margin: 0, fontSize: 14, color: muted });
const Input = styled('input')({
  padding: '12px 14px',
  borderRadius: radiusSm,
  border: `1px solid ${border}`,
  fontSize: 16,
});
const Stepper = styled('div')({ display: 'flex', alignItems: 'center', gap: 12 });
const StepBtn = styled('button')({
  width: 44,
  height: 44,
  borderRadius: 12,
  border: `1px solid ${border}`,
  background: white,
  fontSize: 22,
  cursor: 'pointer',
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
const Err = styled('p')({ margin: 0, fontSize: 14, color: '#b91c1c' });

interface Props {
  slug: string;
  token: string;
  locale: string;
}

/** The QR at the door: name, phone, party size → a place in today's queue. */
export default function WaitlistJoin({ slug, token, locale }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { data: info, error: infoError } = useSWR(['waitlist-info', slug, token], () =>
    fetchWaitlistInfo(slug, token)
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [party, setParty] = useState(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await joinWaitlist(slug, token, {
        name: name.trim(),
        phone: phone.trim(),
        party_size: party,
      });
      router.replace(localePath(locale, `/w/status/${res.token}`));
    } catch (err) {
      const code = waitlistError(err);
      setError(
        (t.waitlist.errors as Record<string, string>)[code ?? ''] ?? t.waitlist.errors.generic
      );
      setBusy(false);
    }
  };

  if (infoError) {
    return (
      <Page>
        <Card>
          <Title>{t.waitlist.notFound}</Title>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card data-testid='waitlist-join'>
        <Title>{info?.restaurant ?? '…'}</Title>
        <Sub>
          {info
            ? info.open
              ? t.waitlist.joinIntro
                  .replace('{waiting}', String(info.waiting))
                  .replace('{minutes}', String(info.estimate))
              : t.waitlist.closed
            : ''}
        </Sub>
        {info?.open ? (
          <>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t.waitlist.name}
              data-testid='waitlist-name'
            />
            <Input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={t.waitlist.phone}
              type='tel'
              data-testid='waitlist-phone'
            />
            <Stepper>
              <span style={{ flex: 1 }}>{t.waitlist.party}</span>
              <StepBtn type='button' onClick={() => setParty(p => Math.max(1, p - 1))}>
                −
              </StepBtn>
              <strong style={{ minWidth: 28, textAlign: 'center' }}>{party}</strong>
              <StepBtn
                type='button'
                onClick={() => setParty(p => Math.min(info?.max_party_size ?? 12, p + 1))}
              >
                +
              </StepBtn>
            </Stepper>
            {error ? <Err>{error}</Err> : null}
            <Btn
              type='button'
              disabled={!name.trim() || !phone.trim() || busy}
              onClick={submit}
              data-testid='waitlist-submit'
            >
              {t.waitlist.join}
            </Btn>
            <Sub>{t.waitlist.smsNote}</Sub>
          </>
        ) : null}
      </Card>
    </Page>
  );
}
