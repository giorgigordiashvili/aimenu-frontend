'use client';

import { styled } from '@pigment-css/react';

import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import InvitePeopleIcon from '@/icons/InvitePeople';
import SuccessIcon from '@/icons/Success';
import { foreground, slate100, slate50, slate500, slate950 } from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  reservationId?: string | null;
  onGoHome: () => void;
  onMyReservations: () => void;
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

const ButtonStack = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '16px',
});

const MyReservationsLink = styled('button')({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  color: slate950,
  padding: 0,
  lineHeight: '20px',
});

const InviteButton = styled('button')({
  width: '100%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 24px',
  border: 'none',
  borderRadius: '50px',
  backgroundColor: '#EC003F',
  color: '#ffffff',
  fontSize: '14px',
  fontFamily: 'Inter',
  fontWeight: 500,
  lineHeight: '20px',
  letterSpacing: '-0.15px',
  cursor: 'pointer',
  '&:hover': { backgroundColor: '#BE123C' },
});

const InviteIconWrap = styled('span')({
  position: 'absolute',
  left: '16px',
  display: 'inline-flex',
  alignItems: 'center',
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingSuccessPanel({ reservationId, onGoHome, onMyReservations }: Props) {
  const t = useTranslations();

  const code = reservationId ? `#${reservationId.slice(0, 7).toUpperCase()}` : null;

  return (
    <Container>
      <IconWrap>
        <SuccessIcon />
      </IconWrap>

      <Title>{t.booking.successTitle}</Title>
      <Description>{t.booking.successDescription}</Description>

      {code && (
        <CodeBox>
          <CodeLabel>{t.booking.bookingCode}</CodeLabel>
          <CodeValue>{code}</CodeValue>
        </CodeBox>
      )}

      <ButtonStack>
        <InviteButton
          type='button'
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: t.booking.successTitle, text: code ?? '' }).catch(() => {});
            }
          }}
        >
          <InviteIconWrap>
            <InvitePeopleIcon />
          </InviteIconWrap>
          {t.booking.inviteFriends}
        </InviteButton>
        <MainButton
          variant='green_cta'
          title={t.booking.returnHome}
          size='large'
          fullWidth
          type='button'
          rounded
          onClick={onGoHome}
        />
      </ButtonStack>

      <MyReservationsLink type='button' onClick={onMyReservations}>
        {t.booking.myReservations}
      </MyReservationsLink>
    </Container>
  );
}
