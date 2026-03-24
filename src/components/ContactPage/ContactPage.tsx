'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import { useState } from 'react';

import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import TextArea from '@/components/TextArea/TextArea';
import TextInput from '@/components/TextInput/TextInput';
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
  gridTemplateColumns: '1fr 1.2fr',
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

const InfoCard = styled('div')({
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
  '@media (max-width: 480px)': {
    gridTemplateColumns: '1fr',
  },
});

const FormField = styled('div')({
  marginBottom: 16,
});

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const { locale } = useLocale();
  const t = useTranslations();

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    topic: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form:', form);
    setSubmitted(true);
  };

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
          {/* Phone card */}
          <InfoCard>
            <IconBoxPhone>
              <Phone />
            </IconBoxPhone>
            <CardTextCol>
              <CardTitle>{t.contact.phoneTitle}</CardTitle>
              <CardSubtitle>{t.contact.phoneSubtitle}</CardSubtitle>
              <CardValueRed>+995 32 2 12 34 56</CardValueRed>
            </CardTextCol>
          </InfoCard>

          {/* Email card */}
          <InfoCard>
            <IconBoxEmail>
              <Email />
            </IconBoxEmail>
            <CardTextCol>
              <CardTitle>{t.contact.emailTitle}</CardTitle>
              <CardSubtitle>{t.contact.emailSubtitle}</CardSubtitle>
              <CardValueBlue>support@aimenu.ge</CardValueBlue>
            </CardTextCol>
          </InfoCard>

          {/* Location card */}
          <InfoCard>
            <IconBoxLocation>
              <Location width={20} height={20} />
            </IconBoxLocation>
            <CardTextCol>
              <CardTitle>{t.contact.locationTitle}</CardTitle>
              <CardSubtitle>{t.contact.locationSubtitle}</CardSubtitle>
              <CardValueAddress>{t.contact.address}</CardValueAddress>
            </CardTextCol>
          </InfoCard>

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
            <div style={{ textAlign: 'center', padding: '40px 0', color: emerald600 }}>
              <p style={{ fontSize: 18, fontWeight: 600 }}>{t.contact.successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormRow>
                <TextInput
                  label={t.contact.firstName}
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                />
                <TextInput
                  label={t.contact.lastName}
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                />
              </FormRow>

              <FormField>
                <TextInput
                  label={t.contact.email}
                  type='email'
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </FormField>

              <FormField>
                <TextInput
                  label={t.contact.topic}
                  value={form.topic}
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                />
              </FormField>

              <FormField>
                <TextArea
                  label={t.contact.message}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={6}
                />
              </FormField>

              <MainButton
                type='submit'
                variant='rose_cta'
                title={t.contact.send}
                icon={Send}
                iconPosition='right'
                size='large'
                fullWidth
              />
            </form>
          )}
        </FormCard>
      </BodySection>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
