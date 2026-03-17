'use client';

import { styled } from '@pigment-css/react';
import { useCallback, useEffect, useState } from 'react';

import { paymentsMethodsDestroy, paymentsMethodsList } from '@/api/generated/api';
import type { PaymentMethod } from '@/api/generated/interfaces';
import ToastNotification from '@/components/ToastNotification';
import { useTranslations } from '@/context/LocaleContext';
import { useToast } from '@/hooks/useToast';
import { border, foreground, green500, muted, radiusMd, slate100, slate900, white } from '@/tokens';

import SavedCardItem from './SavedCardItem';

// ─── Styled ────────────────────────────────────────────────────────────────────

const PageInner = styled('div')({
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 16px 60px',
  '@media (min-width: 768px)': {
    padding: '0 0 60px',
  },
});

const Card = styled('div')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '28px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const CardHeader = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const CardTitle = styled('h2')({
  fontSize: '18px',
  fontWeight: 700,
  color: slate900,
  margin: 0,
});

const CardSubtitle = styled('p')({
  fontSize: '14px',
  color: muted,
  margin: 0,
});

const CardList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const EmptyState = styled('p')({
  fontSize: '14px',
  color: muted,
  textAlign: 'center',
  padding: '24px 0',
  margin: 0,
});

const AddCardBtn = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  padding: '14px 16px',
  fontSize: '14px',
  fontWeight: 500,
  color: muted,
  background: 'transparent',
  border: `1.5px dashed ${border}`,
  borderRadius: radiusMd,
  cursor: 'pointer',
  transition: 'border-color 0.15s, color 0.15s, background 0.15s',
  '&:hover': {
    borderColor: foreground,
    color: foreground,
    background: slate100,
  },
});

const Divider = styled('div')({
  height: '1px',
  background: border,
  margin: '4px 0',
});

const SecuritySection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  paddingTop: '4px',
});

const SecurityHeadingRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const GreenDot = styled('span')({
  display: 'inline-block',
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: green500,
  flexShrink: 0,
});

const SecurityTitle = styled('span')({
  fontSize: '15px',
  fontWeight: 700,
  color: slate900,
});

const SecurityNote = styled('p')({
  fontSize: '13px',
  color: muted,
  margin: 0,
  lineHeight: 1.55,
});

// ─── Plus icon ─────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      <path
        d='M8 3.333v9.334M3.333 8h9.334'
        stroke='currentColor'
        strokeWidth='1.333'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProfilePaymentPage() {
  const t = useTranslations();
  const { toast, showToast, hideToast } = useToast();

  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadCards = useCallback(async () => {
    try {
      const data = await paymentsMethodsList();
      setCards(data.results ?? []);
    } catch {
      // silently fail on initial load
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await paymentsMethodsDestroy(id);
      setConfirmDeleteId(null);
      await loadCards();
      showToast(t.payment.deleteSuccess, 'success');
    } catch {
      showToast(t.payment.deleteError, 'error');
    }
  };

  return (
    <PageInner>
      <Card>
        <CardHeader>
          <CardTitle>{t.payment.savedCards}</CardTitle>
          <CardSubtitle>{t.payment.savedCardsSubtitle}</CardSubtitle>
        </CardHeader>

        <CardList>
          {cards.length === 0 ? (
            <EmptyState>{t.payment.noCards}</EmptyState>
          ) : (
            cards.map(card => (
              <SavedCardItem
                key={card.id}
                card={card}
                confirmDeleteId={confirmDeleteId}
                onDeleteClick={handleDeleteClick}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCancelDelete}
              />
            ))
          )}
        </CardList>

        <AddCardBtn type='button'>
          <PlusIcon />
          {t.payment.addNewCard}
        </AddCardBtn>

        <Divider />

        <SecuritySection>
          <SecurityHeadingRow>
            <GreenDot />
            <SecurityTitle>{t.payment.securePayments}</SecurityTitle>
          </SecurityHeadingRow>
          <SecurityNote>{t.payment.secureNote}</SecurityNote>
        </SecuritySection>
      </Card>

      {toast && (
        <ToastNotification message={toast.message} variant={toast.variant} onClose={hideToast} />
      )}
    </PageInner>
  );
}
