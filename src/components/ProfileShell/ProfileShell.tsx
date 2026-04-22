'use client';

import { styled } from '@pigment-css/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { usersMeRetrieve } from '@/api/generated/api';
import type { User } from '@/api/generated/interfaces';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileTabNav from '@/components/ProfileTabNav';
import ProfileTabSlide from '@/components/ProfileTabSlide';
import { useAuth } from '@/context/AuthContext';
import { MOCK_MODE, MOCK_PROFILE } from '@/hooks/useReservations';
import { Locale } from '@/i18n/config';
import { localePath, stripLocale } from '@/i18n/routing';
import { slate50 } from '@/tokens';

const ShellWrapper = styled('div')({
  background: slate50,
  minHeight: '100vh',
});

interface ProfileShellProps {
  locale: Locale;
  children: React.ReactNode;
}

export default function ProfileShell({ locale, children }: ProfileShellProps) {
  const { user: authUser, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // The hub page at /profile renders its own avatar card + navigation, so
  // hide the shell's ProfileHeader + ProfileTabNav (and the slide animation)
  // on that route. Sub-routes like /profile/reservations keep the full shell.
  const { pathWithoutLocale } = stripLocale(pathname);
  const isHub = pathWithoutLocale === '/profile';

  // Fresh user data — starts from auth context, gets overwritten by API response
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push(localePath(locale, '/login'));
    }
    if (authUser) setUser(authUser);
  }, [authLoading, authUser, router, locale]);

  // Fetch fresh profile data so header shows up-to-date info
  useEffect(() => {
    if (!authUser) return;
    usersMeRetrieve()
      .then(fresh => setUser(fresh))
      .catch(() => {});
  }, [authUser]);

  if (authLoading || !authUser) return null;

  const displayUser = user ?? authUser;

  const displayName =
    (MOCK_MODE
      ? MOCK_PROFILE.name
      : displayUser.full_name ||
        `${displayUser.first_name ?? ''} ${displayUser.last_name ?? ''}`.trim() ||
        displayUser.email) ?? '';

  const displayEmail = MOCK_MODE ? MOCK_PROFILE.email : displayUser.email;
  const displayPhone = MOCK_MODE ? MOCK_PROFILE.phone : displayUser.phone_number;
  const displayLocation = MOCK_MODE ? MOCK_PROFILE.location : null;

  const initials = displayName
    ? displayName
        .split(' ')
        .map((n: string) => n[0])
        .filter(Boolean)
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  return (
    <ShellWrapper>
      <HeaderPrimary />
      {!isHub && (
        <>
          <ProfileHeader
            displayName={displayName}
            displayEmail={displayEmail}
            displayPhone={displayPhone}
            displayLocation={displayLocation}
            initials={initials}
            avatar={displayUser.avatar}
            logout={logout}
            onHome={() => router.push(localePath(locale))}
          />
          <ProfileTabNav />
        </>
      )}
      <main>{isHub ? children : <ProfileTabSlide>{children}</ProfileTabSlide>}</main>
      <Footer locale={locale} />
    </ShellWrapper>
  );
}
