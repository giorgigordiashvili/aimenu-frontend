'use client';

import { styled } from '@pigment-css/react';

import HeaderPrimary from '@/components/HeaderPrimary';
import { useTranslations } from '@/context/LocaleContext';
import ScanIcon from '@/icons/Scan';
import { background, foreground, slate500 } from '@/tokens';

const Page = styled('div')({
  minHeight: '100vh',
  background: background,
  display: 'flex',
  flexDirection: 'column',
});

const Content = styled('main')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '32px 24px',
  gap: '16px',
});

const IconCircle = styled('div')({
  width: '96px',
  height: '96px',
  borderRadius: '50%',
  background: '#F1F5F9',
  color: foreground,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Title = styled('h1')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
  letterSpacing: '-0.3px',
});

const Subtitle = styled('p')({
  fontSize: '14px',
  color: slate500,
  margin: 0,
  maxWidth: '320px',
  lineHeight: 1.5,
});

export default function ScanPage() {
  const t = useTranslations();

  return (
    <Page>
      <HeaderPrimary />
      <Content>
        <IconCircle>
          <ScanIcon width={44} height={44} />
        </IconCircle>
        <Title>{t.scan.title}</Title>
        <Subtitle>{t.scan.subtitle}</Subtitle>
      </Content>
    </Page>
  );
}
