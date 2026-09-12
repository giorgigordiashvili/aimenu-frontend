'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import {
  currencySymbol,
  getVenueMenu,
  type FullMenu,
  type VenueDetailData,
  type VenueRestaurantCard,
} from '@/api/venues';
import CategoryFilterTabs from '@/components/CategoryFilterTabs';
import MainButton from '@/components/MainButton/MainButton';
import ProgressiveImage from '@/components/ProgressiveImage';
import { MenuSectionSkeleton } from '@/components/Skeleton';
import { type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import { restaurantModules } from '@/lib/modules';
import {
  readVenueTable,
  restaurantHref,
  subscribeVenueTable,
  type VenueTableContext,
} from '@/lib/venueTable';
import * as tokens from '@/tokens';
import { getTranslation } from '@/utils/translations';

// ── Styled ────────────────────────────────────────────────────────────────────

const Main = styled('main')({
  padding: '20px',
  paddingBottom: '80px',
  '@media (min-width: 768px)': { padding: '32px 80px 100px', maxWidth: '1280px', margin: '0 auto' },
});

const Hero = styled('section')({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '20px',
});

const Logo = styled('div')({
  width: '72px',
  height: '72px',
  borderRadius: tokens.radiusLg,
  overflow: 'hidden',
  background: tokens.slate100,
  flexShrink: 0,
  position: 'relative',
});

const Title = styled('h1')({
  fontSize: '26px',
  fontWeight: 700,
  color: tokens.foreground,
  margin: 0,
});
const Sub = styled('p')({ margin: '4px 0 0', color: tokens.muted, fontSize: '14px' });

const TableChip = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 14px',
  borderRadius: tokens.radiusMd,
  background: tokens.rose50,
  color: tokens.rose700,
  fontWeight: 600,
  fontSize: '14px',
  marginBottom: '16px',
});

const Segment = styled('div')({
  display: 'inline-flex',
  gap: '6px',
  padding: '4px',
  borderRadius: '999px',
  background: tokens.slate100,
  marginBottom: '20px',
});

const SegBtn = styled('button')<{ active?: boolean }>({
  border: 'none',
  cursor: 'pointer',
  padding: '10px 18px',
  borderRadius: '999px',
  fontSize: '14px',
  fontWeight: 600,
  background: 'transparent',
  color: tokens.slate600,
  variants: [
    {
      props: { active: true },
      style: { background: tokens.white, color: tokens.foreground, boxShadow: tokens.shadowMd },
    },
  ],
});

const Grid = styled('div')({
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: '1fr',
  '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
  '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
});

const Card = styled('article')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px',
  borderRadius: tokens.radiusLg,
  border: `1px solid ${tokens.border}`,
  background: tokens.white,
  borderTop: '4px solid var(--brand, #EC003F)',
});

const CardHead = styled('div')({ display: 'flex', alignItems: 'center', gap: '12px' });
const CardLogo = styled('div')({
  width: '48px',
  height: '48px',
  borderRadius: tokens.radiusMd,
  overflow: 'hidden',
  background: tokens.slate100,
  flexShrink: 0,
  position: 'relative',
});
const CardTitle = styled('h2')({
  fontSize: '18px',
  fontWeight: 700,
  margin: 0,
  color: tokens.foreground,
});
const Meta = styled('div')({
  fontSize: '13px',
  color: tokens.muted,
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
});
const Open = styled('span')<{ open?: boolean }>({
  color: tokens.slate500,
  variants: [{ props: { open: true }, style: { color: tokens.green600 } }],
});
const Desc = styled('p')({
  margin: 0,
  color: tokens.slate600,
  fontSize: '14px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});
const CardActions = styled('div')({ marginTop: 'auto', display: 'flex', gap: '8px' });

const VendorSection = styled('section')({ marginTop: '28px' });
const VendorHead = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  paddingBottom: '10px',
  borderBottom: `2px solid var(--brand, ${tokens.rose500})`,
  marginBottom: '12px',
});
const CatTitle = styled('h3')({
  fontSize: '16px',
  fontWeight: 700,
  margin: '18px 0 8px',
  color: tokens.foreground,
});
const Row = styled(Link)({
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: `1px solid ${tokens.slate100}`,
  textDecoration: 'none',
  color: 'inherit',
});
const Thumb = styled('div')({
  width: '56px',
  height: '56px',
  borderRadius: tokens.radiusMd,
  overflow: 'hidden',
  background: tokens.slate100,
  flexShrink: 0,
  position: 'relative',
});
const RowName = styled('div')({ fontWeight: 600, fontSize: '15px', color: tokens.foreground });
const RowDesc = styled('div')({ fontSize: '13px', color: tokens.muted });
const Price = styled('div')({
  marginLeft: 'auto',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  color: tokens.foreground,
});
const Muted = styled('p')({ color: tokens.muted, textAlign: 'center', padding: '40px 0' });

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useVenueTable(venueSlug: string): VenueTableContext | null {
  const [ctx, setCtx] = useState<VenueTableContext | null>(null);
  useEffect(() => {
    const load = () => {
      const c = readVenueTable();
      setCtx(c && c.venueSlug === venueSlug ? c : null);
    };
    load();
    return subscribeVenueTable(load);
  }, [venueSlug]);
  return ctx;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  slug: string;
  locale: Locale;
  initial: VenueDetailData | null;
}

