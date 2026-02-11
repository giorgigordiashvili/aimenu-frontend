'use client';

import { styled } from '@pigment-css/react';

const Button = styled('button')({
  backgroundColor: '#ffffffE6',
  color: '#0F172B',
  border: 'none',
  borderRadius: '4px',
  padding: '4px 6px',
  cursor: 'pointer',
});

function RestaurantCardButton() {
  return <Button>RestaurantCardButton</Button>;
}

export default RestaurantCardButton;
