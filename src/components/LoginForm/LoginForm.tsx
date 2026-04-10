'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { authLoginCreate } from '@/api/generated';
import HeaderPrimary from '@/components/HeaderPrimary/HeaderPrimary';
import LanguageSwitcherPrimary from '@/components/LanguageSwitcherPrimary';
import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { getDictionary } from '@/i18n/getDictionary';
import EmailIcon from '@/icons/Email';
import EyeIcon from '@/icons/Eye';
import FacebookIcon from '@/icons/Facebook';
import GoogleIcon from '@/icons/Google';
import LockIcon from '@/icons/Lock';

import {
  AlertBox,
  Card,
  DesktopLangWrapper,
  DesktopSocialRow,
  Divider,
  DividerLine,
  DividerText,
  EMAIL_RE,
  Field,
  Footer,
  ForgotLink,
  Form,
  FormErrors,
  Header,
  LoginFormProps,
  LogoText,
  LogoWrapper,
  MobileSocialRow,
  Page,
  ResponsiveButton,
  SocialButtonWrapper,
  Subtitle,
  SubmitButton,
  Title,
} from './shared';

const MobileHeaderWrapper = styled('div')({
  display: 'none',
  '@media (max-width: 768px)': {
    display: 'block',
    width: '100%',
  },
});

export default function LoginForm({ locale }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { locale: currentLocale } = useLocale();
  const t = getDictionary(locale);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!email.trim() || !EMAIL_RE.test(email)) {
      next.email = t.login.invalidEmail;
    }
    if (!password) {
      next.password = t.login.passwordRequired;
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
      const response = await authLoginCreate({
        email: email.trim(),
        password,
      });

      const { access, refresh } = response as { access: string; refresh: string };

      // Use AuthContext login to set tokens and fetch user
      await login({ access, refresh });

      const redirect = searchParams.get('redirect');
      router.push(redirect || `/${locale}`);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: { detail?: string } } };
        const status = axiosErr.response?.status;

        if (status === 401 || status === 400) {
          setApiError(t.login.invalidCredentials);
        } else {
          setApiError(axiosErr.response?.data?.detail || t.login.loginFailed);
        }
      } else if (err instanceof Error && err.message === 'Network Error') {
        setApiError(t.login.networkError);
      } else {
        setApiError(t.login.loginFailed);
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
            <Title>{t.login.title}</Title>
            <Subtitle>{t.login.subtitle}</Subtitle>
          </Header>

          {apiError && <AlertBox style={{ marginBottom: '20px' }}>{apiError}</AlertBox>}

          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <TextInput
                label={t.login.email}
                id='login-email'
                type='email'
                placeholder={t.login.emailPlaceholder}
                autoComplete='email'
                required
                value={email}
                variant='outlined'
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
                label={t.login.password}
                id='login-password'
                type='password'
                placeholder={t.login.passwordPlaceholder}
                autoComplete='current-password'
                required
                value={password}
                variant='outlined'
                leftIcon={LockIcon}
                icon={EyeIcon}
                errorMessage={errors.password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                }}
              />
              <ForgotLink href={`/${locale}/password-reset`}>{t.login.forgotPassword}</ForgotLink>
            </Field>

            <ResponsiveButton>
              <SubmitButton type='submit' disabled={isLoading}>
                {isLoading ? '...' : t.login.signIn}
              </SubmitButton>
            </ResponsiveButton>
          </Form>

          <Divider>
            <DividerLine />
            <DividerText>{t.login.orDivider}</DividerText>
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
            {t.login.noAccount} <Link href={`/${locale}/register`}>{t.login.signUp}</Link>
          </Footer>
        </Card>
        <DesktopLangWrapper>
          <LanguageSwitcherPrimary currentLocale={currentLocale} />
        </DesktopLangWrapper>
      </Page>
    </>
  );
}
