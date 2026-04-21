'use client';

import { styled } from '@pigment-css/react';

// Error badge for form inputs. Shows a red circular "!" icon positioned
// inside the input's right area; on hover / focus a tooltip reveals the
// full error message. On mobile the button receives focus on tap so the
// tooltip shows there too; `title` gives a native long-press fallback.

const Wrapper = styled('span')({
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'inline-flex',
  alignItems: 'center',
  zIndex: 2,
  // Callers that also show a functional right-side icon (password-eye,
  // date picker, etc.) can shift this badge further left via data-slot.
  '&[data-slot="secondary"]': {
    right: '44px',
  },
  // Top-right slot for textarea — no vertical centring needed.
  '&[data-slot="topRight"]': {
    top: '10px',
    transform: 'none',
  },
});

const IconButton = styled('button')({
  background: '#E7000B',
  color: '#ffffff',
  border: 'none',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: 700,
  lineHeight: 1,
  cursor: 'help',
  padding: 0,
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  '&:hover, &:focus-visible': {
    transform: 'scale(1.1)',
    boxShadow: '0 0 0 3px rgba(231, 0, 11, 0.15)',
    outline: 'none',
  },
});

const Tooltip = styled('span')({
  position: 'absolute',
  bottom: 'calc(100% + 10px)',
  right: '-4px',
  background: '#0F172B',
  color: '#ffffff',
  padding: '8px 10px',
  borderRadius: '8px',
  fontSize: '12px',
  lineHeight: 1.4,
  width: 'max-content',
  maxWidth: '240px',
  textAlign: 'left',
  pointerEvents: 'none',
  opacity: 0,
  transform: 'translateY(4px)',
  transition: 'opacity 0.15s ease, transform 0.15s ease',
  boxShadow: '0 6px 14px -4px rgba(0,0,0,0.35)',
  whiteSpace: 'normal',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '100%',
    right: '8px',
    borderWidth: '5px 5px 0',
    borderStyle: 'solid',
    borderColor: '#0F172B transparent transparent',
  },
});

// Hover / focus on the button reveals the sibling tooltip. Using sibling
// selectors keeps the tooltip purely CSS — no JS state needed.
const Container = styled('span')({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  'button:hover + span, button:focus-visible + span': {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

type Slot = 'primary' | 'secondary' | 'topRight';

interface FieldErrorProps {
  message: string;
  slot?: Slot;
  id?: string;
}

export default function FieldError({ message, slot = 'primary', id }: FieldErrorProps) {
  return (
    <Wrapper data-slot={slot}>
      <Container>
        <IconButton
          type='button'
          aria-label={message}
          title={message}
          id={id}
          // Clicking should not submit a parent form.
          onClick={e => {
            e.preventDefault();
            (e.currentTarget as HTMLButtonElement).focus();
          }}
        >
          !
        </IconButton>
        <Tooltip role='tooltip'>{message}</Tooltip>
      </Container>
    </Wrapper>
  );
}
