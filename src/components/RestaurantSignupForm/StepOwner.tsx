'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import type { Dispatch, SetStateAction } from 'react';

import TextInput from '@/components/TextInput/TextInput';
import { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/routing';
import EmailIcon from '@/icons/Email';
import EyeIcon from '@/icons/Eye';
import LockIcon from '@/icons/Lock';
import ManIcon from '@/icons/Man';
import PhoneIcon from '@/icons/Phone';
import * as tokens from '@/tokens';

import type { SignupData, SignupErrors, SignupT } from './shared';

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const Row = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  '@media (max-width: 480px)': {
    gridTemplateColumns: '1fr',
  },
});

const Field = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const PasswordHint = styled('span')({
  fontSize: '11px',
  color: tokens.muted,
  marginTop: '4px',
});

const SectionTitle = styled('h2')({
  fontSize: '16px',
  fontWeight: 600,
  color: tokens.ink,
  margin: '0 0 2px',
});

const SectionSub = styled('p')({
  fontSize: '13px',
  color: tokens.slate500,
  margin: '0 0 8px',
});

const SubmitButton = styled('button')({
  marginTop: '8px',
  padding: '14px 16px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  fontFamily: 'Inter',
  fontWeight: 600,
  backgroundColor: tokens.redBrand,
  color: tokens.white,
  width: '100%',
  '&:hover': {
    backgroundColor: tokens.rose700,
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const Footer = styled('p')({
  textAlign: 'center',
  fontSize: '14px',
  color: tokens.muted,
  margin: '20px 0 0',
  '& a': {
    color: tokens.primary,
    fontWeight: 600,
    textDecoration: 'none',
  },
  '& a:hover': {
    textDecoration: 'underline',
  },
});

interface StepOwnerProps {
  data: SignupData;
  setData: Dispatch<SetStateAction<SignupData>>;
  errors: SignupErrors;
  setErrors: Dispatch<SetStateAction<SignupErrors>>;
  onNext: () => void;
  t: SignupT;
  locale: Locale;
}

export default function StepOwner({
  data,
  setData,
  errors,
  setErrors,
  onNext,
  t,
  locale,
}: StepOwnerProps) {
  function update<K extends keyof SignupData>(key: K, value: SignupData[K]) {
    setData(prev => ({ ...prev, [key]: value }));
    if (errors[key as keyof SignupErrors]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  }

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        onNext();
      }}
      noValidate
    >
      <SectionTitle>{t.ownerSectionTitle}</SectionTitle>
      <SectionSub>{t.ownerSectionSubtitle}</SectionSub>

      <Row>
        <Field>
          <TextInput
            variant='outlined'
            label={t.firstName}
            id='signup-first-name'
            type='text'
            autoComplete='given-name'
            required
            value={data.firstName}
            leftIcon={ManIcon}
            errorMessage={errors.firstName}
            onChange={e => update('firstName', e.target.value)}
          />
        </Field>
        <Field>
          <TextInput
            variant='outlined'
            label={t.lastName}
            id='signup-last-name'
            type='text'
            autoComplete='family-name'
            required
            value={data.lastName}
            leftIcon={ManIcon}
            errorMessage={errors.lastName}
            onChange={e => update('lastName', e.target.value)}
          />
        </Field>
      </Row>

      <Field>
        <TextInput
          variant='outlined'
          label={t.email}
          id='signup-email'
          type='email'
          autoComplete='email'
          required
          value={data.email}
          leftIcon={EmailIcon}
          errorMessage={errors.email}
          onChange={e => update('email', e.target.value)}
        />
      </Field>

      <Field>
        <TextInput
          variant='outlined'
          label={t.phone}
          id='signup-phone'
          type='tel'
          autoComplete='tel'
          value={data.phone}
          leftIcon={PhoneIcon}
          onChange={e => update('phone', e.target.value)}
        />
      </Field>

      <Field>
        <TextInput
          variant='outlined'
          label={t.password}
          id='signup-password'
          type='password'
          autoComplete='new-password'
          required
          value={data.password}
          leftIcon={LockIcon}
          icon={EyeIcon}
          errorMessage={errors.password}
          onChange={e => update('password', e.target.value)}
        />
        <PasswordHint>{t.passwordHint}</PasswordHint>
      </Field>

      <Field>
        <TextInput
          variant='outlined'
          label={t.passwordConfirm}
          id='signup-password-confirm'
          type='password'
          autoComplete='new-password'
          required
          value={data.passwordConfirm}
          leftIcon={LockIcon}
          icon={EyeIcon}
          errorMessage={errors.passwordConfirm}
          onChange={e => update('passwordConfirm', e.target.value)}
        />
      </Field>

      <SubmitButton type='submit'>{t.nextButton}</SubmitButton>

      <Footer>
        {t.haveAccount} <Link href={localePath(locale, '/login')}>{t.loginLink}</Link>
      </Footer>
    </Form>
  );
}
