'use client';

import { styled } from '@pigment-css/react';

import Switch from '../Switch/Switch';

const Wrapper = styled('label')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  width: '100%',
  cursor: 'pointer',
});

const Text = styled('span')({
  fontFamily: 'Inter',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '14px',
  letterSpacing: '-0.15px',
  color: '#0A0A0A',

  '@media (max-width: 768px)': {
    fontSize: '16px',
    lineHeight: '16px',
  },
});

type Props = {
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

function SwitchButton({ label, checked, onChange, disabled }: Props) {
  return (
    <Wrapper style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <Text style={{ color: disabled ? '#90A1B9' : '#0A0A0A' }}>{label}</Text>
      <Switch checked={checked} onChange={onChange} disabled={disabled} />
    </Wrapper>
  );
}

export default SwitchButton;
