'use client';

import { styled } from '@pigment-css/react';

import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import FailIcon from '@/icons/Fail';
import { foreground, slate100, slate50, slate500 } from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  reservationId?: string | null;
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

const CodeBox = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: slate50,
  border: `1px solid ${slate100}`,
  borderRadius: '14px',
  padding: '14px 16px',
  marginBottom: '24px',
});

const CodeLabel = styled('span')({
  fontSize: '14px',
  color: slate500,
  lineHeight: '20px',
});

const CodeValue = styled('span')({
  fontSize: '14px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '20px',
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingFailPanel({ reservationId, onGoBack }: Props) {
  const t = useTranslations();

  const code = reservationId ? `#${reservationId.slice(0, 7).toUpperCase()}` : null;

  return (
    <Container>
      <IconWrap>
        <FailIcon />
      </IconWrap>

      <Title>{t.booking.failTitle}</Title>
      <Description>{t.booking.failDescription}</Description>

      {code && (
        <CodeBox>
          <CodeLabel>{t.booking.bookingCode}</CodeLabel>
          <CodeValue>{code}</CodeValue>
        </CodeBox>
      )}

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
