'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import { usersMePartialUpdate, usersMeRetrieve } from '@/api/generated/api';
import { useTranslations } from '@/context/LocaleContext';
import { useToast } from '@/hooks/useToast';
import {
  background,
  border,
  foreground,
  muted,
  primary,
  radiusMd,
  radiusSm,
  shadowCard,
  slate300,
  slate400,
  slate600,
  slate900,
  white,
} from '@/tokens';

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
  margin: 0,
  marginTop: '4px',
});

const TitleBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  paddingBottom: '4px',
  borderBottom: `1px solid ${border}`,
});

const FieldGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '16px',
  '@media (min-width: 640px)': {
    gridTemplateColumns: '1fr 1fr',
  },
});

const FieldWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const FieldWrapFull = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  gridColumn: '1 / -1',
});

const Label = styled('label')({
  fontSize: '13px',
  fontWeight: 600,
  color: slate600,
});

const Input = styled('input')({
  padding: '10px 14px',
  fontSize: '15px',
  color: foreground,
  background: background,
  border: `1px solid ${border}`,
  borderRadius: radiusSm,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  '&:focus': {
    borderColor: primary,
  },
  '&::placeholder': {
    color: slate400,
  },
  '&:disabled': {
    background: slate300,
    color: muted,
    cursor: 'not-allowed',
  },
});

const ReadonlyNote = styled('span')({
  fontSize: '12px',
  color: muted,
});

const Actions = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
});

const SaveButton = styled('button')<{ loading?: boolean }>({
  padding: '11px 28px',
  background: primary,
  color: white,
  border: 'none',
  borderRadius: radiusSm,
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.9 },
  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
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
      .catch(() => {
        // silently ignore — fields stay empty
      })
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
        <TitleBlock>
          <CardTitle>{t.profile.settingsTitle}</CardTitle>
          <CardSubtitle>{t.profile.settingsSubtitle}</CardSubtitle>
        </TitleBlock>

        <form onSubmit={handleSubmit}>
          <FieldGrid>
            <FieldWrap>
              <Label htmlFor='firstName'>{t.profile.firstName}</Label>
              <Input
                id='firstName'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                disabled={fetching}
                placeholder={t.profile.firstName}
              />
            </FieldWrap>

            <FieldWrap>
              <Label htmlFor='lastName'>{t.profile.lastName}</Label>
              <Input
                id='lastName'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                disabled={fetching}
                placeholder={t.profile.lastName}
              />
            </FieldWrap>

            <FieldWrapFull>
              <Label htmlFor='email'>
                {t.profile.email} <ReadonlyNote>({t.profile.email})</ReadonlyNote>
              </Label>
              <Input id='email' type='email' value={email} disabled placeholder={t.profile.email} />
            </FieldWrapFull>

            <FieldWrapFull>
              <Label htmlFor='phone'>{t.profile.phone}</Label>
              <Input
                id='phone'
                type='tel'
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={fetching}
                placeholder='+995 5XX XXX XXX'
              />
            </FieldWrapFull>
          </FieldGrid>

          <Actions style={{ marginTop: '8px' }}>
            <SaveButton type='submit' disabled={loading || fetching}>
              {loading ? '...' : t.profile.saveChanges}
            </SaveButton>
          </Actions>
        </form>
      </Card>

      {toast && <Toast>{toast}</Toast>}
    </>
  );
}
