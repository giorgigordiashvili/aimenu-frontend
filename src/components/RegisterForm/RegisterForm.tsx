'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { authRegisterCreate } from '@/api/generated';
import HeaderPrimary from '@/components/HeaderPrimary/HeaderPrimary';
import LanguageSwitcherPrimary from '@/components/LanguageSwitcherPrimary';
import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { useLocale } from '@/context/LocaleContext';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import EmailIcon from '@/icons/Email';
import EyeIcon from '@/icons/Eye';
import FacebookIcon from '@/icons/Facebook';
import GoogleIcon from '@/icons/Google';
import LockIcon from '@/icons/Lock';
import ManIcon from '@/icons/Man';
import PhoneIcon from '@/icons/Phone';
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
    padding: '20px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
    padding: '0',
    maxWidth: '100%',
    boxShadow: 'none',
    borderRadius: 0,
    border: 'none',
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
  },
  '@media (max-width: 768px)': {
    '& button': {
      padding: '16px',
      borderRadius: '16px',
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
  margin: '28px 0',
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

const DesktopSocialRow = styled('div')({
  display: 'flex',
  gap: '12px',
  '@media (max-width: 768px)': {
    display: 'none',
  },
});

const MobileSocialRow = styled('div')({
  display: 'none',
  '@media (max-width: 768px)': {
    display: 'flex',
    gap: '26px',
  },
});

const SocialButtonWrapper = styled('div')({
  flex: 1,
  '& button': {
    justifyContent: 'center',
  },
  '@media (max-width: 768px)': {
    '& button': {
      padding: '16px',
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

// ── Desktop lang wrapper ──────────────────────────────────────────────────

const DesktopLangWrapper = styled('div')({
  marginTop: '44px',
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'center',
  '@media (max-width: 768px)': {
    display: 'none',
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

const SubmitButton = styled('button')({
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontFamily: 'Inter',
  lineHeight: '20px',
  letterSpacing: '-0.15px',
  fontWeight: 500,
  backgroundColor: tokens.redBrand,
  color: tokens.white,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: tokens.rose700,
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

// ── Validation helpers ────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
  referralCode?: string;
}

interface RegisterFormProps {
  locale: Locale;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function RegisterForm({ locale }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale: currentLocale } = useLocale();
  const t = getDictionary(locale);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Prefill referral code from `?ref=...` so a click on a shared link lands
  // the customer on this page with the field already filled — they only need
  // to submit, no copy-paste step.
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setReferralCode(ref.toUpperCase());
  }, [searchParams]);

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

    if (!repeatPassword) {
      next.repeatPassword = t.register.requiredField;
    } else if (password !== repeatPassword) {
      next.repeatPassword = t.register.passwordMismatch;
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
      // Backend's UserRegistrationSerializer accepts an optional `referral_code`
      // (write-only, validated server-side). The generated client doesn't
      // expose it yet, so we cast the body — once the next regenerate runs
      // it'll be in the typed shape and the `as` can come off.
      await authRegisterCreate({
        email: email.trim(),
        password,
        password_confirm: repeatPassword,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        ...(referralCode.trim() ? { referral_code: referralCode.trim().toUpperCase() } : {}),
      } as Parameters<typeof authRegisterCreate>[0]);

      router.push(localePath(locale, '/login'));
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, string[]> } };
      const data = axiosErr?.response?.data;
      if (data?.referral_code) {
        setErrors(prev => ({ ...prev, referralCode: String(data.referral_code[0]) }));
        setApiError(null);
      } else if (data) {
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
          <Header>
            <CardTitle>{t.register.title}</CardTitle>
            <CardSubtitle>{t.register.subtitle}</CardSubtitle>
          </Header>

          {apiError && <AlertBox>{apiError}</AlertBox>}

          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <TextInput
                variant='outlined'
                label={t.register.firstName}
                placeholder={t.register.firstNamePlaceholder}
                id='register-first-name'
                type='text'
                autoComplete='given-name'
                required
                value={firstName}
                leftIcon={ManIcon}
                errorMessage={errors.firstName}
                onChange={e => {
                  setFirstName(e.target.value);
                  if (errors.firstName) setErrors(prev => ({ ...prev, firstName: undefined }));
                }}
              />
            </Field>

            <Field>
              <TextInput
                variant='outlined'
                label={t.register.lastName}
                placeholder={t.register.lastNamePlaceholder}
                id='register-last-name'
                type='text'
                autoComplete='family-name'
                required
                value={lastName}
                leftIcon={ManIcon}
                errorMessage={errors.lastName}
                onChange={e => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors(prev => ({ ...prev, lastName: undefined }));
                }}
              />
            </Field>

            <Field>
              <TextInput
                variant='outlined'
                label={t.register.phone}
                placeholder={t.register.phonePlaceholder}
                id='register-phone'
                type='tel'
                autoComplete='tel'
                value={phone}
                leftIcon={PhoneIcon}
                onChange={e => setPhone(e.target.value)}
              />
            </Field>

            <Field>
              <TextInput
                variant='outlined'
                label={t.register.email}
                placeholder={t.register.emailPlaceholder}
                id='register-email'
                type='email'
                autoComplete='email'
                required
                value={email}
                leftIcon={EmailIcon}
                errorMessage={errors.email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
              />
            </Field>

            <Field>
              <TextInput
                variant='outlined'
                label={t.register.password}
                placeholder={t.register.passwordPlaceholder}
                id='register-password'
                type='password'
                autoComplete='new-password'
                required
                value={password}
                leftIcon={LockIcon}
                icon={EyeIcon}
                errorMessage={errors.password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                }}
              />
              <PasswordHint>{t.register.passwordHint}</PasswordHint>
            </Field>

            <Field>
              <TextInput
                variant='outlined'
                label={t.register.repeatPassword}
                placeholder={t.register.repeatPasswordPlaceholder}
                id='register-repeat-password'
                type='password'
                autoComplete='new-password'
                required
                value={repeatPassword}
                leftIcon={LockIcon}
                icon={EyeIcon}
                errorMessage={errors.repeatPassword}
                onChange={e => {
                  setRepeatPassword(e.target.value);
                  if (errors.repeatPassword)
                    setErrors(prev => ({ ...prev, repeatPassword: undefined }));
                }}
              />
            </Field>

            <Field>
              <TextInput
                variant='outlined'
                label={t.referral.signupCodeLabel}
                placeholder='XXXXXXXX'
                id='register-referral-code'
                type='text'
                autoComplete='off'
                value={referralCode}
                errorMessage={errors.referralCode}
                onChange={e => {
                  setReferralCode(e.target.value.toUpperCase());
                  if (errors.referralCode)
                    setErrors(prev => ({ ...prev, referralCode: undefined }));
                }}
              />
              <PasswordHint>{t.referral.signupCodeHelp}</PasswordHint>
            </Field>

            <ResponsiveButton>
              <SubmitButton type='submit' disabled={isLoading}>
                {isLoading ? '...' : t.register.submit}
              </SubmitButton>
            </ResponsiveButton>
          </Form>

          <Divider>
            <DividerLine />
            <DividerText>{t.register.orDivider}</DividerText>
            <DividerLine />
          </Divider>

          {/* Desktop: show text */}
          <DesktopSocialRow>
            <SocialButtonWrapper>
              <MainButton variant='outline' fullWidth title='Google' icon={GoogleIcon} />
            </SocialButtonWrapper>
            <SocialButtonWrapper>
              <MainButton variant='outline' fullWidth title='Facebook' icon={FacebookIcon} />
            </SocialButtonWrapper>
          </DesktopSocialRow>

          {/* Mobile: icon only */}
          <MobileSocialRow>
            <SocialButtonWrapper>
              <MainButton variant='outline' fullWidth title='' icon={GoogleIcon} />
            </SocialButtonWrapper>
            <SocialButtonWrapper>
              <MainButton variant='outline' fullWidth title='' icon={FacebookIcon} />
            </SocialButtonWrapper>
          </MobileSocialRow>

          <Footer>
            {t.register.haveAccount}{' '}
            <Link href={localePath(locale, '/login')}>{t.register.loginLink}</Link>
          </Footer>
        </Card>
        <DesktopLangWrapper>
          <LanguageSwitcherPrimary currentLocale={currentLocale} />
        </DesktopLangWrapper>
      </Page>
    </>
  );
}
