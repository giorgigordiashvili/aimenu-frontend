'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import { memo, useCallback } from 'react';

interface CardProps {
  isClickable?: boolean;
}

const Card = styled('div')<CardProps>({
  display: 'flex',
  alignItems: 'center',
  padding: '18px',
  background: '#ffffff',
  border: '0.873px solid #e2e8f0',
  borderRadius: '14px',
  boxShadow: '0px 16px 16px -8px rgba(12, 12, 13, 0.1), 0px 4px 4px -4px rgba(12, 12, 13, 0.05)',
  gap: '14px',
  cursor: 'default',
  '@media (min-width: 768px)': {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 0,
    gap: 0,
    borderRadius: '14px',
    overflow: 'hidden',
  },
  variants: [
    {
      props: { isClickable: true },
      style: {
        cursor: 'pointer',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        '&:hover': {
          transform: 'scale(1.01)',
        },
        '&:active': {
          transform: 'scale(0.99)',
        },
        '@media (min-width: 768px)': {
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow:
              '0px 24px 24px -12px rgba(12, 12, 13, 0.15), 0px 8px 8px -4px rgba(12, 12, 13, 0.08)',
          },
        },
      },
    },
  ],
});

const ImageContainer = styled('div')({
  position: 'relative',
  width: '78px',
  height: '76px',
  borderRadius: '8px',
  overflow: 'hidden',
  flexShrink: 0,
  '@media (min-width: 768px)': {
    width: '100%',
    height: '160px',
    borderRadius: 0,
  },
});

const StyledImage = styled(Image)({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const ImagePlaceholder = styled('div')({
  width: '100%',
  height: '100%',
  background: '#e2e8f0',
});

const Info = styled('div')({
  flex: 1,
  minWidth: 0,
  '@media (min-width: 768px)': {
    padding: '12px',
  },
});

const Name = styled('h3')({
  fontSize: '14px',
  fontWeight: 500,
  color: '#0f172a',
  lineHeight: '24px',
  letterSpacing: '-0.31px',
  marginBottom: '2px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '4px',
    whiteSpace: 'normal',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
});

const Description = styled('p')({
  fontSize: '11px',
  fontWeight: 400,
  color: '#62748e',
  lineHeight: '20px',
  letterSpacing: '-0.15px',
  marginBottom: '4px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '12px',
    marginBottom: '8px',
    whiteSpace: 'normal',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
});

const Price = styled('p')({
  fontSize: '16px',
  fontWeight: 700,
  color: '#0f172a',
  lineHeight: '24px',
  letterSpacing: '-0.31px',
  margin: 0,
});

const Actions = styled('div')({
  flexShrink: 0,
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const ViewButton = styled('button')({
  width: '42px',
  height: '42px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ffffff',
  border: '0.873px solid #f1f5f9',
  borderRadius: '10px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  color: '#62748e',
  transition: 'transform 0.1s ease, color 0.1s ease',
  cursor: 'pointer',
  '&:hover': {
    background: '#f1f5f9',
    color: '#0f172a',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
});

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  onClick?: () => void;
}

const ProductCard = memo(function ProductCard({
  id: _id,
  name,
  description,
  price,
  image,
  onClick,
}: ProductCardProps) {
  const handleCardClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <Card isClickable={!!onClick} onClick={handleCardClick}>
      <ImageContainer>
        {image ? (
          <StyledImage src={image} alt={name} fill sizes='(min-width: 768px) 300px, 100px' loading='lazy' />
        ) : (
          <ImagePlaceholder />
        )}
      </ImageContainer>
      <Info>
        <Name>{name}</Name>
        {description && <Description>{description}</Description>}
        <Price>{price.toFixed(2)} ₾</Price>
      </Info>
      <Actions>
        <ViewButton onClick={handleCardClick} aria-label='View product details'>
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <circle cx='12' cy='12.5' r='3.5' stroke='currentColor' strokeWidth='1.5' />
          </svg>
        </ViewButton>
      </Actions>
    </Card>
  );
});

export default ProductCard;
