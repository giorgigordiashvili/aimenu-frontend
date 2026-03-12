import { styled } from '@pigment-css/react';

import { border, foreground, rose600, slate50, slate500 } from '@/tokens';

// ─── Styled Components ────────────────────────────────────────────────────────

export const PriceSummary = styled('div')({
  backgroundColor: slate50,
  borderRadius: '12px',
  padding: '16px',
});

export const PriceRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const PriceDivider = styled('div')({
  height: '1px',
  backgroundColor: border,
  margin: '12px 0',
});

export const PriceLabel = styled('span')<{ bold?: boolean }>({
  variants: [
    {
      props: { bold: true },
      style: { fontSize: '16px', fontWeight: 700, color: foreground },
    },
    {
      props: { bold: false },
      style: { fontSize: '14px', fontWeight: 400, color: slate500 },
    },
  ],
});

export const PriceValue = styled('span')<{ highlight?: boolean }>({
  variants: [
    {
      props: { highlight: true },
      style: { fontSize: '24px', fontWeight: 700, color: rose600 },
    },
    {
      props: { highlight: false },
      style: { fontSize: '14px', fontWeight: 400, color: slate500 },
    },
  ],
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface PriceSummarySectionProps {
  depositLabel: string;
  totalLabel: string;
  itemsLabel: string;
  depositAmount: number;
  cartTotal: number;
  itemCount: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PriceSummarySection({
  depositLabel,
  totalLabel,
  itemsLabel,
  depositAmount,
  cartTotal,
  itemCount,
}: PriceSummarySectionProps) {
  return (
    <PriceSummary>
      {itemCount > 0 && (
        <PriceRow>
          <PriceLabel bold={false}>
            {itemsLabel} ({itemCount})
          </PriceLabel>
          <PriceValue highlight={false}>{cartTotal.toFixed(2)} ₾</PriceValue>
        </PriceRow>
      )}
      <PriceRow>
        <PriceLabel bold={false}>{depositLabel}</PriceLabel>
        <PriceValue highlight={false}>{depositAmount.toFixed(2)} ₾</PriceValue>
      </PriceRow>
      <PriceDivider />
      <PriceRow>
        <PriceLabel bold={true}>{totalLabel}</PriceLabel>
        <PriceValue highlight={true}>{(cartTotal + depositAmount).toFixed(2)} ₾</PriceValue>
      </PriceRow>
    </PriceSummary>
  );
}
