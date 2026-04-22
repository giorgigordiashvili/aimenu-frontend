'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { usersMeRetrieve } from '@/api/generated/api';
import type { User } from '@/api/generated/interfaces';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from '@/context/LocaleContext';
import { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/routing';
import ArrowRightIcon from '@/icons/ArrowRight';
import CalendarIcon from '@/icons/Calendar';
import CreditCardIcon from '@/icons/CreditCard';
import EditIcon from '@/icons/Edit';
import HeartOutlineIcon from '@/icons/HeartOutline';
import LogoutIcon from '@/icons/Logout';
import PeopleIcon from '@/icons/People';
import StarIcon from '@/icons/Star';
import UserIcon from '@/icons/User';
import {
  background,
  border,
  foreground,
  radiusMd,
  rose600,
  slate100,
  slate400,
  slate500,
  white,
} from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const Wrapper = styled('div')({
  width: '100%',
  maxWidth: '720px',
  margin: '0 auto',
  padding: '20px 16px 32px',
  // Desktop keeps the legacy tabbed experience — /profile client-redirects
  // to /profile/reservations in the useEffect below. Hide the hub markup
  // on desktop so users never flash-see the mobile layout.
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const Title = styled('h1')({
  fontSize: '24px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 16px',
  letterSpacing: '-0.3px',
});

const HeaderCard = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  background: white,
  borderRadius: radiusMd,
  border: `1px solid ${border}`,
  padding: '14px 16px',
  marginBottom: '12px',
});

const Avatar = styled('div')({
  position: 'relative',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: rose600,
  color: white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: 700,
  flexShrink: 0,
  overflow: 'hidden',
});

const UserInfo = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
});

const Name = styled('span')({
  fontSize: '15px',
  fontWeight: 600,
  color: foreground,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const Sub = styled('span')({
  fontSize: '12px',
  color: slate500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const Section = styled('div')({
  background: white,
  borderRadius: radiusMd,
  border: `1px solid ${border}`,
  overflow: 'hidden',
  marginBottom: '12px',
});

const RowBase = styled('button')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  background: 'transparent',
  border: 'none',
  borderBottom: `1px solid ${slate100}`,
  cursor: 'pointer',
  textAlign: 'left',
  color: foreground,
  fontSize: '14px',
  fontWeight: 500,
  transition: 'background 0.1s',
  '&:last-child': { borderBottom: 'none' },
  '&:hover': { background: background },
  '&[data-danger="true"]': {
    color: '#F04438',
  },
});

const IconCircle = styled('span')({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: slate100,
  color: foreground,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '&[data-danger="true"]': {
    color: '#F04438',
  },
});

const RowLabel = styled('span')({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const RowChevron = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: slate400,
});

// ─── Component ─────────────────────────────────────────────────────────────────

interface Props {
  locale: Locale;
}

export default function ProfileHubPage({ locale }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { user: authUser, isLoading, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push(localePath(locale, '/login'));
    }
    if (authUser) setUser(authUser);
  }, [isLoading, authUser, router, locale]);

  useEffect(() => {
    if (!authUser) return;
    usersMeRetrieve()
      .then(setUser)
      .catch(() => {});
  }, [authUser]);

  // Desktop users keep the legacy tabbed /profile/reservations experience —
  // /profile exists as the hub only on mobile. Redirect on mount so desktop
  // lands where the horizontal tab row lives.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(min-width: 768px)').matches) {
      router.replace(localePath(locale, '/profile/reservations'));
    }
  }, [router, locale]);

  if (isLoading || !authUser) return null;

  const displayUser = user ?? authUser;
  const displayName =
    displayUser.full_name ||
    `${displayUser.first_name ?? ''} ${displayUser.last_name ?? ''}`.trim() ||
    displayUser.email ||
    '';
  const displaySub = displayUser.phone_number || displayUser.email || '';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const navigate = (path: string) => router.push(localePath(locale, path));
  const chevron = <ArrowRightIcon color={slate400} size={14} />;

  return (
    <Wrapper>
      <Title>{t.profile.tabs.profile}</Title>

      <HeaderCard>
        <Avatar>
          {displayUser.avatar ? (
            <Image
              src={displayUser.avatar}
              alt={displayName}
              fill
              sizes='56px'
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <span>{initials || '·'}</span>
          )}
        </Avatar>
        <UserInfo>
          <Name>{displayName}</Name>
          {displaySub && <Sub>{displaySub}</Sub>}
        </UserInfo>
      </HeaderCard>

      <Section>
        <RowBase onClick={() => navigate('/profile/reservations')}>
          <IconCircle>
            <CalendarIcon />
          </IconCircle>
          <RowLabel>{t.profile.tabs.reservations}</RowLabel>
          <RowChevron>{chevron}</RowChevron>
        </RowBase>
        <RowBase onClick={() => navigate('/profile/loyalty')}>
          <IconCircle>
            <StarIcon />
          </IconCircle>
          <RowLabel>{t.profile.tabs.loyalty}</RowLabel>
          <RowChevron>{chevron}</RowChevron>
        </RowBase>
        <RowBase onClick={() => navigate('/profile/reviews')}>
          <IconCircle>
            <EditIcon />
          </IconCircle>
          <RowLabel>{t.profile.tabs.reviews}</RowLabel>
          <RowChevron>{chevron}</RowChevron>
        </RowBase>
        <RowBase onClick={() => navigate('/profile/referral')}>
          <IconCircle>
            <PeopleIcon />
          </IconCircle>
          <RowLabel>{t.profile.tabs.referral}</RowLabel>
          <RowChevron>{chevron}</RowChevron>
        </RowBase>
      </Section>

      <Section>
        <RowBase onClick={() => navigate('/favorites')}>
          <IconCircle>
            <HeartOutlineIcon width={16} height={14} />
          </IconCircle>
          <RowLabel>{t.profile.tabs.favorites}</RowLabel>
          <RowChevron>{chevron}</RowChevron>
        </RowBase>
        <RowBase onClick={() => navigate('/profile/payment')}>
          <IconCircle>
            <CreditCardIcon />
          </IconCircle>
          <RowLabel>{t.profile.tabs.payment}</RowLabel>
          <RowChevron>{chevron}</RowChevron>
        </RowBase>
        <RowBase onClick={() => navigate('/profile/settings')}>
          <IconCircle>
            <UserIcon width={16} height={16} />
          </IconCircle>
          <RowLabel>{t.profile.settingsTitle}</RowLabel>
          <RowChevron>{chevron}</RowChevron>
        </RowBase>
      </Section>

      <Section>
        <RowBase data-danger='true' onClick={() => logout()}>
          <IconCircle data-danger='true'>
            <LogoutIcon />
          </IconCircle>
          <RowLabel>{t.header.logout}</RowLabel>
        </RowBase>
      </Section>
    </Wrapper>
  );
}
