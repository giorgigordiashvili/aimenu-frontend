'use client';

import { styled } from '@pigment-css/react';

import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import FailIcon from '@/icons/Fail';
import { foreground, slate500 } from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  onGoBack: () => void;
};

// ─── Styled components ────────────────────────────────────────────────────────

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  paddingTop: '8px',
});

const IconWrap = styled('div')({
  marginBottom: '20px',
  lineHeight: 0,
});

const Title = styled('h2')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 12px 0',
  letterSpacing: '-0.3px',
  lineHeight: '30px',
});

const Description = styled('p')({
  fontSize: '14px',
  fontWeight: 400,
  color: slate500,
  margin: '0 0 24px 0',
  lineHeight: '22px',
  maxWidth: '320px',
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingFailPanel({ onGoBack }: Props) {
  const t = useTranslations();

  return (
    <Container>
      <IconWrap>
        <FailIcon />
      </IconWrap>

      <Title>{t.booking.failTitle}</Title>
      <Description>{t.booking.failDescription}</Description>

      <MainButton
        variant='green_cta'
        title={t.booking.goBack}
        size='large'
        fullWidth
        type='button'
        rounded
        onClick={onGoBack}
      />
    </Container>
  );
}
