'use client';

import { styled } from '@pigment-css/react';

import { border, radiusMd, white } from '@/tokens';

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

/** Single card wrapping both sections */
const Card = styled('div')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '28px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
});

const Divider = styled('div')({
  height: '1px',
  background: border,
  margin: '28px 0',
});

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProfileSettingsPage() {
  return (
    <PageInner>
      <Card>
        <PersonalInfoForm />
        <Divider />
        <ChangePasswordForm />
      </Card>
    </PageInner>
  );
}
