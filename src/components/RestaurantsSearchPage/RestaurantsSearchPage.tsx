'use client';

import { styled } from '@pigment-css/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import axiosInstance from '@/api/axios';
import { favoritesRestaurantsList, favoritesRestaurantsToggleCreate } from '@/api/generated/api';
import type { RestaurantList } from '@/api/generated/interfaces';
import CategoryFilterTabs from '@/components/CategoryFilterTabs/CategoryFilterTabs';
import Footer from '@/components/Footer/Footer';
import HeaderPrimary from '@/components/HeaderPrimary/HeaderPrimary';
import RestaurantCardPrimary from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';
import { useAuth } from '@/context/AuthContext';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import { border, foreground, muted, rose600, slate100, slate200, slate50, white } from '@/tokens';
import { getTranslation } from '@/utils/translations';

import PageHeader from './PageHeader';
import Pagination from './Pagination';

// ── Styled ────────────────────────────────────────────────────────────────────

const PageWrapper = styled('div')({
  minHeight: '100vh',
  background: slate50,
  display: 'flex',
  flexDirection: 'column',
});

const ContentWrapper = styled('div')({
  padding: '0 16px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const MainContent = styled('main')({
  flex: 1,
});

// Unified filter row: city + sort pills on the left, "Clear filters"
// chip on the right. Category chips live in a separate row below.
const FilterRow = styled('div')({
  maxWidth: '1120px',
  margin: '20px auto 0',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexWrap: 'wrap',
});

// Shared pill styling for the city + sort dropdowns.
const FilterPill = styled('label')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  height: '40px',
  padding: '0 14px',
  border: `1px solid ${border}`,
  borderRadius: '100px',
  background: white,
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    borderColor: slate200,
  },
  '&:focus-within': {
    borderColor: rose600,
    boxShadow: `0 0 0 3px ${slate100}`,
  },
});

const FilterLabel = styled('span')({
  fontSize: '13px',
  color: muted,
  fontWeight: 500,
});

const FilterSelect = styled('select')({
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  border: 'none',
  background: 'transparent',
  padding: '0 20px 0 0',
  fontSize: '14px',
  fontWeight: 600,
  color: foreground,
  outline: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2362748e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0 center',
});

const ClearFiltersChip = styled('button')({
  appearance: 'none',
  border: `1px solid ${rose600}`,
  background: 'rgba(236, 0, 63, 0.08)',
  color: rose600,
  fontSize: '13px',
  fontWeight: 600,
  padding: '0 14px',
  height: '40px',
  borderRadius: '100px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  marginLeft: 'auto',
  transition: 'background 0.15s ease',
  '&:hover': {
    background: 'rgba(236, 0, 63, 0.15)',
  },
  '&:focus-visible': {
    outline: `2px solid ${rose600}`,
    outlineOffset: '2px',
  },
});

// Reservation-context chips strip — shown only when the user arrived
// with date/time/guests selected from the home hero. Each chip shows the
// chosen value with an ✕ to clear it individually.
const ReservationContextRow = styled('div')({
  maxWidth: '1120px',
  margin: '12px auto 0',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
});

const ContextChip = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '0 6px 0 14px',
  height: '36px',
  borderRadius: '100px',
  background: 'rgba(236, 0, 63, 0.08)',
  color: rose600,
  fontSize: '13px',
  fontWeight: 600,
  border: '1px solid rgba(236, 0, 63, 0.2)',
});

const ContextChipClose = styled('button')({
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  color: rose600,
  cursor: 'pointer',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  '&:hover': {
    background: 'rgba(236, 0, 63, 0.15)',
  },
});

const ContextHint = styled('span')({
  fontSize: '12px',
  color: muted,
  fontWeight: 500,
});

const TabsSection = styled('div')({
  maxWidth: '1120px',
  margin: '12px auto 0',
});

const GridSection = styled('div')({
  maxWidth: '1120px',
  margin: '0 auto',
  padding: '24px 0 80px',
  '@media (min-width: 768px)': {
    padding: '32px 0 100px',
  },
});

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 24,
  '@media (max-width: 1024px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  '@media (max-width: 640px)': {
    gridTemplateColumns: '1fr',
    gap: 16,
  },
  marginTop: 16,
});

const CardWrapper = styled('div')({
  '& > div': {
    width: '100%',
  },
});

