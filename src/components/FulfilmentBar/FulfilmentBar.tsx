'use client';

import { styled } from '@pigment-css/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import {
  fetchOrderingConfig,
  fetchSlots,
  type DeliveryQuote,
  type OrderingConfig,
} from '@/api/ordering';
import { useCart } from '@/context/CartContext';
import { useFulfilment, type FulfilmentMode } from '@/context/FulfilmentContext';
import { useTranslations } from '@/context/LocaleContext';
import { useTable } from '@/context/TableContext';
import { localePath } from '@/i18n/routing';
import { border, foreground, muted, primary, rose50, white } from '@/tokens';

const AddressPicker = dynamic(() => import('@/components/AddressPicker'), { ssr: false });

const Card = styled('section')({
  border: `1px solid ${border}`,
  borderRadius: 16,
  padding: 14,
  background: white,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  marginBottom: 20,
});
const Chips = styled('div')({ display: 'flex', gap: 8, flexWrap: 'wrap' });
const Chip = styled('button')({
  padding: '8px 14px',
  borderRadius: 999,
  border: `1px solid ${border}`,
  background: white,
  color: foreground,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  '&[data-active="true"]': { background: primary, borderColor: primary, color: white },
});
const Line = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
  color: foreground,
  flexWrap: 'wrap',
});
const Muted = styled('span')({ color: muted, fontSize: 13 });
const Dot = styled('span')<{ tone: 'ok' | 'off' }>({
  width: 8,
  height: 8,
  borderRadius: 4,
  display: 'inline-block',
  variants: [
    { props: { tone: 'ok' }, style: { background: '#16a34a' } },
    { props: { tone: 'off' }, style: { background: '#f59e0b' } },
  ],
});
const Select = styled('select')({
  padding: '8px 10px',
  borderRadius: 10,
  border: `1px solid ${border}`,
  fontSize: 14,
  background: white,
});
const LinkBtn = styled('button')({
  padding: '8px 12px',
  borderRadius: 10,
  border: `1px dashed ${primary}`,
  background: rose50,
  color: primary,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
});
const Cta = styled('button')({
  marginTop: 4,
  padding: '12px 16px',
  borderRadius: 12,
  border: 'none',
  background: primary,
  color: white,
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
});
const Warn = styled('p')({ margin: 0, fontSize: 13, color: '#b45309' });

function hhmm(iso: string | null | undefined, locale: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

function dayList(maxDays: number, t: { today: string; tomorrow: string }, locale: string) {
  const out: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i <= maxDays; i += 1) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const label =
      i === 0
        ? t.today
        : i === 1
          ? t.tomorrow
          : d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
    out.push({ value, label });
  }
  return out;
}

interface Props {
  slug: string;
  locale: string;
}

/**
 * Pickup / delivery chooser on the restaurant page: open-now state, ASAP or a
 * time slot, the delivery address with its fee, and the checkout button.
 * Renders nothing while the restaurant has online ordering switched off.
 */
