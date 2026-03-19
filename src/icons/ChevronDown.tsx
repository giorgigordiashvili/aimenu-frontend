import * as React from 'react';

import { iconStroke } from '@/tokens';

interface ChevronDownProps {
  size?: number;
  color?: string;
}

const ChevronDown = ({ size = 16, color = iconStroke }: ChevronDownProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 16 16'
    fill='none'
  >
    <path
      d='M4 6L8 10L12 6'
      stroke={color}
      strokeWidth='1.333'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default ChevronDown;
