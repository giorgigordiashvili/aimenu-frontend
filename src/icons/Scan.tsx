import * as React from 'react';

const ScanIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.818}
      d="M6.667 2.5h-1.5c-.934 0-1.4 0-1.757.182-.314.16-.569.414-.728.728-.182.357-.182.823-.182 1.757v1.5M6.667 17.5h-1.5c-.934 0-1.4 0-1.757-.182a1.666 1.666 0 0 1-.728-.728c-.182-.357-.182-.823-.182-1.757v-1.5m15-6.666v-1.5c0-.934 0-1.4-.182-1.757a1.666 1.666 0 0 0-.728-.728c-.357-.182-.823-.182-1.757-.182h-1.5M17.5 13.333v1.5c0 .934 0 1.4-.182 1.757-.16.314-.414.569-.728.728-.357.182-.823.182-1.757.182h-1.5m0-7.5a3.333 3.333 0 1 1-6.666 0 3.333 3.333 0 0 1 6.666 0Z"
    />
  </svg>
);

export default ScanIcon;
