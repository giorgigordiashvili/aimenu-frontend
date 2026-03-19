import * as React from 'react';

import { iconStroke } from '@/tokens';

const RestaurantUtensils = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none'>
    <g
      stroke={iconStroke}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      clipPath='url(#a)'
    >
      <path d='M1.998 1.333v4.664c0 .733.6 1.333 1.333 1.333h2.665a1.333 1.333 0 0 0 1.333-1.333V1.333M4.664 1.333v13.326M13.994 9.995V1.333a3.332 3.332 0 0 0-3.332 3.331v3.998c0 .733.6 1.333 1.333 1.333h1.999Zm0 0v4.664' />
    </g>
    <defs>
      <clipPath id='a'>
        <path fill='#fff' d='M0 0h15.992v15.992H0z' />
      </clipPath>
    </defs>
  </svg>
);
export default RestaurantUtensils;
