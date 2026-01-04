'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import Link from 'next/link';

import { Locale, defaultLocale } from '@/i18n/config';

const List = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  '@media (min-width: 768px)': {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  '@media (min-width: 1280px)': {
    gridTemplateColumns: 'repeat(5, 1fr)',
  },
});

const Item = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  padding: '14px',
  background: '#ffffff',
  border: '0.873px solid #e2e8f0',
  borderRadius: '14px',
  boxShadow: '0px 16px 16px -8px rgba(12, 12, 13, 0.1), 0px 4px 4px -4px rgba(12, 12, 13, 0.05)',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'transform 0.1s ease',
  '&:hover': {
    transform: 'scale(1.01)',
  },
  '&:active': {
    transform: 'scale(0.99)',
  },
  '@media (min-width: 768px)': {
    flexDirection: 'column',
    padding: '16px',
    gap: '12px',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
});

const ImageContainer = styled('div')({
  position: 'relative',
  width: '54px',
  height: '53px',
  borderRadius: '8px',
  overflow: 'hidden',
  flexShrink: 0,
  marginRight: '14px',
  '@media (min-width: 768px)': {
    width: '100%',
    height: '120px',
    marginRight: 0,
    borderRadius: '10px',
  },
});

const ImagePlaceholder = styled('div')({
  width: '100%',
  height: '100%',
  background: '#e2e8f0',
});

const Name = styled('span')({
  flex: 1,
  fontSize: '12px',
  fontWeight: 500,
  color: '#0f172a',
  '@media (min-width: 768px)': {
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'center',
  },
});

const Chevron = styled('svg')({
  color: '#9c9c9c',
  flexShrink: 0,
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface CategoryListProps {
  categories: Category[];
  restaurantSlug: string;
  locale?: Locale;
}

export default function CategoryList({
  categories,
  restaurantSlug,
  locale = defaultLocale,
}: CategoryListProps) {
  return (
    <List>
      {categories.map(category => (
        <Item
          key={category.id}
          href={`/${locale}/restaurant/${restaurantSlug}/category/${category.id}`}
        >
          <ImageContainer>
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(min-width: 768px) 200px, 54px"
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            ) : (
              <ImagePlaceholder />
            )}
          </ImageContainer>
          <Name>{category.name}</Name>
          <Chevron width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Chevron>
        </Item>
      ))}
    </List>
  );
}
