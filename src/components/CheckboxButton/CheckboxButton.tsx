'use client';

import { styled } from '@pigment-css/react';

import Checkmark from '@/icons/Checkmark';

const Wrapper = styled('span')({
  position: 'relative',
  width: '16px',
  height: '16px',
  display: 'inline-block',
  lineHeight: 0,

  '@media (max-width: 768px)': {
    width: '20px',
    height: '20px',
  },
});

const Input = styled('input')({
  appearance: 'none',
  WebkitAppearance: 'none',
  position: 'absolute',
  inset: 0,
  margin: 0,
  padding: 0,

  border: '1px solid #00000010',
  backgroundColor: '#F3F3F5',
  borderRadius: '4px',
  boxShadow: '0px 1px 2px 0px #0000000D',
  cursor: 'pointer',

  '&:checked': {
    backgroundColor: '#0A0A0A',
  },

  '&:disabled': {
    border: '1px solid #0000000D',
    cursor: 'not-allowed',
  },
});

const Icon = styled(Checkmark)({
  position: 'absolute',
  inset: 0,
  margin: 'auto',
  width: '12px',
  height: '12px',
  color: '#fff',
  pointerEvents: 'none',
  opacity: 0,

  'input:checked + &': {
    opacity: 1,
  },

  '@media (max-width: 768px)': {
    width: '14px',
    height: '14px',
  },
});

type Props = {
  disabled?: boolean;
};

function CheckboxButton({ disabled }: Props) {
  return (
    <Wrapper>
      <Input type='checkbox' disabled={disabled} />
      <Icon />
    </Wrapper>
  );
}

export default CheckboxButton;
