'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import axiosInstance from '@/api/axios';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/routing';
import { background, border, foreground, muted, radiusMd, slate100, white } from '@/tokens';

const Page = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background,
});

const Main = styled('main')({
  flex: 1,
  padding: '24px 20px',
  maxWidth: '520px',
  width: '100%',
  margin: '0 auto',
  '@media (min-width: 768px)': { padding: '48px 24px' },
});

const Card = styled('div')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const Title = styled('h1')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
});

const Subtitle = styled('p')({
  fontSize: '14px',
  color: muted,
  margin: 0,
  lineHeight: 1.5,
});

const MetaRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  color: foreground,
  padding: '10px 0',
  borderBottom: `1px solid ${border}`,
  '&:last-child': { borderBottom: 'none' },
});

const MetaLabel = styled('span')({ color: muted });

const ErrorBox = styled('div')({
  padding: '12px 16px',
  borderRadius: '8px',
  background: '#fef2f2',
  color: '#b91c1c',
  fontSize: '13px',
});

const Skeleton = styled('div')({
  height: '14px',
  borderRadius: '8px',
  background: slate100,
});

interface PreviewPayload {
  kind?: string;
  confirmation_code?: string;
  restaurant_name?: string;
  restaurant_slug?: string;
  restaurant_city?: string;
  restaurant_logo?: string;
  reservation_date?: string;
  reservation_time?: string;
  party_size?: number;
  host_name?: string;
  status?: string;
  is_expired?: boolean;
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

interface Props {
  locale: Locale;
  code: string;
}

export default function ReservationInvitePage({ locale, code }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const copy = t.reservationInvite;

  const [preview, setPreview] = useState<PreviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axiosInstance
      .get<PreviewPayload>(`/api/v1/reservations/invite/${encodeURIComponent(code)}/`)
      .then(res => {
        if (cancelled) return;
        if (res.data?.is_expired) {
          setError(copy.expired);
        } else {
          setPreview(res.data);
        }
      })
      .catch(() => {
        if (!cancelled) setError(copy.expired);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [code, copy.expired]);

  return (
    <Page>
      <HeaderPrimary />
      <Main>
        <Card>
          <Title>{copy.title}</Title>
          {loading ? (
            <>
              <Skeleton style={{ width: '60%' }} />
              <Skeleton style={{ width: '40%' }} />
              <Skeleton style={{ width: '80%' }} />
            </>
          ) : error || !preview ? (
            <>
              <ErrorBox>{error ?? copy.expired}</ErrorBox>
              <MainButton
                variant='rose_cta'
                title={copy.back}
                onClick={() => router.push(localePath(locale))}
                rounded
              />
            </>
          ) : (
            <>
              <Subtitle>
                {copy.subtitle
                  .replace('{host}', preview.host_name || copy.someone)
                  .replace('{restaurant}', preview.restaurant_name || '')}
              </Subtitle>

              <div>
                {preview.restaurant_name && (
                  <MetaRow>
                    <MetaLabel>{copy.restaurant}</MetaLabel>
                    <span>{preview.restaurant_name}</span>
                  </MetaRow>
                )}
                {preview.restaurant_city && (
                  <MetaRow>
                    <MetaLabel>{copy.city}</MetaLabel>
                    <span>{preview.restaurant_city}</span>
                  </MetaRow>
                )}
                {preview.reservation_date && (
                  <MetaRow>
                    <MetaLabel>{copy.date}</MetaLabel>
                    <span>{formatDate(preview.reservation_date)}</span>
                  </MetaRow>
                )}
                {preview.reservation_time && (
                  <MetaRow>
                    <MetaLabel>{copy.time}</MetaLabel>
                    <span>{preview.reservation_time}</span>
                  </MetaRow>
                )}
                {preview.party_size !== undefined && (
                  <MetaRow>
                    <MetaLabel>{copy.partySize}</MetaLabel>
                    <span>{preview.party_size}</span>
                  </MetaRow>
                )}
                {preview.host_name && (
                  <MetaRow>
                    <MetaLabel>{copy.host}</MetaLabel>
                    <span>{preview.host_name}</span>
                  </MetaRow>
                )}
              </div>

              {preview.restaurant_slug && (
                <MainButton
                  variant='rose_cta'
                  title={copy.viewRestaurant}
                  onClick={() =>
                    router.push(localePath(locale, `/restaurant/${preview.restaurant_slug}`))
                  }
                  fullWidth
                  rounded
                />
              )}
            </>
          )}
        </Card>
      </Main>
      <Footer locale={locale} />
    </Page>
  );
}
