'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import Link from 'next/link';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLocale } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';

const HeaderWrapper = styled('header')({
  position: 'sticky',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(10px)',
  zIndex: 100,
  height: '64px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
});

const LogoContainer = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
});

const LogoText = styled('span')({
  fontSize: '18px',
  fontWeight: 700,
  color: '#ec003f',
});

export default function Header() {
  const { locale } = useLocale();

  return (
    <HeaderWrapper>
      <LogoContainer href={localePath(locale)}>
        <Image
          src='/logo.png'
          alt='AiMenu'
          width={32}
          height={32}
          style={{ height: '32px', width: '32px', objectFit: 'contain' }}
          priority
        />
        <LogoText>AiMenu</LogoText>
      </LogoContainer>
      <LanguageSwitcher currentLocale={locale} />
    </HeaderWrapper>
  );
}
