'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import CalendarIcon from '@/icons/Calendar';
import CheckmarkIcon from '@/icons/Checkmark';
import ChevronDownIcon from '@/icons/ChevronDown';
import CreditCardIcon from '@/icons/CreditCard';
import EditIcon from '@/icons/Edit';
import HeartOutlineIcon from '@/icons/HeartOutline';
import PeopleIcon from '@/icons/People';
import StarIcon from '@/icons/Star';
import UserIcon from '@/icons/User';
import {
  background,
  border,
  foreground,
  radiusMd,
  radiusSm,
  shadowMd,
  slate500,
  white,
} from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const TabNavRoot = styled('div')({
  backgroundColor: background,
  padding: '16px 16px',
  '@media (min-width: 768px)': {
    padding: '32px 24px',
  },
});

// Mobile dropdown pieces -------------------------------------------------------

const DropdownWrap = styled('div')({
  position: 'relative',
  maxWidth: '1100px',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const DropdownTrigger = styled('button')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '12px 16px',
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  cursor: 'pointer',
  color: foreground,
  fontSize: '15px',
  fontWeight: 600,
  textAlign: 'left',
  transition: 'background 0.15s',
  '&:hover': {
    background: background,
  },
});

const TriggerLabel = styled('span')({
  flex: 1,
});

const TriggerChevron = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.15s ease',
  color: slate500,
  '&[data-open="true"]': {
    transform: 'rotate(180deg)',
  },
});

const DropdownPanel = styled('ul')({
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  right: 0,
  zIndex: 60,
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  boxShadow: shadowMd,
  listStyle: 'none',
  margin: 0,
  padding: '6px',
  maxHeight: '70vh',
  overflowY: 'auto',
  '@keyframes profileDropdownIn': {
    from: { opacity: 0, transform: 'translateY(-4px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  animation: 'profileDropdownIn 0.14s ease-out',
});

const DropdownItem = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '12px 12px',
  borderRadius: radiusSm,
  color: foreground,
  fontSize: '15px',
  fontWeight: 500,
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    background: background,
  },
  '&[data-active="true"]': {
    background: foreground,
    color: white,
  },
});

const DropdownItemLabel = styled('span')({
  flex: 1,
});

const DropdownItemCheck = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'currentColor',
});

// Desktop horizontal pill row -------------------------------------------------

const TabNavInner = styled('div')({
  maxWidth: '1100px',
  margin: '0 auto',
  display: 'none',
  gap: '4px',
  backgroundColor: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '4px',
  '@media (min-width: 768px)': {
    display: 'flex',
  },
});

const TabItem = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  flex: 1,
  padding: '10px 16px',
  fontSize: '14px',
  fontWeight: 500,
  color: slate500,
  background: 'transparent',
  border: 'none',
  borderRadius: radiusSm,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  transition: 'background 0.15s, color 0.15s',
  '&[data-active="true"]': {
    color: white,
    background: foreground,
  },
});

// ─── Component ─────────────────────────────────────────────────────────────────

interface Tab {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function ProfileTabNav() {
  const t = useTranslations();
  const { locale } = useLocale();
  const pathname = usePathname();

  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 'reservations',
        href: localePath(locale, '/profile/reservations'),
        label: t.profile.tabs.reservations,
        icon: <CalendarIcon />,
      },
      {
        id: 'loyalty',
        href: localePath(locale, '/profile/loyalty'),
        label: t.profile.tabs.loyalty,
        icon: <StarIcon />,
      },
      {
        id: 'reviews',
        href: localePath(locale, '/profile/reviews'),
        label: t.profile.tabs.reviews,
        icon: <EditIcon />,
      },
      {
        id: 'favorites',
        href: localePath(locale, '/favorites'),
        label: t.profile.tabs.favorites,
        icon: <HeartOutlineIcon width={16} height={14} />,
      },
      {
        id: 'settings',
        href: localePath(locale, '/profile/settings'),
        label: t.profile.tabs.profile,
        icon: <UserIcon width={16} height={16} />,
      },
      {
        id: 'payment',
        href: localePath(locale, '/profile/payment'),
        label: t.profile.tabs.payment,
        icon: <CreditCardIcon />,
      },
      {
        id: 'referral',
        href: localePath(locale, '/profile/referral'),
        label: t.profile.tabs.referral,
        icon: <PeopleIcon />,
      },
    ],
    [locale, t.profile.tabs]
  );

  const activeTab = tabs.find(tab => pathname.startsWith(tab.href)) ?? tabs[0];

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click and Escape — only while open, so we're not
  // binding listeners when they'd be no-ops.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current) return;
      if (wrapRef.current.contains(e.target as Node)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <TabNavRoot>
      {/* Mobile: dropdown trigger + panel */}
      <DropdownWrap ref={wrapRef}>
        <DropdownTrigger
          type='button'
          aria-haspopup='menu'
          aria-expanded={open}
          aria-controls='profile-tabs-menu'
          onClick={() => setOpen(v => !v)}
        >
          {activeTab.icon}
          <TriggerLabel>{activeTab.label}</TriggerLabel>
          <TriggerChevron data-open={open ? 'true' : undefined}>
            <ChevronDownIcon />
          </TriggerChevron>
        </DropdownTrigger>

        {open && (
          <DropdownPanel id='profile-tabs-menu' role='menu'>
            {tabs.map(tab => {
              const isActive = tab.id === activeTab.id;
              return (
                <li key={tab.id} role='none'>
                  <DropdownItem
                    href={tab.href}
                    role='menuitem'
                    aria-current={isActive ? 'page' : undefined}
                    data-active={isActive ? 'true' : undefined}
                    onClick={close}
                  >
                    {tab.icon}
                    <DropdownItemLabel>{tab.label}</DropdownItemLabel>
                    {isActive && (
                      <DropdownItemCheck>
                        <CheckmarkIcon width={16} height={16} />
                      </DropdownItemCheck>
                    )}
                  </DropdownItem>
                </li>
              );
            })}
          </DropdownPanel>
        )}
      </DropdownWrap>

      {/* Desktop: horizontal pill row */}
      <TabNavInner>
        {tabs.map(tab => (
          <TabItem
            key={tab.id}
            href={tab.href}
            data-active={tab.id === activeTab.id ? 'true' : undefined}
            aria-current={tab.id === activeTab.id ? 'page' : undefined}
          >
            {tab.icon}
            {tab.label}
          </TabItem>
        ))}
      </TabNavInner>
    </TabNavRoot>
  );
}
