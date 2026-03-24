import * as React from 'react';

type StarProps = React.SVGProps<SVGSVGElement> & {
  color?: string;
  size?: number;
};

const Star = ({ color = 'currentColor', size, width = 10, height = 10, ...props }: StarProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size ?? width}
    height={size ?? height}
    viewBox='-0.5 -0.5 12 12'
    fill='none'
    {...props}
  >
    <path
      fill={color}
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M5.263.647a.265.265 0 0 1 .475 0l1.155 2.34a1.062 1.062 0 0 0 .798.58l2.583.378a.265.265 0 0 1 .147.452L8.553 6.216a1.062 1.062 0 0 0-.306.939l.441 2.57a.265.265 0 0 1-.385.28L5.993 8.79a1.061 1.061 0 0 0-.986 0L2.7 10.005a.264.264 0 0 1-.385-.28l.44-2.57a1.061 1.061 0 0 0-.305-.939L.58 4.397a.265.265 0 0 1 .147-.453l2.582-.377a1.06 1.06 0 0 0 .799-.58L5.263.647Z'
    />
  </svg>
);

export default Star;
