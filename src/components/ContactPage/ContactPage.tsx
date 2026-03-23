'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import TextArea from '@/components/TextArea/TextArea';
import TextInput from '@/components/TextInput/TextInput';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import CheckIcon from '@/icons/Check';
import EmailIcon from '@/icons/Email';
import LocationIcon from '@/icons/Location';
import PhoneIcon from '@/icons/Phone';
import { foreground, greenActive, rose500, shadowMd, slate400, slate50, white } from '@/tokens';

// ── Styled Components ────────────────────────────────────────────────────────

const PageWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: slate50,
});

const Main = styled('main')({
  flex: 1,
  padding: '80px 24px',
});

const Inner = styled('div')({
  maxWidth: 1120,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 80,
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    gap: 40,
  },
});

const InfoBlock = styled('div')({});

const ContactTitle = styled('h1')({
  fontSize: 40,
  fontWeight: 700,
  color: foreground,
  marginBottom: 16,
  marginTop: 0,
});

const ContactDesc = styled('p')({
  fontSize: 16,
  color: slate400,
  marginBottom: 40,
  marginTop: 0,
});

const ContactItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 20,
});

const ContactItemText = styled('span')({
  fontSize: 16,
  color: foreground,
});

const FormBlock = styled('div')({
  background: white,
  borderRadius: 16,
  padding: '40px',
  boxShadow: shadowMd,
});

const FormField = styled('div')({
  marginBottom: 20,
});

const ErrorText = styled('p')({
  fontSize: 12,
  color: rose500,
  marginTop: 4,
  marginBottom: 0,
});

const SuccessBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '40px 0',
  gap: 16,
});

const SuccessMessage = styled('p')({
  fontSize: 18,
  fontWeight: 600,
  color: greenActive,
  margin: 0,
});

const IconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: slate400,
});

// ── Component ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const { locale } = useLocale();
  const t = useTranslations();

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = { name: '', email: '', message: '' };
    let valid = true;

    if (!form.name.trim()) {
      newErrors.name = t.contact.form.nameRequired;
      valid = false;
    }
    if (!form.email.trim()) {
      newErrors.email = t.contact.form.emailRequired;
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t.contact.form.emailInvalid;
      valid = false;
    }
    if (!form.message.trim()) {
      newErrors.message = t.contact.form.messageRequired;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log('Contact form:', form);
      setSubmitted(true);
    }
  };

  return (
    <PageWrapper>
      <HeaderPrimary />

      <Main>
        <Inner>
          <InfoBlock>
            <ContactTitle>{t.contact.title}</ContactTitle>
            <ContactDesc>{t.contact.description}</ContactDesc>

            <ContactItem>
              <IconWrap>
                <PhoneIcon />
              </IconWrap>
              <ContactItemText>+995 32 2 00 00 00</ContactItemText>
            </ContactItem>

            <ContactItem>
              <IconWrap>
                <EmailIcon />
              </IconWrap>
              <ContactItemText>info@aimenu.ge</ContactItemText>
            </ContactItem>

            <ContactItem>
              <IconWrap>
                <LocationIcon size={20} />
              </IconWrap>
              <ContactItemText>თბილისი, ჭავჭავაძის 1</ContactItemText>
            </ContactItem>
          </InfoBlock>

          <FormBlock>
            {submitted ? (
              <SuccessBlock>
                <CheckIcon width={48} height={48} style={{ color: greenActive }} />
                <SuccessMessage>{t.contact.form.success}</SuccessMessage>
              </SuccessBlock>
            ) : (
              <>
                <FormField>
                  <TextInput
                    label={t.contact.form.name}
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </FormField>

                <FormField>
                  <TextInput
                    label={t.contact.form.email}
                    type='email'
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </FormField>

                <FormField>
                  <TextArea
                    label={t.contact.form.message}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    required
                  />
                  {errors.message && <ErrorText>{errors.message}</ErrorText>}
                </FormField>

                <MainButton
                  variant='rose_cta'
                  title={t.contact.form.submit}
                  fullWidth
                  onClick={handleSubmit}
                />
              </>
            )}
          </FormBlock>
        </Inner>
      </Main>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
