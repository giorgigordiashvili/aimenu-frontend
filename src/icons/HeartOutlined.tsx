import * as React from 'react';

type HeartOutlinedProps = {
  variant?: 'outlined' | 'filled';
} & React.SVGProps<SVGSVGElement>;

const HeartOutlined = ({ variant = 'outlined', ...props }: HeartOutlinedProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={14}
    height={12}
    viewBox='-0.3 -0.3 15 13'
    fill='none'
    {...props}
  >
    <path
      fill={variant === 'filled' ? '#EC003F' : 'none'}
      stroke={variant === 'filled' ? '#EC003F' : '#EC003F'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M.667 4.344a3.667 3.667 0 0 1 6.394-2.45.373.373 0 0 0 .545 0A3.66 3.66 0 0 1 14 4.343c0 1.527-1 2.667-2 3.667l-3.661 3.542a1.333 1.333 0 0 1-2 .012L2.667 8.011c-1-1-2-2.134-2-3.667Z'
    />
  </svg>
);
export default HeartOutlined;
