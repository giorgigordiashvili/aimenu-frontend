'use client';

import { styled } from '@pigment-css/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Order mirrors ProfileTabNav. Keep in sync if new tabs are added.
const TAB_ORDER = [
  '/profile/reservations',
  '/profile/loyalty',
  '/profile/settings',
  '/profile/payment',
];

function tabIndex(pathname: string): number {
  for (let i = 0; i < TAB_ORDER.length; i++) {
    if (pathname.includes(TAB_ORDER[i])) return i;
  }
  return 0;
}

// Outer wrapper stays mounted (so the ref-tracked "previous index" survives).
// Inner wrapper keys on pathname so React remounts it and the CSS
// animation restarts on every tab change.
const OuterWrap = styled('div')({
  width: '100%',
  overflowX: 'hidden', // guard against horizontal scrollbar during in-flight slide
});

const InnerWrap = styled('div')({
  width: '100%',
  willChange: 'transform, opacity',
  '@keyframes profileSlideInFromRight': {
    from: { transform: 'translate3d(24px, 0, 0)', opacity: 0 },
    to: { transform: 'translate3d(0, 0, 0)', opacity: 1 },
  },
  '@keyframes profileSlideInFromLeft': {
    from: { transform: 'translate3d(-24px, 0, 0)', opacity: 0 },
    to: { transform: 'translate3d(0, 0, 0)', opacity: 1 },
  },
  '&[data-direction="forward"]': {
    animation: 'profileSlideInFromRight .28s cubic-bezier(.2, .7, .3, 1)',
  },
  '&[data-direction="backward"]': {
    animation: 'profileSlideInFromLeft .28s cubic-bezier(.2, .7, .3, 1)',
  },
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none !important',
  },
});

interface Props {
  children: React.ReactNode;
}

export default function ProfileTabSlide({ children }: Props) {
  const pathname = usePathname();
  const prev = useRef<number | null>(null);
  const current = tabIndex(pathname);

  // Compute direction vs. prev *before* the effect that updates prev, so the
  // first render on a given path uses the previous-render's tab as reference.
  let direction: 'forward' | 'backward' | null = null;
  if (prev.current !== null && prev.current !== current) {
    direction = current > prev.current ? 'forward' : 'backward';
  }

  useEffect(() => {
    prev.current = current;
  }, [current]);

  return (
    <OuterWrap>
      <InnerWrap key={pathname} data-direction={direction ?? undefined}>
        {children}
      </InnerWrap>
    </OuterWrap>
  );
}
