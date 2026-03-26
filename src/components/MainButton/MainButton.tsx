'use client';

import { styled } from '@pigment-css/react';

import { green500, lime600, white } from '@/tokens';

type Variant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'rose_cta'
  | 'slate_cta'
  | 'green_cta';

type Props = {
  variant?: Variant;
  title?: string;
  size?: 'small' | 'default' | 'large' | 'extra_small';
  icon?: IconComponent;
  iconGap?: number;
  iconPosition?: 'left' | 'right';
  rounded?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

type IconComponent = React.ComponentType;

const DefaultButton = styled('button')<{
  variant: Variant;
  size: 'small' | 'default' | 'large' | 'extra_small';
}>({
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontFamily: 'Inter',
  lineHeight: '20px',
  letterSpacing: '-0.15px',
  fontWeight: 500,
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  variants: [
    {
      props: { variant: 'default' },
      style: {
        backgroundColor: '#030213',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#030213E6',
        },
      },
    },
    {
      props: { variant: 'destructive' },
      style: {
        backgroundColor: '#D4183D',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#D4183DE6',
        },
      },
    },
    {
      props: { variant: 'outline' },
      style: {
        backgroundColor: white,
        color: '#0A0A0A',
        border: '1px solid #0000001A',
        '&:hover': {
          backgroundColor: '#e9ebef',
        },
      },
    },
    {
      props: { variant: 'secondary' },
      style: {
        backgroundColor: '#ECEEF2',
        color: '#030213',
        '&:hover': {
          backgroundColor: '#ECEEF2CC',
        },
      },
    },
    {
      props: { variant: 'ghost' },
      style: {
        backgroundColor: 'transparent',
        color: '#0A0A0A',
        '&:hover': {
          backgroundColor: '#e9ebef',
        },
      },
    },
    {
      props: { variant: 'rose_cta' },
      style: {
        backgroundColor: '#EC003F',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#BE123C',
        },
      },
    },
    {
      props: { variant: 'slate_cta' },
      style: {
        backgroundColor: '#0F172B',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#1E293B',
        },
      },
    },
    {
      props: { variant: 'green_cta' },
      style: {
        backgroundColor: green500,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: lime600,
        },
      },
    },
    {
      props: { size: 'extra_small' },
      style: {
        padding: '2px 4px',
        fontSize: '12px',
        fontFamily: 'Inter',
        lineHeight: '16px',
        letterSpacing: '0',
        fontWeight: 400,
      },
    },
    {
      props: { size: 'small' },
      style: {
        padding: '6px 12px',
      },
    },
    {
      props: { size: 'large' },
      style: {
        padding: '10px 24px',
      },
    },
  ],
});

function MainButton({
  title,
  variant = 'default',
  size = 'default',
  icon: Icon,
  iconGap = 6,
  iconPosition = 'left',
  rounded,
  fullWidth,
  disabled,
  type = 'button',
  onClick,
}: Props) {
  const iconEl = Icon ? (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon />
    </span>
  ) : null;

  return (
    <DefaultButton
      variant={variant}
      size={size}
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...(Icon
          ? { display: 'flex', alignItems: 'center', gap: iconGap, justifyContent: 'center' }
          : {}),
        ...(rounded ? { borderRadius: 50 } : {}),
        ...(fullWidth ? { width: '100%' } : {}),
      }}
    >
      {iconPosition === 'left' ? iconEl : null}
      {title}
      {iconPosition === 'right' ? iconEl : null}
    </DefaultButton>
  );
}

export default MainButton;
