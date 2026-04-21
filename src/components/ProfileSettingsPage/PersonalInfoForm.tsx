'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import { usersMePartialUpdate, usersMeRetrieve } from '@/api/generated/api';
import MainButton from '@/components/MainButton/MainButton';
import { PersonalInfoFormSkeleton } from '@/components/Skeleton';
import TextInput from '@/components/TextInput/TextInput';
import ToastNotification from '@/components/ToastNotification';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from '@/context/LocaleContext';
import { useToast } from '@/hooks/useToast';
import { foreground, muted } from '@/tokens';

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

// ─── Component ─────────────────────────────────────────────────────────────────

export default function PersonalInfoForm() {
  const t = useTranslations();
  const { toast, showToast, hideToast } = useToast();
  const { user: authUser } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  // `hydrated` becomes true once we have SOME data to display — either the
  // AuthContext user seeded the form, or the /users/me fetch resolved.
  // Prevents flashing empty inputs on a cold load.
  const [hydrated, setHydrated] = useState(false);

  // Seed from auth context immediately
  useEffect(() => {
    if (!authUser) return;
    setFirstName(authUser.first_name ?? '');
    setLastName(authUser.last_name ?? '');
    setEmail(authUser.email ?? '');
    setPhone(authUser.phone_number ?? '');
    setHydrated(true);
  }, [authUser]);

  // Fetch fresh from API to overwrite with latest data
  useEffect(() => {
    usersMeRetrieve()
      .then(user => {
        if (user.first_name) setFirstName(user.first_name);
        if (user.last_name) setLastName(user.last_name);
        if (user.email) setEmail(user.email);
        if (user.phone_number) setPhone(user.phone_number);
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
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
      showToast(t.profile.saveSuccess, 'success');
    } catch {
      showToast(t.profile.updateError, 'error');
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <>
        <SectionTitle>{t.profile.settingsTitle}</SectionTitle>
        <SectionSubtitle>{t.profile.settingsSubtitle}</SectionSubtitle>
        <PersonalInfoFormSkeleton />
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SectionTitle>{t.profile.settingsTitle}</SectionTitle>
        <SectionSubtitle>{t.profile.settingsSubtitle}</SectionSubtitle>
        <ContactTitle>{t.profile.contactInfo}</ContactTitle>

        <FieldGrid>
          <div>
            <TextInput
              label={t.profile.firstName}
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              placeholder={t.profile.firstName}
            />
          </div>
          <div>
            <TextInput
              label={t.profile.lastName}
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
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
              placeholder='+995 5XX XXX XXX'
            />
          </div>
        </FieldGrid>

        <Actions>
          <MainButton
            title={loading ? '...' : t.profile.saveChanges}
            variant='outline'
            size='large'
            type='submit'
          />
        </Actions>
      </form>

      {toast && (
        <ToastNotification message={toast.message} variant={toast.variant} onClose={hideToast} />
      )}
    </>
  );
}
