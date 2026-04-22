'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import type { WalletTransaction, WalletTransactionKind } from '@/api/referrals';
import { useTranslations } from '@/context/LocaleContext';
import { useReferralSummary, useReferredUsers, useWalletHistory } from '@/hooks/useReferral';
import {
  background,
  border,
  foreground,
  muted,
  primary,
  radiusMd,
  radiusSm,
  rose50,
  slate100,
  slate500,
  white,
} from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const Root = styled('div')({
  backgroundColor: background,
  padding: '24px 16px 64px',
  '@media (min-width: 768px)': { padding: '24px 24px 64px' },
});

const Inner = styled('div')({
  maxWidth: '900px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const Header = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '8px 4px',
});

const Title = styled('h1')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
});

const Subtitle = styled('p')({
  fontSize: '14px',
  color: muted,
  margin: 0,
});

const HeroRow = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '16px',
  '@media (min-width: 640px)': {
    gridTemplateColumns: '1fr 1fr',
  },
});

const HeroCard = styled('section')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const HeroLabel = styled('span')({
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: muted,
});

const HeroValue = styled('span')({
  fontSize: '28px',
  fontWeight: 700,
  color: foreground,
});

const RateChip = styled('span')({
  display: 'inline-block',
  padding: '4px 10px',
  borderRadius: '999px',
  background: rose50,
  color: primary,
  fontSize: '12px',
  fontWeight: 600,
  alignSelf: 'flex-start',
});

const ShareCard = styled('section')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const FieldRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: slate100,
  border: `1px solid ${border}`,
  borderRadius: radiusSm,
  padding: '10px 12px',
  fontFamily: 'monospace',
  fontSize: '14px',
  color: foreground,
  overflowX: 'auto',
});

const ButtonsRow = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

const SmallButton = styled('button')({
  padding: '8px 14px',
  borderRadius: radiusSm,
  border: `1px solid ${border}`,
  background: white,
  color: foreground,
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  '&:hover': { background: slate100 },
});

const PrimaryButton = styled('button')({
  padding: '8px 14px',
  borderRadius: radiusSm,
  border: 'none',
  background: primary,
  color: white,
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
});

const HowList = styled('ol')({
  margin: 0,
  paddingLeft: '20px',
  color: slate500,
  fontSize: '14px',
  lineHeight: '22px',
});

const SectionTitle = styled('h2')({
  fontSize: '16px',
  fontWeight: 600,
  color: foreground,
  margin: '8px 4px 0',
});

const Card = styled('section')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '12px',
});

const Empty = styled('div')({
  padding: '24px 16px',
  color: muted,
  fontSize: '14px',
  textAlign: 'center',
});

const Table = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
});

const Th = styled('th')({
  textAlign: 'left',
  padding: '10px 8px',
  color: muted,
  fontWeight: 500,
  fontSize: '12px',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  borderBottom: `1px solid ${border}`,
});

const Td = styled('td')({
  padding: '12px 8px',
  borderBottom: `1px solid ${border}`,
  color: foreground,
});

const Amount = styled('span')({
  fontWeight: 600,
  '&[data-positive="true"]': { color: '#16A34A' },
  '&[data-positive="false"]': { color: primary },
});

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso.slice(0, 10);
  }
}

