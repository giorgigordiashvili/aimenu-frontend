import * as React from 'react';

const History = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={20}
    height={20}
    viewBox='0 0 20 20'
    fill='none'
    {...props}
  >
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.666}
      d='M2.5 9.993a7.495 7.495 0 1 0 7.495-7.495A8.12 8.12 0 0 0 4.382 4.78L2.5 6.662'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.666}
      d='M2.5 2.498v4.164h4.164M9.992 5.83v4.163l3.331 1.666'
    />
  </svg>
);
export default History;
