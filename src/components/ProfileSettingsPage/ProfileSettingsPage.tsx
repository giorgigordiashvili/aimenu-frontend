'use client';

import { styled } from '@pigment-css/react';

import ChangePasswordForm from './ChangePasswordForm';
import PersonalInfoForm from './PersonalInfoForm';

// ─── Styled ────────────────────────────────────────────────────────────────────

const PageInner = styled('div')({
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 16px 60px',
  '@media (min-width: 768px)': {
    padding: '0 0 60px',
  },
});

const SettingsLayout = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
});

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProfileSettingsPage() {
  return (
    <PageInner>
      <SettingsLayout>
        <PersonalInfoForm />
        <ChangePasswordForm />
      </SettingsLayout>
    </PageInner>
  );
}