function asArray(payload: unknown): WalletTransaction[] {
  if (Array.isArray(payload)) return payload as WalletTransaction[];
  if (payload && typeof payload === 'object' && 'results' in payload) {
    return ((payload as { results?: WalletTransaction[] }).results ?? []) as WalletTransaction[];
  }
  return [];
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ReferralPage() {
  const t = useTranslations();
  const { data: summary } = useReferralSummary();
  const { data: history } = useWalletHistory();
  const { data: referred } = useReferredUsers();
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  const txKindLabels = t.referral.txKind as Record<WalletTransactionKind, string>;
  const code = summary?.referral_code ?? '';
  const link = summary?.referral_url ?? '';
  const percent = summary?.effective_percent ?? '0';

  const copy = async (value: string, kind: 'code' | 'link') => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard rejection — ignore. */
    }
  };

  const share = async () => {
    if (!link || typeof navigator === 'undefined' || !navigator.share) return;
    try {
      await navigator.share({
        title: t.referral.shareTitle,
        text: t.referral.shareText.replace('{code}', code),
        url: link,
      });
    } catch {
      /* user cancelled. */
    }
  };

  const rows = asArray(history);

  return (
    <Root>
      <Inner>
        <Header>
          <Title>{t.referral.pageTitle}</Title>
          <Subtitle>{t.referral.pageLead}</Subtitle>
        </Header>

        <HeroRow>
          <HeroCard>
            <HeroLabel>{t.referral.balanceLabel}</HeroLabel>
            <HeroValue>{summary ? `${summary.wallet_balance} ₾` : '— ₾'}</HeroValue>
            <RateChip>{t.referral.effectivePercentValue.replace('{percent}', percent)}</RateChip>
          </HeroCard>
          <HeroCard>
            <HeroLabel>{t.referral.totalEarnedLabel}</HeroLabel>
            <HeroValue>{summary ? `${summary.total_earned} ₾` : '— ₾'}</HeroValue>
            <Subtitle>
              {t.referral.totalSpentLabel}: {summary ? `${summary.total_spent} ₾` : '— ₾'}
            </Subtitle>
          </HeroCard>
        </HeroRow>

        <ShareCard>
          <HeroLabel>{t.referral.referralCodeLabel}</HeroLabel>
          <FieldRow>{code || '••••••••'}</FieldRow>
          <HeroLabel>{t.referral.referralLinkLabel}</HeroLabel>
          <FieldRow>{link || '—'}</FieldRow>
          <ButtonsRow>
            <SmallButton type='button' onClick={() => copy(code, 'code')} disabled={!code}>
              {copied === 'code' ? t.referral.copied : t.referral.copyCode}
            </SmallButton>
            <SmallButton type='button' onClick={() => copy(link, 'link')} disabled={!link}>
              {copied === 'link' ? t.referral.copied : t.referral.copyLink}
            </SmallButton>
            <PrimaryButton type='button' onClick={share} disabled={!link}>
              {t.referral.share}
            </PrimaryButton>
          </ButtonsRow>
          <SectionTitle>{t.referral.howItWorksTitle}</SectionTitle>
          <HowList>
            <li>{t.referral.howItWorks1}</li>
            <li>{t.referral.howItWorks2}</li>
            <li>{t.referral.howItWorks3.replace('{percent}', percent)}</li>
          </HowList>
        </ShareCard>

        <SectionTitle>{t.referral.recentActivityTitle}</SectionTitle>
        <Card>
          {rows.length === 0 ? (
            <Empty>{t.referral.emptyActivity}</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>{t.profile.tabs.payment}</Th>
                  <Th>{t.referral.balanceLabel}</Th>
                  <Th>{t.common.total}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 10).map(row => (
                  <tr key={row.id}>
                    <Td>
                      <div style={{ fontWeight: 500 }}>{txKindLabels[row.kind] ?? row.kind}</div>
                      <div style={{ color: muted, fontSize: 12 }}>
                        {formatDate(row.created_at)}
                        {row.source_order_number ? ` · ${row.source_order_number}` : ''}
                      </div>
                    </Td>
                    <Td>{row.balance_after} ₾</Td>
                    <Td>
                      <Amount data-positive={Number(row.amount) >= 0}>
                        {Number(row.amount) >= 0 ? '+' : ''}
                        {row.amount} ₾
                      </Amount>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <SectionTitle>{t.referral.referredUsersTitle}</SectionTitle>
        <Card>
          {!referred || referred.length === 0 ? (
            <Empty>{t.referral.emptyReferred}</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>{t.referral.referredUsersTitle}</Th>
                  <Th>{t.referral.joinedAt}</Th>
                  <Th>{t.referral.earnedFrom}</Th>
                </tr>
              </thead>
              <tbody>
                {referred.map(row => (
                  <tr key={row.id}>
                    <Td>
                      <div style={{ fontWeight: 500 }}>{row.full_name || row.email}</div>
                      <div style={{ color: muted, fontSize: 12 }}>{row.email}</div>
                    </Td>
                    <Td>{formatDate(row.joined_at)}</Td>
                    <Td>{row.total_earned} ₾</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Inner>
    </Root>
  );
}
