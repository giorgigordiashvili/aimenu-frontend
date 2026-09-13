'use client';

import 'leaflet/dist/leaflet.css';

import { styled } from '@pigment-css/react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import {
  quoteDelivery,
  orderingError,
  type DeliveryQuote,
  type OrderingConfig,
} from '@/api/ordering';
import type { DeliveryAddress } from '@/context/FulfilmentContext';
import { useTranslations } from '@/context/LocaleContext';
import { border, foreground, muted, primary, radiusSm, white } from '@/tokens';

const Backdrop = styled('div')({
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 43, 0.55)',
  zIndex: 400,
});

const Panel = styled('div')({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  maxHeight: '92vh',
  overflowY: 'auto',
  background: white,
  borderRadius: '20px 20px 0 0',
  padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))',
  zIndex: 401,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  '@media (min-width: 768px)': {
    left: '50%',
    right: 'auto',
    top: '50%',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: 560,
    borderRadius: 20,
    maxHeight: '90vh',
  },
});

const Title = styled('h3')({ margin: 0, fontSize: 18, fontWeight: 700, color: foreground });
const Hint = styled('p')({ margin: 0, fontSize: 13, color: muted });
const MapBox = styled('div')({
  height: 260,
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${border}`,
  '@media (min-width: 768px)': { height: 300 },
});
const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
});
const Input = styled('input')({
  width: '100%',
  padding: '10px 12px',
  borderRadius: radiusSm,
  border: `1px solid ${border}`,
  fontSize: 15,
  boxSizing: 'border-box',
});
const Full = styled('div')({ gridColumn: '1 / -1' });
const Row = styled('div')({ display: 'flex', gap: 8, alignItems: 'center' });
const Btn = styled('button')({
  padding: '12px 16px',
  borderRadius: 12,
  border: `1px solid ${primary}`,
  background: primary,
  color: white,
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  flex: 1,
  '&:disabled': { opacity: 0.5, cursor: 'default' },
});
const Ghost = styled('button')({
  padding: '12px 16px',
  borderRadius: 12,
  border: `1px solid ${border}`,
  background: white,
  color: foreground,
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
});
const Small = styled('button')({
  padding: '6px 10px',
  borderRadius: 999,
  border: `1px solid ${border}`,
  background: white,
  color: foreground,
  fontSize: 13,
  cursor: 'pointer',
});
const Note = styled('p')<{ tone: 'ok' | 'error' }>({
  margin: 0,
  fontSize: 14,
  fontWeight: 600,
  variants: [
    { props: { tone: 'ok' }, style: { color: '#15803d' } },
    { props: { tone: 'error' }, style: { color: '#b91c1c' } },
  ],
});

interface Props {
  slug: string;
  config: OrderingConfig;
  subtotal: number;
  initial: DeliveryAddress | null;
  locale: string;
  onSave: (address: DeliveryAddress, quote: DeliveryQuote) => void;
  onClose: () => void;
}

const DEFAULT_CENTER = { lat: 41.7151, lng: 44.8271 };

async function reverseGeocode(lat: number, lng: number, locale: string): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=${locale}`
    );
    if (!res.ok) return '';
    const data = (await res.json()) as { address?: Record<string, string>; display_name?: string };
    const a = data.address ?? {};
    const street = a.road || a.pedestrian || a.footway || '';
    const house = a.house_number || '';
    const line = [street, house].filter(Boolean).join(' ');
    return line || (data.display_name ?? '').split(',').slice(0, 2).join(',');
  } catch {
    return '';
  }
}

