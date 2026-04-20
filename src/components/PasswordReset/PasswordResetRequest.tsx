'use client';

import Link from 'next/link';
import { useState } from 'react';

import { authPasswordResetCreate } from '@/api/generated';
import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import ArrowIcon from '@/icons/Arrow';
import Checkmark from '@/icons/Checkmark';

import {
  AlertBox,
  BackLink,
  Card,
  EMAIL_RE,
  Field,
  Footer,
  Form,
  FormErrors,
  Header,
  Page,
  PasswordResetProps,
  ResponsiveButton,
  Subtitle,
  SuccessIcon,
  Title,
} from './shared';

export default function PasswordResetRequest({ locale }: PasswordResetProps) {
  const t = getDictionary(locale);

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!email.trim() || !EMAIL_RE.test(email)) {
      next.email = t.passwordReset.invalidEmail;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      await authPasswordResetCreate({
        email: email.trim(),
      });

      setIsSuccess(true);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: { detail?: string } } };
        const status = axiosErr.response?.status;

        if (status === 404 || status === 400) {
          setApiError(t.passwordReset.emailNotFound);
        } else {
          setApiError(axiosErr.response?.data?.detail || t.passwordReset.requestFailed);
        }
      } else if (err instanceof Error && err.message === 'Network Error') {
        setApiError(t.passwordReset.networkError);
      } else {
        setApiError(t.passwordReset.requestFailed);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <Page>
        <Card>
          <SuccessIcon>
            <Checkmark />
          </SuccessIcon>

          <Header>
            <Title>{t.passwordReset.successTitle}</Title>
            <Subtitle>{t.passwordReset.successSubtitle}</Subtitle>
          </Header>

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
          <Title>{t.passwordReset.requestTitle}</Title>
          <Subtitle>{t.passwordReset.requestSubtitle}</Subtitle>
        </Header>

        {apiError && <AlertBox style={{ marginBottom: '20px' }}>{apiError}</AlertBox>}

        <Form onSubmit={handleSubmit} noValidate>
          <Field>
            <TextInput
              label={t.passwordReset.email}
              id='reset-email'
              type='email'
              placeholder={t.passwordReset.emailPlaceholder}
              autoComplete='email'
              required
              value={email}
              errorMessage={errors.email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
            />
          </Field>

          <ResponsiveButton
            style={{ opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
          >
            <MainButton
              variant='rose_cta'
              fullWidth
              type='submit'
              title={isLoading ? '...' : t.passwordReset.sendLink}
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
