'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';

const Container = styled('div')({
  display: 'flex',
  gap: '15px',
  paddingBottom: '20px',
  borderBottom: '1px solid #e2e8f0',
  '@media (min-width: 768px)': {
    gap: '24px',
    paddingBottom: '32px',
  },
});

const ImageContainer = styled('div')({
  position: 'relative',
  width: '80px',
  height: '80px',
  borderRadius: '14px',
  overflow: 'hidden',
  flexShrink: 0,
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
  '@media (min-width: 768px)': {
    width: '120px',
    height: '120px',
    borderRadius: '16px',
  },
});

const ImagePlaceholder = styled('div')({
  width: '100%',
  height: '100%',
  background: '#e2e8f0',
});

const Info = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '4px',
  '@media (min-width: 768px)': {
    gap: '8px',
  },
});

const Name = styled('h2')({
  fontSize: '16px',
  fontWeight: 700,
  color: '#0f172a',
  lineHeight: '28px',
  letterSpacing: '-0.44px',
  '@media (min-width: 768px)': {
    fontSize: '24px',
    lineHeight: '32px',
    letterSpacing: '-0.5px',
  },
});

const Description = styled('p')({
  fontSize: '12px',
  fontWeight: 400,
  color: '#62748e',
  lineHeight: '20px',
  letterSpacing: '-0.15px',
  '@media (min-width: 768px)': {
    fontSize: '14px',
    lineHeight: '22px',
  },
});

const RatingBadge = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3px 9px',
  background: '#ffffff',
  border: '0.873px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 500,
  color: '#0f172a',
  width: 'fit-content',
  '@media (min-width: 768px)': {
    padding: '4px 12px',
    fontSize: '14px',
  },
});

interface RestaurantInfoProps {
  name: string;
  description?: string;
  logo?: string;
  rating?: number;
}

export default function RestaurantInfo({ name, description, logo, rating }: RestaurantInfoProps) {
  return (
    <Container>
      <ImageContainer>
        {logo ? (
          <Image src={logo} alt={name} fill sizes='80px' style={{ objectFit: 'cover' }} />
        ) : (
          <ImagePlaceholder />
        )}
      </ImageContainer>
      <Info>
        <Name>{name}</Name>
        {description && <Description>{description}</Description>}
        {rating && (
          <RatingBadge>
            <span>{rating.toFixed(1)} ★</span>
          </RatingBadge>
        )}
      </Info>
    </Container>
  );
}
