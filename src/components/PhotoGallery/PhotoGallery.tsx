'use client';

import { keyframes, styled } from '@pigment-css/react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { blurhashToDataUrl } from '@/components/ProgressiveImage';
import { foreground, white } from '@/tokens';

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
  background:
    'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
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
  background: 'rgba(0, 0, 0, 0.9)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${fadeIn} 0.2s ease-out`,
});

const ModalContent = styled('div')({
  position: 'relative',
  width: '90%',
  maxWidth: '1200px',
  height: '80vh',
  animation: `${slideUp} 0.3s ease-out`,
});

const LightboxImageContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
});

// Low-res backdrop for the lightbox — the same URL is already cached from
// the grid thumbnail, so users on a slow connection see something
// immediately instead of a black box while the full-res decodes.
const LightboxThumb = styled(Image)({
  objectFit: 'contain',
  filter: 'blur(18px)',
  transform: 'scale(1.03)',
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

const CloseButton = styled('button')({
  position: 'absolute',
  top: '16px',
  right: '16px',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
  transition: 'background 0.2s ease',
  '&:hover': {
    background: white,
  },
});

const NavButton = styled('button')({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
  transition: 'background 0.2s ease',
  '&:hover': {
    background: white,
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const PrevButton = styled(NavButton)({
  left: '16px',
});

const NextButton = styled(NavButton)({
  right: '16px',
});

const Counter = styled('div')({
  position: 'absolute',
  bottom: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '8px 16px',
  borderRadius: '100px',
  background: 'rgba(0, 0, 0, 0.7)',
  color: white,
  fontSize: '14px',
  fontWeight: 500,
  zIndex: 10,
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
  // Progressive image for the lightbox: show the cached grid thumbnail
  // immediately and fade in the full-res once decoded.
  const [hiResLoaded, setHiResLoaded] = useState(false);

  const lightboxBlurhashUrl = useMemo(
    () => blurhashToDataUrl(blurhashes?.[currentIndex] ?? null),
    [blurhashes, currentIndex]
  );

  // Ensure we have at least one image
  const galleryImages = images.length > 0 ? images : [];

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setHiResLoaded(false);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

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
  }, []);

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goToPrevious = () => {
    setHiResLoaded(false);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const goToNext = () => {
    setHiResLoaded(false);
    setCurrentIndex(prev => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

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
        <Overlay onClick={closeLightbox} onKeyDown={handleKeyDown} role='dialog' aria-modal='true'>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={closeLightbox} aria-label='Close'>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M18 6L6 18M6 6L18 18'
                  stroke={foreground}
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </CloseButton>

            {galleryImages.length > 1 && (
              <>
                <PrevButton onClick={goToPrevious} aria-label='Previous image'>
                  <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M15 18L9 12L15 6'
                      stroke={foreground}
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </PrevButton>

                <NextButton onClick={goToNext} aria-label='Next image'>
                  <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M9 18L15 12L9 6'
                      stroke={foreground}
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </NextButton>

                <Counter>
                  {currentIndex + 1} / {galleryImages.length}
                </Counter>
              </>
            )}

            <LightboxImageContainer>
              {/* Inline BlurHash backdrop when available (paints instantly,
                  zero network). Falls back to the cached grid thumbnail. */}
              {lightboxBlurhashUrl ? (
                <BlurBackdrop
                  key={`bh-${currentIndex}`}
                  style={{ backgroundImage: `url(${lightboxBlurhashUrl})` }}
                />
              ) : (
                <LightboxThumb
                  key={`thumb-${currentIndex}`}
                  src={galleryImages[currentIndex]}
                  alt=''
                  aria-hidden='true'
                  fill
                  sizes='(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw'
                />
              )}
              <LightboxHiResLayer isLoaded={hiResLoaded}>
                <Image
                  key={`hi-${currentIndex}`}
                  src={galleryImages[currentIndex]}
                  alt={`${restaurantName} - photo ${currentIndex + 1}`}
                  fill
                  sizes='90vw'
                  style={{ objectFit: 'contain' }}
                  onLoad={() => setHiResLoaded(true)}
                />
              </LightboxHiResLayer>
            </LightboxImageContainer>
          </ModalContent>
        </Overlay>
      )}
    </>
  );
}
