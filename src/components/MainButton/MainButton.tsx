'use client';

import { styled } from '@pigment-css/react';

type Variant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'rose_cta'
  | 'slate_cta';

type Props = {
  variant?: Variant;
  title?: string;
  size?: 'small' | 'default' | 'large';
  icon?: IconComponent;
  rounded?: boolean;
};

type IconComponent = React.ComponentType;

const DefaultButton = styled('button')<{ variant: Variant; size: 'small' | 'default' | 'large' }>({
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontFamily: 'Inter',
  lineHeight: '20px',
  letterSpacing: '-0.15px',
  fontWeight: 500,

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
        backgroundColor: 'transparent',
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

function MainButton({ title, variant = 'default', size = 'default', icon: Icon, rounded }: Props) {
  return (
    <DefaultButton
      variant={variant}
      size={size}
      style={{
        ...(Icon ? { display: 'flex', alignItems: 'center', gap: 6 } : {}),
        ...(rounded ? { borderRadius: 50 } : {}),
      }}
    >
      {Icon ? (
        <span
          style={{
            width: 16,
            height: 16,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon />
        </span>
      ) : null}

      {title}
    </DefaultButton>
  );
}

export default MainButton;