// Skeleton that mirrors the real card: square image region + 3 text bars.
// Matches the actual card shape so the loading state doesn't flash a
// completely different silhouette to what lands in its place.
const SkeletonCard = styled('div')({
  width: '100%',
  border: `1px solid ${border}`,
  borderRadius: '14px',
  background: white,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const SkeletonImage = styled('div')({
  width: '100%',
  aspectRatio: '1 / 1',
  background: `linear-gradient(90deg, ${slate100} 0%, ${slate200} 50%, ${slate100} 100%)`,
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.4s infinite',
  '@keyframes shimmer': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
});

const SkeletonTextArea = styled('div')({
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const SkeletonBar = styled('div')({
  height: '12px',
  borderRadius: '6px',
  background: `linear-gradient(90deg, ${slate100} 0%, ${slate200} 50%, ${slate100} 100%)`,
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.4s infinite',
});

const EmptyState = styled('div')({
  gridColumn: '1 / -1',
  textAlign: 'center',
  padding: '80px 24px',
  color: muted,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
});

const EmptyIcon = styled('div')({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: 'rgba(236, 0, 63, 0.08)',
  color: rose600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  marginBottom: '4px',
});

const EmptyTitle = styled('p')({
  fontSize: '18px',
  fontWeight: 600,
  color: foreground,
  margin: 0,
});

const EmptyHint = styled('p')({
  fontSize: '14px',
  color: muted,
  margin: 0,
  maxWidth: '420px',
  lineHeight: 1.5,
});

const EmptyCta = styled('button')({
  marginTop: '12px',
  appearance: 'none',
  border: 'none',
  background: rose600,
  color: white,
  fontSize: '14px',
  fontWeight: 600,
  padding: '10px 18px',
  borderRadius: '100px',
  cursor: 'pointer',
  '&:hover': {
    background: '#BE123C',
  },
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CityOption {
  id: number | string;
  slug: string;
  country: string;
  translations: Record<string, { name: string }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

const parseTranslations = (translations: string | object | undefined): object => {
  if (!translations) return {};
  if (typeof translations === 'string') {
    try {
      return JSON.parse(translations);
    } catch {
      return {};
    }
  }
  return translations;
};

// Extract unique categories from a list of restaurants, picking the best
// translated name for the current locale. Shared between the "fetch once
// unfiltered" category population and the fallback from the filtered page.
function collectCategories(list: RestaurantList[], locale: string): Category[] {
  const byId = new Map<string | number, Category>();
  for (const r of list) {
    if (!r.category) continue;
    const parsed = parseTranslations(r.category.translations) as Record<string, { name?: string }>;
    const name =
      parsed[locale]?.name ?? parsed['ka']?.name ?? parsed['en']?.name ?? r.category.slug;
    byId.set(r.category.id, {
      id: String(r.category.id),
      name,
      icon: r.category.icon,
    });
  }
  return Array.from(byId.values());
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RestaurantsSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = useTranslations();
  const { user } = useAuth();

  // URL-driven state
  const cityParam = searchParams.get('city') ?? '';
  const categoryParam = searchParams.get('category') ?? null;
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10);
  const searchParam = searchParams.get('search') ?? '';
  const sortParam = searchParams.get('sort') ?? '-average_rating';
  // Reservation-context params forwarded from the home hero.
  const dateParam = searchParams.get('date') ?? '';
  const timeParam = searchParams.get('time') ?? '';
  const guestsParam = searchParams.get('guests') ?? '';
  // When all three reservation inputs are present we can switch to the
  // availability-checking backend endpoint (/api/v1/restaurants/search/).
  const hasReservationContext = Boolean(dateParam && timeParam && guestsParam);

  // Local search input state
  const [searchInput, setSearchInput] = useState(searchParam);

  // Data state
  const [restaurants, setRestaurants] = useState<RestaurantList[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<string | number>>(new Set());

  // Sync search input when URL param changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch favorited IDs when user is available
  useEffect(() => {
    if (!user) return;
    const fetchFavIds = async () => {
      try {
        const res = await favoritesRestaurantsList(undefined, undefined, 1000);
        const ids = new Set<string | number>(res.results.map(f => f.restaurant));
        setFavoritedIds(ids);
      } catch {
        // not logged in or error — ignore
      }
    };
    fetchFavIds();
  }, [user]);

  // Fetch cities once
  useEffect(() => {
    axiosInstance
      .get<{ cities: CityOption[] }>('/api/v1/restaurants/cities/')
      .then(res => {
        const data = res.data?.cities;
        if (Array.isArray(data)) {
          setCities(data);
        }
      })
      .catch(() => {
        // cities are optional, ignore error
      });
  }, []);

  // Fetch categories ONCE from a large unfiltered query — otherwise the
  // chip list changes as the user paginates or applies filters, which
  // makes it impossible to switch back to a category that's no longer on
  // the current page.
  useEffect(() => {
    axiosInstance
      .get('/api/v1/restaurants/', { params: { page: 1, page_size: 100 } })
      .then(response => {
        const data = response.data;
        const results: RestaurantList[] = Array.isArray(data) ? data : (data?.results ?? []);
        setCategories(collectCategories(results, locale));
      })
      .catch(() => {
        setCategories([]);
      });
  }, [locale]);

  // Fetch restaurants when URL params change. When the user arrived from
  // the home hero with date+time+guests all selected, use the availability
  // endpoint — it cross-references blocked times and table capacity so
  // only restaurants that can actually seat the party appear. Otherwise,
  // fall back to the regular paginated list.
  useEffect(() => {
    setLoading(true);

    const shouldUseSearch = hasReservationContext;
    const url = shouldUseSearch ? '/api/v1/restaurants/search/' : '/api/v1/restaurants/';
    const params = shouldUseSearch
      ? {
          ...(cityParam ? { city: cityParam } : {}),
          ...(searchParam ? { search: searchParam } : {}),
          date: dateParam,
          time: timeParam,
          party_size: parseInt(guestsParam, 10),
        }
      : {
          ...(cityParam ? { city: cityParam } : {}),
          ...(categoryParam ? { category: categoryParam } : {}),
          ...(searchParam ? { search: searchParam } : {}),
          page: pageParam,
          page_size: PAGE_SIZE,
          ordering: sortParam,
        };

    axiosInstance
      .get(url, { params })
      .then(response => {
        // `axiosInstance` installs a response interceptor that unwraps
        // the `{ success, data: {...} }` envelope this backend uses, so
        // both /restaurants/ and /restaurants/search/ land here as a
        // flat object with `results` + `count` at the top level. Earlier
        // code read `data.data.results` for the search endpoint which
        // was wrong post-unwrap and produced zero restaurants on the
        // reservation-context path.
        const data = response.data;
        const results = Array.isArray(data) ? data : (data?.results ?? []);
        const count = data?.count ?? results.length;
        setRestaurants(results);
        setTotalCount(count);
      })
      .catch(() => {
        setRestaurants([]);
        setTotalCount(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    cityParam,
    categoryParam,
    searchParam,
    pageParam,
    sortParam,
    hasReservationContext,
    dateParam,
    timeParam,
    guestsParam,
  ]);

  // Search endpoint returns everything in one shot (no pagination); hide
  // the pager in that mode.
  const totalPages = hasReservationContext
    ? 1
    : Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        cityParam ||
          categoryParam ||
          searchParam ||
          dateParam ||
          timeParam ||
          guestsParam
      ),
    [cityParam, categoryParam, searchParam, dateParam, timeParam, guestsParam]
  );

  // ── URL helpers ────────────────────────────────────────────────────────────

  const buildParams = useCallback(
    (overrides: {
      city?: string;
      category?: string | null;
      page?: number;
      search?: string;
      sort?: string;
      date?: string;
      time?: string;
      guests?: string;
    }) => {
      const params = new URLSearchParams();
      const city = 'city' in overrides ? overrides.city : cityParam;
      const category = 'category' in overrides ? overrides.category : categoryParam;
      const page = overrides.page ?? 1;
      const search = 'search' in overrides ? overrides.search : searchParam;
      const sort = 'sort' in overrides ? overrides.sort : sortParam;
      const date = 'date' in overrides ? overrides.date : dateParam;
      const time = 'time' in overrides ? overrides.time : timeParam;
      const guests = 'guests' in overrides ? overrides.guests : guestsParam;

      if (city) params.set('city', city);
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      // Omit the sort param when it's the default so URLs stay clean.
      if (sort && sort !== '-average_rating') params.set('sort', sort);
      if (date) params.set('date', date);
      if (time) params.set('time', time);
      if (guests) params.set('guests', guests);
      params.set('page', String(page));
      return params.toString();
    },
    [cityParam, categoryParam, searchParam, sortParam, dateParam, timeParam, guestsParam]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSearchSubmit = useCallback(() => {
    const qs = buildParams({ search: searchInput, page: 1 });
    router.push(`${localePath(locale, '/restaurants')}?${qs}`);
  }, [buildParams, searchInput, locale, router]);

  const handleCategoryChange = useCallback(
    (id: string | null) => {
      const qs = buildParams({ category: id, page: 1 });
      router.push(`${localePath(locale, '/restaurants')}?${qs}`);
    },
    [buildParams, locale, router]
  );

  const handleCityChange = useCallback(
    (city: string) => {
      const qs = buildParams({ city, page: 1 });
      router.push(`${localePath(locale, '/restaurants')}?${qs}`);
    },
    [buildParams, locale, router]
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      const qs = buildParams({ sort, page: 1 });
      router.push(`${localePath(locale, '/restaurants')}?${qs}`);
    },
    [buildParams, locale, router]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      const qs = buildParams({ page: p });
      router.push(`${localePath(locale, '/restaurants')}?${qs}`);
    },
    [buildParams, locale, router]
  );

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    router.push(localePath(locale, '/restaurants'));
  }, [locale, router]);

  // Per-chip clear — wipes only that reservation param, keeps the others.
  const handleClearReservationParam = useCallback(
    (which: 'date' | 'time' | 'guests') => {
      const qs = buildParams({ [which]: '', page: 1 });
      router.push(`${localePath(locale, '/restaurants')}${qs ? `?${qs}` : ''}`);
    },
    [buildParams, locale, router]
  );

  // Pretty-print the date chip in the visitor's locale.
  const reservationDateLabel = useMemo(() => {
    if (!dateParam) return '';
    const d = new Date(`${dateParam}T00:00:00`);
    if (Number.isNaN(d.getTime())) return dateParam;
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
    }).format(d);
  }, [dateParam, locale]);

  const handleToggleFavorite = useCallback(async (restaurantId: string | number) => {
    const id = String(restaurantId);
    // Optimistic update
    setFavoritedIds(prev => {
      const next = new Set(prev);
      if (next.has(id) || next.has(restaurantId)) {
        next.delete(id);
        next.delete(restaurantId as number);
      } else {
        next.add(id);
      }
      return next;
    });
    try {
      await favoritesRestaurantsToggleCreate(id);
    } catch {
      // revert on error — re-fetch
      try {
        const res = await favoritesRestaurantsList(undefined, undefined, 1000);
        const ids = new Set<string | number>(res.results.map(f => f.restaurant));
        setFavoritedIds(ids);
      } catch {
        // ignore
      }
    }
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      <HeaderPrimary />

      {/* Hero sits full-bleed so its gradient backdrop reaches the edges. */}
      <PageHeader
        title={t.restaurantsSearch.title}
        subtitle={t.restaurantsSearch.subtitle}
        resultCount={loading ? undefined : totalCount}
        resultCountTemplate={t.restaurantsSearch.resultsCount}
        resultCountZeroLabel={t.restaurantsSearch.resultsCountZero}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder={t.restaurantsSearch.search}
        clearLabel={t.restaurantsSearch.clearSearch}
        submitLabel={t.restaurantsSearch.submit}
      />

      <ContentWrapper>
        <MainContent>
          {(dateParam || timeParam || guestsParam) && (
            <ReservationContextRow aria-label='Reservation criteria'>
              <ContextHint>{t.restaurantsSearch.reservingFor ?? 'Reserving for:'}</ContextHint>
              {dateParam && (
                <ContextChip>
                  {reservationDateLabel}
                  <ContextChipClose
                    type='button'
                    aria-label='Clear date'
                    onClick={() => handleClearReservationParam('date')}
                  >
                    ✕
                  </ContextChipClose>
                </ContextChip>
              )}
              {timeParam && (
                <ContextChip>
                  {timeParam}
                  <ContextChipClose
                    type='button'
                    aria-label='Clear time'
                    onClick={() => handleClearReservationParam('time')}
                  >
                    ✕
                  </ContextChipClose>
                </ContextChip>
              )}
              {guestsParam && (
                <ContextChip>
                  {guestsParam} {t.booking.persons}
                  <ContextChipClose
                    type='button'
                    aria-label='Clear guests'
                    onClick={() => handleClearReservationParam('guests')}
                  >
                    ✕
                  </ContextChipClose>
                </ContextChip>
              )}
            </ReservationContextRow>
          )}

          <FilterRow>
            <FilterPill>
              <FilterLabel>{t.restaurantsSearch.cityLabel}</FilterLabel>
              <FilterSelect
                value={cityParam}
                onChange={e => handleCityChange(e.target.value)}
                aria-label={t.restaurantsSearch.cityLabel}
              >
                <option value=''>{t.restaurantsSearch.allCities}</option>
                {cities.map(city => (
                  <option key={city.slug} value={city.slug}>
                    {city.translations?.[locale]?.name ??
                      city.translations?.['ka']?.name ??
                      city.slug}
                  </option>
                ))}
              </FilterSelect>
            </FilterPill>

            <FilterPill>
              <FilterLabel>{t.restaurantsSearch.sortLabel}</FilterLabel>
              <FilterSelect
                value={sortParam}
                onChange={e => handleSortChange(e.target.value)}
                aria-label={t.restaurantsSearch.sortLabel}
              >
                <option value='-average_rating'>{t.restaurantsSearch.sortTopRated}</option>
                <option value='-created_at'>{t.restaurantsSearch.sortNewest}</option>
                <option value='name'>{t.restaurantsSearch.sortAz}</option>
              </FilterSelect>
            </FilterPill>

            {hasActiveFilters && (
              <ClearFiltersChip type='button' onClick={handleClearFilters}>
                {t.restaurantsSearch.clearFilters} ✕
              </ClearFiltersChip>
            )}
          </FilterRow>

          <TabsSection>
            <CategoryFilterTabs
              categories={categories}
              activeId={categoryParam}
              allLabel={t.restaurantsSearch.allCategories}
              onChange={handleCategoryChange}
            />
          </TabsSection>

          <GridSection>
            <Grid>
              {loading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <SkeletonCard key={i}>
                    <SkeletonImage />
                    <SkeletonTextArea>
                      <SkeletonBar style={{ width: '70%' }} />
                      <SkeletonBar style={{ width: '45%', height: '10px' }} />
                      <SkeletonBar style={{ width: '55%', height: '10px' }} />
                    </SkeletonTextArea>
                  </SkeletonCard>
                ))
              ) : restaurants.length === 0 ? (
                <EmptyState>
                  <EmptyIcon aria-hidden='true'>🔍</EmptyIcon>
                  <EmptyTitle>
                    {t.restaurantsSearch.noResultsTitle ?? t.restaurantsSearch.noResults}
                  </EmptyTitle>
                  <EmptyHint>{t.restaurantsSearch.noResultsHint ?? ''}</EmptyHint>
                  {hasActiveFilters && (
                    <EmptyCta type='button' onClick={handleClearFilters}>
                      {t.restaurantsSearch.clearFilters}
                    </EmptyCta>
                  )}
                </EmptyState>
              ) : (
                restaurants.map(restaurant => {
                  const categoryName = restaurant.category
                    ? getTranslation(
                        parseTranslations(restaurant.category.translations),
                        'name',
                        locale
                      ) || restaurant.category.slug
                    : undefined;

                  const amenityNames = (restaurant.amenities || [])
                    .map(
                      a =>
                        getTranslation(parseTranslations(a.translations), 'name', locale) || a.slug
                    )
                    .filter(Boolean);

                  return (
                    <CardWrapper key={restaurant.id}>
                      <RestaurantCardPrimary
                        variant='default'
                        restaurantTitle={restaurant.name}
                        imageSrc={restaurant.logo || '/RestaurantCardImage.jpg'}
                        imageBlurhash={(restaurant as { logo_blurhash?: string }).logo_blurhash}
                        locationText={restaurant.city}
                        rating={parseFloat(restaurant.average_rating || '0')}
                        filterText={categoryName}
                        priceLevel='₾₾'
                        href={localePath(locale, `/restaurant/${restaurant.slug}`)}
                        detailsLabel={t.restaurantsList.details}
                        showDetailsButton={true}
                        showBookButton={false}
                        showFavoriteYellow={false}
                        showFavoriteButton={true}
                        showRating={!!restaurant.average_rating}
                        showFilterText={!!categoryName}
                        amenities={amenityNames}
                        isFavorited={
                          favoritedIds.has(String(restaurant.id)) || favoritedIds.has(restaurant.id)
                        }
                        onFavoriteToggle={() => handleToggleFavorite(restaurant.id)}
                      />
                    </CardWrapper>
                  );
                })
              )}
            </Grid>

            <Pagination page={pageParam} totalPages={totalPages} onPageChange={handlePageChange} />
          </GridSection>
        </MainContent>
      </ContentWrapper>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
