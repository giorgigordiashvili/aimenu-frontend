'use client';

import { styled } from '@pigment-css/react';

import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import CheckmarkIcon from '@/icons/Checkmark';
import EditIcon from '@/icons/Edit';
import OrderIcon from '@/icons/Order';
import {
  background,
  border,
  foreground,
  green50,
  green600,
  primary,
  rose50,
  slate25,
  slate100,
  slate200,
  slate500,
  white,
} from '@/tokens';

function EditButtonIcon() {
  return <EditIcon />;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderItem = {
  id: string;
  quantity: number;
  name: string;
  price: number;
  notes?: string[];
};

type Props = {
  items: OrderItem[];
  depositAmount: number;
};

// ─── Styled components ────────────────────────────────────────────────────────

const Section = styled('div')({
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
  color: slate500,
  '& svg': { width: '18px', height: '18px' },
});

const OrderCard = styled('div')({
  border: `1px solid ${border}`,
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.06)',
  backgroundColor: white,
});

const OrderItemRow = styled('div')({
  padding: '12px 14px',
  borderBottom: `1px solid ${slate100}`,
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  '&:last-child': { borderBottom: 'none' },
});

const QuantityBadge = styled('span')({
  backgroundColor: rose50,
  color: primary,
  fontSize: '12px',
  fontWeight: 700,
  borderRadius: '6px',
  padding: '2px 7px',
  flexShrink: 0,
  lineHeight: '18px',
  letterSpacing: '-0.1px',
});

const OrderItemContent = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
});

const OrderItemName = styled('span')({
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  lineHeight: '20px',
});

const OrderItemNote = styled('span')({
  fontSize: '12px',
  color: slate500,
  lineHeight: '17px',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  '&::before': { content: '"•"', flexShrink: 0 },
});

const OrderItemRight = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
});

const OrderItemPrice = styled('span')({
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  lineHeight: '20px',
  whiteSpace: 'nowrap',
});

const OrderSubtotalRow = styled('div')({
  padding: '12px 14px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: `1px solid ${border}`,
  backgroundColor: slate25,
});

const SubtotalLabel = styled('span')({
  fontSize: '13px',
  fontWeight: 400,
  color: slate500,
  lineHeight: '18px',
});

const SubtotalValue = styled('span')({
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  lineHeight: '20px',
});

const PaymentSection = styled('div')({
  padding: '20px',
  backgroundColor: background,
  '@media (min-width: 768px)': {
    padding: '24px',
  },
});

const PaymentRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '12px',
  borderBottom: `1px solid ${border}`,
  marginBottom: '12px',
});

const PaymentLabel = styled('span')({
  fontSize: '14px',
  fontWeight: 400,
  color: slate500,
  lineHeight: '20px',
});

const PaymentValue = styled('span')({
  fontSize: '14px',
  fontWeight: 400,
  color: foreground,
  lineHeight: '20px',
});

const TotalRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '14px',
});

const TotalLabel = styled('span')({
  fontSize: '16px',
  fontWeight: 600,
  color: foreground,
  lineHeight: '24px',
});

const TotalValue = styled('span')({
  fontSize: '18px',
  fontWeight: 700,
  color: primary,
  lineHeight: '24px',
});

const SecureBadge = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: green50,
  border: `1px solid ${slate200}`,
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '13px',
  fontWeight: 500,
  color: green600,
  lineHeight: '18px',
});

const CheckIconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: green600,
  '& svg': { width: '16px', height: '16px' },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingOrderSummary({ items, depositAmount }: Props) {
  const t = useTranslations();
  const foodTotal = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionIconWrap>
            <OrderIcon />
          </SectionIconWrap>
          <SectionTitle>{t.booking.order}</SectionTitle>
        </SectionHeader>

        <OrderCard>
          {items.map(item => (
            <OrderItemRow key={item.id}>
              <QuantityBadge>{item.quantity}x</QuantityBadge>
              <OrderItemContent>
                <OrderItemName>{item.name}</OrderItemName>
                {item.notes?.map((note, i) => (
                  <OrderItemNote key={i}>{note}</OrderItemNote>
                ))}
              </OrderItemContent>
              <OrderItemRight>
                <OrderItemPrice>{item.price.toFixed(2)} ₾</OrderItemPrice>
                <MainButton size='extra_small' variant='outline' icon={EditButtonIcon} />
              </OrderItemRight>
            </OrderItemRow>
          ))}
          <OrderSubtotalRow>
            <SubtotalLabel>{t.booking.foodTotal}</SubtotalLabel>
            <SubtotalValue>{foodTotal.toFixed(2)} ₾</SubtotalValue>
          </OrderSubtotalRow>
        </OrderCard>
      </Section>

      <PaymentSection>
        <PaymentRow>
          <PaymentLabel>{t.booking.bookingDeposit}</PaymentLabel>
          <PaymentValue>{depositAmount.toFixed(2)} ₾</PaymentValue>
        </PaymentRow>
        <TotalRow>
          <TotalLabel>{t.booking.grandTotal}</TotalLabel>
          <TotalValue>{depositAmount.toFixed(2)} ₾</TotalValue>
        </TotalRow>
        <SecureBadge>
          <CheckIconWrap>
            <CheckmarkIcon />
          </CheckIconWrap>
          {t.booking.securePayment}
        </SecureBadge>
      </PaymentSection>
    </>
  );
}
