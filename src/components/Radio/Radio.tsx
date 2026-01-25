'use client';

import { styled } from '@pigment-css/react';

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
  border: 'none',
  backgroundColor: '#FFFFFF',
  borderRadius: '50%',
  boxShadow: '0px 1px 2px 0px #0000000D',
  cursor: 'pointer',

  '&:disabled': {
    cursor: 'not-allowed',
    borderColor: '#0000000D',
  },
});

const Dot = styled('span')({
  position: 'absolute',
  inset: 0,
  margin: 'auto',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#030213',
  pointerEvents: 'none',
  opacity: 0,

  'input:checked + &': {
    opacity: 1,
  },

  '@media (max-width: 768px)': {
    width: '10px',
    height: '10px',
  },
});

type Props = {
  name?: string;
  disabled?: boolean;
};

function Radio({ name, disabled }: Props) {
  return (
    <Wrapper>
      <Input type='radio' name={name} disabled={disabled} />
      <Dot />
    </Wrapper>
  );
}

export default Radio;
