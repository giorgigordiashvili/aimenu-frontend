'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';

import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import { acceptAll, hasDecided, rejectOptional, setConsent } from '@/lib/consent';
import { border, foreground, muted, rose600, slate100, slate900, white } from '@/tokens';

// GDPR-style cookie banner. Stays put until the user makes a choice;
// rendering is purely client-side so it never affects the SSR HTML and
// can therefore be added to the global layout without touching every
// route. Three actions: Accept all, Reject optional, Manage (toggles).

const Wrapper = styled('div')({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 90,
  padding: '16px 16px calc(16px + env(safe-area-inset-bottom))',
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',
});

const Card = styled('div')({
  pointerEvents: 'auto',
  maxWidth: '720px',
  width: '100%',
  background: white,
  border: `1px solid ${border}`,
  borderRadius: '16px',
  padding: '16px',
  boxShadow: '0 12px 32px -12px rgba(15, 23, 43, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  '@media (min-width: 768px)': {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 18px',
  },
});

const Body = styled('div')({
  flex: 1,
  fontSize: '13px',
  lineHeight: '18px',
  color: foreground,
  '@media (min-width: 768px)': {
    fontSize: '14px',
    lineHeight: '20px',
  },
});

const Inline = styled(Link)({
  color: rose600,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
});

const ButtonRow = styled('div')({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  '@media (min-width: 768px)': {
    flexWrap: 'nowrap',
  },
});

const baseBtn = {
  appearance: 'none' as const,
  border: `1px solid ${border}`,
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer' as const,
  background: white,
  color: foreground,
  minHeight: '40px',
  '&:focus-visible': {
    outline: `3px solid ${slate100}`,
    outlineOffset: '2px',
  },
};

const SecondaryBtn = styled('button')(baseBtn);

const PrimaryBtn = styled('button')({
  ...baseBtn,
  background: slate900,
  color: white,
  borderColor: slate900,
});

const ManageDialog = styled('div')({
  pointerEvents: 'auto',
  maxWidth: '480px',
  width: '100%',
  background: white,
  borderRadius: '16px',
  border: `1px solid ${border}`,
  padding: '20px',
  boxShadow: '0 24px 48px -16px rgba(15, 23, 43, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const ToggleRow = styled('label')({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '10px',
  borderRadius: '10px',
  border: `1px solid ${border}`,
  cursor: 'pointer',
});

const ToggleText = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const ToggleTitle = styled('span')({
  fontSize: '14px',
  fontWeight: 600,
  color: foreground,
});

const ToggleSub = styled('span')({
  fontSize: '12px',
  color: muted,
});

const Backdrop = styled('div')({
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 43, 0.45)',
  zIndex: 95,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: '16px',
  '@media (min-width: 768px)': {
    alignItems: 'center',
  },
});

export default function CookieConsent() {
  const t = useTranslations();
  const { locale } = useLocale();
  const copy = (t as unknown as { cookieConsent?: Record<string, string> }).cookieConsent;
  // Don't show until we've checked localStorage on the client. Avoids a
  // flash of the banner during hydration on the server-rendered HTML.
  const [show, setShow] = useState(false);
  const [openManage, setOpenManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setShow(!hasDecided());
  }, []);

  // Without translation strings configured, fail closed (don't render the
  // banner). The dictionary anchors below get filled in via i18n.
  if (!copy || !show) return null;

  const privacyHref = localePath(locale, '/privacy');

  return (
    <>
      <Wrapper role='dialog' aria-live='polite' aria-label={copy.aria}>
        <Card>
          <Body>
            {copy.body} <Inline href={privacyHref}>{copy.learnMore}</Inline>
          </Body>
          <ButtonRow>
            <SecondaryBtn type='button' onClick={() => setOpenManage(true)}>
              {copy.manage}
            </SecondaryBtn>
            <SecondaryBtn
              type='button'
              onClick={() => {
                rejectOptional();
                setShow(false);
              }}
            >
              {copy.rejectOptional}
            </SecondaryBtn>
            <PrimaryBtn
              type='button'
              onClick={() => {
                acceptAll();
                setShow(false);
              }}
            >
              {copy.acceptAll}
            </PrimaryBtn>
          </ButtonRow>
        </Card>
      </Wrapper>

      {openManage && (
        <Backdrop onClick={() => setOpenManage(false)}>
          <ManageDialog
            role='dialog'
            aria-modal='true'
            aria-labelledby={titleId}
            onClick={e => e.stopPropagation()}
          >
            <h2 id={titleId} style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              {copy.manageTitle}
            </h2>

            <ToggleRow>
              <input
                type='checkbox'
                checked
                disabled
                aria-disabled='true'
                style={{ marginTop: 3, width: 18, height: 18 }}
              />
              <ToggleText>
                <ToggleTitle>{copy.necessaryTitle}</ToggleTitle>
                <ToggleSub>{copy.necessaryBody}</ToggleSub>
              </ToggleText>
            </ToggleRow>

            <ToggleRow>
              <input
                type='checkbox'
                checked={analytics}
                onChange={e => setAnalytics(e.target.checked)}
                style={{ marginTop: 3, width: 18, height: 18 }}
              />
              <ToggleText>
                <ToggleTitle>{copy.analyticsTitle}</ToggleTitle>
                <ToggleSub>{copy.analyticsBody}</ToggleSub>
              </ToggleText>
            </ToggleRow>

            <ToggleRow>
              <input
                type='checkbox'
                checked={marketing}
                onChange={e => setMarketing(e.target.checked)}
                style={{ marginTop: 3, width: 18, height: 18 }}
              />
              <ToggleText>
                <ToggleTitle>{copy.marketingTitle}</ToggleTitle>
                <ToggleSub>{copy.marketingBody}</ToggleSub>
              </ToggleText>
            </ToggleRow>

            <ButtonRow>
              <SecondaryBtn type='button' onClick={() => setOpenManage(false)}>
                {copy.cancel}
              </SecondaryBtn>
              <PrimaryBtn
                type='button'
                onClick={() => {
                  setConsent({ analytics, marketing });
                  setOpenManage(false);
                  setShow(false);
                }}
              >
                {copy.savePreferences}
              </PrimaryBtn>
            </ButtonRow>
          </ManageDialog>
        </Backdrop>
      )}
    </>
  );
}
