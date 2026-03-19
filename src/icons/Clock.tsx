import * as React from 'react';

interface ClockIconProps {
  size?: number;
  color?: string;
}

const ClockIcon = ({ size = 16 }: ClockIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 16 16'
    fill='none'
  >
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M8 4v4l2.667 1.333'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M8 14.666A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.333Z'
    />
  </svg>
);
export default ClockIcon;
