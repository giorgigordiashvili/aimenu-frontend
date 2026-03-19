'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import { authPasswordChangeCreate } from '@/api/generated/api';
import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import ToastNotification from '@/components/ToastNotification';
import { useTranslations } from '@/context/LocaleContext';
import { useToast } from '@/hooks/useToast';
import EyeIcon from '@/icons/Eye';
import { foreground, primary } from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const SectionTitle = styled('h2')({
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 20px',
});

const FieldGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '16px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const ErrorText = styled('p')({
  fontSize: '12px',
  color: primary,
  margin: '4px 0 0',
});

const Actions = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '24px',
});

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FormErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ChangePasswordForm() {
  const t = useTranslations();
  const { toast, showToast, hideToast } = useToast();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: FormErrors = {};
    if (!oldPassword) errs.oldPassword = t.profile.fieldRequired;
    if (newPassword.length < 8) errs.newPassword = t.profile.passwordMinLength;
    if (newPassword !== confirmPassword) errs.confirmPassword = t.profile.passwordsDoNotMatch;
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
      showToast(t.profile.passwordChanged, 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      showToast(t.profile.updateError, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SectionTitle>{t.profile.changePassword}</SectionTitle>

        <FieldGrid>
          <div>
            <TextInput
              label={t.profile.currentPassword}
              type='password'
              icon={EyeIcon}
              value={oldPassword}
              onChange={e => {
                setOldPassword(e.target.value);
                setErrors(p => ({ ...p, oldPassword: undefined }));
              }}
              placeholder='••••••••'
              autoComplete='current-password'
            />
            {errors.oldPassword && <ErrorText>{errors.oldPassword}</ErrorText>}
          </div>
          <div>
            <TextInput
              label={t.profile.newPassword}
              type='password'
              icon={EyeIcon}
              value={newPassword}
              onChange={e => {
                setNewPassword(e.target.value);
                setErrors(p => ({ ...p, newPassword: undefined }));
              }}
              placeholder='••••••••'
              autoComplete='new-password'
            />
            {errors.newPassword && <ErrorText>{errors.newPassword}</ErrorText>}
          </div>
          <div>
            <TextInput
              label={t.profile.confirmPassword}
              type='password'
              icon={EyeIcon}
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value);
                setErrors(p => ({ ...p, confirmPassword: undefined }));
              }}
              placeholder='••••••••'
              autoComplete='new-password'
            />
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
          </div>
        </FieldGrid>

        <Actions>
          <MainButton
            title={loading ? '...' : t.profile.updatePassword}
            variant='outline'
            size='large'
            type='submit'
          />
        </Actions>
      </form>

      {toast && (
        <ToastNotification message={toast.message} variant={toast.variant} onClose={hideToast} />
      )}
    </>
  );
}
