'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authRegisterCreate } from '@/api/generated';
import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import EyeIcon from '@/icons/Eye';
import FacebookIcon from '@/icons/Facebook';
import GoogleIcon from '@/icons/Google';
import * as tokens from '@/tokens';

// ── Layout ────────────────────────────────────────────────────────────────

const Page = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  background: tokens.white,
  '@media (max-width: 768px)': {
    padding: '16px',
    alignItems: 'flex-start',
    paddingTop: '48px',
  },
});

const Card = styled('div')({
  width: '100%',
  maxWidth: '440px',
  background: tokens.white,
  borderRadius: tokens.radiusMd,
  boxShadow: tokens.shadowMd,
  padding: '40px 32px',
  '@media (max-width: 768px)': {
    padding: '32px 24px',
    boxShadow: 'none',
    borderRadius: 0,
  },
});

// ── Tabs ─────────────────────────────────────────────────────────────────

const TabRow = styled('div')({
  display: 'flex',
  borderBottom: `1px solid ${tokens.border}`,
  marginBottom: '28px',
});

const Tab = styled(Link)<{ isActive?: boolean }>({
  flex: 1,
  textAlign: 'center',
  padding: '12px 0',
  fontSize: '14px',
  fontWeight: 500,
  textDecoration: 'none',
  color: tokens.muted,
  borderBottom: '2px solid transparent',
  marginBottom: '-1px',
  transition: 'color 0.2s, border-color 0.2s',
  '&:hover': {
    color: tokens.foreground,
  },
  variants: [
    {
      props: { isActive: true },
      style: {
        color: tokens.primary,
        borderBottom: `2px solid ${tokens.primary}`,
      },
    },
  ],
});

// ── Form elements ─────────────────────────────────────────────────────────

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const Field = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const ResponsiveButton = styled('div')({
  '& button': {
    justifyContent: 'center',
  },
  '@media (max-width: 768px)': {
    '& button': {
      padding: '10px 24px',
    },
  },
});

// ── Divider ───────────────────────────────────────────────────────────────

const Divider = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  margin: '24px 0',
});

const DividerLine = styled('div')({
  flex: 1,
  height: '1px',
  background: tokens.border,
});

const DividerText = styled('span')({
  fontSize: '14px',
  color: tokens.muted,
  whiteSpace: 'nowrap',
});

// ── Social ────────────────────────────────────────────────────────────────

const SocialRow = styled('div')({
  display: 'flex',
  gap: '12px',
  '@media (max-width: 400px)': {
    flexDirection: 'column',
  },
});

const SocialButtonWrapper = styled('div')({
  flex: 1,
  '& button': {
    justifyContent: 'center',
  },
  '@media (max-width: 768px)': {
    '& button': {
      padding: '10px 24px',
    },
  },
});

// ── Footer ────────────────────────────────────────────────────────────────

const Footer = styled('p')({
  textAlign: 'center',
  fontSize: '14px',
  color: tokens.muted,
  margin: '24px 0 0',
  '& a': {
    color: tokens.primary,
    fontWeight: 600,
    textDecoration: 'none',
  },
  '& a:hover': {
    textDecoration: 'underline',
  },
});

// ── Alert ─────────────────────────────────────────────────────────────────

const AlertBox = styled('div')({
  background: `${tokens.red600}0D`,
  color: tokens.red600,
  padding: '12px 16px',
  borderRadius: tokens.radiusSm,
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '20px',
});

// ── Validation helpers ────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

interface RegisterFormProps {
  locale: Locale;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function RegisterForm({ locale }: RegisterFormProps) {
  const router = useRouter();
  const t = getDictionary(locale);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};

    if (!firstName.trim()) next.firstName = t.register.requiredField;
    if (!lastName.trim()) next.lastName = t.register.requiredField;

    if (!email.trim() || !EMAIL_RE.test(email)) {
      next.email = t.register.invalidEmail;
    }

    if (!password) {
      next.password = t.register.requiredField;
    } else if (password.length < 8) {
      next.password = t.register.passwordTooShort;
    }

    if (!passwordConfirm) {
      next.passwordConfirm = t.register.requiredField;
    } else if (password !== passwordConfirm) {
      next.passwordConfirm = t.register.passwordMismatch;
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
      await authRegisterCreate({
        email: email.trim(),
        password,
        password_confirm: passwordConfirm,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      router.push(`/${locale}/login`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, string[]> } };
      const data = axiosErr?.response?.data;
      if (data) {
        const firstError = Object.values(data).flat()[0];
        setApiError(String(firstError));
      } else {
        setApiError(t.register.genericError);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Page>
      <Card>
        <TabRow>
          <Tab href={`/${locale}/login`}>{t.register.loginTab}</Tab>
          <Tab href={`/${locale}/register`} isActive>
            {t.register.registerTab}
          </Tab>
        </TabRow>

        {apiError && <AlertBox>{apiError}</AlertBox>}

        <Form onSubmit={handleSubmit} noValidate>
          <Field>
            <TextInput
              label={t.register.firstName}
              id='register-first-name'
              type='text'
              autoComplete='given-name'
              required
              value={firstName}
              errorMessage={errors.firstName}
              onChange={e => {
                setFirstName(e.target.value);
                if (errors.firstName) setErrors(prev => ({ ...prev, firstName: undefined }));
              }}
            />
          </Field>

          <Field>
            <TextInput
              label={t.register.lastName}
              id='register-last-name'
              type='text'
              autoComplete='family-name'
              required
              value={lastName}
              errorMessage={errors.lastName}
              onChange={e => {
                setLastName(e.target.value);
                if (errors.lastName) setErrors(prev => ({ ...prev, lastName: undefined }));
              }}
            />
          </Field>

          <Field>
            <TextInput
              label={t.register.email}
              id='register-email'
              type='email'
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

          <Field>
            <TextInput
              label={t.register.password}
              id='register-password'
              type='password'
              autoComplete='new-password'
              required
              value={password}
              icon={EyeIcon}
              errorMessage={errors.password}
              onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
            />
          </Field>

          <Field>
            <TextInput
              label={t.register.confirmPassword}
              id='register-password-confirm'
              type='password'
              autoComplete='new-password'
              required
              value={passwordConfirm}
              icon={EyeIcon}
              errorMessage={errors.passwordConfirm}
              onChange={e => {
                setPasswordConfirm(e.target.value);
                if (errors.passwordConfirm)
                  setErrors(prev => ({ ...prev, passwordConfirm: undefined }));
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
              title={isLoading ? '...' : t.register.submit}
            />
          </ResponsiveButton>
        </Form>

        <Divider>
          <DividerLine />
          <DividerText>{t.register.orDivider}</DividerText>
          <DividerLine />
        </Divider>

        <SocialRow>
          <SocialButtonWrapper>
            <MainButton variant='outline' fullWidth title='' icon={GoogleIcon} />
          </SocialButtonWrapper>

          <SocialButtonWrapper>
            <MainButton variant='outline' fullWidth title='' icon={FacebookIcon} />
          </SocialButtonWrapper>
        </SocialRow>

        <Footer>
          {t.register.haveAccount} <Link href={`/${locale}/login`}>{t.register.loginLink}</Link>
        </Footer>
      </Card>
    </Page>
  );
}
