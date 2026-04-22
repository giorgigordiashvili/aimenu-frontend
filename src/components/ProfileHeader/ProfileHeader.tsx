'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';

import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import EmailIcon from '@/icons/Email';
import LocationIcon from '@/icons/Location';
import LogoutIcon from '@/icons/Logout';
import PhoneIcon from '@/icons/Phone';
import {
  border,
  foreground,
  radiusSm,
  rose50,
  rose600,
  slate200,
  slate400,
  slate50,
  slate500,
  white,
} from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const HeaderRoot = styled('div')({
  // Hidden on mobile — the bottom nav + profile hub provide all the
  // identity/navigation surface needed. Shown on desktop where the
  // large user card reads as a landmark above the tab row.
  display: 'none',
  backgroundColor: white,
  borderBottom: `1px solid ${border}`,
  '@media (min-width: 768px)': {
    display: 'block',
    padding: '32px 24px',
  },
});

const HeaderInner = styled('div')({
  maxWidth: '1100px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  '@media (min-width: 768px)': {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const ProfileInfoLeft = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flex: 1,
});

const AvatarWrapper = styled('div')({
  position: 'relative',
  flexShrink: 0,
});

const AvatarCircle = styled('div')({
  position: 'relative', // ← makes Image fill clip to this circle, not to AvatarWrapper
  width: '72px',
  height: '72px',
  borderRadius: '50%',
  overflow: 'hidden',
  background: slate200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `3px solid ${slate50}`,
  boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)',
  flexShrink: 0,
  '@media (min-width: 768px)': {
    width: '80px',
    height: '80px',
  },
});

const AvatarInitials = styled('span')({
  fontSize: '24px',
  fontWeight: 700,
  color: slate400,
});

const ProfileMeta = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const ProfileName = styled('h1')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
  lineHeight: '28px',
  '@media (min-width: 768px)': {
    fontSize: '26px',
  },
});

const ProfileMetaRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px',
});

const ProfileMetaItem = styled('span')({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '13px',
  color: slate500,
  '& svg': {
    width: '16px',
    height: '16px',
    flexShrink: 0,
  },
  '& svg path': {
    stroke: slate500,
  },
});

const ProfileActions = styled('div')({
  display: 'flex',
  gap: '8px',
  flexShrink: 0,
  '@media (max-width: 767px)': {
    width: '100%',
    '& > *': { flex: 1 },
  },
});

const LogoutButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '6px 12px',
  fontSize: '14px',
  fontWeight: 500,
  color: rose600,
  backgroundColor: 'transparent',
  border: `1px solid ${rose600}`,
  borderRadius: radiusSm,
  cursor: 'pointer',
  lineHeight: '20px',
  '&:hover': {
    backgroundColor: rose50,
  },
});

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ProfileHeaderProps {
  displayName: string;
  displayEmail?: string | null;
  displayPhone?: string | null;
  displayLocation?: string | null;
  initials: string;
  avatar?: string | null;
  logout: () => void;
  onHome: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProfileHeader({
  displayName,
  displayEmail,
  displayPhone,
  displayLocation,
  initials,
  avatar,
  logout,
  onHome,
}: ProfileHeaderProps) {
  const t = useTranslations();

  return (
    <HeaderRoot>
      <HeaderInner>
        <ProfileInfoLeft>
          <AvatarWrapper>
            <AvatarCircle>
              {avatar ? (
                <Image
                  src={avatar}
                  alt={displayName}
                  fill
                  sizes='80px'
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <AvatarInitials>{initials}</AvatarInitials>
              )}
            </AvatarCircle>
          </AvatarWrapper>

          <ProfileMeta>
            <ProfileName>{displayName}</ProfileName>
            <ProfileMetaRow>
              {displayEmail && (
                <ProfileMetaItem>
                  <EmailIcon />
                  <span>{displayEmail}</span>
                </ProfileMetaItem>
              )}
              {displayPhone && (
                <ProfileMetaItem>
                  <PhoneIcon />
                  <span>{displayPhone}</span>
                </ProfileMetaItem>
              )}
              {displayLocation && (
                <ProfileMetaItem>
                  <LocationIcon />
                  <span>{displayLocation}</span>
                </ProfileMetaItem>
              )}
            </ProfileMetaRow>
          </ProfileMeta>
        </ProfileInfoLeft>

        <ProfileActions>
          <MainButton title={t.reservations.home} variant='outline' size='small' onClick={onHome} />
          <LogoutButton onClick={logout}>
            <LogoutIcon />
            {t.reservations.logout}
          </LogoutButton>
        </ProfileActions>
      </HeaderInner>
    </HeaderRoot>
  );
}
