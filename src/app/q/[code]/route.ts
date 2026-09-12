import { NextRequest, NextResponse } from 'next/server';

// Dynamic QR short links: https://aimenu.ge/q/<code>
//
// The printed code never changes; the backend decides where it goes at scan
// time (restaurant page with that table, the shared-venue page, a menu-only
// view, or a manager-set custom URL). We only build platform paths against
// our own origin and never follow anything but http(s) for custom targets.

export const dynamic = 'force-dynamic';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://admin.aimenu.ge').replace(/\/$/, '');
const CODE_RE = /^[A-Za-z0-9_-]{8,64}$/;
const PLATFORM_PATH_RE = /^\/(restaurant|venue)\//;

interface QRResolveData {
  kind: 'restaurant' | 'venue' | 'menu' | 'custom';
  path: string | null;
  url: string;
}

function requestOrigin(req: NextRequest): string {
  // Behind the reverse proxy Next sees plain http; trust the forwarded
  // headers so redirects stay on the public https origin.
  const proto = req.headers.get('x-forwarded-proto') ?? req.nextUrl.protocol.replace(':', '');
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? req.nextUrl.host;
  return `${proto}://${host}`;
}

function redirectTo(url: URL): NextResponse {
  const res = NextResponse.redirect(url, 302);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const origin = requestOrigin(req);
  const fallback = new URL('/scan?error=invalid', origin);

  if (!CODE_RE.test(code)) return redirectTo(fallback);

  try {
    const res = await fetch(`${API_BASE}/api/v1/qr/${encodeURIComponent(code)}/`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return redirectTo(fallback);
    const json = (await res.json()) as { success?: boolean; data?: QRResolveData };
    const data = json?.data;
    if (!data) return redirectTo(fallback);

    if (data.kind === 'custom') {
      const target = new URL(data.url);
      const isHttp = target.protocol === 'http:' || target.protocol === 'https:';
      const selfLoop = target.origin === origin && target.pathname.startsWith('/q/');
      return isHttp && !selfLoop ? redirectTo(target) : redirectTo(fallback);
    }

    if (data.path && PLATFORM_PATH_RE.test(data.path) && !data.path.startsWith('/q/')) {
      return redirectTo(new URL(data.path, origin));
    }
    return redirectTo(fallback);
  } catch {
    return redirectTo(fallback);
  }
}
