'use client';

import { styled } from '@pigment-css/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Locale, locales } from '@/i18n/config';
import { foreground, muted, slate200, white } from '@/tokens';

// ── Locale labels ─────────────────────────────────────────────────────────────

const LABELS: Record<Locale, string> = {
  ka: 'GEO',
  en: 'ENG',
  ru: 'RUS',
};

// ── Styled ────────────────────────────────────────────────────────────────────

const Wrapper = styled('div')({
  position: 'relative',
  flexShrink: 0,
});

/** Pill trigger button — rounded border, "GEO ˅" */
const Trigger = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  background: 'transparent',
  border: `1.5px solid ${slate200}`,
  borderRadius: '9999px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  color: muted,
  lineHeight: 1,
  transition: 'border-color 0.15s, color 0.15s',
  '&:hover': {
    borderColor: '#94a3b8',
    color: foreground,
  },
});

const Chevron = styled('span')<{ open?: boolean }>({
  display: 'inline-block',
  width: '10px',
  height: '10px',
  borderRight: `2px solid currentColor`,
  borderBottom: `2px solid currentColor`,
  transform: 'rotate(45deg) translateY(-2px)',
  transition: 'transform 0.2s',
  variants: [{ props: { open: true }, style: { transform: 'rotate(225deg) translateY(-2px)' } }],
});

/** Dropdown card */
const Dropdown = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  background: white,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
  padding: '8px',
  minWidth: '100px',
  zIndex: 400,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const Option = styled('button')<{ isActive?: boolean }>({
  width: '100%',
  padding: '10px 16px',
  border: 'none',
  borderRadius: '10px',
  background: 'transparent',
  fontSize: '15px',
  fontWeight: 500,
  color: muted,
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'background 0.1s, color 0.1s',
  '&:hover': {
    background: '#f1f5f9',
    color: foreground,
  },
  variants: [
    {
      props: { isActive: true },
      style: {
        background: '#f1f5f9',
        color: foreground,
        fontWeight: 700,
      },
    },
  ],
});

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  currentLocale: Locale;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LanguageSwitcherPrimary({ currentLocale }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, []);

  function switchLocale(next: Locale) {
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const newPath = segments.join('/') || '/';
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
    router.push(newPath);
    setOpen(false);
  }

  return (
    <Wrapper ref={ref}>
      <Trigger onClick={() => setOpen(s => !s)} aria-haspopup='listbox' aria-expanded={open}>
        {LABELS[currentLocale]}
        <Chevron open={open} />
      </Trigger>

      {open && (
        <Dropdown role='listbox'>
          {locales.map(locale => (
            <Option
              key={locale}
              isActive={locale === currentLocale}
              onClick={() => switchLocale(locale)}
              role='option'
              aria-selected={locale === currentLocale}
            >
              {LABELS[locale]}
            </Option>
          ))}
        </Dropdown>
      )}
    </Wrapper>
  );
}
