import * as React from 'react';

type EyeIconProps = React.SVGProps<SVGSVGElement> & {
  open?: boolean;
};

const EyeIcon: React.FC<EyeIconProps> = ({ open = true, ...props }) => {
  return open ? (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' {...props}>
      <path
        stroke='#90A1B9'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.333}
        d='M7.155 3.384a7.163 7.163 0 0 1 7.47 4.384.667.667 0 0 1 0 .464 7.164 7.164 0 0 1-.962 1.66M9.39 9.438A2 2 0 0 1 6.56 6.61'
      />
      <path
        stroke='#90A1B9'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.333}
        d='M11.653 11.665A7.166 7.166 0 0 1 1.375 8.232a.667.667 0 0 1 0-.464 7.167 7.167 0 0 1 2.964-3.43M1.333 1.333l13.334 13.333'
      />
    </svg>
  ) : (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' {...props}>
      <path
        stroke='#45556C'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.333}
        d='M1.375 8.232a.667.667 0 0 1 0-.464 7.167 7.167 0 0 1 13.25 0 .666.666 0 0 1 0 .464 7.166 7.166 0 0 1-13.25 0Z'
      />
      <path
        stroke='#45556C'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.333}
        d='M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'
      />
    </svg>
  );
};

export default EyeIcon;
