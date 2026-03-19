'use client';

import { styled } from '@pigment-css/react';
import React from 'react';

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

const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  zIndex: 1000,
});

const Sheet = styled('div')({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  background: white,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 24,
  zIndex: 1001,
  maxHeight: '80vh',
  overflowY: 'auto',
});

const SheetHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
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
  return (
    <>
      {/* Overlay */}
      <Overlay onClick={onClose} />

      {/* Bottom sheet */}
      <Sheet>
        {/* Header */}
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <CloseBtn onClick={onClose} aria-label='Close'>
            ✕
          </CloseBtn>
        </SheetHeader>

        {/* Content: custom children (e.g. calendar) or options list */}
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
      </Sheet>
    </>
  );
}
