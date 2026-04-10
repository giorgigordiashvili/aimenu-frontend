import * as React from 'react';

type EmailIconProps = React.SVGProps<SVGSVGElement> & { open?: boolean };

const EmailIcon = ({ width = 16, height = 16, open: _open, ...props }: EmailIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    viewBox='0 0 16 16'
    fill='none'
    {...props}
  >
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M14.659 4.664 8.668 8.48a1.333 1.333 0 0 1-1.339 0L1.332 4.664'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M13.326 2.665H2.665c-.736 0-1.333.597-1.333 1.333v7.996c0 .736.597 1.333 1.333 1.333h10.661c.736 0 1.333-.597 1.333-1.333V3.998c0-.736-.597-1.333-1.333-1.333Z'
    />
  </svg>
);
export default EmailIcon;
