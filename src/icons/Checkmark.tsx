import * as React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const Checkmark: React.FC<Props> = props => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' {...props}>
    <path
      d='M3.333 8.666 6 11.333l6.666-6.667'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
    />
  </svg>
);

export default Checkmark;
