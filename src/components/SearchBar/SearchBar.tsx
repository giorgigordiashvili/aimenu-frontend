'use client';

import { styled } from '@pigment-css/react';

const SearchBarWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '0 14px',
  height: '44px',
  background: '#ffffff',
  border: '0.873px solid #e2e8f0',
  borderRadius: '14px',
  width: '100%',
});

const SearchIcon = styled('svg')({
  flexShrink: 0,
  color: '#9c9c9c',
});

const Input = styled('input')({
  flex: 1,
  fontSize: '12px',
  color: '#0f172a',
  background: 'transparent',
  letterSpacing: '-0.15px',
  border: 'none',
  outline: 'none',
  '&::placeholder': {
    color: '#9c9c9c',
  },
});

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBar({
  placeholder = 'მოძებნე კერძი სახელით',
  value = '',
  onChange,
}: SearchBarProps) {
  return (
    <SearchBarWrapper>
      <SearchIcon width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 14L10.5 10.5M12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </SearchIcon>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
      />
    </SearchBarWrapper>
  );
}
