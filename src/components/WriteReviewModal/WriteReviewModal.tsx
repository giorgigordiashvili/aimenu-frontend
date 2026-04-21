'use client';

import { keyframes, styled } from '@pigment-css/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { createReview, REVIEW_MEDIA_LIMITS, uploadReviewMedia } from '@/api/reviews';
import type { EligibleOrder, Review } from '@/api/reviews';
import MainButton from '@/components/MainButton/MainButton';
import StarRating from '@/components/StarRating';
import { useTranslations } from '@/context/LocaleContext';
import Close from '@/icons/Close';
import {
  background,
  border,
  foreground,
  muted,
  radiusMd,
  rose600,
  slate100,
  slate500,
  white,
} from '@/tokens';

const slideUp = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
});

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  '@media (min-width: 768px)': {
    alignItems: 'center',
    padding: '40px',
  },
});

const Modal = styled('div')({
  background: white,
  width: '100%',
  height: '100dvh',
  borderRadius: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  animation: `${slideUp} 0.3s ease-out`,
  '@media (min-width: 768px)': {
    width: '100%',
    maxWidth: '600px',
    height: 'auto',
    maxHeight: '92vh',
    borderRadius: '20px',
    animation: `${fadeIn} 0.2s ease-out`,
  },
});

const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: `1px solid ${border}`,
});

const HeaderTitle = styled('h2')({
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
});

const CloseBtn = styled('button')({
  background: 'transparent',
  border: 'none',
  padding: '8px',
  cursor: 'pointer',
  color: slate500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Body = styled('div')({
  padding: '20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  flex: 1,
});

const OrderBanner = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: radiusMd,
  background: slate100,
});

const OrderThumb = styled('div')({
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  background: slate100,
  flexShrink: 0,
});

const OrderText = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

const OrderTitle = styled('span')({
  fontSize: '14px',
  fontWeight: 600,
  color: foreground,
});

const OrderMeta = styled('span')({
  fontSize: '12px',
  color: muted,
});

const FieldLabel = styled('label')({
  fontSize: '13px',
  fontWeight: 600,
  color: foreground,
  marginBottom: '8px',
  display: 'block',
});

const TextInput = styled('input')({
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: `1px solid ${border}`,
  fontSize: '14px',
  color: foreground,
  background: white,
  '&:focus': {
    outline: 'none',
    borderColor: foreground,
  },
});

const TextArea = styled('textarea')({
  width: '100%',
  minHeight: '110px',
  padding: '10px 12px',
  borderRadius: '10px',
  border: `1px solid ${border}`,
  fontSize: '14px',
  color: foreground,
  background: white,
  resize: 'vertical',
  fontFamily: 'inherit',
  '&:focus': {
    outline: 'none',
    borderColor: foreground,
  },
});

const Dropzone = styled('label')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  border: `2px dashed ${border}`,
  borderRadius: '12px',
  cursor: 'pointer',
  gap: '6px',
  color: muted,
  fontSize: '13px',
  textAlign: 'center',
  '&:hover': { borderColor: foreground },
});

const HiddenInput = styled('input')({
  position: 'absolute',
  width: 0,
  height: 0,
  opacity: 0,
});

const PreviewGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
  gap: '8px',
});

