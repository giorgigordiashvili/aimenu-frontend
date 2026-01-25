'use client';

import { styled } from '@pigment-css/react';

const Wrapper = styled('label')({
  position: 'relative',
  display: 'inline-block',
  width: '32px',
  height: '18px',
  cursor: 'pointer',

  '@media (max-width: 768px)': {
    width: '40px',
    height: '22px',
  },
});

const Input = styled('input')({
  appearance: 'none',
  WebkitAppearance: 'none',
  position: 'absolute',
  inset: 0,
  margin: 0,
  cursor: 'pointer',
});

const Track = styled('span')({
  position: 'absolute',
  inset: 0,
  backgroundColor: '#CBCED4',
  borderRadius: '100px',
  transition: 'background-color 0.2s ease',

  'input:disabled + &': {
    backgroundColor: '#CBCED480',
  },
});

const Thumb = styled('span')({
  position: 'absolute',
  top: '50%',
  left: '1px',
  transform: 'translateY(-50%)',
  width: '16px',
  height: '16px',
  backgroundColor: '#FFFFFF',
  borderRadius: '100px',
  transition: 'transform 0.2s ease',

  '@media (max-width: 768px)': {
    width: '20px',
    height: '20px',
  },

  'input:checked + span &': {
    transform: 'translate(14px, -50%)',

    '@media (max-width: 768px)': {
      transform: 'translate(18px, -50%)',
    },
  },
});

const CheckedTrack = styled(Track)({
  'input:checked + &': {
    backgroundColor: '#030213',
  },

  'input:checked:disabled + &': {
    backgroundColor: '#CBCED480',
  },
});

type Props = {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

function Switch({ checked, onChange, disabled }: Props) {
  return (
    <Wrapper style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <Input type='checkbox' checked={checked} onChange={onChange} disabled={disabled} />
      <CheckedTrack>
        <Thumb />
      </CheckedTrack>
    </Wrapper>
  );
}

export default Switch;
