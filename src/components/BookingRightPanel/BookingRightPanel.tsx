'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';

import BookingContactForm from '@/components/BookingContactForm/BookingContactForm';
import BookingFailPanel from '@/components/BookingFailPanel/BookingFailPanel';
import BookingSuccessPanel from '@/components/BookingSuccessPanel/BookingSuccessPanel';
import { type PaymentProvider } from '@/components/PaymentProviderPicker';
import PayWithProvider from '@/components/PayWithProvider/PayWithProvider';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import CloseIcon from '@/icons/Close';
import { slate100, slate500, slate600, white } from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  depositAmount?: number;
  grandTotal?: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
  onEmail: (v: string) => void;
  onNotes: (v: string) => void;
  marketingOptIn?: boolean;
  onMarketingOptIn?: (v: boolean) => void;
  isPaymentLoading?: boolean;
  paymentError?: string | null;
  reservationId?: string | null;
  onClose?: () => void;
  onPay: (provider: PaymentProvider) => void;
  step: 'contact' | 'payment' | 'success' | 'fail';
  onStepChange: (step: 'contact' | 'payment') => void;
  bogAvailable: boolean;
  flittAvailable: boolean;
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

const PaymentError = styled('span')({
  fontSize: '13px',
  color: '#B91C1C',
});

const BackLink = styled('button')({
  alignSelf: 'flex-start',
  background: 'none',
  border: 'none',
  padding: '4px 0',
  fontSize: '14px',
  color: slate500,
  cursor: 'pointer',
  textDecoration: 'underline',
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingRightPanel({
  grandTotal,
  name,
  phone,
  email,
  notes,
  onName,
  onPhone,
  onEmail,
  onNotes,
  marketingOptIn,
  onMarketingOptIn,
  isPaymentLoading,
  paymentError,
  reservationId,
  onClose,
  onPay,
  step,
  onStepChange,
  bogAvailable,
  flittAvailable,
}: Props) {
  const t = useTranslations();
  const { locale } = useLocale();
  const router = useRouter();

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
          marketingOptIn={marketingOptIn}
          onMarketingOptIn={onMarketingOptIn}
          showSubmitButton
          onSubmit={() => onStepChange('payment')}
        />
      )}

      {step === 'payment' && (
        <>
          <PayWithProvider
            bogAvailable={bogAvailable}
            flittAvailable={flittAvailable}
            isLoading={isPaymentLoading}
            amountLabel={
              grandTotal !== undefined && grandTotal !== null
                ? `${grandTotal.toFixed(2)} ₾`
                : undefined
            }
            onPay={onPay}
          />
          {paymentError && <PaymentError>{paymentError}</PaymentError>}
          <BackLink type='button' onClick={() => onStepChange('contact')}>
            {t.booking.goBack}
          </BackLink>
        </>
      )}

      {step === 'success' && (
        <BookingSuccessPanel
          reservationId={reservationId}
          onGoHome={() => router.push(localePath(locale))}
          onMyReservations={() => router.push(localePath(locale, '/reservations'))}
        />
      )}

      {step === 'fail' && <BookingFailPanel onGoBack={() => onStepChange('payment')} />}
    </Panel>
  );
}
