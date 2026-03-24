import * as React from 'react';
const Security = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none' {...props}>
    <g
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.666}
      clipPath='url(#a)'
    >
      <path d='M16.662 10.83c0 4.166-2.916 6.25-6.382 7.457a.833.833 0 0 1-.558-.008c-3.474-1.2-6.39-3.283-6.39-7.448V4.999a.833.833 0 0 1 .833-.833c1.666 0 3.75-1 5.199-2.267a.975.975 0 0 1 1.266 0c1.458 1.275 3.533 2.267 5.199 2.267a.833.833 0 0 1 .833.833v5.832Z' />
      <path d='m7.5 9.998 1.666 1.666L12.5 8.33' />
    </g>
    <defs>
      <clipPath id='a'>
        <path fill='#fff' d='M0 0h19.995v19.995H0z' />
      </clipPath>
    </defs>
  </svg>
);
export default Security;
