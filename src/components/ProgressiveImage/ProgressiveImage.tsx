'use client';

import Image, { type ImageProps } from 'next/image';
import { useMemo, useState } from 'react';

import { blurhashToDataUrl } from './blurhashDataUrl';

// Drop-in replacement for `<Image>` that shows a BlurHash LQIP the instant
// the page is parsed, then fades in the real image when it finishes loading.
//
// When `blurhash` is absent we delegate to `<Image>` directly so there's no
// behavioural change on pages whose backend hasn't been re-deployed yet.
// When `blurhash` is malformed we also fall back silently.

interface Props extends Omit<ImageProps, 'placeholder' | 'blurDataURL' | 'onLoadingComplete'> {
  blurhash?: string | null;
}

export default function ProgressiveImage({ blurhash, alt, style, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);

  const blurDataURL = useMemo(() => blurhashToDataUrl(blurhash), [blurhash]);

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
