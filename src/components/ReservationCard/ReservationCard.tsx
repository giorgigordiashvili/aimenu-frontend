'use client';

import { styled, keyframes } from '@pigment-css/react';
import Image from 'next/image';

import { ReservationList } from '@/api/generated/interfaces';
import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import SecondArrow from '@/icons/SecondArrow';
import Star from '@/icons/Star';
import {
  border,
  foreground,
  radiusMd,
  radiusSm,
  rose200,
  rose50,
  rose600,
  rose800,
  shadowSm,
  slate200,
  slate500,
  white,
} from '@/tokens';

// ─── Styled components ─────────────────────────────────────────────────────────

const Card = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  width: '100%',
  padding: '16px',
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  boxShadow: shadowSm,
  cursor: 'pointer',
  textAlign: 'left',
  '&:hover': {
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
  },
});

const Thumbnail = styled('div')({
  width: '80px',
  height: '80px',
  borderRadius: radiusMd,
  flexShrink: 0,
  overflow: 'hidden',
  position: 'relative',
});

const ThumbnailPlaceholder = styled('div')({
  width: '100%',
  height: '100%',
  background: `linear-gradient(135deg, ${slate200} 0%, #cbd5e1 100%)`,
});

const Content = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
});

const RestaurantName = styled('span')({
  fontSize: '16px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '24px',
  letterSpacing: '-0.3px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const Subtitle = styled('span')({
  fontSize: '13px',
  fontWeight: 400,
  color: slate500,
  lineHeight: '18px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const RatingBadge = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '3px 8px',
  background: white,
  border: `1px solid ${border}`,
  borderRadius: '100px',
  width: 'fit-content',
  marginTop: '2px',
});

const RatingText = styled('span')({
  fontSize: '11px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '16px',
});

const Right = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexShrink: 0,
});

const GuestBadge = styled('span')({
  padding: '4px 12px',
  borderRadius: '100px',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: '18px',
  backgroundColor: `${rose600}18`,
  color: rose600,
  whiteSpace: 'nowrap',
});

const ChevronWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// ─── Skeleton ──────────────────────────────────────────────────────────────────

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
});

const SkeletonCard = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  width: '100%',
  padding: '16px',
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
});

const SkeletonBase = styled('div')({
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  borderRadius: '4px',
  animation: `${shimmer} 1.5s infinite`,
});

const SkeletonThumbnail = styled(SkeletonBase)({
  width: '80px',
  height: '80px',
  borderRadius: radiusMd,
  flexShrink: 0,
});

const SkeletonContent = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export function ReservationCardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonThumbnail />
      <SkeletonContent>
        <SkeletonBase style={{ height: '16px', width: '50%' }} />
        <SkeletonBase style={{ height: '13px', width: '70%' }} />
        <SkeletonBase style={{ height: '22px', width: '20%', borderRadius: '100px' }} />
      </SkeletonContent>
    </SkeletonCard>
  );
}

// ─── Variant card shell ─────────────────────────────────────────────────────────

const CardVariant = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  width: '100%',
  padding: '16px',
  background: white,
  border: '1px solid #E5E5E5',
  borderRadius: '14px',
  cursor: 'pointer',
  textAlign: 'left',
  '&:hover': {
    boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
  },
});

// ─── Component ─────────────────────────────────────────────────────────────────

interface ReservationCardProps {
  reservation: ReservationList;
  onClick: (id: string) => void;
  restaurantName?: string;
  restaurantImage?: string;
  restaurantCity?: string;
  restaurantCuisine?: string;
  restaurantRating?: string;
}

export default function ReservationCard({
  reservation,
  onClick,
  restaurantName,
  restaurantImage,
  restaurantCity,
  restaurantCuisine,
  restaurantRating,
}: ReservationCardProps) {
  const t = useTranslations();

  const title =
    restaurantName ||
    (reservation.table_number
      ? `${t.reservations.table} ${reservation.table_number}`
      : `#${reservation.confirmation_code}`);

  const subtitle = [restaurantCity, restaurantCuisine].filter(Boolean).join(' • ');

  const guestLabel = `${reservation.party_size} ${t.reservations.dishes}`;

  return (
    <Card onClick={() => onClick(reservation.id)}>
      <Thumbnail>
        {restaurantImage ? (
          <Image src={restaurantImage} alt={title} fill style={{ objectFit: 'cover' }} />
        ) : (
          <ThumbnailPlaceholder />
        )}
      </Thumbnail>

      <Content>
        <RestaurantName>{title}</RestaurantName>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {restaurantRating && (
          <RatingBadge>
            <svg width={11} height={11} viewBox='0 0 12 12' fill='none'>
              <path
                d='M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z'
                fill='#FFB800'
                stroke='#FFB800'
                strokeWidth='1'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <RatingText>{restaurantRating}</RatingText>
          </RatingBadge>
        )}
      </Content>

      <Right>
        <GuestBadge>{guestLabel}</GuestBadge>
        <ChevronWrapper>
          <SecondArrow />
        </ChevronWrapper>
      </Right>
    </Card>
  );
}

const VariantRatingWrapper = styled('div')({
  width: 'fit-content',
});

const VariantGuestBadge = styled('span')({
  padding: '4px 12px',
  borderRadius: radiusSm,
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: '18px',
  backgroundColor: rose50,
  border: `1px solid ${rose200}`,
  color: rose800,
  whiteSpace: 'nowrap',
});

// ─── Variant ────────────────────────────────────────────────────────────────────

function VariantRatingStarIcon() {
  return <Star color={foreground} size={10} />;
}

export function ReservationCardVariant({
  reservation,
  onClick,
  restaurantName,
  restaurantImage,
  restaurantCity,
  restaurantCuisine,
  restaurantRating,
}: ReservationCardProps) {
  const t = useTranslations();

  const title =
    restaurantName ||
    (reservation.table_number
      ? `${t.reservations.table} ${reservation.table_number}`
      : `#${reservation.confirmation_code}`);

  const subtitle = [restaurantCity, restaurantCuisine].filter(Boolean).join(' • ');

  const guestLabel = `${reservation.party_size} ${t.reservations.dishes}`;

  return (
    <CardVariant onClick={() => onClick(reservation.id)}>
      <Thumbnail>
        {restaurantImage ? (
          <Image src={restaurantImage} alt={title} fill style={{ objectFit: 'cover' }} />
        ) : (
          <ThumbnailPlaceholder />
        )}
      </Thumbnail>

      <Content>
        <RestaurantName>{title}</RestaurantName>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {restaurantRating && (
          <VariantRatingWrapper>
            <MainButton
              variant='outline'
              size='extra_small'
              title={restaurantRating}
              icon={VariantRatingStarIcon}
              iconGap={4}
              iconPosition='right'
            />
          </VariantRatingWrapper>
        )}
      </Content>

      <Right>
        <VariantGuestBadge>{guestLabel}</VariantGuestBadge>
        <ChevronWrapper>
          <SecondArrow />
        </ChevronWrapper>
      </Right>
    </CardVariant>
  );
}
