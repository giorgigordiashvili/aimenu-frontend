'use client';

import { styled } from '@pigment-css/react';
import { useState, useCallback } from 'react';

import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { useTranslations } from '@/context/LocaleContext';
import AddPeopleIcon from '@/icons/AddPeople';
import CloseIcon from '@/icons/Close';
import EmailIcon from '@/icons/Email';
import PeopleIcon from '@/icons/People';
import { border, foreground, slate500, white, primary, slate50, red50, slate100 } from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Guest {
  id: string;
  name: string;
  contact: string;
}

// ─── Styled components ────────────────────────────────────────────────────────

const Section = styled('div')({
  marginBottom: '48px',
  width: '100%',
  minWidth: 0,
});

const SectionTitle = styled('h3')({
  fontSize: '14px',
  fontWeight: 600,
  color: foreground,
  margin: '0 0 12px 0',
  lineHeight: '20px',
});

// Add Guest Form
const AddGuestCard = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '20px 24px',
  borderRadius: '12px',
  backgroundColor: slate50,
  marginBottom: '16px',
  border: `1px solid ${border}`,
  overflow: 'hidden',
  minWidth: 0,
});

// Guest List
const GuestListSection = styled('div')({
  marginTop: '24px',
});

const GuestListTitle = styled('h4')({
  fontSize: '15px',
  fontWeight: 500,
  color: slate500,
  margin: '0 0 12px 0',
  lineHeight: '20px',
});

const GuestCard = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: white,
  border: `1px solid ${border}`,
  marginBottom: '24px',
});

const GuestInfo = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const GuestAvatar = styled('div')({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: red50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const GuestAvatarIcon = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg path': {
    stroke: primary,
  },
});

const GuestDetails = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const GuestName = styled('span')({
  fontSize: '16px',
  fontWeight: 500,
  color: foreground,
  lineHeight: '22px',
});

const GuestContact = styled('span')({
  fontSize: '14px',
  fontWeight: 400,
  color: slate500,
  lineHeight: '20px',
});

const RemoveButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: slate100,
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuestAddSection() {
  const t = useTranslations();

  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const handleAddGuest = useCallback(() => {
    if (!name.trim() || !contact.trim()) return;

    const newGuest: Guest = {
      id: crypto.randomUUID(),
      name: name.trim(),
      contact: contact.trim(),
    };

    setGuests(prev => [...prev, newGuest]);
    setName('');
    setContact('');
  }, [name, contact]);

  const handleRemoveGuest = useCallback((id: string) => {
    setGuests(prev => prev.filter(guest => guest.id !== id));
  }, []);

  const isAddDisabled = !name.trim() || !contact.trim();

  return (
    <Section>
      {/* Guest List */}
      {guests.length > 0 && (
        <GuestListSection>
          <GuestListTitle>
            {t.orderReview.addedGuests} ({guests.length})
          </GuestListTitle>
          {guests.map(guest => (
            <GuestCard key={guest.id}>
              <GuestInfo>
                <GuestAvatar>
                  <GuestAvatarIcon>
                    <PeopleIcon />
                  </GuestAvatarIcon>
                </GuestAvatar>
                <GuestDetails>
                  <GuestName>{guest.name}</GuestName>
                  <GuestContact>{guest.contact}</GuestContact>
                </GuestDetails>
              </GuestInfo>
              <RemoveButton onClick={() => handleRemoveGuest(guest.id)}>
                <CloseIcon />
              </RemoveButton>
            </GuestCard>
          ))}
        </GuestListSection>
      )}

      {/* Add Guest Form */}
      <AddGuestCard>
        <SectionTitle>{t.orderReview.addGuestTitle}</SectionTitle>
        <TextInput
          label=''
          icon={PeopleIcon}
          placeholder={t.orderReview.namePlaceholder}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextInput
          label=''
          icon={EmailIcon}
          placeholder={t.orderReview.contactPlaceholder}
          value={contact}
          onChange={e => setContact(e.target.value)}
        />
        <MainButton
          variant='outline'
          title={t.orderReview.addToList}
          icon={AddPeopleIcon}
          onClick={handleAddGuest}
          disabled={isAddDisabled}
          fullWidth
        />
      </AddGuestCard>
    </Section>
  );
}
