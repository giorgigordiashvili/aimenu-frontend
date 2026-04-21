'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import axiosInstance from '@/api/axios';
import type { RestaurantList } from '@/api/generated/interfaces';
import { useLocale } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import SearchIcon from '@/icons/Search';
import {
  border,
  foreground,
  muted,
  rose600,
  rose700,
  slate100,
  slate200,
  slate400,
  white,
} from '@/tokens';

// ── Styled ────────────────────────────────────────────────────────────────────

// Hero-style backdrop with a soft pink→neutral gradient so the page has
// a clear visual anchor instead of opening on flat slate. The colours
// mirror the brand palette without competing with the card grid below.
//
// Intentionally NOT `overflow: hidden` — the search suggestions popover
// below the input extends past the section's bottom edge, and clipping
// it here would hide the dropdown. The blur decoration has its own
// clipped wrapper (BlurClip) to keep the paint within the section.
const HeaderSection = styled('section')({
  position: 'relative',
  padding: '32px 16px 28px',
  background: 'linear-gradient(180deg, #FFE4EC 0%, #FEF2F4 35%, #F8FAFC 100%)',
  '@media (min-width: 768px)': {
    padding: '56px 24px 44px',
  },
});

// Invisible clip layer so the BlurCircle's negative-offset position can
// visually escape the viewport edges without forcing `overflow: hidden`
// on HeaderSection itself (which would clip the popover).
const BlurClip = styled('div')({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 0,
});

// Decorative blur behind the title — purely cosmetic, stays behind content.
const BlurCircle = styled('div')({
  position: 'absolute',
  width: '320px',
  height: '320px',
  borderRadius: '50%',
  background: 'rgba(236, 0, 63, 0.18)',
  filter: 'blur(80px)',
  top: '-120px',
  right: '-80px',
  '@media (max-width: 768px)': {
    width: '220px',
    height: '220px',
    top: '-80px',
    right: '-60px',
  },
});

const HeaderInner = styled('div')({
  position: 'relative',
  maxWidth: '960px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '12px',
});

const ResultPill = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 12px',
  borderRadius: '100px',
  background: 'rgba(236, 0, 63, 0.1)',
  color: rose600,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
});

const Title = styled('h1')({
  fontSize: '30px',
  fontWeight: 800,
  color: foreground,
  margin: 0,
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  '@media (min-width: 768px)': {
    fontSize: '44px',
  },
});

const Subtitle = styled('p')({
  fontSize: '15px',
  color: muted,
  margin: 0,
  maxWidth: '560px',
  lineHeight: 1.5,
  '@media (min-width: 768px)': {
    fontSize: '17px',
  },
});

// Wrapper establishes a positioning context for the absolutely-positioned
// suggestions dropdown below the search bar.
const SearchWrap = styled('div')({
  position: 'relative',
  width: '100%',
  maxWidth: '640px',
  marginTop: '8px',
});

const SearchBox = styled('div')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: '56px',
  padding: '0 4px 0 16px',
  border: `1px solid ${border}`,
  borderRadius: '100px',
  background: white,
  boxShadow: '0 2px 8px -4px rgba(15, 23, 43, 0.08)',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  '&:focus-within': {
    borderColor: rose600,
    boxShadow: '0 0 0 4px rgba(236, 0, 63, 0.12)',
  },
});

const IconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: slate400,
  flexShrink: 0,
});

const SearchInput = styled('input')({
  border: 'none',
  outline: 'none',
  flex: 1,
  fontSize: '16px',
  lineHeight: '20px',
  color: foreground,
  background: 'transparent',
  fontFamily: 'inherit',
  // iOS Safari kicks off a zoom-to-input if font-size < 16px.
  minWidth: 0,
  '&::placeholder': {
    color: slate400,
  },
  // Hide the native WebKit "×" on type="search" — we render our own,
  // and stacking them looked like two X buttons side by side.
  '&::-webkit-search-cancel-button': {
    appearance: 'none',
    WebkitAppearance: 'none',
  },
  '&::-webkit-search-decoration': {
    appearance: 'none',
    WebkitAppearance: 'none',
  },
});

const ClearButton = styled('button')({
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  padding: '0',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  cursor: 'pointer',
  color: muted,
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '&:hover': {
    background: slate100,
    color: foreground,
  },
});

const SubmitButton = styled('button')({
  appearance: 'none',
  border: 'none',
  height: '48px',
  padding: '0 22px',
  borderRadius: '100px',
  background: rose600,
  color: white,
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s ease, transform 0.1s ease',
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  '&:hover': {
    background: rose700,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:focus-visible': {
    outline: `2px solid ${rose700}`,
    outlineOffset: '2px',
  },
  '@media (max-width: 520px)': {
    padding: '0 14px',
  },
});

// ── Suggestions dropdown ─────────────────────────────────────────────────────

const SuggestionsPopover = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  right: 0,
  background: white,
  border: `1px solid ${slate200}`,
  borderRadius: '16px',
  boxShadow: '0 14px 32px -12px rgba(15, 23, 43, 0.18)',
  padding: '6px',
  zIndex: 20,
  maxHeight: '420px',
  overflowY: 'auto',
  textAlign: 'left',
});

const SuggestionLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: '10px',
  textDecoration: 'none',
  color: foreground,
  transition: 'background 0.1s ease',
  '&:hover, &:focus-visible': {
    background: slate100,
    outline: 'none',
  },
});

