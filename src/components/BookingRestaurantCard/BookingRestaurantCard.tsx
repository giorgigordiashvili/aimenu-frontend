'use client';

import { styled } from '@pigment-css/react';

import MainButton from '@/components/MainButton/MainButton';
import StarIcon from '@/icons/Star';
import { background, foreground, slate300, slate500 } from '@/tokens';

function RatingStarIcon() {
  return <StarIcon size={10} />;
}

type Props = {
  name?: string;
  subtitle?: string;
  rating?: number;
  image?: string;
};

const Card = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px 20px',
  backgroundColor: background,
  '@media (min-width: 768px)': {
    padding: '24px 24px 16px',
  },
});

const Image = styled('div')({
  width: '64px',
  height: '64px',
  borderRadius: '10px',
  overflow: 'hidden',
  flexShrink: 0,
  backgroundColor: slate300,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const Info = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const Name = styled('span')({
  fontSize: '16px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '22px',
});

const SubtitleText = styled('span')({
  fontSize: '13px',
  fontWeight: 400,
  color: slate500,
  lineHeight: '18px',
});

const RatingWrap = styled('div')({
  marginTop: '2px',
});

export default function BookingRestaurantCard({ name, subtitle, rating, image }: Props) {
  return (
    <Card>
      <Image
        role='img'
        aria-label={name}
        style={image ? { backgroundImage: `url(${image})` } : undefined}
      />
      <Info>
        {name && <Name>{name}</Name>}
        {subtitle && <SubtitleText>{subtitle}</SubtitleText>}
        {rating !== undefined && (
          <RatingWrap>
            <MainButton
              variant='outline'
              size='extra_small'
              title={String(rating)}
              icon={RatingStarIcon}
              iconGap={4}
              iconPosition='right'
            />
          </RatingWrap>
        )}
      </Info>
    </Card>
  );
}
