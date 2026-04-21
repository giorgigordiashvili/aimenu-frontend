'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import type { Review } from '@/api/reviews';
import { reportReview } from '@/api/reviews';
import MainButton from '@/components/MainButton/MainButton';
import StarRating from '@/components/StarRating';
import { useTranslations } from '@/context/LocaleContext';
import Close from '@/icons/Close';
import Fail from '@/icons/Fail';
import { background, border, foreground, muted, radiusMd, slate100, white } from '@/tokens';

const Card = styled('article')({
  padding: '20px',
  borderRadius: radiusMd,
  border: `1px solid ${border}`,
  background: white,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const Head = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const Avatar = styled('div')({
  width: '40px',
  height: '40px',
  borderRadius: '999px',
  background: slate100,
  color: muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 700,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  flexShrink: 0,
});

const NameBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

const Name = styled('span')({
  fontSize: '14px',
  fontWeight: 600,
  color: foreground,
  lineHeight: 1.3,
});

const Meta = styled('span')({
  fontSize: '12px',
  color: muted,
  lineHeight: 1.3,
});

const Title = styled('h4')({
  fontSize: '15px',
  fontWeight: 600,
  color: foreground,
  margin: 0,
});

const Body = styled('p')({
  fontSize: '14px',
  lineHeight: 1.55,
  color: foreground,
  margin: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});

const MediaGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))',
  gap: '8px',
});

const MediaThumb = styled('button')({
  border: 'none',
  padding: 0,
  background: 'transparent',
  cursor: 'pointer',
  position: 'relative',
  aspectRatio: '1 / 1',
  borderRadius: '10px',
  overflow: 'hidden',
  '& img, & video': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  '&:focus-visible': {
    outline: `2px solid ${foreground}`,
    outlineOffset: '2px',
  },
});

const VideoOverlay = styled('span')({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.3)',
  color: white,
  fontSize: '24px',
  fontWeight: 800,
});

const Lightbox = styled('div')({
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  background: 'rgba(0,0,0,0.92)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
});

const LightboxInner = styled('div')({
  maxWidth: '96vw',
  maxHeight: '92vh',
  '& img, & video': {
    maxWidth: '96vw',
    maxHeight: '92vh',
    borderRadius: '8px',
  },
});

