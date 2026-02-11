import * as React from 'react';

type LocationIconProps = {
  color?: string;
  size?: number;
};

const LocationIcon = ({ color = '#90A1B9', size = 16 }: LocationIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 16 16'
    fill='none'
  >
    <path
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M13.333 6.666c0 3.329-3.692 6.796-4.932 7.866a.667.667 0 0 1-.802 0c-1.24-1.07-4.932-4.537-4.932-7.866a5.333 5.333 0 1 1 10.666 0Z'
    />
    <path
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M8 8.667a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'
    />
  </svg>
);
export default LocationIcon;
