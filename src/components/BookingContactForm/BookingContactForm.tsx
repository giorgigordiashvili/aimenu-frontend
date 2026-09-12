'use client';

import { styled } from '@pigment-css/react';

import MainButton from '@/components/MainButton/MainButton';
import TextArea from '@/components/TextArea/TextArea';
import TextInput from '@/components/TextInput/TextInput';
import { useTranslations } from '@/context/LocaleContext';
import ArrowIcon from '@/icons/Arrow';
import { foreground, slate500 } from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  name: string;
  phone: string;
  email: string;
  notes: string;
  marketingOptIn?: boolean;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
  onEmail: (v: string) => void;
  onNotes: (v: string) => void;
  onMarketingOptIn?: (v: boolean) => void;
  showSubmitButton?: boolean;
  onSubmit?: () => void;
};

// ─── Inline icons ─────────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
      <ArrowIcon color='#ffffff' size={16} />
    </span>
  );
}

// ─── Styled components ────────────────────────────────────────────────────────

const Title = styled('h2')({
  fontSize: '16px',
  fontWeight: 600,
  color: foreground,
  margin: '0 0 4px 0',
  letterSpacing: '-0.15px',
});

const Subtitle = styled('p')({
  fontSize: '13px',
  fontWeight: 400,
  color: slate500,
  margin: '0 0 16px 0',
  lineHeight: '18px',
});

const FieldGroup = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const PhoneEmailRow = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  '@media (min-width: 768px)': {
    flexDirection: 'row',
    gap: '12px',
    '& > div': { flex: 1, minWidth: 0 },
  },
});

const SubmitWrap = styled('div')({
  marginTop: '24px',
});

// ─── Component ────────────────────────────────────────────────────────────────

const ConsentLabel = styled('label')({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  marginTop: 12,
  fontSize: 13,
  color: slate500,
  cursor: 'pointer',
});

export default function BookingContactForm({
  name,
  phone,
  email,
  notes,
  marketingOptIn = false,
  onName,
  onPhone,
  onEmail,
  onNotes,
  onMarketingOptIn,
  showSubmitButton = false,
  onSubmit,
}: Props) {
  const t = useTranslations();

  return (
    <>
      <Title>{t.booking.contactInfo}</Title>
      <Subtitle>{t.booking.contactSubtitle}</Subtitle>

      <FieldGroup>
        <TextInput
          label={t.booking.fullName}
          placeholder={t.booking.fullNamePlaceholder}
          value={name}
          onChange={e => onName(e.target.value)}
          autoComplete='name'
        />

        <PhoneEmailRow>
          <div>
            <TextInput
              label={t.booking.phone}
              type='tel'
              placeholder={t.booking.phonePlaceholder}
              value={phone}
              onChange={e => onPhone(e.target.value)}
              autoComplete='tel'
            />
          </div>
          <div>
            <TextInput
              label={t.booking.email}
              type='email'
              placeholder={t.booking.emailPlaceholder}
              value={email}
              onChange={e => onEmail(e.target.value)}
              autoComplete='email'
            />
          </div>
        </PhoneEmailRow>

        <TextArea
          label={t.booking.specialRequests}
          placeholder={t.booking.specialRequestsPlaceholder}
          value={notes}
          onChange={e => onNotes(e.target.value)}
        />
        {onMarketingOptIn && (
          <ConsentLabel>
            <input
              type='checkbox'
              checked={marketingOptIn}
              onChange={e => onMarketingOptIn(e.target.checked)}
              data-testid='booking-marketing-opt-in'
            />
            <span>{t.booking.marketingOptIn}</span>
          </ConsentLabel>
        )}
      </FieldGroup>

      {showSubmitButton && (
        <SubmitWrap>
          <MainButton
            variant='green_cta'
            title={t.booking.continue}
            icon={ArrowRightIcon}
            iconGap={12}
            iconPosition='right'
            size='large'
            fullWidth
            type='button'
            onClick={onSubmit}
          />
        </SubmitWrap>
      )}
    </>
  );
}
