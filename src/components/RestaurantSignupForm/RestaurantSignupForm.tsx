'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authLoginCreate, authRegisterCreate, restaurantsCreateCreate } from '@/api/generated';
import HeaderPrimary from '@/components/HeaderPrimary/HeaderPrimary';
import LanguageSwitcherPrimary from '@/components/LanguageSwitcherPrimary';
import { useAuth } from '@/context/AuthContext';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import * as tokens from '@/tokens';

import { EMAIL_RE, type SignupData, type SignupErrors, slugify } from './shared';
import StepOwner from './StepOwner';
import StepRestaurant from './StepRestaurant';
import StepReview from './StepReview';

// ── Layout ────────────────────────────────────────────────────────────────

const Page = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '40px 24px 48px',
  background: tokens.white,
  '@media (max-width: 768px)': {
    padding: '20px',
  },
});

const LogoWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  marginBottom: '24px',
  '@media (max-width: 768px)': {
    display: 'none',
  },
});

const LogoText = styled('span')({
  fontSize: '22px',
  fontWeight: 700,
  color: tokens.primary,
});

const Card = styled('div')({
  width: '100%',
  maxWidth: '560px',
  background: tokens.white,
  borderRadius: tokens.radiusMd,
  boxShadow: tokens.shadowMd,
  border: `1px solid ${tokens.slate200}`,
  padding: '32px 32px 40px',
  '@media (max-width: 768px)': {
    padding: '0',
    boxShadow: 'none',
    border: 'none',
    borderRadius: 0,
  },
});

const MobileHeaderWrapper = styled('div')({
  display: 'none',
  '@media (max-width: 768px)': {
    display: 'block',
    width: '100%',
  },
});

const Header = styled('div')({
  textAlign: 'left',
  marginBottom: '20px',
});

const CardTitle = styled('h1')({
  fontSize: '24px',
  fontWeight: 700,
  color: tokens.ink,
  margin: '0 0 8px',
});

const CardSubtitle = styled('p')({
  fontSize: '15px',
  color: tokens.slate500,
  margin: 0,
  lineHeight: 1.4,
});

const AlertBox = styled('div')({
  background: `${tokens.red600}0D`,
  color: tokens.red600,
  padding: '12px 16px',
  borderRadius: tokens.radiusSm,
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '20px',
});

const DesktopLangWrapper = styled('div')({
  marginTop: '32px',
  display: 'flex',
  justifyContent: 'center',
  '@media (max-width: 768px)': {
    display: 'none',
  },
});

// ── Stepper ───────────────────────────────────────────────────────────────

const Stepper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  margin: '8px 0 24px',
});

const Dot = styled('div')({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '13px',
  fontWeight: 600,
  background: tokens.slate50,
  color: tokens.slate500,
  border: `1px solid ${tokens.slate200}`,
  flexShrink: 0,
  '&[data-active="true"]': {
    background: tokens.primary,
    color: tokens.white,
    borderColor: tokens.primary,
  },
  '&[data-done="true"]': {
    background: tokens.primary,
    color: tokens.white,
    borderColor: tokens.primary,
  },
});

const StepLabel = styled('span')({
  fontSize: '13px',
  color: tokens.slate500,
  whiteSpace: 'nowrap',
  '&[data-active="true"]': {
    color: tokens.ink,
    fontWeight: 600,
  },
  '@media (max-width: 480px)': {
    display: 'none',
  },
});

const StepperLine = styled('div')({
  flex: 1,
  height: '1px',
  background: tokens.slate200,
  minWidth: '12px',
});

// ── Component ─────────────────────────────────────────────────────────────

interface RestaurantSignupFormProps {
  locale: Locale;
}

const initialData: SignupData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  restaurantName: '',
  categoryId: '',
  country: 'Georgia',
  city: '',
  address: '',
  restaurantPhone: '',
  website: '',
  description: '',
  acceptedTerms: false,
};

