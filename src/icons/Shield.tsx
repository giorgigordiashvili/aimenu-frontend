import * as React from 'react';

const Shield = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M12 2L3 6V12C3 16.418 7.004 20.499 12 22C16.996 20.499 21 16.418 21 12V6L12 2Z'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
export default Shield;
