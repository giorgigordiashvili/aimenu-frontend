'use client';

import { styled } from '@pigment-css/react';
import { useSearchParams } from 'next/navigation';

import HeaderPrimary from '@/components/HeaderPrimary';
import { useTranslations } from '@/context/LocaleContext';
import ScanIcon from '@/icons/Scan';
import { background, foreground, rose600, rose50, slate500 } from '@/tokens';

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

const Invalid = styled('p')({
  fontSize: '14px',
  color: rose600,
  background: rose50,
  borderRadius: '8px',
  padding: '10px 14px',
  margin: 0,
  maxWidth: '360px',
  lineHeight: 1.5,
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
  const invalid = useSearchParams().get('error') === 'invalid';

  return (
    <Page>
      <HeaderPrimary />
      <Content>
        <IconCircle>
          <ScanIcon width={44} height={44} />
        </IconCircle>
        <Title>{t.scan.title}</Title>
        {invalid ? <Invalid data-testid='scan-invalid'>{t.scan.invalid}</Invalid> : null}
        <Subtitle>{t.scan.subtitle}</Subtitle>
      </Content>
    </Page>
  );
}
