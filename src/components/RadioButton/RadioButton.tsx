'use client';

import { styled } from '@pigment-css/react';

import Radio from '../Radio/Radio';

const Label = styled('label')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
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
  name: string;
  disabled?: boolean;
};

function RadioButton({ label, name, disabled = false }: Props) {
  return (
    <Label style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <Radio name={name} disabled={disabled} />
      <Text style={{ color: disabled ? '#90A1B9' : '#0A0A0A' }}>{label}</Text>
    </Label>
  );
}

export default RadioButton;