export default function VenuePage({ slug, locale, initial }: Props) {
  const t = getDictionary(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') === 'menu' ? 'menu' : 'restaurants';
  const table = useVenueTable(slug);
  const [vendor, setVendor] = useState<string | null>(null);

  const setView = (next: 'restaurants' | 'menu') => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'menu') params.set('view', 'menu');
    else params.delete('view');
    const qs = params.toString();
    router.replace(`${localePath(locale, `/venue/${slug}`)}${qs ? `?${qs}` : ''}`, {
      scroll: false,
    });
  };

  const menu = useSWR(view === 'menu' ? ['venueMenu', slug] : null, () => getVenueMenu(slug), {
    revalidateOnFocus: false,
  });

  const hrefFor = (r: VenueRestaurantCard) =>
    restaurantHref(localePath(locale, `/restaurant/${r.slug}`), table, r.slug);

  if (!initial) {
    return (
      <Main>
        <Muted>{t.venue.notFound}</Muted>
      </Main>
    );
  }

  const { venue, restaurants } = initial;
  const vendors = restaurants.map(r => ({ id: r.slug, name: r.name }));

  return (
    <Main>
      <Hero>
        {venue.logo ? (
          <Logo>
            <ProgressiveImage
              src={venue.logo}
              alt={venue.name}
              fill
              sizes='72px'
              blurhash={venue.logo_blurhash}
              style={{ objectFit: 'cover' }}
            />
          </Logo>
        ) : null}
        <div>
          <Title>{venue.name}</Title>
          <Sub>
            {venue.description ||
              t.venue.restaurantsCount.replace('{count}', String(restaurants.length))}
          </Sub>
        </div>
      </Hero>

      {table ? (
        <TableChip data-testid='venue-table-chip'>
          <span>
            {t.venue.table} {table.tableNumber}
          </span>
          <span style={{ fontWeight: 400 }}>· {t.venue.tableHint}</span>
        </TableChip>
      ) : null}

      <Segment role='tablist' aria-label={t.venue.menu}>
        <SegBtn
          role='tab'
          aria-selected={view === 'restaurants'}
          active={view === 'restaurants'}
          onClick={() => setView('restaurants')}
        >
          {t.venue.restaurants}
        </SegBtn>
        <SegBtn
          role='tab'
          aria-selected={view === 'menu'}
          active={view === 'menu'}
          onClick={() => setView('menu')}
        >
          {t.venue.menu}
        </SegBtn>
      </Segment>

      {view === 'restaurants' ? (
        <Grid>
          {restaurants.map(r => (
            <RestaurantCard key={r.slug} r={r} locale={locale} href={hrefFor(r)} t={t} />
          ))}
        </Grid>
      ) : (
        <>
          <CategoryFilterTabs
            categories={vendors}
            activeId={vendor}
            allLabel={t.venue.all}
            onChange={setVendor}
          />
          {menu.isLoading ? (
            <MenuSectionSkeleton />
          ) : menu.error || !menu.data ? (
            <Muted>{t.venue.loadFailed}</Muted>
          ) : (
            menu.data.restaurants
              .filter(e => !vendor || e.restaurant.slug === vendor)
              .map(e => (
                <VendorMenu
                  key={e.restaurant.slug}
                  r={e.restaurant}
                  menu={e.menu}
                  locale={locale}
                  href={hrefFor(e.restaurant)}
                  t={t}
                />
              ))
          )}
        </>
      )}
    </Main>
  );
}

