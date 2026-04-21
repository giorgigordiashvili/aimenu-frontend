'use client';

import { keyframes, styled } from '@pigment-css/react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { blurhashToDataUrl } from '@/components/ProgressiveImage';
import { white } from '@/tokens';

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const slideUp = keyframes({
  from: { transform: 'scale(0.95)', opacity: 0 },
  to: { transform: 'scale(1)', opacity: 1 },
});

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
});

// Base layer: shimmer skeleton that shows before blurhash decodes (SSR has
// no blurhash data URL, and canvas-decoding on hydration takes a frame or
// two). When the decoded blurhash is passed via inline `backgroundImage`,
// it layers on top and hides the shimmer.
const BlurBackdrop = styled('div')({
  position: 'absolute',
  inset: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(6px)',
  transform: 'scale(1.05)',
  zIndex: 0,
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundRepeat: 'repeat-x',
  // Fallback animation only runs while the solid gradient is visible; once
  // an inline background-image (blurhash) overrides the gradient the
  // keyframe has nothing to animate over.
  animation: `${shimmer} 1.5s infinite`,
});

// Lightbox Modal Styles
const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  background: 'rgba(8, 9, 12, 0.94)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  animation: `${fadeIn} 0.2s ease-out`,
  '@media (max-width: 640px)': {
    padding: '0',
  },
});

const ModalContent = styled('div')({
  position: 'relative',
  width: '100%',
  maxWidth: '1200px',
  height: 'min(92vh, 1000px)',
  display: 'flex',
  flexDirection: 'column',
  animation: `${slideUp} 0.28s ease-out`,
  '@media (max-width: 640px)': {
    height: '100dvh',
    maxWidth: '100%',
  },
});

const LightboxImageContainer = styled('div')({
  position: 'relative',
  width: '100%',
  flex: 1,
  borderRadius: '12px',
  overflow: 'hidden',
  '@media (max-width: 640px)': {
    borderRadius: 0,
  },
});

// Neutral backdrop shown while the hi-res image is loading or when no
// blurhash is available. Previously this was a duplicate <Image> of the
// same hi-res URL with a CSS blur — which forced the browser to download
// the full photo twice.
const NeutralBackdrop = styled('div')({
  position: 'absolute',
  inset: 0,
  background: 'rgba(20, 20, 22, 0.85)',
});

interface HiResWrapProps {
  isLoaded?: boolean;
}

const LightboxHiResLayer = styled('div')<HiResWrapProps>({
  position: 'absolute',
  inset: 0,
  opacity: 0,
  transition: 'opacity 0.25s ease-out',
  variants: [
    {
      props: { isLoaded: true },
      style: { opacity: 1 },
    },
  ],
});

// Circular control button — used for Close + Prev/Next. Uses a dark
// translucent fill with a light icon instead of a white disc, which
// readably sits on top of any image (previously bright photos hid the
// white close button).
const CircleBtn = styled('button')({
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  background: 'rgba(20, 20, 22, 0.55)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: white,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  transition: 'background 0.15s ease, transform 0.15s ease',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  '&:hover:not(:disabled)': {
    background: 'rgba(40, 40, 44, 0.75)',
  },
  '&:focus-visible': {
    outline: `2px solid ${white}`,
    outlineOffset: '2px',
  },
  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
});

const CloseButton = styled(CircleBtn)({
  position: 'absolute',
  top: '16px',
  right: '16px',
  zIndex: 10,
  '@media (max-width: 640px)': {
    top: 'max(12px, env(safe-area-inset-top))',
    right: '12px',
  },
});

const NavButton = styled(CircleBtn)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '48px',
  height: '48px',
  zIndex: 10,
  '&:hover:not(:disabled)': {
    transform: 'translateY(-50%) scale(1.05)',
    background: 'rgba(40, 40, 44, 0.75)',
  },
});

const PrevButton = styled(NavButton)({
  left: '16px',
  '@media (max-width: 640px)': {
    left: '8px',
  },
});

const NextButton = styled(NavButton)({
  right: '16px',
  '@media (max-width: 640px)': {
    right: '8px',
  },
});

const Counter = styled('div')({
  position: 'absolute',
  bottom: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '6px 14px',
  borderRadius: '100px',
  background: 'rgba(20, 20, 22, 0.6)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  color: white,
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '0.02em',
  zIndex: 10,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  '@media (max-width: 640px)': {
    bottom: 'max(16px, env(safe-area-inset-bottom))',
  },
});

const ErrorMessage = styled('div')({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '14px',
  zIndex: 5,
});

interface PhotoGalleryProps {
  images: string[];
  /** Parallel array of BlurHash strings for each image (optional). */
  blurhashes?: (string | null | undefined)[];
  restaurantName: string;
}

