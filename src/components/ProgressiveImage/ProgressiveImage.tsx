'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';

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

// Maximum time we'll hold the blur filter. If the real image hasn't fired
// `onLoad` within this window (CDN 404 / cold-TLS stall / broken URL), we
// remove the filter anyway so users don't end up staring at a permanent
// blurry smudge. The Image element still reports failures via onError,
// but that only fires on some failure modes — the timeout catches the rest.
const BLUR_TIMEOUT_MS = 6000;

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
  const imgRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<number | null>(null);

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

  // Catch cached images. Browsers don't re-fire `load` on an <img> whose
  // `complete` is already true, so if next/image mounted the real image
  // before our blurhash finished decoding, the onLoad handler attached
  // below would never fire and the blur would stay until BLUR_TIMEOUT_MS.
  // Poll `complete` once per render until it flips.
  useEffect(() => {
    if (loaded) return;
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  });

  // Safety net: if the real image never fires `load` (CDN 404, CORS, cold
  // connection that silently stalls, preload race where the event was
  // dropped), clear the blur anyway so we don't look frozen forever.
  useEffect(() => {
    if (loaded) return;
    timerRef.current = window.setTimeout(() => setLoaded(true), BLUR_TIMEOUT_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [loaded]);

  const blurActive = typeof blurDataURL === 'string' && !loaded;

  // Always render a single tree so `onLoad` stays attached across the
  // blurhash-decoding transition. Pass `placeholder` + `blurDataURL`
  // only once decoded; the CSS filter handles the fade.
  return (
    <Image
      ref={imgRef}
      alt={alt}
      {...(typeof blurDataURL === 'string'
        ? { placeholder: 'blur' as const, blurDataURL }
        : {})}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      style={{
        ...style,
        transition: 'filter 350ms ease',
        filter: blurActive ? 'blur(8px)' : 'none',
      }}
      {...rest}
    />
  );
}
