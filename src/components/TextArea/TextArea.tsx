'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

const Text = styled('p')({
  fontSize: '14px',
  fontFamily: 'Inter',
  lineHeight: '17px',
  letterSpacing: '-0.15px',
  fontWeight: 500,
  color: '#0A0A0A',
  margin: '0 0 8px 0',
});

const ErrorText = styled('p')({
  fontSize: '12px',
  fontFamily: 'Inter',
  lineHeight: '14px',
  marginTop: '6px',
  color: '#E7000B',
});

const StyledTextArea = styled('textarea')({
  fontSize: '14px',
  fontFamily: 'Inter',
  lineHeight: '17px',
  letterSpacing: '-0.15px',
  fontWeight: 400,
  border: '1px solid transparent',
  color: '#717182',
  borderRadius: '8px',
  padding: '10px 12px',
  backgroundColor: '#F3F3F5',
  outline: 'none',
  width: '100%',
  resize: 'vertical',
  minHeight: '96px',

  '@media (max-width: 768px)': {
    padding: '15px 12px',
  },

  '&::placeholder': {
    color: '#717182',
  },

  '&:focus': {
    border: '1px solid #A1A1A1',
    boxShadow: '0 0 0 3px #a1a1a180',
  },

  '&:disabled': {
    color: '#B8B8C1',
    backgroundColor: '#F3F3F5',
    borderColor: '#F3F3F5',
    cursor: 'not-allowed',
    WebkitTextFillColor: '#B8B8C1',
    opacity: 1,
  },

  '&[data-error="true"]': {
    border: '1px solid #E7000B',
  },
});

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  errorMessage?: string;
};

function TextArea({ label, errorMessage, ...props }: TextAreaProps) {
  const [isError, setIsError] = useState(false);

  return (
    <>
      {label && <Text>{label}</Text>}

      <StyledTextArea
        {...props}
        data-error={isError ? 'true' : undefined}
        aria-invalid={isError}
        onBlur={e => {
          setIsError(!e.currentTarget.checkValidity());
        }}
      />

      {isError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </>
  );
}

export default TextArea;
