'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import { authPasswordChangeCreate } from '@/api/generated/api';
import { useTranslations } from '@/context/LocaleContext';
import { useToast } from '@/hooks/useToast';
import {
  background,
  border,
  foreground,
  primary,
  radiusMd,
  radiusSm,
  shadowCard,
  slate400,
  slate600,
  slate900,
  white,
} from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const Card = styled('div')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '28px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

const CardTitle = styled('h2')({
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
  paddingBottom: '16px',
  borderBottom: `1px solid ${border}`,
});

const FieldList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const FieldWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const Label = styled('label')({
  fontSize: '13px',
  fontWeight: 600,
  color: slate600,
});

const Input = styled('input')({
  padding: '10px 14px',
  fontSize: '15px',
  color: foreground,
  background: background,
  border: `1px solid ${border}`,
  borderRadius: radiusSm,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  '&:focus': {
    borderColor: primary,
  },
  '&::placeholder': {
    color: slate400,
  },
});

const ErrorText = styled('p')({
  fontSize: '12px',
  color: primary,
  margin: 0,
});

const Actions = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
});

const SaveButton = styled('button')({
  padding: '11px 28px',
  background: primary,
  color: white,
  border: 'none',
  borderRadius: radiusSm,
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.9 },
  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
});

const Toast = styled('div')({
  position: 'fixed',
  bottom: '24px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: slate900,
  color: white,
  padding: '12px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  zIndex: 400,
  whiteSpace: 'nowrap',
  boxShadow: shadowCard,
});

// ─── Validation ────────────────────────────────────────────────────────────────

interface FormErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ChangePasswordForm() {
  const t = useTranslations();
  const { toast, showToast } = useToast();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errs: FormErrors = {};
    if (!oldPassword) errs.oldPassword = 'Required';
    if (newPassword.length < 8) errs.newPassword = 'Minimum 8 characters';
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await authPasswordChangeCreate({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      });
      showToast(t.profile.passwordChanged);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      showToast(t.profile.updateError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardTitle>{t.profile.changePassword}</CardTitle>

        <form onSubmit={handleSubmit}>
          <FieldList>
            <FieldWrap>
              <Label htmlFor='oldPassword'>{t.profile.currentPassword}</Label>
              <Input
                id='oldPassword'
                type='password'
                value={oldPassword}
                onChange={e => {
                  setOldPassword(e.target.value);
                  setErrors(p => ({ ...p, oldPassword: undefined }));
                }}
                placeholder='••••••••'
                autoComplete='current-password'
              />
              {errors.oldPassword && <ErrorText>{errors.oldPassword}</ErrorText>}
            </FieldWrap>

            <FieldWrap>
              <Label htmlFor='newPassword'>{t.profile.newPassword}</Label>
              <Input
                id='newPassword'
                type='password'
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                  setErrors(p => ({ ...p, newPassword: undefined }));
                }}
                placeholder='••••••••'
                autoComplete='new-password'
              />
              {errors.newPassword && <ErrorText>{errors.newPassword}</ErrorText>}
            </FieldWrap>

            <FieldWrap>
              <Label htmlFor='confirmPassword'>{t.profile.confirmPassword}</Label>
              <Input
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setErrors(p => ({ ...p, confirmPassword: undefined }));
                }}
                placeholder='••••••••'
                autoComplete='new-password'
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
            </FieldWrap>
          </FieldList>

          <Actions style={{ marginTop: '8px' }}>
            <SaveButton type='submit' disabled={loading}>
              {loading ? '...' : t.profile.updatePassword}
            </SaveButton>
          </Actions>
        </form>
      </Card>

      {toast && <Toast>{toast}</Toast>}
    </>
  );
}
