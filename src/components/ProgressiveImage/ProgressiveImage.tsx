'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

import { blurhashToDataUrl } from './blurhashDataUrl';

// Drop-in replacement for `<Image>` that shows a BlurHash LQIP the instant
// the page is parsed, then fades in the real image when it finishes loading.
//
// When `blurhash` is absent we delegate to `<Image>` directly so there's no
// behavioural change on pages whose backend hasn't been re-deployed yet.
// When `blurhash` is malformed we also fall back silently.
//
// Decoding is deferred to an idle callback so a screen with N images
// (the restaurant detail page renders ~28) doesn't pay N × canvas decodes
// on hydration — that used to add hundreds of ms to TBT on slow 3G.

interface Props extends Omit<ImageProps, 'placeholder' | 'blurDataURL' | 'onLoadingComplete'> {
  blurhash?: string | null;
}

type IdleCb = (cb: () => void, opts?: { timeout: number }) => number;
type CancelIdleCb = (handle: number) => void;

function scheduleIdle(cb: () => void): () => void {
  if (typeof window === 'undefined') {
    cb();
    return () => undefined;
  }
  const ric = (window as unknown as { requestIdleCallback?: IdleCb }).requestIdleCallback;
  const cic = (window as unknown as { cancelIdleCallback?: CancelIdleCb }).cancelIdleCallback;
  if (ric) {
    const handle = ric(cb, { timeout: 500 });
    return () => cic?.(handle);
  }
  const handle = window.setTimeout(cb, 1);
  return () => window.clearTimeout(handle);
}

export default function ProgressiveImage({ blurhash, alt, style, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);
  // `null` = not yet decoded, `string` = decoded data URL, `false` = no
  // blurhash available / malformed. Deferring the decode means the first
  // paint pass runs without any main-thread canvas work; the browser's
  // own image pipeline handles the placeholder (solid background) until
  // the idle callback lands.
  const [blurDataURL, setBlurDataURL] = useState<string | false | null>(blurhash ? null : false);

  useEffect(() => {
    if (!blurhash) {
      setBlurDataURL(false);
      return;
    }
    let cancelled = false;
    const cancel = scheduleIdle(() => {
      if (cancelled) return;
      const url = blurhashToDataUrl(blurhash);
      setBlurDataURL(url ?? false);
    });
    return () => {
      cancelled = true;
      cancel();
    };
  }, [blurhash]);

  if (!blurDataURL) {
    return <Image alt={alt} style={style} {...rest} />;
  }

  return (
    <Image
      alt={alt}
      placeholder='blur'
      blurDataURL={blurDataURL}
      onLoadingComplete={() => setLoaded(true)}
      style={{
        ...style,
        transition: 'filter 350ms ease',
        filter: loaded ? 'none' : 'blur(8px)',
      }}
      {...rest}
    />
  );
}
