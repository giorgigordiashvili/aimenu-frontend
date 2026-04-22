'use client';

import { styled } from '@pigment-css/react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import CheckIcon from '@/icons/Check';
import { foreground, slate100, slate400, white } from '@/tokens';

interface Option {
  label: string;
  value: string;
}

interface MobileSelectModalProps {
  title: string;
  options?: Option[];
  selected?: string;
  onSelect?: (value: string) => void;
  onClose: () => void;
  children?: React.ReactNode;
}

// ── Styled components ─────────────────────────────────────────────────────────

// Header stacks up to 401; bump well above that so the sticky nav never
// peeks through when the sheet is tall enough to scroll.
const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  zIndex: 2000,
});

const Sheet = styled('div')({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  background: white,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  zIndex: 2001,
  maxHeight: '80vh',
  // Sheet itself is the flex column so the header can stay pinned while
  // Content becomes the scroll region. Previously the whole sheet
  // scrolled which dragged the title + close button out of view.
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const SheetHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 24px 12px',
  background: white,
  borderBottom: `1px solid ${slate100}`,
  flexShrink: 0,
});

const SheetContent = styled('div')({
  padding: '8px 24px 24px',
  overflowY: 'auto',
  flex: 1,
  WebkitOverflowScrolling: 'touch',
});

const SheetTitle = styled('h3')({
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
  color: foreground,
});

const CloseBtn = styled('button')({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 20,
  color: slate400,
  padding: 4,
  lineHeight: 1,
});

const OptionRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: `1px solid ${slate100}`,
  cursor: 'pointer',
  color: foreground,
  fontSize: 15,
  fontWeight: 400,
  '&[data-selected="true"]': {
    fontWeight: 700,
  },
});

const OptionLabel = styled('span')({
  fontSize: 14,
  color: foreground,
});

const CheckWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: foreground,
});

// ── Component ─────────────────────────────────────────────────────────────────

export default function MobileSelectModal({
  title,
  options,
  selected,
  onSelect,
  onClose,
  children,
}: MobileSelectModalProps) {
  // Portal to document.body so the sheet escapes the Hero section's
  // stacking context (Hero sets position:relative + zIndex:2, which
  // would otherwise clamp anything rendered inside below the sticky
  // header at zIndex:200 regardless of the modal's own z-index).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll-lock the page body while the sheet is open. Otherwise the
  // whole homepage scrolls behind the overlay when the user pans a
  // large calendar or option list.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    const previous = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previous;
    };
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Overlay */}
      <Overlay onClick={onClose} />

      {/* Bottom sheet */}
      <Sheet>
        {/* Header stays pinned — clicking "✕" is always reachable even
            when the option list or calendar scrolls. */}
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <CloseBtn onClick={onClose} aria-label='Close'>
            ✕
          </CloseBtn>
        </SheetHeader>

        <SheetContent>
          {children !== null && children !== undefined
            ? children
            : options?.map(opt => {
                const isSel = opt.value === selected;
                return (
                  <OptionRow
                    key={opt.value}
                    data-selected={isSel ? 'true' : undefined}
                    onClick={() => {
                      onSelect?.(opt.value);
                      onClose();
                    }}
                  >
                    <OptionLabel>{opt.label}</OptionLabel>
                    {isSel && (
                      <CheckWrap>
                        <CheckIcon />
                      </CheckWrap>
                    )}
                  </OptionRow>
                );
              })}
        </SheetContent>
      </Sheet>
    </>,
    document.body
  );
}
