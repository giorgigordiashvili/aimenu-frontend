'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import { usersMePartialUpdate, usersMeRetrieve } from '@/api/generated/api';
import MainButton from '@/components/MainButton/MainButton';
import TextInput from '@/components/TextInput/TextInput';
import { useTranslations } from '@/context/LocaleContext';
import { useToast } from '@/hooks/useToast';
import { border, foreground, muted, radiusMd, shadowCard, slate900, white } from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const Card = styled('div')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '28px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

const CardTitle = styled('h2')({
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
});

const CardSubtitle = styled('p')({
  fontSize: '14px',
  color: muted,
  margin: '4px 0 0',
});

const SectionTitle = styled('h3')({
  fontSize: '16px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 16px',
});

const Divider = styled('div')({
  height: '1px',
  background: border,
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
      <Card>
        <div>
          <CardTitle>{t.profile.settingsTitle}</CardTitle>
          <CardSubtitle>{t.profile.settingsSubtitle}</CardSubtitle>
        </div>

        <Divider />

        <form onSubmit={handleSubmit}>
          <SectionTitle>{t.profile.contactInfo}</SectionTitle>

          <FieldGrid>
            <TextInput
              label={t.profile.firstName}
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              disabled={fetching}
              placeholder={t.profile.firstName}
            />
            <TextInput
              label={t.profile.lastName}
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              disabled={fetching}
              placeholder={t.profile.lastName}
            />
            <TextInput
              label={t.profile.email}
              type='email'
              value={email}
              disabled
              placeholder={t.profile.email}
            />
            <TextInput
              label={t.profile.phone}
              type='tel'
              value={phone}
              onChange={e => setPhone(e.target.value)}
              disabled={fetching}
              placeholder='+995 5XX XXX XXX'
            />
          </FieldGrid>

          <Actions style={{ marginTop: '24px' }}>
            <MainButton
              title={loading ? '...' : t.profile.saveChanges}
              variant='outline'
              size='small'
              onClick={() => {}}
            />
          </Actions>
        </form>
      </Card>

      {toast && <Toast>{toast}</Toast>}
    </>
  );
}
