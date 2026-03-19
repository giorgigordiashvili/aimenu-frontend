'use client';

import { styled } from '@pigment-css/react';
import { useState, useRef } from 'react';

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

const InputWrapper = styled('div')({
  position: 'relative',
  width: '100%',
});

const LeftIconWrapper = styled('div')({
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'none',
  color: '#90A1B9',

  '& svg': {
    width: '16px',
    height: '16px',
  },

  '@media (max-width: 768px)': {
    '& svg': {
      width: '20px',
      height: '20px',
    },
  },
});

const RightIconButton = styled('button')({
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  color: '#90A1B9',

  '& svg': {
    width: '16px',
    height: '16px',
    pointerEvents: 'none',
  },

  '@media (max-width: 768px)': {
    '& svg': {
      width: '20px',
      height: '20px',
    },
  },
});

const StyledInput = styled('input')({
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

  '@media (max-width: 768px)': {
    paddingBlock: '15px',
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

  '&::-webkit-calendar-picker-indicator': {
    opacity: 0,
    position: 'absolute',
    right: '12px',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
});

type IconComponent = React.ComponentType<{ open?: boolean }>;

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  errorMessage?: string;
  icon?: IconComponent;
  onIconClick?: () => void;
};

function TextInput({
  label = 'Text Input Component',
  errorMessage,
  type = 'text',
  icon: Icon,
  onIconClick,
  ...props
}: TextInputProps) {
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPassword = type === 'password';
  const isLocation = type === 'location';
  const isDate = type === 'date';
  const isTime = type === 'time';

  return (
    <>
      {label && <Text>{label}</Text>}

      <InputWrapper>
        {Icon && !isPassword && !isLocation && !isDate && !isTime && (
          <LeftIconWrapper>
            <Icon />
          </LeftIconWrapper>
        )}

        <StyledInput
          {...props}
          ref={inputRef}
          type={isPassword && showPassword ? 'text' : type}
          data-error={isError ? 'true' : undefined}
          aria-invalid={isError}
          style={{
            paddingLeft:
              Icon && !isPassword && !isLocation && !isDate && !isTime ? '40px' : undefined,
            paddingRight: isPassword || isLocation || isDate || isTime ? '40px' : undefined,
          }}
          onBlur={e => {
            setIsError(!e.currentTarget.checkValidity());
          }}
        />

        {(isLocation || isDate || isTime) && Icon && (
          <RightIconButton
            type='button'
            onClick={() => {
              if ((isDate || isTime) && inputRef.current?.showPicker) {
                inputRef.current.showPicker();
              } else {
                onIconClick?.();
              }
            }}
            aria-label={isDate ? 'Open date picker' : isTime ? 'Open time picker' : 'Icon action'}
          >
            <Icon />
          </RightIconButton>
        )}

        {isPassword && Icon && (
          <RightIconButton
            type='button'
            onClick={() => setShowPassword(prev => !prev)}
            aria-label='Toggle password visibility'
          >
            <Icon open={!showPassword} />
          </RightIconButton>
        )}
      </InputWrapper>

      {isError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </>
  );
}

export default TextInput;
