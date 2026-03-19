import * as React from 'react';

type ArrowProps = {
  color?: string;
  size?: number;
};

const ArrowIcon = ({ color = '#62748E', size = 16 }: ArrowProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} fill='none'>
    <path
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M7.996 12.66 3.332 7.996l4.664-4.664M12.66 7.996H3.332'
    />
  </svg>
);
export default ArrowIcon;
