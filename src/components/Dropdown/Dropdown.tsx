'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useRef, useState, ReactNode } from 'react';

import Checkmark from '@/icons/Checkmark';
import DropdownArrow from '@/icons/DropdownArrow';

const Text = styled('p')({
  fontSize: '14px',
  fontFamily: 'Inter',
  lineHeight: '17px',
  letterSpacing: '-0.15px',
  fontWeight: 500,
  color: '#0A0A0A',
  margin: '0 0 8px 0',
});

const DropdownWrapper = styled('div')({
  position: 'relative',
  width: '100%',
});

const DropdownButton = styled('button')({
  background: '#F3F3F5',
  borderRadius: '8px',
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: '14px',
  fontFamily: 'Inter',
  lineHeight: '17px',
  letterSpacing: '-0.15px',
  fontWeight: 400,
  color: '#0A0A0A',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid transparent',

  '&:hover:not(:disabled)': {
    border: '1px solid #A1A1A1',
    boxShadow: '0 0 0 3px #a1a1a180',
  },

  '&:disabled': {
    cursor: 'not-allowed',
    color: '#848484',
    opacity: 1,
  },

  '&:disabled svg': {
    opacity: 0.6,
  },
});

const LeftContent = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const LeftIconWrapper = styled('span')({
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,

  '& svg': {
    width: '16px',
    height: '16px',
  },
});

const ArrowWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  transition: 'transform 0.2s ease',
});

const DropdownList = styled('ul')({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  background: '#FFFFFF',
  zIndex: 1000,
  margin: '4px 0 0 0',
  padding: 4,
  listStyle: 'none',
  borderRadius: '8px',
  border: '1px solid #E0E0E5',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

const DropdownItem = styled('li')({
  padding: '10px 12px',
  fontSize: '14px',
  fontFamily: 'Inter',
  lineHeight: '17px',
  letterSpacing: '-0.15px',
  borderRadius: '6px',
  fontWeight: 400,
  color: '#0A0A0A',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  '&:hover': {
    background: '#F3F3F5',
  },
});

const CheckmarkWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',

  '& svg': {
    width: '16px',
    height: '16px',
  },
});

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  label?: string;
  placeholder?: string;
  value?: string | null;
  onChange?: (value: string) => void;
  options: Option[];
  icon?: ReactNode;
  disabled?: boolean;
};

function Dropdown({
  label,
  placeholder = 'Select option',
  value,
  onChange,
  options,
  icon,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <>
      {label && <Text>{label}</Text>}

      <DropdownWrapper ref={wrapperRef}>
        <DropdownButton
          type='button'
          disabled={disabled}
          aria-disabled={disabled}
          aria-expanded={isOpen}
          onClick={() => {
            if (disabled) return;
            setIsOpen(prev => !prev);
          }}
        >
          <LeftContent>
            {icon && <LeftIconWrapper>{icon}</LeftIconWrapper>}
            <span>{selectedOption?.label ?? placeholder}</span>
          </LeftContent>

          <ArrowWrapper style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <DropdownArrow />
          </ArrowWrapper>
        </DropdownButton>

        {isOpen && !disabled && (
          <DropdownList>
            {options.map(option => (
              <DropdownItem
                key={option.value}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <CheckmarkWrapper>
                    <Checkmark />
                  </CheckmarkWrapper>
                )}
              </DropdownItem>
            ))}
          </DropdownList>
        )}
      </DropdownWrapper>
    </>
  );
}

export default Dropdown;
