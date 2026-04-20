'use client';

import { styled } from '@pigment-css/react';
import { usePathname, useRouter } from 'next/navigation';

import { Locale, locales, localeNames } from '@/i18n/config';
import { localePath, stripLocale } from '@/i18n/routing';

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  background: '#f1f5f9',
  borderRadius: '8px',
  padding: '4px',
});

interface ButtonProps {
  isActive?: boolean;
}

const Button = styled('button')<ButtonProps>({
  padding: '6px 10px',
  border: 'none',
  borderRadius: '6px',
  background: 'transparent',
  fontSize: '12px',
  fontWeight: 500,
  color: '#334155',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: 'none',
  '&:hover': {
    background: '#e2e8f0',
    color: '#0f172a',
  },
  variants: [
    {
      props: { isActive: true },
      style: {
        background: '#ffffff',
        color: '#0f172a',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          background: '#ffffff',
        },
      },
    },
  ],
});

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    const { pathWithoutLocale } = stripLocale(pathname);
    const newPath = localePath(newLocale, pathWithoutLocale);

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    router.push(newPath);
  };

  return (
    <Container>
      {locales.map(locale => (
        <Button
          key={locale}
          onClick={() => switchLocale(locale)}
          isActive={locale === currentLocale}
          aria-label={`Switch to ${localeNames[locale]}`}
        >
          {locale.toUpperCase()}
        </Button>
      ))}
    </Container>
  );
}
