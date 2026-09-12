'use client';

import { styled } from '@pigment-css/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import axiosInstance from '@/api/axios';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import { useAuth } from '@/context/AuthContext';
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

const Title = styled('h1')({ fontSize: '22px', fontWeight: 700, color: foreground, margin: 0 });

const Subtitle = styled('p')({ fontSize: '14px', color: muted, margin: 0, lineHeight: 1.5 });

const MetaRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '12px',
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

const SuccessBox = styled('div')({
  padding: '12px 16px',
  borderRadius: '8px',
  background: '#ecfccb',
  color: '#3f6212',
  fontSize: '14px',
  lineHeight: 1.5,
});

const Skeleton = styled('div')({ height: '14px', borderRadius: '8px', background: slate100 });

const Actions = styled('div')({ display: 'flex', flexDirection: 'column', gap: '10px' });

const Small = styled('p')({ fontSize: '13px', color: muted, margin: 0, lineHeight: 1.5 });

const LinkButton = styled('button')({
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#155dfc',
  cursor: 'pointer',
  fontSize: '13px',
});

interface Invitation {
  restaurant_name: string;
  restaurant_slug: string;
  restaurant_logo?: string | null;
  role: string;
  invited_by?: string;
  is_valid: boolean;
  expires_at?: string;
  status: string;
  admin_url?: string;
  pos_url?: string;
}

interface AcceptResult {
  restaurant_name?: string;
  admin_url?: string;
  pos_url?: string;
}

function formatDateTime(iso: string | undefined): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

interface Props {
  locale: Locale;
  token: string;
}

/**
 * Staff invitation landing page. The token is the capability: anyone with the
 * link can read the restaurant/role, but accepting needs a signed-in account,
 * which then becomes a staff member (and may open the tenant admin / POS).
 */
export default function StaffAcceptPage({ locale, token }: Props) {
  const t = useTranslations();
  const copy = t.staffInvite;
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [done, setDone] = useState<AcceptResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axiosInstance
      .get<Invitation>(`/api/v1/staff/invitations/${encodeURIComponent(token)}/`)
      .then(res => {
        if (cancelled) return;
        const data = res.data;
        if (!data?.is_valid) {
          setError(
            data?.status === 'accepted'
              ? copy.alreadyAccepted
              : data?.status === 'expired'
                ? copy.expired
                : copy.invalid
          );
        }
        setInvitation(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setError(copy.invalid);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, copy.alreadyAccepted, copy.expired, copy.invalid]);

  const redirectQuery = `?redirect=${encodeURIComponent(pathname)}`;

  async function accept() {
    setAccepting(true);
    setError(null);
    try {
      const res = await axiosInstance.post<AcceptResult>('/api/v1/staff/invitations/accept/', {
        token,
      });
      setDone(res.data ?? {});
    } catch (err) {
      const message = (err as { response?: { data?: { token?: string[]; detail?: string } } })
        ?.response?.data;
      setError(message?.token?.[0] ?? message?.detail ?? copy.failed);
    } finally {
      setAccepting(false);
    }
  }

  const adminUrl =
    done?.admin_url ??
    invitation?.admin_url ??
    (invitation ? `https://${invitation.restaurant_slug}.admin.aimenu.ge/tenant-admin/` : '#');
  const posUrl = done?.pos_url ?? invitation?.pos_url ?? 'https://pos.aimenu.ge';

  return (
    <Page>
      <HeaderPrimary />
      <Main>
        <Card>
          <Title>{copy.title}</Title>
          {loading || authLoading ? (
            <>
              <Skeleton style={{ width: '60%' }} />
              <Skeleton style={{ width: '40%' }} />
              <Skeleton style={{ width: '80%' }} />
            </>
          ) : done ? (
            <>
              <SuccessBox>
                {copy.accepted.replace('{restaurant}', invitation?.restaurant_name ?? '')}
              </SuccessBox>
              <Actions>
                <a href={adminUrl}>
                  <MainButton variant='rose_cta' title={copy.openAdmin} fullWidth rounded />
                </a>
                <a href={posUrl}>
                  <MainButton variant='outline' title={copy.openPos} fullWidth rounded />
                </a>
              </Actions>
            </>
          ) : error && !invitation?.is_valid ? (
            <>
              <ErrorBox>{error}</ErrorBox>
              <MainButton
                variant='rose_cta'
                title={copy.back}
                onClick={() => router.push(localePath(locale))}
                rounded
              />
            </>
          ) : invitation ? (
            <>
              <Subtitle>
                {copy.subtitle
                  .replace('{restaurant}', invitation.restaurant_name)
                  .replace('{role}', invitation.role)}
              </Subtitle>
              <div>
                <MetaRow>
                  <MetaLabel>{copy.restaurant}</MetaLabel>
                  <span>{invitation.restaurant_name}</span>
                </MetaRow>
                <MetaRow>
                  <MetaLabel>{copy.role}</MetaLabel>
                  <span>{invitation.role}</span>
                </MetaRow>
                {invitation.invited_by && (
                  <MetaRow>
                    <MetaLabel>{copy.invitedBy}</MetaLabel>
                    <span>{invitation.invited_by}</span>
                  </MetaRow>
                )}
                {invitation.expires_at && (
                  <MetaRow>
                    <MetaLabel>{copy.expires}</MetaLabel>
                    <span>{formatDateTime(invitation.expires_at)}</span>
                  </MetaRow>
                )}
              </div>
              {error && <ErrorBox>{error}</ErrorBox>}
              {isAuthenticated ? (
                <Actions>
                  <MainButton
                    variant='rose_cta'
                    title={accepting ? copy.accepting : copy.accept}
                    onClick={accept}
                    disabled={accepting}
                    fullWidth
                    rounded
                  />
                  <Small>
                    {copy.loggedInAs.replace('{email}', user?.email ?? '')}{' '}
                    <LinkButton type='button' onClick={() => logout()}>
                      {copy.switchAccount}
                    </LinkButton>
                  </Small>
                </Actions>
              ) : (
                <Actions>
                  <Small>{copy.signInHint}</Small>
                  <MainButton
                    variant='rose_cta'
                    title={copy.loginCta}
                    onClick={() => router.push(localePath(locale, '/login') + redirectQuery)}
                    fullWidth
                    rounded
                  />
                  <MainButton
                    variant='outline'
                    title={copy.registerCta}
                    onClick={() => router.push(localePath(locale, '/register') + redirectQuery)}
                    fullWidth
                    rounded
                  />
                </Actions>
              )}
            </>
          ) : (
            <ErrorBox>{copy.invalid}</ErrorBox>
          )}
        </Card>
      </Main>
      <Footer locale={locale} />
    </Page>
  );
}
