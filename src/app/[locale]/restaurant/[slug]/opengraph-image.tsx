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
  const name = r?.name ?? slug;
  const city = r?.city ?? '';
  const rating = r?.average_rating ? parseFloat(r.average_rating).toFixed(1) : null;
  const bg = r?.cover_image || r?.logo || null;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        position: 'relative',
        background: '#0f172b',
      }}
    >
      {bg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bg}
          alt=''
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15,23,43,0.35) 0%, rgba(15,23,43,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '64px 80px',
          color: '#fff',
          width: '100%',
        }}
      >
        <div style={{ fontSize: 22, opacity: 0.7, marginBottom: 12 }}>aimenu.ge</div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            margin: 0,
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 20,
            fontSize: 28,
            opacity: 0.9,
          }}
        >
          {city ? <span>{city}</span> : null}
          {rating ? <span>★ {rating}</span> : null}
        </div>
      </div>
    </div>,
    size
  );
}
