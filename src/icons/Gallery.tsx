import * as React from 'react';

import { muted } from '@/tokens';

const Gallery = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none' viewBox='0 0 16 16'>
    <g stroke={muted} strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.333}>
      <rect x='1.5' y='1.5' width='13' height='13' rx='2' />
      <circle cx='5.5' cy='5.5' r='1.2' />
      <path d='m14.5 10-3.5-3.5L3 14.5' />
    </g>
  </svg>
);
export default Gallery;
