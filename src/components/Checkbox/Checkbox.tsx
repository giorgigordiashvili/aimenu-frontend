'use client';

import { styled } from '@pigment-css/react';

import CheckboxButton from '../CheckboxButton/CheckboxButton';

const Label = styled('label')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',

  '@media (max-width: 768px)': {
    gap: '12px',
  },
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
  disabled?: boolean;
};

function CheckboxWithText({ label, disabled = false }: Props) {
  return (
    <Label style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <CheckboxButton disabled={disabled} />
      <Text style={{ color: disabled ? '#90A1B9' : '#0A0A0A' }}>{label}</Text>
    </Label>
  );
}

export default CheckboxWithText;
