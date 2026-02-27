'use client';

import { styled, keyframes } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import BookingOrderSummary from '@/components/BookingOrderSummary';
import BookingRestaurantCard from '@/components/BookingRestaurantCard/BookingRestaurantCard';
import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import { useReservationDetail } from '@/hooks/useReservations';
import CalendarIcon from '@/icons/Calendar';
import CloseIcon from '@/icons/Close';
import DeleteIcon from '@/icons/Delete';
import PeopleIcon from '@/icons/People';
import { MOCK_DEPOSIT, MOCK_ORDER_ITEMS } from '@/mocks/reservations';
import {
  background,
  border,
  foreground,
  red600,
  shadowMd,
  slate100,
  slate400,
  slate600,
  white,
} from '@/tokens';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

// ─── Styled components ─────────────────────────────────────────────────────────

const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 200,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  '@media (min-width: 768px)': {
    alignItems: 'center',
  },
});

const ModalContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '12px',
  width: '100%',
  '@media (min-width: 768px)': {
    width: 'auto',
  },
});

const CloseButton = styled('button')({
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: `1px solid rgba(255, 255, 255, 0.5)`,
    backgroundColor: white,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      backgroundColor: slate100,
    },
  },
});

const Sheet = styled('div')({
  width: '100%',
  backgroundColor: background,
  borderRadius: '16px 16px 0 0',
  height: '70vh',
  overflowY: 'auto',
  boxShadow: shadowMd,
  '@media (min-width: 768px)': {
    width: '512px',
    flex: 'none',
    borderRadius: '16px',
    height: 'auto',
    maxHeight: '95vh',
  },
});

const Divider = styled('div')({
  height: '1px',
  backgroundColor: border,
});

const ReservationSection = styled('div')({
  padding: '20px',
  backgroundColor: background,
  '@media (min-width: 768px)': {
    padding: '24px',
  },
});

const SectionHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
});

const SectionTitle = styled('h2')({
  fontSize: '16px',
  fontWeight: 600,
  color: foreground,
  margin: 0,
  letterSpacing: '-0.15px',
});

const SectionIconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: slate400,
  '& svg': { width: '18px', height: '18px' },
});

const DateTimeRow = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  marginBottom: '10px',
});

const FieldBox = styled('div')({
  border: `1px solid ${border}`,
  borderRadius: '12px',
  padding: '12px 14px',
  backgroundColor: white,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.06)',
});

const FieldLabel = styled('span')({
  fontSize: '11px',
  fontWeight: 500,
  color: slate600,
  letterSpacing: '0.2px',
  lineHeight: '14px',
  textTransform: 'uppercase',
});

const FieldValue = styled('span')({
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  lineHeight: '20px',
});

const GuestsBox = styled('div')({
  border: `1px solid ${border}`,
  borderRadius: '12px',
  padding: '12px 14px',
  backgroundColor: white,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.06)',
});

const Footer = styled('div')({
  padding: '16px 20px 24px',
  backgroundColor: background,
});

// ─── Cancel card (inline on desktop, overlay on mobile) ────────────────────────

/* On mobile: bottom-sheet overlay (slides up from bottom).
   On desktop: static flex item to the right of Sheet with 90px gap. */
const CancelCardWrap = styled('div')({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  zIndex: 310,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  '@media (min-width: 768px)': {
    position: 'static',
    backgroundColor: 'transparent',
    zIndex: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    /* flex gap is 12px, so 78px margin = 90px total gap from Sheet */
    marginLeft: '78px',
    flexShrink: 0,
  },
});

const CancelCard = styled('div')({
  width: '100%',
  backgroundColor: white,
  borderRadius: '16px 16px 0 0',
  padding: '24px 20px 32px',
  boxShadow: shadowMd,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  '@media (min-width: 768px)': {
    width: '393px',
    borderRadius: '16px',
    padding: '24px 20px',
    maxHeight: '85vh',
    overflowY: 'auto',
  },
});

const CancelQuestion = styled('p')({
  fontFamily: 'Inter',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  color: foreground,
  margin: 0,
  textAlign: 'center',
});

const CancelButtonRow = styled('div')({
  display: 'flex',
  gap: '12px',
  width: '100%',
});

const CancelErrorText = styled('p')({
  fontSize: '13px',
  color: red600,
  margin: 0,
  lineHeight: '18px',
  textAlign: 'center',
});

// ─── Skeleton ──────────────────────────────────────────────────────────────────

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
});

const SkeletonBase = styled('div')({
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  borderRadius: '8px',
  animation: `${shimmer} 1.5s infinite`,
});

