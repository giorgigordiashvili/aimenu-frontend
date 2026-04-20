'use client';

import { keyframes, styled } from '@pigment-css/react';
import Image from 'next/image';
import { useState } from 'react';

import { foreground, slate200, slate300, slate400, white } from '@/tokens';

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const slideUp = keyframes({
  from: { transform: 'scale(0.95)', opacity: 0 },
  to: { transform: 'scale(1)', opacity: 1 },
});

const Container = styled('div')({
  marginBottom: '24px',
  '@media (min-width: 768px)': {
    marginBottom: '32px',
  },
});

// Mobile: Single image
const MobileImageContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '300px',
  borderRadius: '16px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

// Desktop: Grid layout
const DesktopGrid = styled('div')({
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: '12px',
    height: '400px',
  },
});

const GridImageContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

const LargeGridImage = styled(GridImageContainer)({
  gridRow: 'span 2',
});

const ImagePlaceholder = styled('div')({
  width: '100%',
  height: '100%',
  background: `linear-gradient(135deg, ${slate200} 0%, ${slate300} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: slate400,
  fontSize: '14px',
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
  restaurantName: string;
}

export default function PhotoGallery({ images, restaurantName }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure we have at least one image
  const galleryImages = images.length > 0 ? images : [];

  // Prepare 5 images for desktop grid (1 large + 4 small)
  const desktopImages = galleryImages.length > 0 ? galleryImages.slice(0, 5) : [];
  while (desktopImages.length < 5 && desktopImages.length > 0) {
    desktopImages.push(galleryImages[0]);
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  if (galleryImages.length === 0) {
    return (
      <Container>
        <MobileImageContainer>
          <ImagePlaceholder>No images available</ImagePlaceholder>
        </MobileImageContainer>
      </Container>
    );
  }

  return (
    <>
      <Container>
        {/* Mobile: Single Image */}
        <MobileImageContainer onClick={() => openLightbox(0)}>
          <Image
            src={galleryImages[0]}
            alt={`${restaurantName} - main photo`}
            fill
            // The LCP element on mobile. Scoping `sizes` to the
            // viewports where this image is actually visible lets Next
            // pick a 420/640-bucketed src on phones instead of the
            // 750 bucket (~52 KB → ~22 KB on slow 3G).
            sizes='(min-width: 768px) 1px, 100vw'
            style={{ objectFit: 'cover' }}
            priority
            fetchPriority='high'
          />
        </MobileImageContainer>

        {/* Desktop: Grid Layout */}
        <DesktopGrid>
          {/* Large image on left (spans 2 rows) */}
          <LargeGridImage onClick={() => openLightbox(0)}>
            <Image
              src={desktopImages[0]}
              alt={`${restaurantName} - photo 1`}
              fill
              // Main layout caps at 1280px with 80px padding — the hero
              // column is at most ~640px wide on desktop. Reflecting
              // that in `sizes` keeps the downloaded image well under
              // the 750 bucket.
              sizes='(min-width: 1280px) 640px, (min-width: 768px) 50vw, 1px'
              style={{ objectFit: 'cover' }}
              priority
              fetchPriority='high'
            />
          </LargeGridImage>

          {/* 4 smaller images on right (2x2 grid) */}
          {desktopImages.slice(1, 5).map((image, index) => (
            <GridImageContainer key={index} onClick={() => openLightbox(index + 1)}>
              <Image
                src={image}
                alt={`${restaurantName} - photo ${index + 2}`}
                fill
                sizes='(min-width: 1280px) 220px, (min-width: 768px) 25vw, 1px'
                style={{ objectFit: 'cover' }}
                loading='lazy'
              />
            </GridImageContainer>
          ))}
        </DesktopGrid>
      </Container>

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
              <Image
                src={galleryImages[currentIndex]}
                alt={`${restaurantName} - photo ${currentIndex + 1}`}
                fill
                sizes='90vw'
                style={{ objectFit: 'contain' }}
              />
            </LightboxImageContainer>
          </ModalContent>
        </Overlay>
      )}
    </>
  );
}