export default function FulfilmentBar({ slug, locale }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const f = useFulfilment();
  const { tableData } = useTable();
  const { getSubtotal, getTotalItems, restaurantSlug: cartSlug } = useCart();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [day, setDay] = useState<string>('');

  const { data: config } = useSWR<OrderingConfig>(['ordering-config', slug], () =>
    fetchOrderingConfig(slug)
  );
  const atTable =
    !!tableData?.isValidated && tableData.restaurantSlug === slug && !!tableData.sessionId;

  useEffect(() => {
    f.scopeTo(slug);
  }, [slug, f]);

  // Default mode once the config is known.
  useEffect(() => {
    if (!config?.enabled) return;
    if (atTable) {
      if (f.mode !== 'dine_in') f.setMode('dine_in');
      return;
    }
    if (
      f.mode === 'dine_in' ||
      (f.mode === 'pickup' && !config.pickup) ||
      (f.mode === 'delivery' && !config.delivery)
    ) {
      f.setMode(config.pickup ? 'pickup' : config.delivery ? 'delivery' : 'dine_in');
    }
  }, [config, atTable, f]);

  const kind = f.mode === 'delivery' ? 'delivery' : 'takeaway';
  const days = useMemo(
    () => (config ? dayList(config.max_days_ahead, t.ordering, locale) : []),
    [config, t.ordering, locale]
  );
  const { data: slots } = useSWR(
    config?.scheduling && day ? ['ordering-slots', slug, kind, day] : null,
    () => fetchSlots(slug, kind, day)
  );

  if (!config?.enabled || (!config.pickup && !config.delivery)) return null;
  if (atTable) return null;

  const subtotal = getSubtotal();
  const asapAllowed = config.asap && config.open_now && !config.paused;
  const lead = f.mode === 'delivery' ? config.delivery_lead_minutes : config.lead_minutes;
  const minOrder = parseFloat(
    f.mode === 'delivery' ? config.min_order_delivery : config.min_order_pickup
  );
  const zoneMin = quote ? parseFloat(quote.min_order) : 0;
  const effectiveMin = Math.max(minOrder, zoneMin);
  const missing = effectiveMin > 0 && subtotal < effectiveMin ? effectiveMin - subtotal : 0;
  const items = getTotalItems();

  const modes: FulfilmentMode[] = [];
  if (config.pickup) modes.push('pickup');
  if (config.delivery) modes.push('delivery');

  return (
    <Card data-testid='fulfilment-bar'>
      <Chips>
        {modes.map(m => (
          <Chip
            key={m}
            type='button'
            data-active={f.mode === m}
            onClick={() => f.setMode(m)}
            data-testid={`mode-${m}`}
          >
            {m === 'pickup' ? '🛍 ' : '🛵 '}
            {m === 'pickup' ? t.ordering.pickup : t.ordering.delivery}
          </Chip>
        ))}
      </Chips>

      <Line>
        <Dot tone={config.open_now && !config.paused ? 'ok' : 'off'} />
        {config.paused ? (
          <span>
            {config.pause_reason || t.ordering.paused}
            {config.resume_at
              ? ` · ${t.ordering.resumeAt.replace('{time}', hhmm(config.resume_at, locale))}`
              : ''}
          </span>
        ) : config.open_now ? (
          <span>
            {t.ordering.openNow}
            {config.closes_at ? (
              <Muted>
                {' '}
                · {t.ordering.closesAt.replace('{time}', hhmm(config.closes_at, locale))}
              </Muted>
            ) : null}
          </span>
        ) : (
          <span>
            {t.ordering.closedNow}
            {config.next_opening ? (
              <Muted>
                {' · '}
                {t.ordering.opensAt.replace(
                  '{time}',
                  new Date(config.next_opening).toLocaleString(locale, {
                    weekday: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                )}
              </Muted>
            ) : null}
          </span>
        )}
      </Line>

      <Line>
        <Muted>{t.ordering.when}:</Muted>
        {asapAllowed ? (
          <Chip
            type='button'
            data-active={f.scheduledFor === null}
            onClick={() => f.setScheduledFor(null)}
          >
            {t.ordering.asap} <Muted>{t.ordering.asapIn.replace('{minutes}', String(lead))}</Muted>
          </Chip>
        ) : null}
        {config.scheduling ? (
          <>
            <Select
              value={day}
              onChange={e => {
                setDay(e.target.value);
                f.setScheduledFor(null);
              }}
              aria-label={t.ordering.chooseTime}
            >
              <option value=''>{t.ordering.chooseTime}</option>
              {days.map(d => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </Select>
            {day ? (
              slots && slots.length ? (
                <Select
                  value={f.scheduledFor ?? ''}
                  onChange={e => f.setScheduledFor(e.target.value || null)}
                  data-testid='slot-select'
                >
                  <option value=''>--:--</option>
                  {slots.map(s => (
                    <option key={s.time} value={s.time}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <Muted>{t.ordering.noSlots}</Muted>
              )
            ) : null}
          </>
        ) : null}
        {f.scheduledFor ? (
          <Muted>
            {t.ordering.scheduledFor.replace(
              '{time}',
              new Date(f.scheduledFor).toLocaleString(locale, {
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })
            )}
          </Muted>
        ) : null}
      </Line>

      {f.mode === 'delivery' ? (
        <Line>
          <Muted>{t.ordering.where}:</Muted>
          {f.address ? (
            <>
              <span>
                {f.address.text}
                {f.address.apartment
                  ? `, ${t.ordering.apartment.toLowerCase()} ${f.address.apartment}`
                  : ''}
              </span>
              {quote ? (
                <Muted>
                  {' · '}
                  {parseFloat(quote.fee) > 0
                    ? `${t.ordering.deliveryFee} ${parseFloat(quote.fee).toFixed(2)} ₾`
                    : t.ordering.freeDelivery}
                  {' · '}
                  {t.ordering.eta.replace('{minutes}', String(quote.eta_minutes))}
                </Muted>
              ) : null}
              <LinkBtn type='button' onClick={() => setPickerOpen(true)}>
                {t.ordering.changeAddress}
              </LinkBtn>
            </>
          ) : (
            <LinkBtn type='button' onClick={() => setPickerOpen(true)} data-testid='add-address'>
              {t.ordering.addAddress}
            </LinkBtn>
          )}
        </Line>
      ) : null}

      {effectiveMin > 0 ? (
        <Muted>
          {t.ordering.minOrder.replace('{amount}', effectiveMin.toFixed(2))}
          {parseFloat(config.free_delivery_over) > 0 && f.mode === 'delivery'
            ? ` · ${t.ordering.freeOver.replace('{amount}', parseFloat(config.free_delivery_over).toFixed(2))}`
            : ''}
        </Muted>
      ) : null}
      {missing > 0 && items > 0 ? (
        <Warn>
          {t.ordering.minOrderMissing
            .replace('{amount}', missing.toFixed(2))
            .replace('{kind}', f.mode === 'delivery' ? t.ordering.delivery : t.ordering.pickup)}
        </Warn>
      ) : null}
      {!asapAllowed && !f.scheduledFor ? <Warn>{t.ordering.chooseTime}</Warn> : null}

      {items > 0 && cartSlug === slug ? (
        <Cta
          type='button'
          data-testid='fulfilment-checkout'
          onClick={() => router.push(localePath(locale, '/order-review'))}
        >
          {t.reservationWidget.order} · {subtotal.toFixed(2)} ₾
        </Cta>
      ) : null}

      {pickerOpen ? (
        <AddressPicker
          slug={slug}
          config={config}
          subtotal={subtotal}
          initial={f.address}
          locale={locale}
          onClose={() => setPickerOpen(false)}
          onSave={(address, q) => {
            f.setAddress(address);
            setQuote(q);
            setPickerOpen(false);
          }}
        />
      ) : null}
    </Card>
  );
}
