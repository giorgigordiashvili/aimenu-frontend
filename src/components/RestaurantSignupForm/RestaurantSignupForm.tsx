'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { emailCheck } from '@/api/auth';
import { authLoginCreate, authRegisterCreate, restaurantsCreateCreate } from '@/api/generated';
import HeaderPrimary from '@/components/HeaderPrimary/HeaderPrimary';
import LanguageSwitcherPrimary from '@/components/LanguageSwitcherPrimary';
import { useAuth } from '@/context/AuthContext';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import { authErrorMessage, fieldMessage, hasCode, parseApiError } from '@/lib/api-error';
import * as tokens from '@/tokens';

import { EMAIL_RE, type OwnerMode, type SignupData, type SignupErrors } from './shared';
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
  const { login, logout, user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<SignupData>(initialData);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ownerBusy, setOwnerBusy] = useState(false);
  // One AiMenu identity serves both roles: a customer account can own a
  // restaurant. Step 1 therefore has three shapes -- see OwnerMode.
  const [ownerMode, setOwnerMode] = useState<OwnerMode>('new');
  // Once the owner is signed in we don't want to register again if the
  // restaurant-create step fails — we only retry the restaurant step.
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
    if (user && ownerMode !== 'signedIn') {
      setOwnerMode('signedIn');
      setAccountCreated(true);
      setData(prev => ({
        ...prev,
        email: user.email ?? prev.email,
        firstName: prev.firstName || user.first_name || '',
        lastName: prev.lastName || user.last_name || '',
      }));
    }
  }, [user, ownerMode]);

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

  /** Sign the existing account in with the password typed on step 1. */
  async function signInExisting(): Promise<boolean> {
    if (!data.password) {
      setErrors(prev => ({ ...prev, password: ts.errors.requiredField }));
      return false;
    }
    setOwnerBusy(true);
    try {
      const tokenResp = (await authLoginCreate({
        email: data.email.trim(),
        password: data.password,
      })) as { access?: string; refresh?: string };
      if (!tokenResp?.access || !tokenResp?.refresh) {
        setApiError(t.apiErrors.generic);
        return false;
      }
      await login({ access: tokenResp.access, refresh: tokenResp.refresh });
      setAccountCreated(true);
      return true;
    } catch (err: unknown) {
      const e = parseApiError(err);
      const msg = authErrorMessage(e, t.apiErrors);
      if (e.status === 401) setErrors(prev => ({ ...prev, password: msg }));
      else setApiError(msg);
      return false;
    } finally {
      setOwnerBusy(false);
    }
  }

  async function handleOwnerNext() {
    if (ownerMode === 'signedIn') {
      setStep(2);
      return;
    }
    if (ownerMode === 'existing') {
      if (await signInExisting()) setStep(2);
      return;
    }
    if (!validateStep1()) return;
    // Known email? Then ask for its password instead of failing at submit.
    setOwnerBusy(true);
    try {
      const check = await emailCheck(data.email.trim());
      if (check.exists) {
        setOwnerMode('existing');
        setData(prev => ({ ...prev, password: '', passwordConfirm: '' }));
        return;
      }
    } catch {
      // The check is a convenience; registration itself still reports a taken email.
    } finally {
      setOwnerBusy(false);
    }
    setStep(2);
  }

  function useDifferentEmail() {
    setOwnerMode('new');
    setApiError(null);
    setErrors({});
    setData(prev => ({ ...prev, email: '', password: '', passwordConfirm: '' }));
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
    if (step === 1) {
      void handleOwnerNext();
      return;
    }
    if (step === 2 && !validateStep2()) return;
    setStep(3);
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
      //    attempt that failed at step 2, and not when an existing account
      //    was signed in on step 1).
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
          const e = parseApiError(err);
          if (hasCode(e, 'email', 'email_taken')) {
            // Registered meanwhile (or the pre-check was skipped): ask for the password.
            setOwnerMode('existing');
            setData(prev => ({ ...prev, password: '', passwordConfirm: '' }));
            setErrors({});
            setApiError(t.apiErrors.emailTaken);
            setStep(1);
            return;
          }
          const next: SignupErrors = {};
          const emailMsg = fieldMessage(e, 'email', t.apiErrors);
          if (emailMsg) next.email = emailMsg;
          const passwordMsg = fieldMessage(e, 'password', t.apiErrors);
          if (passwordMsg) next.password = passwordMsg;
          const confirmMsg = fieldMessage(e, 'password_confirm', t.apiErrors);
          if (confirmMsg) next.passwordConfirm = confirmMsg;
          const firstNameMsg = fieldMessage(e, 'first_name', t.apiErrors);
          if (firstNameMsg) next.firstName = firstNameMsg;
          const lastNameMsg = fieldMessage(e, 'last_name', t.apiErrors);
          if (lastNameMsg) next.lastName = lastNameMsg;
          if (Object.keys(next).length) {
            setErrors(prev => ({ ...prev, ...next }));
            setApiError(Object.values(next)[0] ?? null);
            setStep(1);
            return;
          }
          setApiError(e.network ? t.apiErrors.network : authErrorMessage(e, t.apiErrors));
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

      // 3. Create the restaurant. No slug: the backend derives one from the
      //    name (Georgian transliterated) and suffixes it on collision.
      const restaurant = await restaurantsCreateCreate({
        name: data.restaurantName.trim(),
        description: data.description.trim() || undefined,
        category_id: data.categoryId || undefined,
        email: data.email.trim(),
        phone: data.restaurantPhone.trim() || undefined,
        website: data.website.trim() || undefined,
        address: data.address.trim() || undefined,
        city: data.city.trim() || undefined,
        country: data.country.trim() || undefined,
      });

      const finalSlug = restaurant.slug ?? '';
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
      const e = parseApiError(err);
      const next: SignupErrors = {};
      const nameMsg = fieldMessage(e, 'name', t.apiErrors);
      if (nameMsg) next.restaurantName = nameMsg;
      const cityMsg = fieldMessage(e, 'city', t.apiErrors);
      if (cityMsg) next.city = cityMsg;
      const phoneMsg = fieldMessage(e, 'phone', t.apiErrors);
      if (phoneMsg) next.restaurantPhone = phoneMsg;
      const websiteMsg = fieldMessage(e, 'website', t.apiErrors);
      if (websiteMsg) next.website = websiteMsg;
      if (Object.keys(next).length) {
        setErrors(prev => ({ ...prev, ...next }));
        setApiError(Object.values(next)[0] ?? null);
        setStep(2);
        return;
      }
      if (e.status === 401) {
        // Session expired between steps: sign in again.
        setAccountCreated(false);
        setOwnerMode('existing');
        setApiError(t.apiErrors.invalidCredentials);
        setStep(1);
        return;
      }
      setApiError(
        e.network ? t.apiErrors.network : (e.message ?? ts.errors.restaurantCreationFailed)
      );
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
              mode={ownerMode}
              busy={ownerBusy}
              onUseDifferentEmail={useDifferentEmail}
              onSignOut={() => {
                void logout(null);
              }}
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
