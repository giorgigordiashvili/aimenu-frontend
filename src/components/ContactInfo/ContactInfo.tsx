'use client';

import { styled } from '@pigment-css/react';

import type { RestaurantHours } from '@/api/generated/interfaces';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import ClockIcon from '@/icons/Clock';
import Phone from '@/icons/Phone';
import Web from '@/icons/Web';
import { foreground, muted } from '@/tokens';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  marginBottom: '24px',
  '@media (min-width: 768px)': {
    marginBottom: '32px',
  },
});

const SectionTitle = styled('h2')({
  fontSize: '20px',
  fontWeight: 600,
  color: foreground,
  lineHeight: '28px',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '24px',
    lineHeight: '32px',
  },
});

const InfoGrid = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  '@media (min-width: 768px)': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
  },
});

const InfoColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const InfoItem = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
});

const InfoHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const IconContainer = styled('div')({
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const InfoLabel = styled('span')({
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  lineHeight: '20px',
});

const InfoText = styled('div')({
  fontSize: '14px',
  fontWeight: 400,
  color: muted,
  lineHeight: '20px',
  paddingLeft: '28px',
});

const InfoLink = styled('a')({
  fontSize: '14px',
  fontWeight: 400,
  color: muted,
  lineHeight: '20px',
  textDecoration: 'none',
  paddingLeft: '28px',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: foreground,
  },
});

interface ContactInfoProps {
  operatingHours?: RestaurantHours[];
  phone?: string;
  website?: string;
  email?: string;
  isOpenNow?: string;
  locale: Locale;
}

export default function ContactInfo({ operatingHours, phone, website, locale }: ContactInfoProps) {
  const t = getDictionary(locale);

  // Format hours to show range (e.g., "ორშ-კვი: 10:00 - 00:00")
  const formatTime = (time: string) => {
    return time.split(':').slice(0, 2).join(':');
  };

  // Get weekday hours (Monday-Friday)
  const weekdayHours = operatingHours?.find(h => {
    const apiDay =
      typeof h.day_of_week === 'number' ? h.day_of_week : parseInt(String(h.day_of_week), 10);
    return apiDay === 0; // Monday
  });

  const hoursDisplay = weekdayHours
    ? `${t.restaurantDetail.mondayFriday || 'ორშ-კვი'}: ${formatTime(weekdayHours.open_time)} - ${formatTime(weekdayHours.close_time)}`
    : t.restaurantDetail.workingHours;

  return (
    <Container>
      <SectionTitle>{t.restaurantDetail.additionalInfo}</SectionTitle>

      <InfoGrid>
        {/* Left Column */}
        <InfoColumn>
          {/* Working Hours */}
          {operatingHours && operatingHours.length > 0 && (
            <InfoItem>
              <InfoHeader>
                <IconContainer>
                  <ClockIcon size={20} />
                </IconContainer>
                <InfoLabel>{t.restaurantDetail.workingHours}</InfoLabel>
              </InfoHeader>
              <InfoText>{hoursDisplay}</InfoText>
            </InfoItem>
          )}

          {/* Website */}
          {website && (
            <InfoItem>
              <InfoHeader>
                <IconContainer>
                  <Web />
                </IconContainer>
                <InfoLabel>{t.restaurantDetail.website}</InfoLabel>
              </InfoHeader>
              <InfoLink href={website} target='_blank' rel='noopener noreferrer'>
                {website.replace(/^https?:\/\//, '')}
              </InfoLink>
            </InfoItem>
          )}
        </InfoColumn>

        {/* Right Column */}
        <InfoColumn>
          {/* Phone */}
          {phone && (
            <InfoItem>
              <InfoHeader>
                <IconContainer>
                  <Phone />
                </IconContainer>
                <InfoLabel>{t.restaurantDetail.phone || 'ტელეფონი'}</InfoLabel>
              </InfoHeader>
              <InfoLink href={`tel:${phone}`}>{phone}</InfoLink>
            </InfoItem>
          )}
        </InfoColumn>
      </InfoGrid>
    </Container>
  );
}