const SkeletonWrapper = styled('div')({
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const SkeletonSm = styled(SkeletonBase)({ height: '80px' });
const SkeletonMd = styled(SkeletonBase)({ height: '120px' });
const SkeletonLg = styled(SkeletonBase)({ height: '200px' });

function DetailSkeleton() {
  return (
    <SkeletonWrapper>
      <SkeletonSm />
      <SkeletonMd />
      <SkeletonLg />
    </SkeletonWrapper>
  );
}

const GuestsContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

// ─── Component ─────────────────────────────────────────────────────────────────

export interface ReservationDetailModalProps {
  reservationId: string | null;
  onClose: () => void;
  onConfirmCancel: (id: string) => Promise<void>;
  restaurantName?: string;
  restaurantImage?: string;
  restaurantSubtitle?: string;
  restaurantRating?: number;
}

export default function ReservationDetailModal({
  reservationId,
  onClose,
  onConfirmCancel,
  restaurantName,
  restaurantImage,
  restaurantSubtitle,
  restaurantRating,
}: ReservationDetailModalProps) {
  const t = useTranslations();
  const { reservation, isLoading } = useReservationDetail(reservationId);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (!reservationId) {
      setShowCancel(false);
      setCancelError(null);
    }
  }, [reservationId]);

  if (!reservationId) return null;

  const orderItems = MOCK_ORDER_ITEMS[reservationId] ?? [];

  const handleCancelConfirm = async () => {
    if (!reservation) return;
    setCancelLoading(true);
    setCancelError(null);
    try {
      await onConfirmCancel(reservation.id);
      setShowCancel(false);
      onClose();
    } catch {
      setCancelError(t.reservations.errorCancelling);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        {/* ── Detail sheet ───────────────────────────────────── */}
        <Sheet>
          <BookingRestaurantCard
            name={restaurantName}
            subtitle={restaurantSubtitle}
            rating={restaurantRating}
            image={restaurantImage}
          />

          {isLoading || !reservation ? (
            <DetailSkeleton />
          ) : (
            <>
              <Divider />

              {/* ── Date / Time / Guests ──────────────────────── */}
              <ReservationSection>
                <SectionHeader>
                  <SectionIconWrap>
                    <CalendarIcon />
                  </SectionIconWrap>
                  <SectionTitle>{t.booking.yourReservation}</SectionTitle>
                </SectionHeader>

                <DateTimeRow>
                  <FieldBox>
                    <FieldLabel>{t.booking.date}</FieldLabel>
                    <FieldValue>{formatDate(reservation.reservation_date)}</FieldValue>
                  </FieldBox>
                  <FieldBox>
                    <FieldLabel>{t.booking.time}</FieldLabel>
                    <FieldValue>{formatTime(reservation.reservation_time)}</FieldValue>
                  </FieldBox>
                </DateTimeRow>

                <GuestsBox>
                  <SectionIconWrap>
                    <PeopleIcon />
                  </SectionIconWrap>
                  <GuestsContent>
                    <FieldLabel>{t.booking.guests}</FieldLabel>
                    <FieldValue>
                      {reservation.party_size} {t.booking.persons}
                    </FieldValue>
                  </GuestsContent>
                </GuestsBox>
              </ReservationSection>

              <Divider />

              {/* ── Order summary ─────────────────────────────── */}
              <BookingOrderSummary items={orderItems} depositAmount={MOCK_DEPOSIT} />

              {/* ── Cancel button (hidden while cancel card is open) ── */}
              {reservation.can_cancel && !showCancel && (
                <Footer>
                  <MainButton
                    title={t.reservations.cancelReservation}
                    variant='green_cta'
                    fullWidth
                    onClick={() => setShowCancel(true)}
                  />
                </Footer>
              )}
            </>
          )}
        </Sheet>

        {/* ── Cancel confirmation card ────────────────────────── */}
        {showCancel && (
          <CancelCardWrap onClick={() => setShowCancel(false)}>
            <CancelCard onClick={e => e.stopPropagation()}>
              <DeleteIcon />
              <CancelQuestion>{t.reservations.cancelConfirmTitle}</CancelQuestion>
              {cancelError && <CancelErrorText>{cancelError}</CancelErrorText>}
              <CancelButtonRow>
                <MainButton
                  title={t.reservations.cancelBack}
                  variant='secondary'
                  size='large'
                  fullWidth
                  disabled={cancelLoading}
                  onClick={() => setShowCancel(false)}
                />
                <MainButton
                  title={t.reservations.cancelConfirm}
                  variant='rose_cta'
                  size='large'
                  fullWidth
                  disabled={cancelLoading}
                  onClick={handleCancelConfirm}
                />
              </CancelButtonRow>
            </CancelCard>
          </CancelCardWrap>
        )}

        {/* ── Close button (hidden while cancel card is open) ──── */}
        {!showCancel && (
          <CloseButton onClick={onClose} aria-label={t.common.close}>
            <CloseIcon />
          </CloseButton>
        )}
      </ModalContainer>
    </Overlay>
  );
}
