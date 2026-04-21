'use client';

import { styled, keyframes } from '@pigment-css/react';
import { useEffect, useId, useRef, useState } from 'react';

import { reservationsSettingsRetrieve } from '@/api/generated/api';
import ReservationWidget from '@/components/ReservationWidget/ReservationWidget';
import { useCart } from '@/context/CartContext';
import { useTranslations } from '@/context/LocaleContext';
import { useTable } from '@/context/TableContext';
import { background, border, foreground, muted, rose600, slate100, white } from '@/tokens';

// Mobile-only. Shows a fixed bottom bar with the current sum (cart total
// when the user is at a table, deposit otherwise) + a CTA that opens the
// full ReservationWidget inside a bottom sheet. On desktop this component
// renders nothing — the sidebar widget already covers that layout.
//
// Accessibility:
//   - the sticky bar is a real <button> with aria-expanded / aria-haspopup
//   - the sheet has role="dialog" + aria-modal + aria-labelledby
//   - clicking the backdrop or pressing Escape closes it
//   - focus is moved to a close button when the sheet opens and restored
//     to the trigger when it closes
//   - body scroll is locked while open

const slideUp = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
});

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const MobileOnly = styled('div')({
  '@media (min-width: 1024px)': {
    display: 'none',
  },
});

const StickyBar = styled('div')({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 40,
  background: white,
  borderTop: `1px solid ${border}`,
  padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
});

const StickyInfo = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
});

const StickyLabel = styled('span')({
  fontSize: '12px',
  color: muted,
  lineHeight: '14px',
});

const StickyAmount = styled('span')({
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '24px',
});

const StickyButton = styled('button')({
  flexShrink: 0,
  background: rose600,
  color: white,
  border: 'none',
  borderRadius: '12px',
  padding: '12px 20px',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  minHeight: '44px',
  '&:focus-visible': {
    outline: `3px solid ${slate100}`,
    outlineOffset: '2px',
  },
});

const Backdrop = styled('div')({
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.5)',
  zIndex: 60,
  animation: `${fadeIn} 0.2s ease-out`,
});

const Sheet = styled('div')({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 61,
  background: background,
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  maxHeight: '92dvh',
  overflowY: 'auto',
  paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
  animation: `${slideUp} 0.25s ease-out`,
});

const SheetGrip = styled('div')({
  width: '40px',
  height: '4px',
  borderRadius: '4px',
  background: slate100,
  margin: '10px auto 8px',
});

const SheetHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px 8px',
});

const SheetTitle = styled('h2')({
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
});

const CloseButton = styled('button')({
  background: 'transparent',
  border: 'none',
  padding: '8px',
  cursor: 'pointer',
  color: foreground,
  fontSize: '14px',
  borderRadius: '8px',
  minHeight: '44px',
  minWidth: '44px',
  '&:focus-visible': {
    outline: `3px solid ${slate100}`,
    outlineOffset: '2px',
  },
});

const SheetBody = styled('div')({
  padding: '0 16px 16px',
});

interface Props {
  slug: string;
  locale: string;
  /** Master ordering switch from the restaurant. */
  orderingEnabled?: boolean;
  /** Whether the restaurant accepts reservations. */
  reservationsEnabled?: boolean;
}

export default function MobileReservationSheet({
  slug,
  locale,
  orderingEnabled = true,
  reservationsEnabled = true,
}: Props) {
  const t = useTranslations();
  const { getTotalPrice, getTotalItems } = useCart();
  const { tableData } = useTable();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [depositAmount, setDepositAmount] = useState(10.0);
  const titleId = useId();

  // Same resolution rule as ReservationWidget: treat as "at a table" when
  // a TableSession has been validated for this restaurant. No need to
  // re-read the `?table=` query string here since TableContext already
  // persists it.
  // Treat the user as seated only when ordering is actually allowed —
  // otherwise the bar has nothing to offer in menu-only mode and should
  // just fall through to reservation mode (or hide entirely).
  const hasTable =
    orderingEnabled &&
    !!tableData?.isValidated &&
    !!tableData.sessionId &&
    tableData.restaurantSlug === slug;

  useEffect(() => {
    reservationsSettingsRetrieve()
      .then((d: { deposit_amount?: string | null }) => {
        if (d?.deposit_amount) setDepositAmount(parseFloat(d.deposit_amount));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus into the sheet so screen readers announce it.
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Restore focus to trigger when the sheet closes.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      triggerRef.current?.focus();
    }
    wasOpenRef.current = open;
  }, [open]);

  const cartTotal = getTotalPrice();
  const itemCount = getTotalItems();

  // Amount + copy depend on mode.
  //   - At a table with items: show cart total
  //   - At a table without items: prompt to browse menu (show 0 total)
  //   - Reservation mode: show the deposit the user will pay to book
  const amount = hasTable ? cartTotal : depositAmount;
  const label = hasTable
    ? itemCount > 0
      ? t.reservationWidget.grandTotal
      : t.reservationWidget.items
    : t.reservationWidget.deposit;
  const cta = hasTable
    ? itemCount > 0
      ? t.reservationWidget.order
      : t.reservationWidget.browseMenu
    : t.reservationWidget.mobileStickyOpen;
  const ariaLabel = hasTable
    ? t.reservationWidget.mobileOrderStickyAria
    : t.reservationWidget.mobileStickyAria;

  // Hide the whole bar when the restaurant is fully menu-only (no
  // reservations, no ordering). Nothing meaningful to show.
  if (!orderingEnabled && !reservationsEnabled) {
    return null;
  }

  return (
    <MobileOnly>
      <StickyBar role='region' aria-label={ariaLabel}>
        <StickyInfo>
          <StickyLabel>{label}</StickyLabel>
          <StickyAmount>{amount.toFixed(2)} ₾</StickyAmount>
        </StickyInfo>
        <StickyButton
          type='button'
          ref={triggerRef}
          aria-haspopup='dialog'
          aria-expanded={open}
          aria-label={ariaLabel}
          onClick={() => setOpen(true)}
        >
          {cta}
        </StickyButton>
      </StickyBar>

      {open && (
        <>
          <Backdrop onClick={() => setOpen(false)} aria-hidden='true' />
          <Sheet role='dialog' aria-modal='true' aria-labelledby={titleId}>
            <SheetGrip aria-hidden='true' />
            <SheetHeader>
              <SheetTitle id={titleId}>
                {hasTable ? t.reservationWidget.orderTitle : t.reservationWidget.title}
              </SheetTitle>
              <CloseButton
                type='button'
                ref={closeRef}
                onClick={() => setOpen(false)}
                aria-label={t.reservationWidget.mobileStickyClose}
              >
                ✕
              </CloseButton>
            </SheetHeader>
            <SheetBody>
              <ReservationWidget slug={slug} locale={locale} />
            </SheetBody>
          </Sheet>
        </>
      )}
    </MobileOnly>
  );
}
