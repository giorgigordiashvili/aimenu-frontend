'use client';

import { styled } from '@pigment-css/react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

import axios from '@/api/axios';
import { useTranslations } from '@/context/LocaleContext';
import type { LoyaltyCounterRow } from '@/hooks/useLoyalty';
import { border, foreground, muted, primary, radiusMd, white } from '@/tokens';

const Backdrop = styled('div')({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  zIndex: 80,
});

const Sheet = styled('div')({
  backgroundColor: white,
  borderRadius: radiusMd,
  padding: '28px 24px',
  width: '100%',
  maxWidth: '380px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  alignItems: 'stretch',
});

const Title = styled('h2')({
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
  textAlign: 'center',
});

const QrWrap = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  padding: '16px',
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  backgroundColor: white,
});

const Code = styled('div')({
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '14px',
  letterSpacing: '0.5px',
  textAlign: 'center',
  padding: '10px 12px',
  borderRadius: '10px',
  border: `1px solid ${border}`,
  backgroundColor: '#F9FAFB',
  color: foreground,
  wordBreak: 'break-all',
});

const Meta = styled('p')({
  fontSize: '13px',
  color: muted,
  margin: 0,
  textAlign: 'center',
});

const CloseBtn = styled('button')({
  backgroundColor: primary,
  color: white,
  border: 'none',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
});

const Err = styled('p')({
  color: primary,
  fontSize: '13px',
  textAlign: 'center',
  margin: 0,
});

interface RedemptionDTO {
  id: string;
  code: string;
  status: string;
  expires_at: string;
}

interface Props {
  row: LoyaltyCounterRow;
  onClose: () => void;
}

export default function LoyaltyRedeemModal({ row, onClose }: Props) {
  const t = useTranslations();
  const [redemption, setRedemption] = useState<RedemptionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.post('/api/v1/loyalty/my/redeem/', {
          program_id: row.program.id,
        });
        const data = (res.data?.data ?? res.data) as RedemptionDTO;
        if (!cancelled) {
          setRedemption(data);
          setLoading(false);
        }
      } catch (e: unknown) {
        const code = (e as { response?: { data?: { error?: { code?: string } } } })?.response?.data
          ?.error?.code;
        const key =
          (code && (t.loyalty.errors as Record<string, string>)[code]) || t.loyalty.errors.generic;
        if (!cancelled) {
          setErr(key);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [row.program.id, t.loyalty.errors]);

  const expires = redemption ? new Date(redemption.expires_at).toLocaleString() : '';

  return (
    <Backdrop onClick={onClose}>
      <Sheet onClick={e => e.stopPropagation()}>
        <Title>{t.loyalty.showQrTitle}</Title>

        {loading ? (
          <Meta>{t.loyalty.issuing}</Meta>
        ) : err ? (
          <Err>{err}</Err>
        ) : redemption ? (
          <>
            <QrWrap>
              <QRCodeSVG value={redemption.code} size={220} />
            </QrWrap>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Meta>{t.loyalty.codeLabel}</Meta>
              <Code>{redemption.code}</Code>
            </div>
            <Meta>{t.loyalty.expiresAt.replace('{{time}}', expires)}</Meta>
          </>
        ) : null}

        <CloseBtn onClick={onClose}>{t.loyalty.close}</CloseBtn>
      </Sheet>
    </Backdrop>
  );
}
