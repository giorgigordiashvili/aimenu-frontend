'use client';

import { styled } from '@pigment-css/react';

import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import type { Locale } from '@/i18n/config';
import { background, border, foreground, muted, slate100 } from '@/tokens';

const Page = styled('div')({
  minHeight: '100vh',
  background,
  display: 'flex',
  flexDirection: 'column',
});

const Main = styled('main')({
  flex: 1,
  maxWidth: '720px',
  width: '100%',
  margin: '0 auto',
  padding: '32px 20px 80px',
  '@media (min-width: 768px)': {
    padding: '48px 24px 100px',
  },
});

const Title = styled('h1')({
  fontSize: '28px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 8px',
  '@media (min-width: 768px)': {
    fontSize: '36px',
  },
});

const Updated = styled('p')({
  fontSize: '13px',
  color: muted,
  margin: '0 0 24px',
});

const DraftBanner = styled('aside')({
  background: slate100,
  border: `1px solid ${border}`,
  borderRadius: '12px',
  padding: '14px 16px',
  fontSize: '13px',
  color: foreground,
  marginBottom: '24px',
});

const Body = styled('div')({
  fontSize: '15px',
  lineHeight: '24px',
  color: foreground,
  '& h2': {
    fontSize: '20px',
    fontWeight: 700,
    margin: '32px 0 12px',
  },
  '& h3': {
    fontSize: '17px',
    fontWeight: 700,
    margin: '24px 0 8px',
  },
  '& p, & li': {
    fontSize: '15px',
    lineHeight: '24px',
    margin: '0 0 12px',
  },
  '& ul': {
    paddingLeft: '20px',
    margin: '0 0 16px',
  },
  '& a': {
    color: foreground,
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
});

interface Props {
  locale: Locale;
  title: string;
  updated: string;
  draftNote: string;
  children: React.ReactNode;
}

export default function LegalPage({ locale, title, updated, draftNote, children }: Props) {
  return (
    <Page>
      <HeaderPrimary />
      <Main>
        <Title>{title}</Title>
        <Updated>{updated}</Updated>
        <DraftBanner role='note'>{draftNote}</DraftBanner>
        <Body>{children}</Body>
      </Main>
      <Footer locale={locale} />
    </Page>
  );
}
