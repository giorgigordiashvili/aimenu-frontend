import { styled } from '@pigment-css/react';

import { foreground, shadowCard, slate100, slate200, white } from '@/tokens';

export const DropdownList = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  right: 0,
  zIndex: 300,
  backgroundColor: white,
  border: `1px solid ${slate200}`,
  borderRadius: '12px',
  boxShadow: shadowCard,
  maxHeight: '220px',
  overflowY: 'auto',
  userSelect: 'none',
});

export const DropdownRow = styled('div')<{ isSelected?: boolean; isLast?: boolean }>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '48px',
  padding: '0 16px',
  borderBottom: `1px solid ${slate200}`,
  cursor: 'pointer',
  transition: 'background-color 0.1s ease',
  '&:hover': { backgroundColor: slate100 },

  variants: [
    {
      props: { isLast: true },
      style: { borderBottom: 'none' },
    },
    {
      props: { isSelected: true },
      style: {
        backgroundColor: slate100,
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

export const CheckMark = styled('span')({
  color: foreground,
  fontSize: '15px',
  fontWeight: 700,
});
