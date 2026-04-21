'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import HeaderPrimary from '@/components/HeaderPrimary/HeaderPrimary';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import * as tokens from '@/tokens';

const Page = styled('div')({
  minHeight: '100vh',
  background: tokens.white,
  display: 'flex',
  flexDirection: 'column',
});

const Main = styled('main')({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
});

const Card = styled('div')({
  width: '100%',
  maxWidth: '520px',
  background: tokens.white,
  borderRadius: tokens.radiusMd,
  boxShadow: tokens.shadowMd,
  border: `1px solid ${tokens.slate200}`,
  padding: '32px',
  textAlign: 'center',
  '@media (max-width: 768px)': {
    boxShadow: 'none',
    border: 'none',
    padding: '16px',
  },
});

const Title = styled('h1')({
  fontSize: '24px',
  fontWeight: 700,
  color: tokens.ink,
  margin: '12px 0 8px',
});

const Subtitle = styled('p')({
  fontSize: '15px',
  color: tokens.slate500,
  margin: '0 0 24px',
  lineHeight: 1.4,
});

const Badge = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: `${tokens.primary}1A`,
  color: tokens.primary,
  fontSize: '28px',
});

const CtaCard = styled('a')({
  display: 'block',
  textAlign: 'left',
  padding: '16px',
  borderRadius: tokens.radiusSm,
  border: `1px solid ${tokens.slate200}`,
  textDecoration: 'none',
  marginBottom: '12px',
  transition: 'border-color 0.15s',
  '&:hover': {
    borderColor: tokens.primary,
  },
  '&[data-variant="primary"]': {
    background: tokens.primary,
    color: tokens.white,
    border: 'none',
  },
  '&[data-variant="primary"] h3': {
    color: tokens.white,
  },
  '&[data-variant="primary"] p': {
    color: `${tokens.white}CC`,
  },
});

const CtaTitle = styled('h3')({
  fontSize: '15px',
  fontWeight: 600,
  color: tokens.ink,
  margin: '0 0 4px',
});

const CtaHint = styled('p')({
  fontSize: '13px',
  color: tokens.slate500,
  margin: 0,
  lineHeight: 1.4,
});

const FallbackNote = styled('p')({
  fontSize: '12px',
  color: tokens.muted,
  marginTop: '20px',
  lineHeight: 1.5,
});

interface SuccessClientProps {
  locale: Locale;
}

export default function SuccessClient({ locale }: SuccessClientProps) {
  const t = getDictionary(locale).restaurantSignup;
  const params = useSearchParams();

  const [slug, setSlug] = useState<string>(params?.get('slug') ?? '');
  const [name, setName] = useState<string>(params?.get('name') ?? '');

  // If the URL params were stripped (e.g. user refreshed after cleaning URL
  // or opened the page directly), fall back to sessionStorage.
  useEffect(() => {
    if (slug && name) return;
    try {
      const raw = sessionStorage.getItem('aimenu_signup_result');
      if (!raw) return;
      const parsed = JSON.parse(raw) as { slug?: string; name?: string };
      if (!slug && parsed.slug) setSlug(parsed.slug);
      if (!name && parsed.name) setName(parsed.name);
    } catch {
      // Bad JSON or storage blocked — ignore.
    }
  }, [slug, name]);

  // Per-tenant Django admin lives at <slug>.admin.aimenu.ge/tenant-admin/. The
  // plain subdomain root 404s, so always point at /tenant-admin/ directly.
  const manageUrl = slug
    ? `https://${slug}.admin.aimenu.ge/tenant-admin/`
    : 'https://admin.aimenu.ge/admin/';
  const publicUrl = slug
    ? `https://aimenu.ge${localePath(locale, `/restaurant/${slug}`)}`
    : 'https://aimenu.ge';

  return (
    <Page>
      <HeaderPrimary />
      <Main>
        <Card>
          <Badge>✓</Badge>
          <Title>{t.successTitle}</Title>
          <Subtitle>{t.successSubtitle.replace('{name}', name || 'Your restaurant')}</Subtitle>

          <CtaCard href={manageUrl} data-variant='primary'>
            <CtaTitle>{t.successManageCta}</CtaTitle>
            <CtaHint>{t.successManageHint}</CtaHint>
          </CtaCard>

          <CtaCard href={publicUrl} target='_blank' rel='noreferrer'>
            <CtaTitle>{t.successViewCta}</CtaTitle>
            <CtaHint>{t.successViewHint}</CtaHint>
          </CtaCard>

          <FallbackNote>
            {t.successFallbackNote} <Link href={localePath(locale, '/')}>aimenu.ge</Link>
          </FallbackNote>
        </Card>
      </Main>
    </Page>
  );
}
