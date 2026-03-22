'use client';

import { styled } from '@pigment-css/react';

import { foreground, muted, rose500, slate100, slate200, white } from '@/tokens';

// ── Styled ────────────────────────────────────────────────────────────────────

const Wrapper = styled('nav')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '32px 0',
  flexWrap: 'wrap',
});

interface PageButtonProps {
  isActive?: boolean;
  disabled?: boolean;
}

const PageButton = styled('button')<PageButtonProps>({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '36px',
  height: '36px',
  padding: '0 10px',
  borderRadius: '8px',
  border: `1px solid ${slate200}`,
  background: white,
  color: foreground,
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.15s, color 0.15s',
  '&:hover:not(:disabled)': {
    background: slate100,
  },
  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  variants: [
    {
      props: { isActive: true },
      style: {
        background: rose500,
        color: white,
        borderColor: rose500,
        '&:hover': {
          background: rose500,
        },
      },
    },
  ],
});

const Ellipsis = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '36px',
  height: '36px',
  color: muted,
  fontSize: '14px',
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  if (current <= 3) {
    pages.push(1, 2, 3, 4, 5);
    if (total > 5) pages.push('ellipsis', total);
  } else if (current >= total - 2) {
    pages.push(1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total);
  }

  return pages;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <Wrapper aria-label='Pagination'>
      <PageButton
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label='Previous page'
      >
        ‹
      </PageButton>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <Ellipsis key={`ellipsis-${i}`}>…</Ellipsis>
        ) : (
          <PageButton
            key={p}
            isActive={p === page}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </PageButton>
        )
      )}

      <PageButton
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label='Next page'
      >
        ›
      </PageButton>
    </Wrapper>
  );
}
