'use client';

import { styled } from '@pigment-css/react';
import { useState, useCallback } from 'react';

import { tablesSessionsInviteCreate } from '@/api/generated/api';
import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import { useTable } from '@/context/TableContext';
import { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/routing';
import CheckmarkIcon from '@/icons/Checkmark';
import CopyIcon from '@/icons/Copy';
import InviteArrow from '@/icons/InviteArrow';
import {
  background,
  border,
  foreground,
  slate500,
  white,
  slate50,
  blue50,
  blue500,
} from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InviteFriendsSectionProps {
  locale: Locale;
  paymentMethod: 'iWillPay' | 'everyonePays';
}

// ─── Styled components ────────────────────────────────────────────────────────

// Invite Link Section (before link is created)
const InviteLinkCard = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '20px 24px',
  borderRadius: '12px',
  border: `1px solid ${border}`,
  backgroundColor: background,
  marginBottom: '24px',
});

const InviteLinkHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const InviteLinkContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const InviteLinkTitle = styled('span')({
  fontSize: '16px',
  fontWeight: 600,
  color: foreground,
  lineHeight: '22px',
});

const InviteLinkDescription = styled('span')({
  fontSize: '13px',
  fontWeight: 400,
  color: slate500,
  lineHeight: '18px',
});

// Generated Link Section (after link is created)
const GeneratedLinkContent = styled('div')({
  marginTop: '20px',
});

const GeneratedLinkRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
});

const LinkInputWrapper = styled('div')({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  borderRadius: '12px',
  border: `1px solid ${border}`,
  backgroundColor: white,
});

const LinkInput = styled('input')({
  flex: 1,
  border: 'none',
  outline: 'none',
  fontSize: '14px',
  fontWeight: 400,
  color: foreground,
  backgroundColor: 'transparent',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const CopyButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px',
  borderRadius: '8px',
  border: `1px solid ${border}`,
  backgroundColor: white,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  flexShrink: 0,
  '&:hover': {
    backgroundColor: slate50,
  },
});

const InfoMessage = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: blue50,
  border: 'none',
});

const InfoText = styled('p')({
  margin: 0,
  fontSize: '14px',
  fontWeight: 400,
  color: blue500,
  lineHeight: '20px',
});

// ─── Component ────────────────────────────────────────────────────────────────

// Response shape for POST /api/v1/tables/sessions/{sessionId}/invite/.
// The generated client returns `any`; keep a local type until drf-spectacular
// annotates the endpoint.
interface InviteCreateResponse {
  invite_code: string;
  expires_at?: string;
}

export default function InviteFriendsSection({ locale, paymentMethod }: InviteFriendsSectionProps) {
  const t = useTranslations();
  const { tableData } = useTable();
  const sessionId = tableData?.sessionId;

  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const handleCreateLink = useCallback(async () => {
    if (!sessionId) {
      setLinkError(t.orderReview.inviteLinkDescription);
      return;
    }

    setIsCreatingLink(true);
    setLinkError(null);
    try {
      const response = (await tablesSessionsInviteCreate(sessionId)) as InviteCreateResponse;
      const inviteCode = response?.invite_code;
      if (!inviteCode) {
        throw new Error('missing invite_code in response');
      }
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const inviteLink = `${baseUrl}${localePath(locale, `/order-review/invite/${inviteCode}`)}`;
      setGeneratedLink(inviteLink);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.error('[createInvite]', err);
      setLinkError(t.orderReview.invitationFailed);
    } finally {
      setIsCreatingLink(false);
    }
  }, [locale, sessionId, t.orderReview.inviteLinkDescription, t.orderReview.invitationFailed]);

  const handleCopyLink = useCallback(async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Legacy fallback for browsers that don't support clipboard API
      // Note: document.execCommand('copy') is deprecated but still works in most browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = generatedLink;
        // Make the textarea invisible
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } catch {
        // If both methods fail, silently ignore - user can manually copy
        console.warn('Failed to copy link to clipboard');
      }
    }
  }, [generatedLink]);

  // Before link is created - show create button
  if (!generatedLink) {
    return (
      <InviteLinkCard>
        <InviteLinkHeader>
          <InviteLinkContent>
            <InviteLinkTitle>{t.orderReview.inviteLink}</InviteLinkTitle>
            <InviteLinkDescription>{t.orderReview.inviteLinkDescription}</InviteLinkDescription>
            {linkError && <InviteLinkDescription>{linkError}</InviteLinkDescription>}
          </InviteLinkContent>
          <MainButton
            variant='rose_cta'
            title={isCreatingLink ? t.orderReview.placing : t.orderReview.createLink}
            icon={InviteArrow}
            onClick={handleCreateLink}
            disabled={isCreatingLink || !sessionId}
          />
        </InviteLinkHeader>
      </InviteLinkCard>
    );
  }

  // After link is created - show link with copy button and info message inside the same card
  return (
    <InviteLinkCard>
      <InviteLinkHeader>
        <InviteLinkContent>
          <InviteLinkTitle>{t.orderReview.inviteLink}</InviteLinkTitle>
          <InviteLinkDescription>{t.orderReview.inviteLinkDescription}</InviteLinkDescription>
        </InviteLinkContent>
        <MainButton
          variant='rose_cta'
          title={t.orderReview.createLink}
          icon={InviteArrow}
          onClick={handleCreateLink}
          disabled={isCreatingLink}
          rounded
        />
      </InviteLinkHeader>
      <GeneratedLinkContent>
        <GeneratedLinkRow>
          <LinkInputWrapper>
            <LinkInput type='text' value={generatedLink} readOnly />
          </LinkInputWrapper>
          <CopyButton
            onClick={handleCopyLink}
            title={linkCopied ? t.orderReview.linkCopied : undefined}
          >
            {linkCopied ? <CheckmarkIcon /> : <CopyIcon />}
          </CopyButton>
        </GeneratedLinkRow>
        <InfoMessage>
          <InfoText>
            {paymentMethod === 'iWillPay'
              ? t.orderReview.linkInfoMessage
              : t.orderReview.linkInfoMessageSplit}
          </InfoText>
        </InfoMessage>
      </GeneratedLinkContent>
    </InviteLinkCard>
  );
}
