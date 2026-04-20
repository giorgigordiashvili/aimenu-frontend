'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

import axiosInstance from '@/api/axios';
import { ordersRetrieve } from '@/api/generated/api';
import type { Order } from '@/api/generated/interfaces';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import { useTable } from '@/context/TableContext';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import { border, foreground, muted, slate50, slate100, slate500, white } from '@/tokens';

const Page = styled('div')({
  minHeight: '100vh',
  background: slate50,
  display: 'flex',
  flexDirection: 'column',
});

const Main = styled('main')({
  flex: 1,
  padding: '24px 20px',
  maxWidth: '720px',
  width: '100%',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: '48px 24px',
  },
});

const Title = styled('h1')({
  fontSize: '24px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 8px',
  lineHeight: 1.2,
  '@media (min-width: 768px)': {
    fontSize: '28px',
  },
});

const OrderNumber = styled('p')({
  fontSize: '14px',
  color: slate500,
  margin: '0 0 24px',
});

const Card = styled('section')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '16px',
  '@media (min-width: 768px)': {
    padding: '24px',
  },
});

const StatusRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
});

const StatusLabel = styled('span')({
  fontSize: '14px',
  color: slate500,
});

const StatusBadge = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: '999px',
  background: slate100,
  color: foreground,
  fontSize: '13px',
  fontWeight: 600,
});

const SectionHeading = styled('h2')({
  fontSize: '16px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 12px',
});

const ItemRow = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '12px 0',
  borderBottom: `1px solid ${border}`,
  '&:last-child': {
    borderBottom: 'none',
  },
});

const ItemName = styled('span')({
  fontSize: '15px',
  fontWeight: 500,
  color: foreground,
});

const ItemMeta = styled('span')({
  fontSize: '13px',
  color: muted,
  display: 'block',
  marginTop: '4px',
});

const ItemPrice = styled('span')({
  fontSize: '15px',
  fontWeight: 600,
  color: foreground,
  whiteSpace: 'nowrap',
});

const TotalRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: `1px solid ${border}`,
});

const TotalLabel = styled('span')({
  fontSize: '15px',
  fontWeight: 600,
  color: foreground,
});

const TotalValue = styled('span')({
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
});

const ErrorMessage = styled('p')({
  fontSize: '14px',
  color: muted,
  textAlign: 'center',
  padding: '40px 20px',
});

const Actions = styled('div')({
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  marginTop: '24px',
});

interface Props {
  locale: Locale;
  orderNumber: string;
}

type StatusKey = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

const STATUS_KEYS: StatusKey[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'completed',
  'cancelled',
];

function resolveStatusKey(raw: unknown): StatusKey {
  const str = typeof raw === 'string' ? raw.toLowerCase() : '';
  return (STATUS_KEYS.find(k => k === str) ?? 'pending') as StatusKey;
}

interface SessionUnpaidSummary {
  payment_mode: string;
  host: string;
  orders_summary?: {
    unpaid_count: number;
    unpaid_total: string;
  };
}

