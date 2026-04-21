'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { styled } from '@pigment-css/react';
import Image from 'next/image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { contactCreate } from '@/api/generated';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import TextArea from '@/components/TextArea/TextArea';
import TextInput from '@/components/TextInput/TextInput';
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '@/config/contact';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import Email from '@/icons/Email';
import Location from '@/icons/Location';
import Phone from '@/icons/Phone';
import Send from '@/icons/Send';
import {
  blue50,
  blue600,
  emerald50,
  emerald600,
  redBrand,
  rose50,
  shadowCard,
  slate50,
  slate500,
  slate700,
  slate900,
} from '@/tokens';

// ── Styled Components ─────────────────────────────────────────────────────────

const PageWrapper = styled('div')({
  background: slate50,
  minHeight: '100vh',
});

const TopSection = styled('section')({
  padding: '80px 24px 64px',
  textAlign: 'center',
  maxWidth: 1120,
  margin: '0 auto',
});

const PageTitle = styled('h1')({
  fontSize: 40,
  fontWeight: 700,
  color: slate900,
  margin: '0 0 16px',
});

const PageSubtitle = styled('p')({
  fontSize: 16,
  color: slate500,
  margin: 0,
  lineHeight: 1.6,
  maxWidth: 560,
  marginLeft: 'auto',
  marginRight: 'auto',
});

