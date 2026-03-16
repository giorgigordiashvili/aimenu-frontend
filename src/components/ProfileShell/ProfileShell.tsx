'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileTabNav from '@/components/ProfileTabNav';
import { useAuth } from '@/context/AuthContext';
import { MOCK_MODE, MOCK_PROFILE } from '@/hooks/useReservations';
import { Locale } from '@/i18n/config';

interface ProfileShellProps {
  locale: Locale;
  children: React.ReactNode;
}

export default function ProfileShell({ locale, children }: ProfileShellProps) {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [authLoading, user, router, locale]);

  if (authLoading || !user) return null;

  const displayName = MOCK_MODE
    ? MOCK_PROFILE.name
    : user.full_name || `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email;
  const displayEmail = MOCK_MODE ? MOCK_PROFILE.email : user.email;
  const displayPhone = MOCK_MODE ? MOCK_PROFILE.phone : user.phone_number;
  const displayLocation = MOCK_MODE ? MOCK_PROFILE.location : null;

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <HeaderPrimary />
      <ProfileHeader
        displayName={displayName}
        displayEmail={displayEmail}
        displayPhone={displayPhone}
        displayLocation={displayLocation}
        initials={initials}
        avatar={user.avatar}
        logout={logout}
        onHome={() => router.push(`/${locale}`)}
      />
      <ProfileTabNav />
      <main>{children}</main>
      <Footer locale={locale} />
    </>
  );
}
