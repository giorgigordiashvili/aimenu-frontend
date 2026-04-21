'use client';

import { styled } from '@pigment-css/react';

import { useTranslations } from '@/context/LocaleContext';
import { usePlatformLoyalty } from '@/hooks/usePlatformLoyalty';
import RestaurantUtensils from '@/icons/RestaurantUtensils';
import { border, foreground, muted, primary, radiusMd, slate100, slate200, white } from '@/tokens';

const Card = styled('div')({
  backgroundColor: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
});

const TierName = styled('h3')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  margin: 0,
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
  lineHeight: 1.2,
  '& svg': {
    color: primary,
    flexShrink: 0,
  },
});

const StatusLabel = styled('p')({
  margin: '4px 0 0',
  fontSize: '12px',
  color: muted,
  lineHeight: 1.3,
});

const ProgressBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const ProgressLabels = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  fontWeight: 500,
  color: muted,
});

const ProgressTrack = styled('div')({
  position: 'relative',
  height: '6px',
  borderRadius: '999px',
  background: slate200,
  overflow: 'hidden',
});

const ProgressFill = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  borderRadius: '999px',
  background: primary,
  transition: 'width 0.3s ease-out',
});

const Teaser = styled('p')({
  fontSize: '13px',
  color: muted,
  margin: 0,
  lineHeight: 1.4,
});

const SkeletonBlock = styled('div')({
  background: `linear-gradient(90deg, ${slate100} 0%, ${slate200} 50%, ${slate100} 100%)`,
  backgroundSize: '200% 100%',
  animation: 'platformStatusShimmer 1.4s infinite',
  borderRadius: '8px',
  '@keyframes platformStatusShimmer': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
});

function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k: string) =>
    values[k] === undefined ? '' : String(values[k])
  );
}

export default function PlatformStatusCard() {
  const t = useTranslations();
  const copy = t.platformLoyalty;
  const { status, isLoading } = usePlatformLoyalty();

  if (isLoading) {
    return (
      <Card aria-busy='true'>
        <SkeletonBlock style={{ height: '22px', width: '40%' }} />
        <SkeletonBlock style={{ height: '6px', width: '100%' }} />
        <SkeletonBlock style={{ height: '14px', width: '80%' }} />
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <div>
          <TierName>
            <RestaurantUtensils />
            {copy.tiers.gourmand}
          </TierName>
          <StatusLabel>{copy.yourStatus}</StatusLabel>
        </div>
        <Teaser>{copy.signInPrompt}</Teaser>
      </Card>
    );
  }

  const current = status.current_tier;
  const next = status.next_tier;
  const points = parseFloat(status.points);
  const pointsToNext = parseFloat(status.points_to_next);
  const tierName = current?.name ?? copy.tiers.gourmand;

  const progressPct = (() => {
    if (!next) return 100;
    const floor = current?.min_points ?? 0;
    const span = next.min_points - floor;
    if (span <= 0) return 0;
    return Math.max(0, Math.min(100, ((points - floor) / span) * 100));
  })();

  const teaser = next
    ? interpolate(copy.nextTeaser, {
        points: Math.ceil(pointsToNext),
        discount: next.discount_percent,
      }).replace(/<\/?b>/g, '')
    : interpolate(copy.topTierMessage, { discount: current?.discount_percent ?? 0 }).replace(
        /<\/?b>/g,
        ''
      );

  return (
    <Card>
      <div>
        <TierName>
          <RestaurantUtensils />
          {tierName}
        </TierName>
        <StatusLabel>{copy.yourStatus}</StatusLabel>
      </div>

      <ProgressBlock>
        <ProgressLabels>
          <span>
            {points.toLocaleString()} {copy.pointsLabel}
          </span>
          {next && <span>{interpolate(copy.toNextLabel, { target: next.min_points })}</span>}
        </ProgressLabels>
        <ProgressTrack
          role='progressbar'
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPct)}
        >
          <ProgressFill style={{ width: `${progressPct}%` }} />
        </ProgressTrack>
      </ProgressBlock>

      <Teaser>{teaser}</Teaser>
    </Card>
  );
}
