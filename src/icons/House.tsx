import * as React from 'react';

const House = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none' {...props}>
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M10 14V8.667A.667.667 0 0 0 9.333 8H6.667A.667.667 0 0 0 6 8.667V14'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M2 6.667a1.333 1.333 0 0 1 .473-1.019l4.666-4a1.333 1.333 0 0 1 1.722 0l4.666 4A1.332 1.332 0 0 1 14 6.667v6A1.334 1.334 0 0 1 12.667 14H3.333A1.334 1.334 0 0 1 2 12.667v-6Z'
    />
  </svg>
);
export default House;
