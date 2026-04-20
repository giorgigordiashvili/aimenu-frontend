'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { authPasswordResetConfirmCreate } from '@/api/generated';
import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import ArrowIcon from '@/icons/Arrow';
import Checkmark from '@/icons/Checkmark';
import EyeIcon from '@/icons/Eye';

import {
  AlertBox,
  BackLink,
  Card,
  Field,
  Footer,
  Form,
  FormErrors,
  Header,
  Page,
  PasswordResetProps,
  ResponsiveButton,
  Subtitle,
  SuccessBox,
  SuccessIcon,
  Title,
} from './shared';

export default function PasswordResetConfirm({ locale }: PasswordResetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = getDictionary(locale);

  const token = searchParams.get('token');

  // DEV ONLY: Add ?mock=success or ?mock=form to test UI states
  const mockState = process.env.NODE_ENV === 'development' ? searchParams.get('mock') : null;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(mockState === 'success');

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push(localePath(locale, '/login'));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, locale, router]);

  function validate(): boolean {
    const next: FormErrors = {};

    if (!password) {
      next.password = t.passwordReset.passwordRequired;
    } else if (password.length < 8) {
      next.password = t.passwordReset.passwordTooShort;
    }

    if (!confirmPassword) {
      next.confirmPassword = t.passwordReset.passwordRequired;
    } else if (password !== confirmPassword) {
      next.confirmPassword = t.passwordReset.passwordsDoNotMatch;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    if (!token) {
      setApiError(t.passwordReset.invalidToken);
      return;
    }

    setIsLoading(true);

    try {
      await authPasswordResetConfirmCreate({
        token,
        new_password: password,
        new_password_confirm: confirmPassword,
      });

      setIsSuccess(true);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: { detail?: string } } };
        const status = axiosErr.response?.status;

        if (status === 400 || status === 404) {
          setApiError(t.passwordReset.invalidToken);
        } else {
          setApiError(axiosErr.response?.data?.detail || t.passwordReset.resetFailed);
        }
      } else if (err instanceof Error && err.message === 'Network Error') {
        setApiError(t.passwordReset.networkError);
      } else {
        setApiError(t.passwordReset.resetFailed);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Missing token state (skip in mock mode)
  if (!token && !mockState) {
    return (
      <Page>
        <Card>
          <Header>
            <Title>{t.passwordReset.confirmTitle}</Title>
          </Header>

          <AlertBox style={{ marginBottom: '20px' }}>{t.passwordReset.invalidToken}</AlertBox>

          <Footer>
            <Link href={localePath(locale, '/password-reset')}>{t.passwordReset.requestTitle}</Link>
          </Footer>
        </Card>
      </Page>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <Page>
        <Card>
          <SuccessIcon>
            <Checkmark />
          </SuccessIcon>

          <Header>
            <Title>{t.passwordReset.confirmTitle}</Title>
          </Header>

          <SuccessBox style={{ marginBottom: '20px' }}>{t.passwordReset.resetSuccess}</SuccessBox>

          <Footer>
            <Link href={localePath(locale, '/login')}>{t.passwordReset.backToLogin}</Link>
          </Footer>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card>
        <BackLink href={localePath(locale, '/login')}>
          <ArrowIcon />
          {t.passwordReset.back}
        </BackLink>

        <Header>
          <Title>{t.passwordReset.confirmTitle}</Title>
          <Subtitle>{t.passwordReset.confirmSubtitle}</Subtitle>
        </Header>

        {apiError && <AlertBox style={{ marginBottom: '20px' }}>{apiError}</AlertBox>}

        <Form onSubmit={handleSubmit} noValidate>
          <Field>
            <TextInput
              label={t.passwordReset.newPassword}
              id='new-password'
              type='password'
              placeholder={t.passwordReset.newPasswordPlaceholder}
              autoComplete='new-password'
              required
              value={password}
              errorMessage={errors.password}
              onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
              icon={EyeIcon}
            />
          </Field>

          <Field>
            <TextInput
              label={t.passwordReset.confirmPassword}
              id='confirm-password'
              type='password'
              placeholder={t.passwordReset.confirmPasswordPlaceholder}
              autoComplete='new-password'
              required
              value={confirmPassword}
              errorMessage={errors.confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors(prev => ({ ...prev, confirmPassword: undefined }));
              }}
              icon={EyeIcon}
            />
          </Field>

          <ResponsiveButton
            style={{ opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
          >
            <MainButton
              variant='rose_cta'
              fullWidth
              type='submit'
              title={isLoading ? '...' : t.passwordReset.resetPassword}
            />
          </ResponsiveButton>
        </Form>

        <Footer>
          <Link href={localePath(locale, '/login')}>{t.passwordReset.backToLogin}</Link>
        </Footer>
      </Card>
    </Page>
  );
}
