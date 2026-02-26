'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import DeleteIcon from '@/icons/Delete';
import { foreground, red600, shadowMd, white } from '@/tokens';

// ─── Styled components ─────────────────────────────────────────────────────────

const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  zIndex: 300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Dialog = styled('div')({
  width: '393px',
  maxWidth: 'calc(100% - 32px)',
  backgroundColor: white,
  borderRadius: '16px',
  padding: '24px 20px',
  boxShadow: shadowMd,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
});

const IconWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Question = styled('p')({
  fontFamily: 'Inter',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  color: foreground,
  margin: 0,
  textAlign: 'center',
});

const ButtonRow = styled('div')({
  display: 'flex',
  gap: '12px',
  width: '100%',
});

const ErrorText = styled('p')({
  fontSize: '13px',
  color: red600,
  margin: 0,
  lineHeight: '18px',
  textAlign: 'center',
});

// ─── Component ─────────────────────────────────────────────────────────────────

interface ReservationCancelDialogProps {
  reservationId: string | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function ReservationCancelDialog({
  reservationId,
  onClose,
  onConfirm,
}: ReservationCancelDialogProps) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!reservationId) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onConfirm(reservationId);
    } catch {
      setError(t.reservations.errorCancelling);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={e => e.stopPropagation()}>
        <IconWrap>
          <DeleteIcon />
        </IconWrap>

        <Question>{t.reservations.cancelConfirmTitle}</Question>

        {error && <ErrorText>{error}</ErrorText>}

        <ButtonRow>
          <MainButton
            title={t.reservations.cancelBack}
            variant='secondary'
            size='large'
            fullWidth
            disabled={isLoading}
            onClick={onClose}
          />
          <MainButton
            title={t.reservations.cancelConfirm}
            variant='rose_cta'
            size='large'
            fullWidth
            disabled={isLoading}
            onClick={handleConfirm}
          />
        </ButtonRow>
      </Dialog>
    </Overlay>
  );
}
