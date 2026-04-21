'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import type { Dispatch, SetStateAction } from 'react';

import { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/routing';
import * as tokens from '@/tokens';

import type { SignupData, SignupT } from './shared';

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
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

const Group = styled('div')({
  background: tokens.slate50,
  border: `1px solid ${tokens.slate200}`,
  borderRadius: tokens.radiusSm,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const GroupTitle = styled('h3')({
  fontSize: '13px',
  fontWeight: 600,
  color: tokens.slate500,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  margin: 0,
  marginBottom: '4px',
});

const Row = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  fontSize: '14px',
  '& > span:first-child': {
    color: tokens.slate500,
    flexShrink: 0,
  },
  '& > span:last-child': {
    color: tokens.ink,
    fontWeight: 500,
    textAlign: 'right',
    wordBreak: 'break-word',
  },
});

const TermsWrapper = styled('label')({
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-start',
  fontSize: '13px',
  color: tokens.ink,
  cursor: 'pointer',
  lineHeight: 1.45,
  '& a': {
    color: tokens.primary,
    textDecoration: 'underline',
  },
  '& input[type="checkbox"]': {
    marginTop: '3px',
    width: '16px',
    height: '16px',
    accentColor: tokens.primary,
    cursor: 'pointer',
    flexShrink: 0,
  },
});

const ButtonRow = styled('div')({
  display: 'flex',
  gap: '12px',
  marginTop: '4px',
});

const PrimaryButton = styled('button')({
  flex: 2,
  padding: '14px 16px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  fontFamily: 'Inter',
  fontWeight: 600,
  backgroundColor: tokens.redBrand,
  color: tokens.white,
  '&:hover': {
    backgroundColor: tokens.rose700,
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});

const SecondaryButton = styled('button')({
  flex: 1,
  padding: '14px 16px',
  borderRadius: '10px',
  border: `1px solid ${tokens.slate200}`,
  cursor: 'pointer',
  fontSize: '15px',
  fontFamily: 'Inter',
  fontWeight: 600,
  backgroundColor: tokens.white,
  color: tokens.ink,
  '&:hover': {
    backgroundColor: tokens.slate50,
  },
});

interface StepReviewProps {
  data: SignupData;
  setData: Dispatch<SetStateAction<SignupData>>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  t: SignupT;
  locale: Locale;
}

// Renders t.acceptTerms which contains `{termsLink}` + `{privacyLink}`
// placeholders. We interpolate two <Link> elements and flatten the array
// between raw strings.
function renderAcceptTerms(t: SignupT, locale: Locale) {
  const template = t.acceptTerms;
  const termsNode = (
    <Link key='terms' href={localePath(locale, '/terms')}>
      {t.acceptTermsLink}
    </Link>
  );
  const privacyNode = (
    <Link key='privacy' href={localePath(locale, '/privacy')}>
      {t.acceptPrivacyLink}
    </Link>
  );
  // Split on both placeholders in one pass.
  const parts = template.split(/(\{termsLink\}|\{privacyLink\})/g);
  return parts.map((part, i) => {
    if (part === '{termsLink}') return <span key={`t-${i}`}>{termsNode}</span>;
    if (part === '{privacyLink}') return <span key={`p-${i}`}>{privacyNode}</span>;
    return <span key={`s-${i}`}>{part}</span>;
  });
}

export default function StepReview({
  data,
  setData,
  onBack,
  onSubmit,
  isSubmitting,
  t,
  locale,
}: StepReviewProps) {
  const ownerName = `${data.firstName} ${data.lastName}`.trim();

  return (
    <Wrapper>
      <SectionTitle>{t.reviewSectionTitle}</SectionTitle>
      <SectionSub>{t.reviewSectionSubtitle}</SectionSub>

      <Group>
        <GroupTitle>{t.reviewOwner}</GroupTitle>
        <Row>
          <span>{t.firstName}</span>
          <span>{ownerName || '—'}</span>
        </Row>
        <Row>
          <span>{t.email}</span>
          <span>{data.email}</span>
        </Row>
        {data.phone && (
          <Row>
            <span>{t.phone}</span>
            <span>{data.phone}</span>
          </Row>
        )}
      </Group>

      <Group>
        <GroupTitle>{t.reviewRestaurant}</GroupTitle>
        <Row>
          <span>{t.restaurantName}</span>
          <span>{data.restaurantName}</span>
        </Row>
        {data.city && (
          <Row>
            <span>{t.city}</span>
            <span>
              {data.city}
              {data.country ? `, ${data.country}` : ''}
            </span>
          </Row>
        )}
        {data.address && (
          <Row>
            <span>{t.address}</span>
            <span>{data.address}</span>
          </Row>
        )}
        {data.restaurantPhone && (
          <Row>
            <span>{t.restaurantPhone}</span>
            <span>{data.restaurantPhone}</span>
          </Row>
        )}
        {data.website && (
          <Row>
            <span>{t.website}</span>
            <span>{data.website}</span>
          </Row>
        )}
      </Group>

      <TermsWrapper>
        <input
          type='checkbox'
          checked={data.acceptedTerms}
          onChange={e => setData(prev => ({ ...prev, acceptedTerms: e.target.checked }))}
        />
        <span>{renderAcceptTerms(t, locale)}</span>
      </TermsWrapper>

      <ButtonRow>
        <SecondaryButton type='button' onClick={onBack} disabled={isSubmitting}>
          {t.backButton}
        </SecondaryButton>
        <PrimaryButton type='button' onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? t.submitting : t.submitButton}
        </PrimaryButton>
      </ButtonRow>
    </Wrapper>
  );
}