const LightboxClose = styled('button')({
  position: 'absolute',
  top: '16px',
  right: '16px',
  width: '40px',
  height: '40px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.1)',
  border: 'none',
  color: white,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Actions = styled('div')({
  display: 'flex',
  gap: '8px',
  marginTop: '4px',
});

const ReportPanel = styled('div')({
  background: background,
  border: `1px solid ${border}`,
  borderRadius: '10px',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const ReportLabel = styled('span')({
  fontSize: '12px',
  color: muted,
});

const ReportSelect = styled('select')({
  width: '100%',
  padding: '8px',
  borderRadius: '8px',
  border: `1px solid ${border}`,
  background: white,
  fontSize: '14px',
  color: foreground,
});

const ReportTextarea = styled('textarea')({
  width: '100%',
  minHeight: '60px',
  padding: '8px',
  borderRadius: '8px',
  border: `1px solid ${border}`,
  fontSize: '14px',
  color: foreground,
  resize: 'vertical',
  fontFamily: 'inherit',
});

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface Props {
  review: Review;
  onDeleted?: (id: string) => void;
  onEdit?: (review: Review) => void;
}

export default function ReviewCard({ review, onEdit }: Props) {
  const t = useTranslations();
  const copy = t.reviews;
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState('spam');
  const [notes, setNotes] = useState('');
  const [reportState, setReportState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const createdAt = new Date(review.created_at).toLocaleDateString();
  const edited = review.edited_at ? ` · ${copy.editedBadge}` : '';

  const submitReport = async () => {
    setReportState('loading');
    try {
      await reportReview(review.id, { reason, notes });
      setReportState('done');
    } catch {
      setReportState('error');
    }
  };

  const openMedia = lightbox !== null ? review.media[lightbox] : null;

  return (
    <Card>
      <Head>
        <Avatar
          style={review.user_avatar ? { backgroundImage: `url(${review.user_avatar})` } : undefined}
        >
          {!review.user_avatar && initials(review.user_name)}
        </Avatar>
        <NameBlock>
          <Name>{review.user_name}</Name>
          <Meta>
            {createdAt}
            {edited}
          </Meta>
        </NameBlock>
        <div style={{ marginLeft: 'auto' }}>
          <StarRating value={review.rating} readOnly size={16} />
        </div>
      </Head>

      {review.title && <Title>{review.title}</Title>}
      {review.body && <Body>{review.body}</Body>}

      {review.media.length > 0 && (
        <MediaGrid>
          {review.media.map((m, i) => (
            <MediaThumb
              key={m.id}
              type='button'
              onClick={() => setLightbox(i)}
              aria-label={m.kind === 'image' ? copy.openImage : copy.openVideo}
            >
              {m.kind === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.file_url}
                  alt=''
                  loading='lazy'
                  style={
                    m.blurhash
                      ? {
                          backgroundImage: `url(${m.file_url})`,
                          backgroundSize: 'cover',
                        }
                      : undefined
                  }
                />
              ) : (
                <>
                  <video src={m.file_url} preload='metadata' muted />
                  <VideoOverlay>▶</VideoOverlay>
                </>
              )}
            </MediaThumb>
          ))}
        </MediaGrid>
      )}

      <Actions>
        {review.is_mine && review.is_editable && onEdit && (
          <MainButton
            variant='outline'
            size='extra_small'
            title={copy.editCta}
            onClick={() => onEdit(review)}
          />
        )}
        {review.can_report && !reporting && reportState === 'idle' && (
          <MainButton
            variant='ghost'
            size='extra_small'
            icon={Fail}
            title={copy.reportCta}
            onClick={() => setReporting(true)}
          />
        )}
        {review.can_report && review.open_reports > 0 && (
          <Meta style={{ marginLeft: 'auto' }}>
            {copy.openReports}: {review.open_reports}
          </Meta>
        )}
      </Actions>

      {reporting && reportState !== 'done' && (
        <ReportPanel>
          <ReportLabel>{copy.reportReasonLabel}</ReportLabel>
          <ReportSelect value={reason} onChange={e => setReason(e.target.value)}>
            <option value='spam'>{copy.reportReasonSpam}</option>
            <option value='offensive'>{copy.reportReasonOffensive}</option>
            <option value='not_a_customer'>{copy.reportReasonNotCustomer}</option>
            <option value='off_topic'>{copy.reportReasonOffTopic}</option>
            <option value='other'>{copy.reportReasonOther}</option>
          </ReportSelect>
          <ReportTextarea
            placeholder={copy.reportNotesPlaceholder}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
          {reportState === 'error' && <Meta>{copy.reportError}</Meta>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <MainButton
              variant='rose_cta'
              size='small'
              title={reportState === 'loading' ? copy.reportSubmitting : copy.reportSubmit}
              onClick={submitReport}
              disabled={reportState === 'loading'}
            />
            <MainButton
              variant='ghost'
              size='small'
              title={copy.cancel}
              onClick={() => {
                setReporting(false);
                setReportState('idle');
              }}
            />
          </div>
        </ReportPanel>
      )}

      {reportState === 'done' && <Meta>{copy.reportSubmitted}</Meta>}

      {openMedia && (
        <Lightbox onClick={() => setLightbox(null)}>
          <LightboxClose type='button' aria-label={copy.close}>
            <Close />
          </LightboxClose>
          <LightboxInner onClick={e => e.stopPropagation()}>
            {openMedia.kind === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={openMedia.file_url} alt='' />
            ) : (
              <video src={openMedia.file_url} controls autoPlay />
            )}
          </LightboxInner>
        </Lightbox>
      )}
    </Card>
  );
}