export default function PhotoGallery({ images, blurhashes, restaurantName }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Progressive image for the lightbox: show the blurhash backdrop first,
  // fade the full-res in once loaded.
  const [hiResLoaded, setHiResLoaded] = useState(false);
  // Differentiate "still loading" from "load failed". Without this the
  // lightbox would silently show a blurred backdrop forever when a CDN
  // image 404s — same bug class we fixed in ProgressiveImage.
  const [hiResFailed, setHiResFailed] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  // Remember what had focus before we opened the lightbox so we can put
  // it back on close — WAI-ARIA modal-dialog best practice.
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const lightboxBlurhashUrl = useMemo(
    () => blurhashToDataUrl(blurhashes?.[currentIndex] ?? null),
    [blurhashes, currentIndex]
  );

  // Ensure we have at least one image
  const galleryImages = images.length > 0 ? images : [];

  const openLightbox = useCallback((index: number) => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setCurrentIndex(index);
    setHiResLoaded(false);
    setHiResFailed(false);
    setLightboxOpen(true);
  }, []);

  // Desktop drops the photo grid and instead shows action icons in
  // RestaurantDetailInfo. The Gallery icon dispatches this event to open
  // the lightbox without needing to lift state out of PhotoGallery.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ index?: number }>).detail;
      openLightbox(detail?.index ?? 0);
    };
    window.addEventListener('photo-gallery:open', handler);
    return () => window.removeEventListener('photo-gallery:open', handler);
  }, [openLightbox]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToPrevious = useCallback(() => {
    setHiResLoaded(false);
    setHiResFailed(false);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  }, [galleryImages.length]);

  const goToNext = useCallback(() => {
    setHiResLoaded(false);
    setHiResFailed(false);
    setCurrentIndex(prev => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  }, [galleryImages.length]);

  // Scroll lock + keyboard handling + initial focus, all gated on
  // `lightboxOpen` so cleanup runs automatically when the modal closes
  // OR when the component unmounts mid-flight (e.g. user navigates via
  // Next.js router with the lightbox still open).
  useEffect(() => {
    if (!lightboxOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Keyboard shortcuts — attached to window because the overlay <div>
    // never receives focus in practice.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft' && galleryImages.length > 1) {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight' && galleryImages.length > 1) {
        e.preventDefault();
        goToNext();
      }
    };
    window.addEventListener('keydown', onKey);

    // Move focus to the close button so a) screen readers announce the
    // dialog, b) keyboard users can Tab through nav controls + Close
    // without landing on elements behind the overlay.
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lastFocusedRef.current?.focus?.();
    };
  }, [lightboxOpen, galleryImages.length, closeLightbox, goToPrevious, goToNext]);

  // Preload the neighbouring images once the lightbox is open so Prev/Next
  // doesn't re-trigger the blur-to-sharp cycle on every click. Browser
  // image cache handles the actual storage; we just prime it.
  const preloadUrls = useMemo(() => {
    if (!lightboxOpen || galleryImages.length < 2) return [] as string[];
    const prev = galleryImages[(currentIndex - 1 + galleryImages.length) % galleryImages.length];
    const next = galleryImages[(currentIndex + 1) % galleryImages.length];
    return [prev, next].filter(Boolean);
  }, [lightboxOpen, currentIndex, galleryImages]);

  if (galleryImages.length === 0) {
    // No images = no lightbox to open. The Gallery icon won't have
    // anything to show but that's handled gracefully by early-return.
    return null;
  }

  return (
    <>
      {/* No hero image on mobile or desktop any more — the Gallery icon
          in RestaurantDetailInfo opens the lightbox via a window event.
          This component is only here for that listener + the lightbox. */}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <Overlay
          onClick={closeLightbox}
          role='dialog'
          aria-modal='true'
          aria-label={`${restaurantName} photo viewer`}
        >
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton ref={closeButtonRef} onClick={closeLightbox} aria-label='Close gallery'>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                <path
                  d='M18 6L6 18M6 6L18 18'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </CloseButton>

            {galleryImages.length > 1 && (
              <>
                <PrevButton onClick={goToPrevious} aria-label='Previous image'>
                  <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                    <path
                      d='M15 18L9 12L15 6'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </PrevButton>

                <NextButton onClick={goToNext} aria-label='Next image'>
                  <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                    <path
                      d='M9 18L15 12L9 6'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </NextButton>

                <Counter aria-live='polite'>
                  {currentIndex + 1} / {galleryImages.length}
                </Counter>
              </>
            )}

            <LightboxImageContainer>
              {/* BlurHash when the API provided one, solid dark backdrop
                  otherwise. Never re-use the hi-res URL as a "thumb" — it
                  would double the network cost. */}
              {lightboxBlurhashUrl ? (
                <BlurBackdrop
                  key={`bh-${currentIndex}`}
                  style={{ backgroundImage: `url(${lightboxBlurhashUrl})` }}
                />
              ) : (
                <NeutralBackdrop />
              )}
              <LightboxHiResLayer isLoaded={hiResLoaded && !hiResFailed}>
                <Image
                  key={`hi-${currentIndex}`}
                  src={galleryImages[currentIndex]}
                  alt={`${restaurantName} — photo ${currentIndex + 1} of ${galleryImages.length}`}
                  fill
                  sizes='(min-width: 1280px) 1200px, 100vw'
                  priority
                  style={{ objectFit: 'contain' }}
                  onLoad={() => setHiResLoaded(true)}
                  onError={() => {
                    setHiResFailed(true);
                    setHiResLoaded(true); // fade out the blur layer
                  }}
                />
              </LightboxHiResLayer>
              {hiResFailed && <ErrorMessage>Image unavailable</ErrorMessage>}
            </LightboxImageContainer>
          </ModalContent>

          {/* Off-screen prefetch of the neighbouring images so Prev/Next
              is instant. Browser cache dedupes subsequent real requests. */}
          {preloadUrls.map(url => (
            <link key={`pre-${url}`} rel='prefetch' as='image' href={url} />
          ))}
        </Overlay>
      )}
    </>
  );
}
