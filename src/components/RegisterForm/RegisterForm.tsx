'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authRegisterCreate } from '@/api/generated';
import HeaderPrimary from '@/components/HeaderPrimary/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import ArrowIcon from '@/icons/Arrow';
import EyeIcon from '@/icons/Eye';
import FacebookIcon from '@/icons/Facebook';
import GoogleIcon from '@/icons/Google';
import * as tokens from '@/tokens';

// ── Layout ────────────────────────────────────────────────────────────────

const Page = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  background: tokens.white,
  '@media (max-width: 768px)': {
    padding: '16px',
    alignItems: 'center',
  },
});

const LogoWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  marginBottom: '32px',
  '@media (max-width: 768px)': {
    display: 'none',
  },
});

const LogoText = styled('span')({
  fontSize: '24px',
  fontWeight: 700,
  color: tokens.primary,
});

const Card = styled('div')({
  width: '100%',
  maxWidth: '440px',
  background: tokens.white,
  borderRadius: tokens.radiusMd,
  boxShadow: tokens.shadowMd,
  border: `1px solid ${tokens.slate200}`,
  padding: '40px 32px',
  '@media (max-width: 768px)': {
    padding: '32px 24px',
    boxShadow: 'none',
    borderRadius: 0,
    border: 'none',
  },
});

const BackLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '14px',
  fontWeight: 500,
  color: tokens.muted,
  textDecoration: 'none',
  marginBottom: '16px',
  '&:hover': {
    color: tokens.foreground,
  },
});

const Header = styled('div')({
  textAlign: 'center',
  marginBottom: '32px',
});

const CardTitle = styled('h1')({
  fontSize: '24px',
  fontWeight: 700,
  color: tokens.ink,
  margin: '0 0 8px',
  '@media (max-width: 768px)': {
    fontSize: '26px',
  },
});

const CardSubtitle = styled('p')({
  fontSize: '16px',
  color: tokens.slate500,
  margin: 0,
  lineHeight: '20px',
  marginBottom: '24px',
  '@media (max-width: 768px)': {
    fontSize: '14px',
  },
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
});

const PasswordHint = styled('span')({
  fontSize: '10px',
  color: tokens.muted,
  marginTop: '4px',
});

const ResponsiveButton = styled('div')({
  '& button': {
    justifyContent: 'center',
    padding: '8px 16px',
  },
  '@media (max-width: 768px)': {
    '& button': {
      padding: '10px 24px',
    },
  },
});

// ── Mobile header ─────────────────────────────────────────────────────────

const MobileHeaderWrapper = styled('div')({
  display: 'none',
  '@media (max-width: 768px)': {
    display: 'block',
    width: '100%',
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
  fullName?: string;
  email?: string;
  password?: string;
}

interface RegisterFormProps {
  locale: Locale;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function RegisterForm({ locale }: RegisterFormProps) {
  const router = useRouter();
  const t = getDictionary(locale);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};

    if (!fullName.trim()) next.fullName = t.register.requiredField;

    if (!email.trim() || !EMAIL_RE.test(email)) {
      next.email = t.register.invalidEmail;
    }

    if (!password) {
      next.password = t.register.requiredField;
    } else if (password.length < 8) {
      next.password = t.register.passwordTooShort;
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
      const parts = fullName.trim().split(/\s+/);
      const first_name = parts[0] || '';
      const last_name = parts.slice(1).join(' ') || parts[0] || '';

      await authRegisterCreate({
        email: email.trim(),
        password,
        password_confirm: password,
        first_name,
        last_name,
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
    <>
      <MobileHeaderWrapper>
        <HeaderPrimary />
      </MobileHeaderWrapper>
      <Page>
        <LogoWrapper>
          <Image src='/logo.png' alt='AiMenu' width={40} height={40} />
          <LogoText>AiMenu</LogoText>
        </LogoWrapper>

        <Card>
          <BackLink href={`/${locale}`}>
            <ArrowIcon />
            {t.register.backLink}
          </BackLink>

          <Header>
            <CardTitle>{t.register.title}</CardTitle>
            <CardSubtitle>{t.register.subtitle}</CardSubtitle>
          </Header>

          {apiError && <AlertBox>{apiError}</AlertBox>}

          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <TextInput
                label={t.register.fullName}
                id='register-full-name'
                type='text'
                autoComplete='name'
                required
                value={fullName}
                errorMessage={errors.fullName}
                onChange={e => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                }}
              />
            </Field>

            <Field>
              <TextInput
                label={t.register.phone}
                id='register-phone'
                type='tel'
                autoComplete='tel'
                value={phone}
                onChange={e => setPhone(e.target.value)}
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
              <PasswordHint>{t.register.passwordHint}</PasswordHint>
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
              <MainButton variant='outline' fullWidth title='Google' icon={GoogleIcon} />
            </SocialButtonWrapper>

            <SocialButtonWrapper>
              <MainButton variant='outline' fullWidth title='Facebook' icon={FacebookIcon} />
            </SocialButtonWrapper>
          </SocialRow>

          <Footer>
            {t.register.haveAccount} <Link href={`/${locale}/login`}>{t.register.loginLink}</Link>
          </Footer>
        </Card>
      </Page>
    </>
  );
}