const SuggestionThumb = styled('div')({
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  background: slate100,
  overflow: 'hidden',
  flexShrink: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
});

const SuggestionMeta = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  flex: 1,
});

const SuggestionName = styled('span')({
  fontSize: '14px',
  fontWeight: 600,
  color: foreground,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const SuggestionSub = styled('span')({
  fontSize: '12px',
  color: muted,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const SuggestionEmpty = styled('div')({
  padding: '16px 12px',
  fontSize: '13px',
  color: muted,
  textAlign: 'center',
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle: string;
  /** Total matched restaurants — shown above the title as a chip. */
  resultCount?: number;
  /** Copy template with "{count}" placeholder. */
  resultCountTemplate?: string;
  /** Copy shown when there are zero results (no interpolation). */
  resultCountZeroLabel?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: () => void;
  searchPlaceholder?: string;
  clearLabel?: string;
  submitLabel?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

const MIN_QUERY = 2;
const SUGGESTION_LIMIT = 6;
const DEBOUNCE_MS = 180;

export default function PageHeader({
  title,
  subtitle,
  resultCount,
  resultCountTemplate,
  resultCountZeroLabel,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'ძიება...',
  clearLabel = 'Clear',
  submitLabel = 'Search',
}: PageHeaderProps) {
  const { locale } = useLocale();
  const [suggestions, setSuggestions] = useState<RestaurantList[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPopoverOpen(false);
      onSearchSubmit();
    } else if (e.key === 'Escape') {
      setPopoverOpen(false);
    }
  };

  const countLabel = (() => {
    if (resultCount === undefined) return null;
    if (resultCount === 0 && resultCountZeroLabel) return resultCountZeroLabel;
    if (resultCountTemplate) return resultCountTemplate.replace('{count}', String(resultCount));
    return null;
  })();

  // Debounced typeahead. Fire once the user pauses typing; ignore queries
  // shorter than MIN_QUERY so a single-letter press doesn't thrash the API.
  useEffect(() => {
    const q = searchValue.trim();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (q.length < MIN_QUERY) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      const reqId = ++requestIdRef.current;
      try {
        const res = await axiosInstance.get('/api/v1/restaurants/', {
          params: { search: q, page: 1, page_size: SUGGESTION_LIMIT },
        });
        // Ignore late responses from superseded requests.
        if (reqId !== requestIdRef.current) return;
        const data = res.data;
        const results: RestaurantList[] = Array.isArray(data) ? data : (data?.results ?? []);
        setSuggestions(results);
      } catch {
        if (reqId !== requestIdRef.current) return;
        setSuggestions([]);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchValue]);

  // Close the popover when the user clicks outside the search wrap. The
  // focus-based close (onBlur) alone isn't enough because moving from
  // input → suggestion link counts as a blur and would nuke the click.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setPopoverOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const showPopover = popoverOpen && inputFocused && searchValue.trim().length >= MIN_QUERY;

  return (
    <HeaderSection>
      <BlurClip aria-hidden='true'>
        <BlurCircle />
      </BlurClip>
      <HeaderInner>
        {countLabel && <ResultPill>{countLabel}</ResultPill>}
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>

        <SearchWrap ref={wrapRef}>
          <SearchBox>
            <IconWrap aria-hidden='true'>
              <SearchIcon width={18} height={18} />
            </IconWrap>
            <SearchInput
              type='search'
              value={searchValue}
              onChange={e => {
                onSearchChange(e.target.value);
                setPopoverOpen(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setInputFocused(true);
                setPopoverOpen(true);
              }}
              onBlur={() => setInputFocused(false)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              aria-autocomplete='list'
              aria-expanded={showPopover}
            />
            {searchValue && (
              <ClearButton
                type='button'
                onClick={() => {
                  onSearchChange('');
                  setPopoverOpen(false);
                  onSearchSubmit();
                }}
                aria-label={clearLabel}
              >
                ✕
              </ClearButton>
            )}
            <SubmitButton
              type='button'
              onClick={() => {
                setPopoverOpen(false);
                onSearchSubmit();
              }}
              aria-label={submitLabel}
            >
              {submitLabel}
            </SubmitButton>
          </SearchBox>

          {showPopover && (
            <SuggestionsPopover role='listbox'>
              {suggestions.length === 0 ? (
                <SuggestionEmpty>—</SuggestionEmpty>
              ) : (
                suggestions.map(r => (
                  <SuggestionLink
                    key={r.id}
                    href={localePath(locale, `/restaurant/${r.slug}`)}
                    role='option'
                    // Nav happens via <Link>; closing the popover here
                    // avoids a flash of stale results behind the route.
                    onClick={() => setPopoverOpen(false)}
                    // Prevent blur-close before navigation fires.
                    onMouseDown={e => e.preventDefault()}
                  >
                    <SuggestionThumb
                      style={r.logo ? { backgroundImage: `url(${r.logo})` } : undefined}
                      aria-hidden='true'
                    />
                    <SuggestionMeta>
                      <SuggestionName>{r.name}</SuggestionName>
                      {r.city && <SuggestionSub>{r.city}</SuggestionSub>}
                    </SuggestionMeta>
                  </SuggestionLink>
                ))
              )}
            </SuggestionsPopover>
          )}
        </SearchWrap>
      </HeaderInner>
    </HeaderSection>
  );
}
