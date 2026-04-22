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
  size?: 'small' | 'default' | 'large' | 'extra_large' | 'extra_small';
  icon?: IconComponent;
  iconGap?: number;
  iconPosition?: 'left' | 'right';
  rounded?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  /**
   * Accessible name — required when the button has only an icon (no
   * `title`). Lighthouse flagged the Favorite/Share/Gallery icon
   * buttons on the restaurant detail page as missing accessible names.
   */
  'aria-label'?: string;
};

type IconComponent = React.ComponentType;

const DefaultButton = styled('button')<{
  variant: Variant;
  size: 'small' | 'default' | 'large' | 'extra_large' | 'extra_small';
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
        transition: 'background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease',
        '&:hover': {
          backgroundColor: '#C6082F',
          transform: 'translateY(-1px)',
          boxShadow: '0 8px 20px rgba(236, 0, 63, 0.28)',
        },
        '&:active': {
          transform: 'translateY(0)',
          backgroundColor: '#A60427',
          boxShadow: '0 2px 6px rgba(236, 0, 63, 0.24)',
        },
      },
    },
    {
      props: { variant: 'slate_cta' },
      style: {
        backgroundColor: '#0F172B',
        color: '#ffffff',
        transition: 'background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease',
        '&:hover': {
          // Brighter indigo-slate on hover so the button reads as
          // responsive even against a dark card footer. The subtle lift
          // + soft shadow mirrors the rose CTA so primary/secondary
          // actions share a consistent motion language.
          backgroundColor: '#1F2A44',
          transform: 'translateY(-1px)',
          boxShadow: '0 8px 20px rgba(15, 23, 43, 0.28)',
        },
        '&:active': {
          transform: 'translateY(0)',
          backgroundColor: '#0A1020',
          boxShadow: '0 2px 6px rgba(15, 23, 43, 0.24)',
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
    {
      props: { size: 'extra_large' },
      style: {
        padding: '16px',
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
  'aria-label': ariaLabel,
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
      aria-label={ariaLabel}
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
