'use client';

import { styled } from '@pigment-css/react';

type Variant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'rose cta'
  | 'slate cta';

type IconName = 'heart' | 'search' | 'calendar';

type Props = {
  variant?: Variant;
  title?: string;
  size?: 'small' | 'default' | 'large';
  icon?: IconName;
};

const ICON_CONFIG: Record<IconName, { src: string; defaultVariant: Variant; rounded?: boolean }> = {
  heart: {
    src: '/images/heart.png',
    defaultVariant: 'default',
  },
  search: {
    src: '/images/search.png',
    defaultVariant: 'outline',
  },
  calendar: {
    src: '/images/calendar.png',
    defaultVariant: 'rose cta',
    rounded: true,
  },
};

const IconImg = styled("img")({
  width: 16,
  height: 16,
  display: 'block',
});

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
      },
    },
    {
      props: { variant: 'destructive' },
      style: {
        backgroundColor: '#D4183D',
        color: '#ffffff',
      },
    },
    {
      props: { variant: 'outline' },
      style: {
        backgroundColor: 'transparent',
        color: '#0A0A0A',
        border: '1px solid #0000001A',
      },
    },
    {
      props: { variant: 'secondary' },
      style: {
        backgroundColor: '#ECEEF2',
        color: '#030213',
      },
    },
    {
      props: { variant: 'ghost' },
      style: {
        backgroundColor: 'transparent',
        color: '#0A0A0A',
      },
    },
    {
      props: { variant: 'rose cta' },
      style: {
        backgroundColor: '#EC003F',
        color: '#ffffff',
      },
    },
    {
      props: { variant: 'slate cta' },
      style: {
        backgroundColor: '#0F172B',
        color: '#ffffff',
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

function MainButton({ title, variant, size = 'default', icon }: Props) {
  const iconCfg = icon ? ICON_CONFIG[icon] : null;

  const finalVariant: Variant = variant ?? iconCfg?.defaultVariant ?? 'default';

  return (
    <DefaultButton
      variant={finalVariant}
      size={size}
      style={{
        ...(icon ? { display: 'flex', alignItems: 'center', gap: 6 } : {}),
        ...(iconCfg?.rounded ? { borderRadius: 50 } : {}),
      }}
    >
      {iconCfg ? <IconImg src={iconCfg.src} alt={icon} /> : null}
      {title}
    </DefaultButton>
  );
}


export default MainButton;
