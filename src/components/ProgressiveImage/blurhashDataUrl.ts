import { decode } from 'blurhash';

// Decode a BlurHash string into a tiny data URL the browser can render
// immediately — used as `placeholder="blur"` / `blurDataURL` on next/image.
//
// Cached per-hash because decoding is a few ms on first call; re-rendering
// the same card (scroll / route) would otherwise pay it again.
const cache = new Map<string, string>();

export function blurhashToDataUrl(hash: string | null | undefined, size = 32): string | null {
  if (!hash || hash.length < 6) return null;
  const key = `${hash}:${size}`;
  const cached = cache.get(key);
  if (cached) return cached;
  try {
    const pixels = decode(hash, size, size);
    // Canvas decoding only runs client-side. On the server we bail out
    // cleanly — the component falls back to rendering without a placeholder.
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const imageData = ctx.createImageData(size, size);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
    const url = (canvas as HTMLCanvasElement).toDataURL('image/png');
    cache.set(key, url);
    return url;
  } catch {
    return null;
  }
}