/** Drag a pin to the door, fill in entrance / floor / apartment, get the delivery fee live. */
export default function AddressPicker({
  slug,
  config,
  subtotal,
  initial,
  locale,
  onSave,
  onClose,
}: Props) {
  const t = useTranslations();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(
    initial ? { lat: initial.lat, lng: initial.lng } : null
  );
  const [text, setText] = useState(initial?.text ?? '');
  const [building, setBuilding] = useState(initial?.building ?? '');
  const [entrance, setEntrance] = useState(initial?.entrance ?? '');
  const [floor, setFloor] = useState(initial?.floor ?? '');
  const [apartment, setApartment] = useState(initial?.apartment ?? '');
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [error, setError] = useState<string>('');
  const [checking, setChecking] = useState(false);

  // Map bootstrap (client only).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapRef.current || mapInstance.current) return;
      const center = pos ?? config.restaurant_location ?? DEFAULT_CENTER;
      const map = L.map(mapRef.current, { zoomControl: true }).setView(
        [center.lat, center.lng],
        14
      );
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);
      if (config.restaurant_location) {
        L.circleMarker([config.restaurant_location.lat, config.restaurant_location.lng], {
          radius: 7,
          color: '#0f172b',
          fillColor: '#0f172b',
          fillOpacity: 1,
        }).addTo(map);
        for (const z of config.zones) {
          if (z.kind === 'polygon' && z.polygon.length >= 3) {
            L.polygon(z.polygon as [number, number][], {
              color: z.color || '#2563eb',
              weight: 1,
              fillOpacity: 0.06,
            }).addTo(map);
          } else if (z.kind === 'radius') {
            L.circle([config.restaurant_location.lat, config.restaurant_location.lng], {
              radius: z.radius_km * 1000,
              color: z.color || '#2563eb',
              weight: 1,
              fillOpacity: 0.04,
            }).addTo(map);
          }
        }
      }
      const icon = L.divIcon({
        className: '',
        html: '<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:#EC003F;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 22],
      });
      const start = pos ?? center;
      const marker = L.marker([start.lat, start.lng], { draggable: true, icon }).addTo(map);
      marker.on('dragend', () => {
        const p = marker.getLatLng();
        setPos({ lat: p.lat, lng: p.lng });
      });
      map.on('click', e => {
        marker.setLatLng(e.latlng);
        setPos({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
      mapInstance.current = map;
      markerRef.current = marker;
      if (!pos) setPos({ lat: start.lat, lng: start.lng });
    })();
    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quote + reverse geocode whenever the pin moves.
  useEffect(() => {
    if (!pos) return;
    let cancelled = false;
    setChecking(true);
    setError('');
    quoteDelivery(slug, pos.lat, pos.lng, subtotal)
      .then(q => {
        if (!cancelled) setQuote(q);
      })
      .catch(err => {
        if (cancelled) return;
        setQuote(null);
        const e = orderingError(err);
        setError(
          e
            ? ((t.ordering.errors as Record<string, string>)[e.code] ?? e.message)
            : t.ordering.outOfZone
        );
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    if (!initial || initial.lat !== pos.lat || initial.lng !== pos.lng) {
      reverseGeocode(pos.lat, pos.lng, locale).then(line => {
        if (!cancelled && line) setText(line);
      });
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, slug, subtotal]);

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(p => {
      const next = { lat: p.coords.latitude, lng: p.coords.longitude };
      setPos(next);
      markerRef.current?.setLatLng([next.lat, next.lng]);
      mapInstance.current?.setView([next.lat, next.lng], 16);
    });
  };

  const canSave = !!pos && !!quote && text.trim().length > 0 && !checking;

  return (
    <>
      <Backdrop onClick={onClose} aria-hidden='true' />
      <Panel role='dialog' aria-modal='true' data-testid='address-picker'>
        <Title>{t.ordering.addAddress}</Title>
        <Hint>{t.ordering.pinHint}</Hint>
        <MapBox ref={mapRef} />
        <Row>
          <Small type='button' onClick={locate}>
            📍 {t.ordering.locateMe}
          </Small>
          {checking ? (
            <Hint>…</Hint>
          ) : quote ? (
            <Note tone='ok'>
              {parseFloat(quote.fee) > 0
                ? `${t.ordering.deliveryFee}: ${parseFloat(quote.fee).toFixed(2)} ₾`
                : t.ordering.freeDelivery}
              {' · '}
              {t.ordering.eta.replace('{minutes}', String(quote.eta_minutes))}
            </Note>
          ) : error ? (
            <Note tone='error'>{error}</Note>
          ) : null}
        </Row>
        <Grid>
          <Full>
            <Input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={t.ordering.street}
              data-testid='address-street'
            />
          </Full>
          <Input
            value={building}
            onChange={e => setBuilding(e.target.value)}
            placeholder={t.ordering.building}
          />
          <Input
            value={entrance}
            onChange={e => setEntrance(e.target.value)}
            placeholder={t.ordering.entrance}
          />
          <Input
            value={floor}
            onChange={e => setFloor(e.target.value)}
            placeholder={t.ordering.floor}
          />
          <Input
            value={apartment}
            onChange={e => setApartment(e.target.value)}
            placeholder={t.ordering.apartment}
          />
        </Grid>
        <Row>
          <Ghost type='button' onClick={onClose}>
            {t.ordering.cancel}
          </Ghost>
          <Btn
            type='button'
            disabled={!canSave}
            data-testid='address-save'
            onClick={() => {
              if (!pos || !quote) return;
              onSave(
                {
                  text: text.trim(),
                  lat: Number(pos.lat.toFixed(6)),
                  lng: Number(pos.lng.toFixed(6)),
                  building: building.trim(),
                  entrance: entrance.trim(),
                  floor: floor.trim(),
                  apartment: apartment.trim(),
                },
                quote
              );
            }}
          >
            {t.ordering.saveAddress}
          </Btn>
        </Row>
      </Panel>
    </>
  );
}