type Dict = ReturnType<typeof getDictionary>;

function RestaurantCard({
  r,
  locale,
  href,
  t,
}: {
  r: VenueRestaurantCard;
  locale: Locale;
  href: string;
  t: Dict;
}) {
  const category = r.category ? getTranslation(r.category.translations, 'name', locale) : '';
  // Reviews module off for this member: no stars on its card.
  const rating = restaurantModules(r).reviews ? parseFloat(r.average_rating || '0') : 0;
  return (
    <Card
      style={{ ['--brand' as string]: r.primary_color || undefined }}
      data-testid={`venue-card-${r.slug}`}
    >
      <CardHead>
        <CardLogo>
          {r.logo ? (
            <ProgressiveImage
              src={r.logo}
              alt={r.name}
              fill
              sizes='48px'
              blurhash={r.logo_blurhash}
              style={{ objectFit: 'cover' }}
            />
          ) : null}
        </CardLogo>
        <div>
          <CardTitle>{r.name}</CardTitle>
          <Meta>
            {category ? <span>{category}</span> : null}
            <Open open={r.is_open_now}>
              {r.is_open_now ? t.restaurantDetail.openNow : t.restaurantDetail.closed}
            </Open>
            {rating > 0 ? (
              <span>
                ★ {rating.toFixed(1)} · {r.total_reviews} {t.venue.reviews}
              </span>
            ) : null}
          </Meta>
        </div>
      </CardHead>
      {r.description ? <Desc>{r.description}</Desc> : null}
      <CardActions>
        <Link href={href} style={{ textDecoration: 'none', flex: 1 }}>
          <MainButton
            variant={r.accepts_remote_orders ? 'rose_cta' : 'outline'}
            size='default'
            rounded
            fullWidth
            title={r.accepts_remote_orders ? t.venue.order : t.venue.viewMenu}
          />
        </Link>
      </CardActions>
    </Card>
  );
}

function VendorMenu({
  r,
  menu,
  locale,
  href,
  t,
}: {
  r: VenueRestaurantCard;
  menu: FullMenu;
  locale: Locale;
  href: string;
  t: Dict;
}) {
  const symbol = currencySymbol(r.default_currency);
  const groups = useMemo(() => {
    const out = menu.categories
      .filter(g => g.items.length)
      .map(g => ({
        id: g.category.id,
        name: getTranslation(g.category.translations, 'name', locale),
        items: g.items,
      }));
    if (menu.uncategorized_items.length)
      out.push({ id: 'other', name: '', items: menu.uncategorized_items });
    return out;
  }, [menu, locale]);

  return (
    <VendorSection
      style={{ ['--brand' as string]: r.primary_color || undefined }}
      data-testid={`venue-menu-${r.slug}`}
    >
      <VendorHead>
        <CardTitle>{r.name}</CardTitle>
        <Link href={href} style={{ textDecoration: 'none' }}>
          <MainButton
            variant='rose_cta'
            size='small'
            rounded
            title={r.accepts_remote_orders ? t.venue.order : t.venue.viewMenu}
          />
        </Link>
      </VendorHead>
      {groups.length === 0 ? <Muted>{t.venue.emptyMenu}</Muted> : null}
      {groups.map(g => (
        <div key={g.id}>
          {g.name ? <CatTitle>{g.name}</CatTitle> : null}
          {g.items.map(item => {
            const name = getTranslation(item.translations, 'name', locale);
            const desc = getTranslation(item.translations, 'description', locale);
            return (
              <Row key={item.id} href={href}>
                {item.image ? (
                  <Thumb>
                    <ProgressiveImage
                      src={item.image}
                      alt={name}
                      fill
                      sizes='56px'
                      blurhash={(item as { image_blurhash?: string }).image_blurhash}
                      style={{ objectFit: 'cover' }}
                    />
                  </Thumb>
                ) : null}
                <div style={{ minWidth: 0 }}>
                  <RowName>{name}</RowName>
                  {desc ? <RowDesc>{desc}</RowDesc> : null}
                </div>
                <Price>
                  {parseFloat(item.price).toFixed(2)} {symbol}
                </Price>
              </Row>
            );
          })}
        </div>
      ))}
    </VendorSection>
  );
}