const BodySection = styled('section')({
  maxWidth: 1120,
  margin: '0 auto',
  padding: '0 24px 80px',
  display: 'grid',
  gridTemplateColumns: '360px 1fr',
  gap: 32,
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const LeftCol = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

const InfoCard = styled('a')({
  background: 'white',
  borderRadius: 16,
  boxShadow: shadowCard,
  padding: 24,
  display: 'flex',
  gap: 16,
  alignItems: 'flex-start',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 10px 20px -8px rgba(0,0,0,0.15), 0 4px 8px -4px rgba(0,0,0,0.08)',
  },
});

const InfoCardStatic = styled('div')({
  background: 'white',
  borderRadius: 16,
  boxShadow: shadowCard,
  padding: 24,
  display: 'flex',
  gap: 16,
  alignItems: 'flex-start',
});

const IconBoxPhone = styled('div')({
  width: 48,
  height: 48,
  borderRadius: 10,
  background: rose50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const IconBoxEmail = styled('div')({
  width: 48,
  height: 48,
  borderRadius: 10,
  background: blue50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const IconBoxLocation = styled('div')({
  width: 48,
  height: 48,
  borderRadius: 10,
  background: emerald50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const CardTextCol = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

const CardTitle = styled('p')({
  fontSize: 16,
  fontWeight: 700,
  color: slate900,
  margin: 0,
});

const CardSubtitle = styled('p')({
  fontSize: 14,
  color: slate500,
  margin: 0,
});

const CardValueRed = styled('p')({
  fontSize: 14,
  fontWeight: 600,
  color: redBrand,
  margin: 0,
});

const CardValueBlue = styled('p')({
  fontSize: 14,
  fontWeight: 600,
  color: blue600,
  margin: 0,
  wordBreak: 'break-all',
});

const CardValueAddress = styled('p')({
  fontSize: 14,
  fontWeight: 600,
  color: slate700,
  margin: 0,
});

const ContactPhoto = styled('div')({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: shadowCard,
});

const FormCard = styled('div')({
  background: 'white',
  borderRadius: 16,
  boxShadow: shadowCard,
  padding: 32,
});

const FormTitle = styled('h2')({
  fontSize: 24,
  fontWeight: 700,
  color: slate900,
  margin: '0 0 8px',
});

const FormSubtitle = styled('p')({
  fontSize: 14,
  color: slate500,
  margin: '0 0 24px',
});

const FormRow = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
  marginBottom: 16,
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const FormField = styled('div')({
  marginBottom: 16,
});

const FieldWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

const SuccessWrapper = styled('div')({
  textAlign: 'center',
  padding: '40px 0',
  color: emerald600,
});

const SuccessText = styled('p')({
  fontSize: 18,
  fontWeight: 600,
  margin: 0,
});

const ErrorBanner = styled('div')({
  background: 'rgba(220, 38, 38, 0.08)',
  color: '#B91C1C',
  padding: '12px 16px',
  borderRadius: 10,
  fontSize: 14,
  marginBottom: 16,
});

// The honeypot — positioned absolutely off-screen and visually hidden from
// humans; only bots filling every field trip it. We pass its value through
// to the backend, which silent-drops submissions where it's non-empty.
const Honeypot = styled('div')({
  position: 'absolute',
  left: '-10000px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
});

// ── Component ─────────────────────────────────────────────────────────────────

// Zod schema with the i18n error keys embedded as message payload. The form
// component converts those keys into the user's locale before rendering.
const contactSchema = z.object({
  firstName: z.string().trim().min(1, { message: 'firstNameRequired' }),
  lastName: z.string().trim(),
  email: z.string().trim().email({ message: 'invalidEmail' }),
  phone: z.string().trim(),
  topic: z.string().trim(),
  message: z
    .string()
    .trim()
    .min(10, { message: 'messageTooShort' })
    .max(5000, { message: 'messageTooLong' }),
  website: z.string(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type ContactErrorMessages = {
  firstNameRequired: string;
  invalidEmail: string;
  messageTooShort: string;
  messageTooLong: string;
  network: string;
  rateLimited: string;
};

function resolveError(key: string | undefined, errors: ContactErrorMessages): string | undefined {
  if (!key) return undefined;
  return (errors as Record<string, string>)[key] ?? key;
}

export default function ContactPage() {
  const { locale } = useLocale();
  const t = useTranslations();
  const err = t.contact.errors as ContactErrorMessages;

  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      topic: '',
      message: '',
      website: '',
    },
    mode: 'onBlur',
  });

  async function onSubmit(values: ContactFormValues) {
    setApiError(null);
    try {
      await contactCreate({
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone: values.phone,
        topic: values.topic,
        message: values.message,
        website: values.website, // honeypot — always empty for real users
      });
      setSubmitted(true);
    } catch (e: unknown) {
      const ax = e as { response?: { status?: number } };
      if (ax?.response?.status === 429) {
        setApiError(err.rateLimited);
      } else {
        setApiError(err.network);
      }
    }
  }

  return (
    <PageWrapper>
      <HeaderPrimary />

      <TopSection>
        <PageTitle>{t.contact.title}</PageTitle>
        <PageSubtitle>{t.contact.subtitle}</PageSubtitle>
      </TopSection>

      <BodySection>
        {/* Left col */}
        <LeftCol>
          {/* Phone card — anchor so tapping it triggers dialler on mobile */}
          <InfoCard href={`tel:${CONTACT_PHONE_TEL}`}>
            <IconBoxPhone>
              <Phone width={20} height={20} style={{ color: redBrand }} />
            </IconBoxPhone>
            <CardTextCol>
              <CardTitle>{t.contact.phoneTitle}</CardTitle>
              <CardSubtitle>{t.contact.phoneSubtitle}</CardSubtitle>
              <CardValueRed>{CONTACT_PHONE_DISPLAY}</CardValueRed>
            </CardTextCol>
          </InfoCard>

          {/* Email card — mailto: so desktop mail client opens */}
          <InfoCard href={`mailto:${CONTACT_EMAIL}`}>
            <IconBoxEmail>
              <Email width={20} height={20} style={{ color: blue600 }} />
            </IconBoxEmail>
            <CardTextCol>
              <CardTitle>{t.contact.emailTitle}</CardTitle>
              <CardSubtitle>{t.contact.emailSubtitle}</CardSubtitle>
              <CardValueBlue>{CONTACT_EMAIL}</CardValueBlue>
            </CardTextCol>
          </InfoCard>

          {/* Location card */}
          <InfoCardStatic>
            <IconBoxLocation>
              <Location width={20} height={20} style={{ color: emerald600 }} />
            </IconBoxLocation>
            <CardTextCol>
              <CardTitle>{t.contact.locationTitle}</CardTitle>
              <CardSubtitle>{t.contact.locationSubtitle}</CardSubtitle>
              <CardValueAddress>{t.contact.address}</CardValueAddress>
            </CardTextCol>
          </InfoCardStatic>

          {/* Photo */}
          <ContactPhoto>
            <Image
              src='/demo/ContactPagePhoto.png'
              alt='Contact'
              width={528}
              height={300}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </ContactPhoto>
        </LeftCol>

        {/* Right col — form */}
        <FormCard>
          <FormTitle>{t.contact.formTitle}</FormTitle>
          <FormSubtitle>{t.contact.formSubtitle}</FormSubtitle>

          {submitted ? (
            <SuccessWrapper>
              <SuccessText>{t.contact.successMessage}</SuccessText>
            </SuccessWrapper>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {apiError && <ErrorBanner role='alert'>{apiError}</ErrorBanner>}

              <FormRow>
                <FieldWrapper>
                  <Controller
                    name='firstName'
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        variant='outlined'
                        label={t.contact.firstName}
                        placeholder={t.contact.firstNamePlaceholder}
                        autoComplete='given-name'
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        errorMessage={resolveError(errors.firstName?.message, err)}
                      />
                    )}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <Controller
                    name='lastName'
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        variant='outlined'
                        label={t.contact.lastName}
                        placeholder={t.contact.lastNamePlaceholder}
                        autoComplete='family-name'
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </FieldWrapper>
              </FormRow>

              <FormField>
                <FieldWrapper>
                  <Controller
                    name='email'
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        variant='outlined'
                        label={t.contact.email}
                        placeholder={t.contact.emailPlaceholder}
                        type='email'
                        autoComplete='email'
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        errorMessage={resolveError(errors.email?.message, err)}
                      />
                    )}
                  />
                </FieldWrapper>
              </FormField>

              <FormField>
                <FieldWrapper>
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        variant='outlined'
                        label={t.contact.phone}
                        placeholder={t.contact.phonePlaceholder}
                        type='tel'
                        autoComplete='tel'
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </FieldWrapper>
              </FormField>

              <FormField>
                <FieldWrapper>
                  <Controller
                    name='topic'
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        variant='outlined'
                        label={t.contact.topic}
                        placeholder={t.contact.topicPlaceholder}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </FieldWrapper>
              </FormField>

              <FormField>
                <FieldWrapper>
                  <Controller
                    name='message'
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        variant='outlined'
                        label={t.contact.message}
                        placeholder={t.contact.messagePlaceholder}
                        rows={6}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        errorMessage={resolveError(errors.message?.message, err)}
                      />
                    )}
                  />
                </FieldWrapper>
              </FormField>

              {/* Honeypot — hidden from humans, autofilled by spam bots */}
              <Honeypot aria-hidden='true'>
                <label>
                  Website
                  <input tabIndex={-1} autoComplete='off' {...register('website')} />
                </label>
              </Honeypot>

              <MainButton
                type='submit'
                variant='slate_cta'
                title={isSubmitting ? t.contact.sending : t.contact.send}
                icon={Send}
                iconPosition='left'
                size='large'
                fullWidth
                disabled={isSubmitting}
              />
            </form>
          )}
        </FormCard>
      </BodySection>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