export default function RestaurantSignupForm({ locale }: RestaurantSignupFormProps) {
  const router = useRouter();
  const t = getDictionary(locale);
  const ts = t.restaurantSignup;
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<SignupData>(initialData);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Once an owner account has been created we don't want to create it again
  // if the restaurant-create step fails — we only retry the restaurant step.
  const [accountCreated, setAccountCreated] = useState(false);

  function validateStep1(): boolean {
    const next: SignupErrors = {};
    if (!data.firstName.trim()) next.firstName = ts.errors.requiredField;
    if (!data.lastName.trim()) next.lastName = ts.errors.requiredField;
    if (!data.email.trim() || !EMAIL_RE.test(data.email)) next.email = ts.errors.invalidEmail;
    if (!data.password) next.password = ts.errors.requiredField;
    else if (data.password.length < 8) next.password = ts.errors.passwordTooShort;
    if (!data.passwordConfirm) next.passwordConfirm = ts.errors.requiredField;
    else if (data.password !== data.passwordConfirm)
      next.passwordConfirm = ts.errors.passwordMismatch;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep2(): boolean {
    const next: SignupErrors = {};
    if (!data.restaurantName.trim()) next.restaurantName = ts.errors.requiredField;
    if (!data.city.trim()) next.city = ts.errors.requiredField;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext() {
    setApiError(null);
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(prev => (prev === 1 ? 2 : 3));
  }

  function handleBack() {
    setApiError(null);
    setStep(prev => (prev === 3 ? 2 : 1));
  }

  async function handleSubmit() {
    if (!data.acceptedTerms) {
      setApiError(ts.errors.mustAcceptTerms);
      return;
    }
    setApiError(null);
    setIsSubmitting(true);

    try {
      // 1. Create the owner account (only if we didn't already on a previous
      //    attempt that failed at step 2).
      if (!accountCreated) {
        try {
          await authRegisterCreate({
            email: data.email.trim(),
            password: data.password,
            password_confirm: data.passwordConfirm,
            first_name: data.firstName.trim(),
            last_name: data.lastName.trim(),
            phone_number: data.phone.trim() || undefined,
          });
        } catch (err: unknown) {
          const axiosErr = err as { response?: { data?: Record<string, string[] | string> } };
          const body = axiosErr?.response?.data;
          if (body && (body.email || (Array.isArray(body.email) && body.email.length))) {
            // Email already registered — bounce back to step 1 with an inline hint
            setErrors(prev => ({ ...prev, email: ts.errors.emailTaken }));
            setApiError(ts.errors.emailTaken);
            setStep(1);
            return;
          }
          setApiError(ts.errors.accountCreationFailed);
          return;
        }

        // 2. Obtain JWT pair so the restaurant-create call is authenticated.
        const tokenResp = (await authLoginCreate({
          email: data.email.trim(),
          password: data.password,
        })) as { access?: string; refresh?: string };
        if (!tokenResp?.access || !tokenResp?.refresh) {
          setApiError(ts.errors.accountCreationFailed);
          return;
        }
        await login({ access: tokenResp.access, refresh: tokenResp.refresh });
        setAccountCreated(true);
      }

      // 3. Create the restaurant. Backend's save() auto-suffixes slug on
      //    collision, so a deterministic client-side slugify is safe.
      const slug = slugify(data.restaurantName);
      const restaurant = await restaurantsCreateCreate({
        name: data.restaurantName.trim(),
        slug,
        description: data.description.trim() || undefined,
        category_id: data.categoryId || undefined,
        email: data.email.trim(),
        phone: data.restaurantPhone.trim() || undefined,
        website: data.website.trim() || undefined,
        address: data.address.trim() || undefined,
        city: data.city.trim() || undefined,
        country: data.country.trim() || undefined,
      });

      const finalSlug = restaurant?.slug ?? slug;
      try {
        sessionStorage.setItem(
          'aimenu_signup_result',
          JSON.stringify({ slug: finalSlug, name: restaurant.name })
        );
      } catch {
        // sessionStorage may be unavailable (private mode) — URL params cover us.
      }
      router.push(
        localePath(
          locale,
          `/restaurant-signup/success?slug=${encodeURIComponent(finalSlug)}&name=${encodeURIComponent(restaurant.name)}`
        )
      );
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, unknown> } };
      const body = axiosErr?.response?.data;
      if (body && typeof body === 'object') {
        const firstVal = Object.values(body).flat().find(Boolean);
        if (firstVal) {
          setApiError(String(firstVal));
          return;
        }
      }
      setApiError(ts.errors.restaurantCreationFailed);
    } finally {
      setIsSubmitting(false);
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
            <CardTitle>{ts.pageTitle}</CardTitle>
            <CardSubtitle>{ts.pageSubtitle}</CardSubtitle>
          </Header>

          <Stepper role='progressbar' aria-valuemin={1} aria-valuemax={3} aria-valuenow={step}>
            <Dot
              data-active={step === 1 ? 'true' : undefined}
              data-done={step > 1 ? 'true' : undefined}
            >
              1
            </Dot>
            <StepLabel data-active={step === 1 ? 'true' : undefined}>{ts.step1Label}</StepLabel>
            <StepperLine />
            <Dot
              data-active={step === 2 ? 'true' : undefined}
              data-done={step > 2 ? 'true' : undefined}
            >
              2
            </Dot>
            <StepLabel data-active={step === 2 ? 'true' : undefined}>{ts.step2Label}</StepLabel>
            <StepperLine />
            <Dot data-active={step === 3 ? 'true' : undefined}>3</Dot>
            <StepLabel data-active={step === 3 ? 'true' : undefined}>{ts.step3Label}</StepLabel>
          </Stepper>

          {apiError && <AlertBox role='alert'>{apiError}</AlertBox>}

          {step === 1 && (
            <StepOwner
              data={data}
              setData={setData}
              errors={errors}
              setErrors={setErrors}
              onNext={handleNext}
              t={ts}
              locale={locale}
            />
          )}
          {step === 2 && (
            <StepRestaurant
              data={data}
              setData={setData}
              errors={errors}
              setErrors={setErrors}
              onNext={handleNext}
              onBack={handleBack}
              t={ts}
              locale={locale}
            />
          )}
          {step === 3 && (
            <StepReview
              data={data}
              setData={setData}
              onBack={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              t={ts}
              locale={locale}
            />
          )}
        </Card>

        <DesktopLangWrapper>
          <LanguageSwitcherPrimary currentLocale={locale} />
        </DesktopLangWrapper>
      </Page>
    </>
  );
}
