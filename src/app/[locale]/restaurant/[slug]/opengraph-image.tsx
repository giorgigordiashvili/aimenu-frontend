import { ImageResponse } from 'next/og';

// Per-restaurant OG image generated at request time. Pigment CSS's build
// sandbox can't evaluate axios, so we hit the public REST endpoint with
// plain `fetch` here — keeps this route's import graph clean.

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

interface RestaurantSummary {
  name: string;
  description?: string | null;
  city?: string | null;
  cover_image?: string | null;
  logo?: string | null;
  category?: { translations?: unknown; slug: string } | null;
  average_rating?: string | null;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://admin.aimenu.ge').replace(/\/$/, '');
const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aimenu.ge').replace(/\/$/, '');

async function loadRestaurant(slug: string): Promise<RestaurantSummary | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/restaurants/${slug}/`, {
      // 1h cache so social-graph crawlers don't hammer the API.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as RestaurantSummary;
  } catch {
    return null;
  }
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const r = await loadRestaurant(slug);
  const name = r?.name ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const city = r?.city ?? '';
  const rating = r?.average_rating ? parseFloat(r.average_rating).toFixed(1) : null;
  const description = r?.description ? r.description.slice(0, 120) : '';
  const cover = r?.cover_image || null;
  const logo = r?.logo || null;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        position: 'relative',
        background: '#0f172b',
        fontFamily: 'sans-serif',
      }}
    >
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=''
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(24px) brightness(0.55)',
            transform: 'scale(1.08)',
          }}
        />
      )}
      {/* Darker gradient on the bottom half so the text row always has contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15,23,43,0.55) 0%, rgba(15,23,43,0.95) 100%)',
        }}
      />

      {/* aimenu.ge badge — top-right */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.22)',
          borderRadius: 999,
          padding: '10px 20px 10px 14px',
          color: '#fff',
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: '-0.5px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${SITE_ORIGIN}/logo.png`}
          alt=''
          width={32}
          height={32}
          style={{ borderRadius: 8 }}
        />
        aimenu.ge
      </div>

      {/* Main content row — logo badge + info */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 48,
          padding: '64px 80px',
          color: '#fff',
          width: '100%',
          marginTop: 'auto',
        }}
      >
        {/* Restaurant logo badge */}
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: 999,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
          }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt=''
              width={220}
              height={220}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                fontSize: 88,
                fontWeight: 800,
                color: '#0f172b',
                letterSpacing: '-2px',
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Text column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-2px',
              margin: 0,
              color: '#fff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </div>
          {description && (
            <div
              style={{
                fontSize: 26,
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.82)',
                marginTop: 16,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </div>
          )}
          {(city || rating) && (
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 24,
              }}
            >
              {city && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(255,255,255,0.14)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    borderRadius: 999,
                    padding: '8px 18px',
                    fontSize: 24,
                    fontWeight: 500,
                  }}
                >
                  📍 {city}
                </div>
              )}
              {rating && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(236,0,63,0.18)',
                    border: '1px solid rgba(236,0,63,0.45)',
                    borderRadius: 999,
                    padding: '8px 18px',
                    fontSize: 24,
                    fontWeight: 600,
                    color: '#fff',
                  }}
                >
                  ★ {rating}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    size
  );
}
