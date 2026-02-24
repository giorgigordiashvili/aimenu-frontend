'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import BookingContactForm from '@/components/BookingContactForm/BookingContactForm';
import BookingFailPanel from '@/components/BookingFailPanel/BookingFailPanel';
import BookingPaymentForm from '@/components/BookingPaymentForm/BookingPaymentForm';
import BookingSuccessPanel from '@/components/BookingSuccessPanel/BookingSuccessPanel';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import CloseIcon from '@/icons/Close';
import { slate100, slate600, white } from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  depositAmount: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
  onEmail: (v: string) => void;
  onNotes: (v: string) => void;
  isPaymentLoading?: boolean;
  paymentError?: string | null;
  reservationId?: string | null;
  onClose?: () => void;
  onPay: () => void;
};

// ─── Styled components ────────────────────────────────────────────────────────

const Panel = styled('div')({
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: white,
    padding: '32px',
    position: 'sticky',
    top: 0,
    minHeight: '100vh',
    alignSelf: 'start',
  },
});

const CloseRow = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: '24px',
});

const CloseButton = styled('button')({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: slate600,
  borderRadius: '6px',
  '&:hover': {
    backgroundColor: slate100,
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingRightPanel({
  depositAmount,
  name,
  phone,
  email,
  notes,
  onName,
  onPhone,
  onEmail,
  onNotes,
  isPaymentLoading,
  paymentError,
  reservationId,
  onClose,
  onPay,
}: Props) {
  const t = useTranslations();
  const { locale } = useLocale();
  const [step, setStep] = useState<'contact' | 'payment' | 'success' | 'fail'>('contact');

  // Transition to success/fail based on API result
  useEffect(() => {
    if (reservationId) setStep('success');
  }, [reservationId]);

  useEffect(() => {
    if (paymentError) setStep('fail');
  }, [paymentError]);

  return (
    <Panel>
      <CloseRow>
        <CloseButton type='button' onClick={onClose} aria-label={t.booking.close}>
          <CloseIcon />
        </CloseButton>
      </CloseRow>

      {step === 'contact' && (
        <BookingContactForm
          name={name}
          phone={phone}
          email={email}
          notes={notes}
          onName={onName}
          onPhone={onPhone}
          onEmail={onEmail}
          onNotes={onNotes}
          showSubmitButton
          onSubmit={() => setStep('payment')}
        />
      )}

      {step === 'payment' && (
        <BookingPaymentForm
          depositAmount={depositAmount}
          savedCard={{ last4: '4488', brand: 'Mastercard' }}
          isLoading={isPaymentLoading}
          error={paymentError}
          onBack={() => setStep('contact')}
          onPay={onPay}
        />
      )}

      {step === 'success' && (
        <BookingSuccessPanel
          reservationId={reservationId}
          onGoHome={() => (window.location.href = `/${locale}`)}
          onMyReservations={() => (window.location.href = `/${locale}/reservations`)}
        />
      )}

      {step === 'fail' && (
        <BookingFailPanel reservationId={reservationId} onGoBack={() => setStep('payment')} />
      )}
    </Panel>
  );
}
