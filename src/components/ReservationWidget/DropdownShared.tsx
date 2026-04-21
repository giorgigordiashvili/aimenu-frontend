import { keyframes, styled } from '@pigment-css/react';
import React from 'react';

import CheckIcon from '@/icons/Check';
import { foreground, rose50, rose600, slate100, slate200, white } from '@/tokens';

// Subtle slide-down + fade so the dropdown doesn't just pop into place.
const dropIn = keyframes({
  from: { opacity: 0, transform: 'translateY(-6px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const DropdownList = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 12px)',
  left: 0,
  right: 0,
  // Raised above the rest of the page reliably; matches the z-index of the
  // restaurant detail lightbox so these never sit behind modal content.
  zIndex: 300,
  backgroundColor: white,
  border: `1px solid ${slate200}`,
  borderRadius: '14px',
  boxShadow: '0 20px 40px -16px rgba(15, 23, 43, 0.2), 0 4px 12px -6px rgba(15, 23, 43, 0.08)',
  maxHeight: '260px',
  overflowY: 'auto',
  padding: '4px',
  userSelect: 'none',
  animation: `${dropIn} 0.14s ease-out`,
  // Nicer scrollbar on WebKit so the thin scrollbar doesn't fight the rounded
  // corners of the popover.
  '&::-webkit-scrollbar': { width: '6px' },
  '&::-webkit-scrollbar-thumb': { background: slate200, borderRadius: '4px' },
});

export const DropdownRow = styled('div')<{ isSelected?: boolean; isLast?: boolean }>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '44px',
  padding: '0 14px',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background-color 0.1s ease',
  outline: 'none',
  '&:hover': { backgroundColor: slate100 },
  '&:focus-visible': {
    backgroundColor: slate100,
    boxShadow: `inset 0 0 0 2px ${rose600}`,
  },

  variants: [
    // `isLast` used to suppress a border-bottom; no longer needed with the
    // new padded-popover design but the prop stays for API compatibility.
    { props: { isLast: true }, style: {} },
    {
      props: { isSelected: true },
      style: {
        backgroundColor: rose50,
        '&:hover': { backgroundColor: rose50 },
      },
    },
  ],
});

export const DropdownRowText = styled('span')<{ isSelected?: boolean }>({
  fontSize: '15px',
  variants: [
    {
      props: { isSelected: true },
      style: { color: rose600, fontWeight: 700 },
    },
    {
      props: { isSelected: false },
      style: { color: foreground, fontWeight: 500 },
    },
  ],
});

const CheckMarkWrap = styled('span')({
  color: rose600,
  display: 'flex',
  alignItems: 'center',
});

export function CheckMark() {
  return (
    <CheckMarkWrap aria-hidden='true'>
      <CheckIcon />
    </CheckMarkWrap>
  );
}
