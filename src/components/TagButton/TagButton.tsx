'use client';

import { styled } from '@pigment-css/react';

import { foreground, slate50, slate100 } from '@/tokens';

const Button = styled('button')<{ size: 'small' | 'default' }>({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: slate50,
  border: `1px solid ${slate100}`,
  borderRadius: '100px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontWeight: 400,
  color: foreground,
  '&:hover': {
    background: slate100,
  },
  variants: [
    {
      props: { size: 'default' },
      style: {
        padding: '10px 16px',
        fontSize: '14px',
        lineHeight: '20px',
      },
    },
    {
      props: { size: 'small' },
      style: {
        padding: '6px 12px',
        fontSize: '13px',
        lineHeight: '18px',
      },
    },
  ],
});

const IconWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const TextWrapper = styled('span')<{ size: 'small' | 'default' }>({
  fontWeight: 400,
  color: foreground,
  variants: [
    {
      props: { size: 'default' },
      style: {
        fontSize: '14px',
        lineHeight: '20px',
      },
    },
    {
      props: { size: 'small' },
      style: {
        fontSize: '13px',
        lineHeight: '18px',
      },
    },
  ],
});

interface TagButtonProps {
  icon?: React.ComponentType;
  text: string;
  size?: 'small' | 'default';
  onClick?: () => void;
}

export default function TagButton({ icon: Icon, text, size = 'default', onClick }: TagButtonProps) {
  return (
    <Button size={size} onClick={onClick}>
      {Icon && (
        <IconWrapper>
          <Icon />
        </IconWrapper>
      )}
      <TextWrapper size={size}>{text}</TextWrapper>
    </Button>
  );
}