export default function OrderStatusPage({ locale, orderNumber }: Props) {
  const t = getDictionary(locale);
  const router = useRouter();
  const { tableData } = useTable();

  const { data, error, isLoading } = useSWR<Order>(
    ['order', orderNumber],
    async () => (await ordersRetrieve(orderNumber)) as Order,
    {
      refreshInterval: 15_000,
      revalidateOnFocus: true,
    }
  );

  // Only worth fetching when the user is on an active table session — otherwise
  // there's no settle CTA to show anyway.
  const { data: session } = useSWR<SessionUnpaidSummary>(
    tableData?.sessionId ? ['session-settle', tableData.sessionId] : null,
    async () => {
      const res = await axiosInstance.get(`/api/v1/tables/sessions/${tableData!.sessionId}/`);
      const body = res.data as SessionUnpaidSummary | { data: SessionUnpaidSummary };
      return (body as { data?: SessionUnpaidSummary }).data ?? (body as SessionUnpaidSummary);
    }
  );

  if (error) {
    return (
      <Page>
        <HeaderPrimary />
        <Main>
          <ErrorMessage>{t.orders.notFound}</ErrorMessage>
          <Actions>
            <MainButton
              variant='rose_cta'
              title={t.orderReview.backToMenu}
              onClick={() => {
                window.location.href = localePath(locale);
              }}
              rounded
            />
          </Actions>
        </Main>
        <Footer locale={locale} />
      </Page>
    );
  }

  if (isLoading || !data) {
    return (
      <Page>
        <HeaderPrimary />
        <Main>
          <Title>{t.orders.title}</Title>
          <OrderNumber>{t.orders.orderNumber.replace('{number}', orderNumber)}</OrderNumber>
          <Card>
            <StatusRow>
              <StatusLabel>{t.orders.status.pending}</StatusLabel>
            </StatusRow>
          </Card>
        </Main>
        <Footer locale={locale} />
      </Page>
    );
  }

  const statusKey = resolveStatusKey(data.status);
  const total = parseFloat(data.total || '0');
  const orderSuccessCopy = (t as unknown as { orderSuccess?: Record<string, string> }).orderSuccess;
  const showSettleCta =
    !!session &&
    session.payment_mode === 'host_covers' &&
    (session.orders_summary?.unpaid_count ?? 0) > 0 &&
    !!orderSuccessCopy;

  return (
    <Page>
      <HeaderPrimary />
      <Main>
        <Title>{t.orders.title}</Title>
        <OrderNumber>{t.orders.orderNumber.replace('{number}', data.order_number)}</OrderNumber>

        <Card>
          <StatusRow>
            <StatusLabel>{t.orders.placedAt}:</StatusLabel>
            <span>{new Date(data.created_at).toLocaleString(locale)}</span>
          </StatusRow>
          <StatusRow>
            <StatusLabel>{t.orders.title}:</StatusLabel>
            <StatusBadge>{t.orders.status[statusKey]}</StatusBadge>
          </StatusRow>
        </Card>

        <Card>
          <SectionHeading>{t.orders.yourOrder}</SectionHeading>
          {data.items.map(item => (
            <ItemRow key={item.id}>
              <div>
                <ItemName>
                  {item.quantity ?? 1}× {item.item_name}
                </ItemName>
                {item.modifiers.length > 0 && (
                  <ItemMeta>{item.modifiers.map(m => m.modifier_name).join(', ')}</ItemMeta>
                )}
                {item.special_instructions && <ItemMeta>{item.special_instructions}</ItemMeta>}
              </div>
              <ItemPrice>{parseFloat(item.total_price).toFixed(2)} ₾</ItemPrice>
            </ItemRow>
          ))}
          <TotalRow>
            <TotalLabel>{t.orders.total}</TotalLabel>
            <TotalValue>{total.toFixed(2)} ₾</TotalValue>
          </TotalRow>
        </Card>

        {showSettleCta && orderSuccessCopy && (
          <Card>
            <SectionHeading>{orderSuccessCopy.settleCtaTitle}</SectionHeading>
            <ItemMeta>
              {orderSuccessCopy.settleCtaBody
                .replace('{count}', String(session!.orders_summary!.unpaid_count))
                .replace('{total}', parseFloat(session!.orders_summary!.unpaid_total).toFixed(2))}
            </ItemMeta>
            <div style={{ marginTop: 12 }}>
              <MainButton
                variant='rose_cta'
                title={orderSuccessCopy.settleCtaButton}
                onClick={() => router.push(localePath(locale, '/table/settle'))}
                rounded
              />
            </div>
          </Card>
        )}

        <Actions>
          <MainButton
            variant='outline'
            title={t.orderReview.backToMenu}
            onClick={() => {
              window.location.href = localePath(locale);
            }}
            rounded
          />
        </Actions>
      </Main>
      <Footer locale={locale} />
    </Page>
  );
}
