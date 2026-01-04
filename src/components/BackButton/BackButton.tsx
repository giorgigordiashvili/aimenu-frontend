'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';

const StyledBackButton = styled('button')({
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ffffff',
  border: '0.873px solid #f1f5f9',
  borderRadius: '120px',
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
  color: '#0f172a',
  flexShrink: 0,
  cursor: 'pointer',
  '&:hover': {
    background: '#f1f5f9',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
});

interface BackButtonProps {
  onClick?: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <StyledBackButton onClick={handleClick} aria-label="Go back">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.5 15L7.5 10L12.5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </StyledBackButton>
  );
}
