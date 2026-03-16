'use client';

import { useEffect, useState } from 'react';
import { styled } from '@pigment-css/react';

import { usersMePartialUpdate, usersMeRetrieve } from '@/api/generated/api';
import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { useTranslations } from '@/context/LocaleContext';
import { useToast } from '@/hooks/useToast';
import { foreground, muted, shadowCard, slate900, white } from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const SectionTitle = styled('h2')({
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 4px',
});

const SectionSubtitle = styled('p')({
  fontSize: '14px',
  color: muted,
  margin: '0 0 20px',
});

const ContactTitle = styled('h3')({
  fontSize: '16px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 16px',
});

const FieldGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  '@media (max-width: 640px)': {
    gridTemplateColumns: '1fr',
  },
});

const Actions = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '24px',
});

const Toast = styled('div')({
  position: 'fixed',
  bottom: '24px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: slate900,
  color: white,
  padding: '12px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  zIndex: 400,
  whiteSpace: 'nowrap',
  boxShadow: shadowCard,
});

// ─── Component ─────────────────────────────────────────────────────────────────

export default function PersonalInfoForm() {
  const t = useTranslations();
  const { toast, showToast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    usersMeRetrieve()
      .then(user => {
        setFirstName(user.first_name ?? '');
        setLastName(user.last_name ?? '');
        setEmail(user.email ?? '');
        setPhone(user.phone_number ?? '');
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    setLoading(true);
    try {
      await usersMePartialUpdate({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phone.trim() || undefined,
      });
      showToast(t.profile.saveSuccess);
    } catch {
      showToast(t.profile.updateError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SectionTitle>{t.profile.settingsTitle}</SectionTitle>
        <SectionSubtitle>{t.profile.settingsSubtitle}</SectionSubtitle>

        <ContactTitle>{t.profile.contactInfo}</ContactTitle>

        {/* Each TextInput is a React fragment — wrap in div to keep as one grid item */}
        <FieldGrid>
          <div>
            <TextInput
              label={t.profile.firstName}
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              disabled={fetching}
              placeholder={t.profile.firstName}
            />
          </div>
          <div>
            <TextInput
              label={t.profile.lastName}
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              disabled={fetching}
              placeholder={t.profile.lastName}
            />
          </div>
          <div>
            <TextInput
              label={t.profile.email}
              type='email'
              value={email}
              disabled
              placeholder={t.profile.email}
            />
          </div>
          <div>
            <TextInput
              label={t.profile.phone}
              type='tel'
              value={phone}
              onChange={e => setPhone(e.target.value)}
              disabled={fetching}
              placeholder='+995 5XX XXX XXX'
            />
          </div>
        </FieldGrid>

        <Actions>
          <MainButton
            title={loading ? '...' : t.profile.saveChanges}
            variant='outline'
            size='small'
            type='submit'
          />
        </Actions>
      </form>

      {toast && <Toast>{toast}</Toast>}
    </>
  );
}
