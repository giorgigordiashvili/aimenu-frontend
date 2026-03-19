'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';

import { Locale } from '@/i18n/config';
import * as tokens from '@/tokens';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface PasswordResetProps {
  locale: Locale;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const Page = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  background: tokens.white,
  '@media (max-width: 768px)': {
    padding: '16px',
    alignItems: 'flex-start',
    paddingTop: '48px',
  },
});

export const Card = styled('div')({
  width: '100%',
  maxWidth: '440px',
  background: tokens.white,
  borderRadius: tokens.radiusMd,
  boxShadow: tokens.shadowMd,
  padding: '40px 32px',
  '@media (max-width: 768px)': {
    padding: '32px 24px',
    boxShadow: 'none',
    borderRadius: 0,
  },
});

export const BackLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '14px',
  fontWeight: 500,
  color: tokens.muted,
  textDecoration: 'none',
  marginBottom: '16px',
  '&:hover': {
    color: tokens.foreground,
  },
});

export const Header = styled('div')({
  textAlign: 'center',
  marginBottom: '32px',
});

export const Title = styled('h1')({
  fontSize: '24px',
  fontWeight: 700,
  color: tokens.foreground,
  margin: '0 0 8px',
  '@media (max-width: 768px)': {
    fontSize: '20px',
  },
});

export const Subtitle = styled('p')({
  fontSize: '14px',
  color: tokens.muted,
  margin: 0,
  lineHeight: '20px',
});

export const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const Field = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

export const ResponsiveButton = styled('div')({
  '& button': {
    justifyContent: 'center',
  },
  '@media (max-width: 768px)': {
    '& button': {
      padding: '10px 24px',
    },
  },
});

export const Footer = styled('p')({
  textAlign: 'center',
  fontSize: '14px',
  color: tokens.muted,
  margin: '24px 0 0',
  '& a': {
    color: tokens.primary,
    fontWeight: 600,
    textDecoration: 'none',
  },
  '& a:hover': {
    textDecoration: 'underline',
  },
});

export const AlertBox = styled('div')({
  background: `${tokens.red600}0D`,
  color: tokens.red600,
  padding: '12px 16px',
  borderRadius: tokens.radiusSm,
  fontSize: '14px',
  lineHeight: '20px',
});

export const SuccessBox = styled('div')({
  background: `${tokens.green600}0D`,
  color: tokens.green600,
  padding: '12px 16px',
  borderRadius: tokens.radiusSm,
  fontSize: '14px',
  lineHeight: '20px',
});

export const SuccessIcon = styled('div')({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: `${tokens.green600}1A`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  '& svg': {
    width: '32px',
    height: '32px',
    color: tokens.green600,
  },
});
