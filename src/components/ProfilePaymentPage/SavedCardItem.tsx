'use client';

import { styled } from '@pigment-css/react';

import type { PaymentMethod } from '@/api/generated/interfaces';
import { useTranslations } from '@/context/LocaleContext';
import {
  border,
  foreground,
  muted,
  radiusMd,
  radiusSm,
  red600,
  rose50,
  rose600,
  slate100,
  slate500,
  slate900,
  white,
} from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const CardRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
});

const BrandBadge = styled('div')<{ brand: string }>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '32px',
  borderRadius: radiusSm,
  border: `1px solid ${border}`,
  background: white,
  flexShrink: 0,
  overflow: 'hidden',
});

const CardInfo = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const CardNumber = styled('span')({
  fontSize: '15px',
  fontWeight: 600,
  color: slate900,
  letterSpacing: '0.02em',
});

const CardExpiry = styled('span')({
  fontSize: '12px',
  color: muted,
  fontWeight: 400,
});

const DeleteBtn = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: slate500,
  borderRadius: radiusSm,
  flexShrink: 0,
  transition: 'background 0.15s, color 0.15s',
  '&:hover': {
    background: rose50,
    color: rose600,
  },
});

const ConfirmInline = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
});

const ConfirmText = styled('span')({
  fontSize: '13px',
  color: slate500,
  flexShrink: 0,
});

const ConfirmBtn = styled('button')({
  padding: '5px 12px',
  fontSize: '13px',
  fontWeight: 500,
  borderRadius: radiusSm,
  cursor: 'pointer',
  border: `1px solid ${red600}`,
  background: red600,
  color: white,
  transition: 'opacity 0.15s',
  '&:hover': {
    opacity: 0.85,
  },
});

const CancelBtn = styled('button')({
  padding: '5px 12px',
  fontSize: '13px',
  fontWeight: 500,
  borderRadius: radiusSm,
  cursor: 'pointer',
  border: `1px solid ${border}`,
  background: white,
  color: foreground,
  transition: 'background 0.15s',
  '&:hover': {
    background: slate100,
  },
});

// ─── Brand logo helpers ─────────────────────────────────────────────────────────

function VisaLogo() {
  return (
    <svg width='38' height='12' viewBox='0 0 38 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <text
        x='50%'
        y='10'
        textAnchor='middle'
        fontFamily='Arial, sans-serif'
        fontWeight='bold'
        fontSize='12'
        fill='#1A1F71'
        letterSpacing='-0.5'
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg width='32' height='20' viewBox='0 0 32 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='12' cy='10' r='10' fill='#EB001B' />
      <circle cx='20' cy='10' r='10' fill='#F79E1B' />
      <path d='M16 3.3a10 10 0 0 1 0 13.4A10 10 0 0 1 16 3.3z' fill='#FF5F00' />
    </svg>
  );
}

function GenericCardLogo({ brand: _brand }: { brand: string }) {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect x='1' y='4' width='18' height='12' rx='2' stroke='currentColor' strokeWidth='1.5' />
      <path d='M1 8h18' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  );
}

function CardBrandLogo({ brand }: { brand: string }) {
  const lower = brand.toLowerCase();
  if (lower === 'visa') return <VisaLogo />;
  if (lower === 'mastercard') return <MastercardLogo />;
  return <GenericCardLogo brand={brand} />;
}

// ─── Trash icon ───────────────────────────────────────────────────────────────

function TrashIcon() {
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
        d='M6.5 2.5h3M2 4h12M10.667 4l-.46 6.903c-.069 1.036-.104 1.554-.328 1.947a2 2 0 0 1-.864.81C8.677 14 8.157 14 7.117 14H8.88c-1.04 0-1.56 0-1.898-.34a2 2 0 0 1-.864-.81C5.894 12.457 5.86 11.939 5.79 10.903L5.333 4m2 2.5v4m1.333-4v4'
        stroke='currentColor'
        strokeWidth='1.333'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface SavedCardItemProps {
  card: PaymentMethod;
  confirmDeleteId: string | null;
  onDeleteClick: (id: string) => void;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
}

export default function SavedCardItem({
  card,
  confirmDeleteId,
  onDeleteClick,
  onConfirmDelete,
  onCancelDelete,
}: SavedCardItemProps) {
  const t = useTranslations();

  const expMonth = String(card.card_exp_month).padStart(2, '0');
  const expYear = String(card.card_exp_year).slice(-2);
  const maskedNumber = `${card.card_last4.slice(0, 0) || ''}•••• •••• •••• ${card.card_last4}`;

  const isConfirming = confirmDeleteId === card.id;

  return (
    <CardRow>
      <BrandBadge brand={card.card_brand}>
        <CardBrandLogo brand={card.card_brand} />
      </BrandBadge>

      <CardInfo>
        <CardNumber>{maskedNumber}</CardNumber>
        <CardExpiry>
          {t.payment.expires}: {expMonth}/{expYear}
        </CardExpiry>
      </CardInfo>

      {isConfirming ? (
        <ConfirmInline>
          <ConfirmText>{t.payment.deleteConfirm}</ConfirmText>
          <ConfirmBtn onClick={() => onConfirmDelete(card.id)}>{t.payment.deleteCard}</ConfirmBtn>
          <CancelBtn onClick={onCancelDelete}>{t.common.close}</CancelBtn>
        </ConfirmInline>
      ) : (
        <DeleteBtn
          aria-label={t.payment.deleteCard}
          onClick={() => onDeleteClick(card.id)}
          title={t.payment.deleteCard}
        >
          <TrashIcon />
        </DeleteBtn>
      )}
    </CardRow>
  );
}
