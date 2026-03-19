import * as React from 'react';

import { muted } from '@/tokens';

const Share = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none'>
    <g
      stroke={muted}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      clipPath='url(#a)'
    >
      <path d='M11.993 5.33a1.999 1.999 0 1 0 0-3.997 1.999 1.999 0 0 0 0 3.998ZM3.997 9.995a1.999 1.999 0 1 0 0-3.998 1.999 1.999 0 0 0 0 3.998ZM11.993 14.66a1.999 1.999 0 1 0 0-3.999 1.999 1.999 0 0 0 0 3.998ZM5.725 9.002l4.55 2.652M10.269 4.338 5.725 6.99' />
    </g>
    <defs>
      <clipPath id='a'>
        <path fill='#fff' d='M0 0h15.992v15.992H0z' />
      </clipPath>
    </defs>
  </svg>
);
export default Share;
