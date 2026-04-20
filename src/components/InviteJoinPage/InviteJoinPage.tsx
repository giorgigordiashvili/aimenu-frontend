'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import axiosInstance from '@/api/axios';
import { tablesSessionsJoinRetrieve } from '@/api/generated/api';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { useTable } from '@/context/TableContext';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import EmailIcon from '@/icons/Email';
import PeopleIcon from '@/icons/People';
import { background, border, foreground, muted, slate500, white } from '@/tokens';

const Page = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background,
});

const Main = styled('main')({
  flex: 1,
  padding: '24px 20px',
  maxWidth: '480px',
  width: '100%',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: '48px 24px',
  },
});

const Card = styled('div')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: '16px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const Title = styled('h1')({
  fontSize: '24px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
  lineHeight: 1.2,
});

const Subtitle = styled('p')({
  fontSize: '14px',
  color: slate500,
  margin: 0,
  lineHeight: '20px',
});

const MetaRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  color: foreground,
  padding: '8px 0',
  borderBottom: `1px solid ${border}`,
  '&:last-child': {
    borderBottom: 'none',
  },
});

const MetaLabel = styled('span')({
  color: slate500,
});

const ErrorBox = styled('div')({
  padding: '12px 16px',
  borderRadius: '8px',
  background: '#fef2f2',
  color: '#b91c1c',
  fontSize: '13px',
});

const StatusMessage = styled('p')({
  fontSize: '14px',
  color: muted,
  textAlign: 'center',
  margin: 0,
  padding: '24px 0',
});

interface JoinInfo {
  host_name?: string;
  restaurant_name?: string;
  restaurant_slug?: string;
  table_number?: string;
  session_id?: string;
  invite_code?: string;
  status?: string;
  expires_at?: string;
  is_expired?: boolean;
}

interface Props {
  locale: Locale;
  inviteCode: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,}$/;

function isValidContact(value: string): boolean {
  const trimmed = value.trim();
  if (EMAIL_RE.test(trimmed)) return true;
  return PHONE_RE.test(trimmed.replace(/\s/g, ''));
}

export default function InviteJoinPage({ locale, inviteCode }: Props) {
  const t = getDictionary(locale);
  const router = useRouter();
  const { setTableData } = useTable();

  const [info, setInfo] = useState<JoinInfo | null>(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setFetching(true);
    tablesSessionsJoinRetrieve(inviteCode)
      .then(data => {
        if (cancelled) return;
        const payload = data as JoinInfo;
        if (payload?.is_expired) {
          setFetchError(t.inviteJoin.expired);
        } else {
          setInfo(payload);
        }
      })
      .catch(() => {
        if (!cancelled) setFetchError(t.inviteJoin.expired);
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [inviteCode, t.inviteJoin.expired]);

  const handleConfirm = useCallback(async () => {
    if (!name.trim() || !contact.trim()) return;
    if (!isValidContact(contact)) {
      setContactError(t.inviteJoin.invalidContact);
      return;
    }
    setContactError(null);
    setJoining(true);
    setJoinError(null);
    try {
      // POST body is untyped in the generated client; send directly via axios.
      await axiosInstance.post(`/api/v1/tables/sessions/join/${inviteCode}/confirm/`, {
        guest_name: name.trim(),
        guest_contact: contact.trim(),
      });

      if (info?.restaurant_slug) {
        setTableData({
          code: inviteCode,
          tableNumber: info.table_number,
          restaurantSlug: info.restaurant_slug,
          sessionId: info.session_id,
          isValidated: true,
        });
        router.push(localePath(locale, `/restaurant/${info.restaurant_slug}`));
      } else {
        router.push(localePath(locale));
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.error('[joinSession]', err);
      setJoinError(t.inviteJoin.failed);
      setJoining(false);
    }
  }, [
    contact,
    info,
    inviteCode,
    locale,
    name,
    router,
    setTableData,
    t.inviteJoin.failed,
    t.inviteJoin.invalidContact,
  ]);

  if (fetching) {
    return (
      <Page>
        <HeaderPrimary />
        <Main>
          <Card>
            <Title>{t.inviteJoin.title}</Title>
            <StatusMessage>…</StatusMessage>
          </Card>
        </Main>
      </Page>
    );
  }

  if (fetchError || !info) {
    return (
      <Page>
        <HeaderPrimary />
        <Main>
          <Card>
            <Title>{t.inviteJoin.title}</Title>
            <ErrorBox>{fetchError ?? t.inviteJoin.expired}</ErrorBox>
            <MainButton
              variant='rose_cta'
              title={t.orderReview.backToMenu}
              onClick={() => router.push(localePath(locale))}
              rounded
            />
          </Card>
        </Main>
      </Page>
    );
  }

  return (
    <Page>
      <HeaderPrimary />
      <Main>
        <Card>
          <Title>{t.inviteJoin.title}</Title>
          <Subtitle>{t.inviteJoin.subtitle}</Subtitle>

          <div>
            {info.host_name && (
              <MetaRow>
                <MetaLabel>{t.inviteJoin.host}</MetaLabel>
                <span>{info.host_name}</span>
              </MetaRow>
            )}
            {info.restaurant_name && (
              <MetaRow>
                <MetaLabel>{t.inviteJoin.restaurant}</MetaLabel>
                <span>{info.restaurant_name}</span>
              </MetaRow>
            )}
            {info.table_number && (
              <MetaRow>
                <MetaLabel>{t.inviteJoin.table}</MetaLabel>
                <span>{info.table_number}</span>
              </MetaRow>
            )}
          </div>

          <TextInput
            label=''
            leftIcon={PeopleIcon}
            placeholder={t.inviteJoin.namePlaceholder}
            value={name}
            onChange={e => setName(e.target.value)}
            variant='outlined'
          />
          <TextInput
            label=''
            leftIcon={EmailIcon}
            placeholder={t.inviteJoin.contactPlaceholder}
            value={contact}
            onChange={e => {
              setContact(e.target.value);
              if (contactError) setContactError(null);
            }}
            errorMessage={contactError || undefined}
            variant='outlined'
          />

          {joinError && <ErrorBox>{joinError}</ErrorBox>}

          <MainButton
            variant='rose_cta'
            title={joining ? t.inviteJoin.joining : t.inviteJoin.confirm}
            onClick={handleConfirm}
            disabled={joining || !name.trim() || !contact.trim()}
            fullWidth
          />
        </Card>
      </Main>
    </Page>
  );
}
