import * as React from 'react';

const People = ({ open: _open, ...props }: React.SVGProps<SVGSVGElement> & { open?: boolean }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    viewBox='0 0 16 16'
    fill='none'
    {...props}
  >
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M10.667 14v-1.333A2.667 2.667 0 0 0 8 10H4a2.667 2.667 0 0 0-2.667 2.667V14M10.667 2.085a2.667 2.667 0 0 1 0 5.163M14.667 14v-1.333a2.667 2.667 0 0 0-2-2.58M6 7.333A2.667 2.667 0 1 0 6 2a2.667 2.667 0 0 0 0 5.333Z'
    />
  </svg>
);
export default People;
