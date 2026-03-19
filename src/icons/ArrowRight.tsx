import * as React from 'react';

type ArrowRightProps = {
  color?: string;
  size?: number;
};

const ArrowRightIcon = ({ color = '#ffffff', size = 16 }: ArrowRightProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} fill='none'>
    <path
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M3.333 8h9.334M8 3.333 12.667 8 8 12.667'
    />
  </svg>
);

export default ArrowRightIcon;