const Preview = styled('div')({
  position: 'relative',
  aspectRatio: '1 / 1',
  borderRadius: '10px',
  overflow: 'hidden',
  background: slate100,
  '& img, & video': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

const RemoveBtn = styled('button')({
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '24px',
  height: '24px',
  borderRadius: '999px',
  background: 'rgba(0,0,0,0.6)',
  color: white,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
});

const ProgressBar = styled('div')({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: '3px',
  background: 'rgba(0,0,0,0.2)',
  overflow: 'hidden',
});

const ProgressFill = styled('div')({
  height: '100%',
  background: rose600,
  transition: 'width 0.1s linear',
});

const ErrorText = styled('p')({
  fontSize: '13px',
  color: '#b91c1c',
  margin: 0,
});

const Footer = styled('div')({
  padding: '14px 20px',
  borderTop: `1px solid ${border}`,
  background: background,
  display: 'flex',
  gap: '12px',
});

// ── Video duration preflight (saves a server round-trip for oversize clips) ──
function readVideoDuration(file: File): Promise<number> {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => {
      const d = v.duration;
      URL.revokeObjectURL(url);
      resolve(isFinite(d) ? d : 0);
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
    v.src = url;
  });
}

interface PendingMedia {
  id: string;
  file: File;
  kind: 'image' | 'video';
  previewUrl: string;
  durationS?: number;
  progress: number;
}

interface Props {
  open: boolean;
  order: EligibleOrder | null;
  onClose: () => void;
  onSubmitted: (review: Review) => void;
}

export default function WriteReviewModal({ open, order, onClose, onSubmitted }: Props) {
  const t = useTranslations();
  const copy = t.reviews;

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [media, setMedia] = useState<PendingMedia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset the local state every time the modal opens against a new order.
  useEffect(() => {
    if (open) {
      setRating(0);
      setTitle('');
      setBody('');
      setMedia([]);
      setError(null);
      setSubmitting(false);
    }
  }, [open, order?.id]);

  const imageCount = media.filter(m => m.kind === 'image').length;
  const videoCount = media.filter(m => m.kind === 'video').length;

  const addFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      setError(null);
      const next: PendingMedia[] = [];
      for (const f of Array.from(files)) {
        const isImage = f.type.startsWith('image/');
        const isVideo = f.type.startsWith('video/');
        if (!isImage && !isVideo) continue;

        if (isImage) {
          if (
            imageCount + next.filter(n => n.kind === 'image').length >=
            REVIEW_MEDIA_LIMITS.maxImages
          ) {
            setError(copy.imageLimit);
            continue;
          }
          if (f.size > REVIEW_MEDIA_LIMITS.maxImageBytes) {
            setError(copy.imageTooLarge);
            continue;
          }
          next.push({
            id: crypto.randomUUID(),
            file: f,
            kind: 'image',
            previewUrl: URL.createObjectURL(f),
            progress: 0,
          });
        } else {
          if (
            videoCount + next.filter(n => n.kind === 'video').length >=
            REVIEW_MEDIA_LIMITS.maxVideos
          ) {
            setError(copy.videoLimit);
            continue;
          }
          if (f.size > REVIEW_MEDIA_LIMITS.maxVideoBytes) {
            setError(copy.videoTooLarge);
            continue;
          }
          const duration = await readVideoDuration(f);
          if (duration > REVIEW_MEDIA_LIMITS.maxVideoDurationS) {
            setError(copy.videoTooLong);
            continue;
          }
          next.push({
            id: crypto.randomUUID(),
            file: f,
            kind: 'video',
            previewUrl: URL.createObjectURL(f),
            durationS: duration,
            progress: 0,
          });
        }
      }
      if (next.length) setMedia(prev => [...prev, ...next]);
    },
    [
      copy.imageLimit,
      copy.imageTooLarge,
      copy.videoLimit,
      copy.videoTooLarge,
      copy.videoTooLong,
      imageCount,
      videoCount,
    ]
  );

  const removeMedia = (id: string) => {
    setMedia(prev => {
      const target = prev.find(m => m.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter(m => m.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (!order) return;
    if (rating < 1) {
      setError(copy.ratingRequired);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const review = await createReview({ order: order.id, rating, title, body });
      for (const item of media) {
        await uploadReviewMedia(review.id, item.file, item.kind, item.durationS, p => {
          setMedia(prev =>
            prev.map(m =>
              m.id === item.id ? { ...m, progress: p.total ? p.loaded / p.total : 0 } : m
            )
          );
        });
      }
      onSubmitted(review);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.error('[createReview]', e);
      setError(copy.submitError);
      setSubmitting(false);
    }
  };

  if (!open || !order) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <HeaderTitle>{copy.writeTitle}</HeaderTitle>
          <CloseBtn type='button' aria-label={copy.close} onClick={onClose}>
            <Close />
          </CloseBtn>
        </Header>

        <Body>
          <OrderBanner>
            <OrderThumb
              style={
                order.restaurant_logo
                  ? { backgroundImage: `url(${order.restaurant_logo})` }
                  : undefined
              }
            />
            <OrderText>
              <OrderTitle>{order.restaurant_name}</OrderTitle>
              <OrderMeta>
                {order.order_number} · {order.total} ₾
              </OrderMeta>
            </OrderText>
          </OrderBanner>

          <div>
            <FieldLabel>{copy.ratingLabel}</FieldLabel>
            <StarRating value={rating} onChange={setRating} size={28} />
          </div>

          <div>
            <FieldLabel htmlFor='review-title'>{copy.titleLabel}</FieldLabel>
            <TextInput
              id='review-title'
              maxLength={120}
              placeholder={copy.titlePlaceholder}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor='review-body'>{copy.bodyLabel}</FieldLabel>
            <TextArea
              id='review-body'
              maxLength={4000}
              placeholder={copy.bodyPlaceholder}
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>{copy.mediaLabel}</FieldLabel>
            <Dropzone>
              <HiddenInput
                ref={fileInputRef}
                type='file'
                accept='image/*,video/*'
                multiple
                onChange={e => {
                  void addFiles(e.target.files);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              />
              <span>{copy.mediaDropzone}</span>
              <OrderMeta>{copy.mediaLimitsCopy}</OrderMeta>
            </Dropzone>
            {media.length > 0 && (
              <PreviewGrid style={{ marginTop: '8px' }}>
                {media.map(m => (
                  <Preview key={m.id}>
                    {m.kind === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.previewUrl} alt='' />
                    ) : (
                      <video src={m.previewUrl} muted />
                    )}
                    {m.progress > 0 && m.progress < 1 && (
                      <ProgressBar>
                        <ProgressFill style={{ width: `${m.progress * 100}%` }} />
                      </ProgressBar>
                    )}
                    {!submitting && (
                      <RemoveBtn
                        type='button'
                        onClick={() => removeMedia(m.id)}
                        aria-label={copy.remove}
                      >
                        ×
                      </RemoveBtn>
                    )}
                  </Preview>
                ))}
              </PreviewGrid>
            )}
          </div>

          {error && <ErrorText>{error}</ErrorText>}
        </Body>

        <Footer>
          <MainButton variant='ghost' title={copy.cancel} onClick={onClose} disabled={submitting} />
          <MainButton
            variant='rose_cta'
            title={submitting ? copy.submitting : copy.submit}
            onClick={handleSubmit}
            disabled={submitting || rating < 1}
            fullWidth
          />
        </Footer>
      </Modal>
    </Overlay>
  );
}
