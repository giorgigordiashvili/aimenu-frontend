import * as React from 'react';

import { iconStroke } from '@/tokens';

interface ClockIconProps {
  size?: number;
}

const ClockIcon = ({ size = 16 }: ClockIconProps) => {
  const scale = size / 16;
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} fill='none'>
      <path
        stroke={iconStroke}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.333 * scale}
        d={`M${8 * scale} ${4 * scale}v${4 * scale}l${2.667 * scale} ${1.333 * scale}`}
      />
      <path
        stroke={iconStroke}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.333 * scale}
        d={`M${8 * scale} ${14.666 * scale}A${6.667 * scale} ${6.667 * scale} 0 1 0 ${8 * scale} ${1.333 * scale}a${6.667 * scale} ${6.667 * scale} 0 0 0 0 ${13.333 * scale}Z`}
      />
    </svg>
  );
};
export default ClockIcon;
