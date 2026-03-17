'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { usersMeRetrieve } from '@/api/generated/api';
import type { User } from '@/api/generated/interfaces';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileTabNav from '@/components/ProfileTabNav';
import { useAuth } from '@/context/AuthContext';
import { MOCK_MODE, MOCK_PROFILE } from '@/hooks/useReservations';
import { Locale } from '@/i18n/config';
import { slate50 } from '@/tokens';

interface ProfileShellProps {
  locale: Locale;
  children: React.ReactNode;
}

export default function ProfileShell({ locale, children }: ProfileShellProps) {
  const { user: authUser, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Fresh user data — starts from auth context, gets overwritten by API response
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push(`/${locale}/login`);
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
    <div style={{ background: slate50, minHeight: '100vh' }}>
      <HeaderPrimary />
      <ProfileHeader
        displayName={displayName}
        displayEmail={displayEmail}
        displayPhone={displayPhone}
        displayLocation={displayLocation}
        initials={initials}
        avatar={displayUser.avatar}
        logout={logout}
        onHome={() => router.push(`/${locale}`)}
      />
      <ProfileTabNav />
      <main style={{ background: slate50 }}>{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
