'use client';

import { styled } from '@pigment-css/react';

import { useTranslations } from '@/context/LocaleContext';
import { usePlatformLoyalty } from '@/hooks/usePlatformLoyalty';
import {
  border,
  foreground,
  muted,
  primary,
  radiusMd,
  rose50,
  slate100,
  slate200,
  white,
} from '@/tokens';

// Platform-wide tier status card. Shown at the top of /profile/loyalty.
// Mirrors the mockup: big tier name, current points + next-tier target,
// progress bar, CTA copy nudging toward the next reward.

const Card = styled('div')({
  background: `linear-gradient(145deg, ${rose50} 0%, ${white} 100%)`,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const StatusLabel = styled('span')({
  fontSize: '12px',
  fontWeight: 600,
  color: muted,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

const TierName = styled('h2')({
  fontSize: '28px',
  fontWeight: 800,
  color: foreground,
  margin: 0,
  lineHeight: 1.15,
  letterSpacing: '-0.01em',
});

const PointsRow = styled('div')({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap',
});

const PointsBig = styled('span')({
  fontSize: '24px',
  fontWeight: 700,
  color: foreground,
});

const PointsSub = styled('span')({
  fontSize: '14px',
  fontWeight: 500,
  color: muted,
});

const ProgressTrack = styled('div')({
  position: 'relative',
  height: '10px',
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
  fontSize: '14px',
  color: foreground,
  margin: 0,
  lineHeight: 1.5,
  '& b': {
    color: primary,
    fontWeight: 700,
  },
});

const SignInPrompt = styled('p')({
  fontSize: '14px',
  color: muted,
  margin: 0,
  lineHeight: 1.5,
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
        <SkeletonBlock style={{ height: '14px', width: '30%' }} />
        <SkeletonBlock style={{ height: '32px', width: '40%' }} />
        <SkeletonBlock style={{ height: '10px', width: '100%' }} />
        <SkeletonBlock style={{ height: '14px', width: '70%' }} />
      </Card>
    );
  }

  // Anonymous user: invite to sign in. The /status/ endpoint is auth-only
  // so null here means "not signed in OR first-time visitor with no data".
  if (!status) {
    return (
      <Card>
        <StatusLabel>{copy.yourStatus}</StatusLabel>
        <TierName>{copy.tiers.gourmand}</TierName>
        <SignInPrompt>{copy.signInPrompt}</SignInPrompt>
      </Card>
    );
  }

  const current = status.current_tier;
  const next = status.next_tier;
  const points = parseFloat(status.points);
  const pointsToNext = parseFloat(status.points_to_next);
  const tierName = current?.name ?? copy.tiers.gourmand;

  // Progress within the current band: (points - current.min) / (next.min - current.min).
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
      })
    : interpolate(copy.topTierMessage, { discount: current?.discount_percent ?? 0 });

  return (
    <Card>
      <StatusLabel>{copy.yourStatus}</StatusLabel>
      <TierName>{tierName}</TierName>

      <PointsRow>
        <PointsBig>
          {points.toLocaleString()} {copy.pointsLabel}
        </PointsBig>
        {next && (
          <PointsSub>
            {interpolate(copy.toNextLabel, { target: next.min_points })}
          </PointsSub>
        )}
      </PointsRow>

      <ProgressTrack
        role='progressbar'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPct)}
      >
        <ProgressFill style={{ width: `${progressPct}%` }} />
      </ProgressTrack>

      <Teaser dangerouslySetInnerHTML={{ __html: teaser }} />
    </Card>
  );
}
