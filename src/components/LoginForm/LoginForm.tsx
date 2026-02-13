'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authLoginCreate } from '@/api/generated';
import CheckboxWithText from '@/components/Checkbox/Checkbox';
import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { getDictionary } from '@/i18n/getDictionary';
import ArrowIcon from '@/icons/Arrow';
import EyeIcon from '@/icons/Eye';
import FacebookIcon from '@/icons/Facebook';
import GoogleIcon from '@/icons/Google';

import {
  AlertBox,
  BackLink,
  Card,
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
  Page,
  RememberRow,
  ResponsiveButton,
  SocialButtonWrapper,
  SocialRow,
  Subtitle,
  Title,
} from './shared';

export default function LoginForm({ locale }: LoginFormProps) {
  const router = useRouter();
  const t = getDictionary(locale);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('access', access);
      storage.setItem('refresh', refresh);

      router.push(`/${locale}`);
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
    <Page>
      <Card>
        <BackLink href={`/${locale}`}>
          <ArrowIcon />
          {t.login.back}
        </BackLink>

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
              icon={EyeIcon}
              errorMessage={errors.password}
              onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
            />
            <ForgotLink href={`/${locale}/forgot-password`}>{t.login.forgotPassword}</ForgotLink>
          </Field>

          <RememberRow
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
          >
            <CheckboxWithText label={t.login.rememberMe} />
          </RememberRow>

          <ResponsiveButton
            style={{ opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
          >
            <MainButton
              variant='rose_cta'
              fullWidth
              type='submit'
              title={isLoading ? '...' : t.login.signIn}
            />
          </ResponsiveButton>
        </Form>

        <Divider>
          <DividerLine />
          <DividerText>{t.login.orContinueWith}</DividerText>
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
          {t.login.noAccount} <Link href={`/${locale}/register`}>{t.login.signUp}</Link>
        </Footer>
      </Card>
    </Page>
  );
}
