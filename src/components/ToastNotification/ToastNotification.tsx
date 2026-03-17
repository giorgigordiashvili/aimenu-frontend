'use client';

import { styled } from '@pigment-css/react';

import type { ToastVariant } from '@/hooks/useToast';
import { blue500, green700, primary, white } from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const Wrapper = styled('div')<{ variant: ToastVariant }>({
  position: 'fixed',
  top: '24px',
  right: '24px',
  zIndex: 9999,
  width: '400px',
  maxWidth: 'calc(100vw - 48px)',
  padding: '16px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
  variants: [
    { props: { variant: 'success' }, style: { background: green700 } },
    { props: { variant: 'error' }, style: { background: primary } },
    { props: { variant: 'info' }, style: { background: blue500 } },
  ],
});

const IconCircle = styled('div')({
  width: '20px',
  height: '20px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '1px',
});

const TextBlock = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
});

const Title = styled('span')({
  fontSize: '14px',
  fontWeight: 700,
  color: white,
  lineHeight: '20px',
});

const CloseBtn = styled('button')({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  marginTop: '1px',
});

// ─── Icons (inline, 20px, white) ─────────────────────────────────────────────

const CheckIcon = () => (
  <svg width={20} height={20} viewBox='0 0 20 20' fill='none'>
    <circle cx={10} cy={10} r={9} stroke='white' strokeWidth={1.5} />
    <path
      d='M6 10l3 3 5-5'
      stroke='white'
      strokeWidth={1.8}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const XIcon = () => (
  <svg width={20} height={20} viewBox='0 0 20 20' fill='none'>
    <path d='M5 5l10 10M15 5L5 15' stroke='white' strokeWidth={1.8} strokeLinecap='round' />
  </svg>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface ToastNotificationProps {
  message: string;
  variant: ToastVariant;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ToastNotification({ message, variant, onClose }: ToastNotificationProps) {
  return (
    <Wrapper variant={variant}>
      <IconCircle>{variant === 'success' ? <CheckIcon /> : variant === 'info' ? <CheckIcon /> : <XIcon />}</IconCircle>

      <TextBlock>
        <Title>{message}</Title>
      </TextBlock>

      <CloseBtn onClick={onClose} aria-label='Close'>
        <XIcon />
      </CloseBtn>
    </Wrapper>
  );
}
