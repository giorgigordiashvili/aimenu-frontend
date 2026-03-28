import { styled } from '@pigment-css/react';
import React from 'react';

import CheckIcon from '@/icons/Check';
import { foreground, scrollIndicator, shadowCard, slate150, slate200, white } from '@/tokens';

export const DropdownList = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 16px)',
  left: 0,
  right: 0,
  zIndex: 300,
  backgroundColor: white,
  border: `1px solid ${slate200}`,
  borderRadius: '12px',
  boxShadow: shadowCard,
  maxHeight: '220px',
  overflowY: 'auto',
  clipPath: 'inset(0 round 12px)',
  userSelect: 'none',
  scrollbarColor: `${scrollIndicator} transparent`,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: scrollIndicator,
  },
});

export const DropdownRow = styled('div')<{ isSelected?: boolean; isLast?: boolean }>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '40px',
  padding: '0 20px',
  borderBottom: `1px solid ${slate200}`,
  cursor: 'pointer',
  transition: 'background-color 0.1s ease',
  '&:hover': { backgroundColor: slate150 },

  variants: [
    {
      props: { isLast: true },
      style: { borderBottom: 'none' },
    },
    {
      props: { isSelected: true },
      style: {
        backgroundColor: slate150,
      },
    },
  ],
});

export const DropdownRowText = styled('span')<{ isSelected?: boolean }>({
  fontSize: '15px',
  variants: [
    {
      props: { isSelected: true },
      style: { color: foreground, fontWeight: 700 },
    },
    {
      props: { isSelected: false },
      style: { color: foreground, fontWeight: 400 },
    },
  ],
});

const CheckMarkWrap = styled('span')({
  color: foreground,
  display: 'flex',
  alignItems: 'center',
});

export function CheckMark() {
  return (
    <CheckMarkWrap>
      <CheckIcon />
    </CheckMarkWrap>
  );
}
