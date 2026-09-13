import { NextRequest, NextResponse } from 'next/server';

import { defaultLocale, isValidLocale } from './i18n/config';
import { localePath, stripLocale } from './i18n/routing';

// /orders/<number> is a public status page (order_number is the lookup key).
// /profile/orders is still gated via /profile prefix.
const protectedPaths = ['/profile', '/reservations'];
const authPaths = ['/login', '/register', '/password-reset'];

// Hosts that are the marketplace itself; anything else is a restaurant's own
// domain (Online ordering -> Custom domain) and is resolved through the API.
const OWN_HOST_SUFFIXES = ['aimenu.ge', 'localhost', 'vercel.app', 'ondigitalocean.app'];
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://admin.aimenu.ge').replace(/\/$/, '');
const DOMAIN_TTL_MS = 5 * 60 * 1000;
const domainCache = new Map<string, { slug: string | null; until: number }>();

function isOwnHost(host: string): boolean {
  if (!host || host === '127.0.0.1') return true;
  return OWN_HOST_SUFFIXES.some(s => host === s || host.endsWith(`.${s}`));
}

async function slugForHost(host: string): Promise<string | null> {
  const hit = domainCache.get(host);
  if (hit && hit.until > Date.now()) return hit.slug;
  let slug: string | null = null;
  try {
    const res = await fetch(
      `${API_URL}/api/v1/ordering/by-domain/?host=${encodeURIComponent(host)}`,
      {
        headers: { accept: 'application/json' },
      }
    );
    if (res.ok) {
      const body = (await res.json()) as { data?: { slug?: string } };
      slug = body.data?.slug ?? null;
    }
  } catch {
    slug = null;
  }
  domainCache.set(host, { slug, until: Date.now() + DOMAIN_TTL_MS });
  return slug;
}

function getPreferredLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().substring(0, 2).toLowerCase())
      .find(lang => isValidLocale(lang));
    if (preferred) return preferred;
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon') ||
    // Non-localised routes: the QR short-link resolver (a redirect, no UI)
    // and the Facebook data-deletion page. Without this they would be
    // rewritten into /ka/... and swallowed by the [locale]/[...slug] 404.
    pathname === '/q' ||
    pathname.startsWith('/q/') ||
    pathname.startsWith('/data-deletion')
  ) {
    return NextResponse.next();
  }

  // A restaurant's own domain: the root shows that restaurant's page only.
  const host = (request.headers.get('host') ?? '').split(':')[0].toLowerCase();
  const siteSlug = isOwnHost(host) ? null : await slugForHost(host);
  const requestHeaders = new Headers(request.headers);
  if (siteSlug) {
    requestHeaders.set('x-site-mode', 'restaurant');
    requestHeaders.set('x-site-slug', siteSlug);
  }
  const withHeaders = { request: { headers: requestHeaders } };

  const { locale: urlLocale, pathWithoutLocale } = stripLocale(pathname);
  const effectiveLocale =
    urlLocale ?? (pathname === '/' ? getPreferredLocale(request) : defaultLocale);
  const token = request.cookies.get('access_token')?.value;

  if (siteSlug && pathWithoutLocale === '/') {
    const target = `/${effectiveLocale}/restaurant/${siteSlug}`;
    const rewriteUrl = new URL(target, request.url);
    rewriteUrl.search = search;
    return NextResponse.rewrite(rewriteUrl, withHeaders);
  }

  if (protectedPaths.some(p => pathWithoutLocale.startsWith(p)) && !token) {
    const loginUrl = new URL(localePath(effectiveLocale, '/login'), request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authPaths.some(p => pathWithoutLocale.startsWith(p)) && token) {
    return NextResponse.redirect(new URL(localePath(effectiveLocale, '/'), request.url));
  }

  // Strip default-locale prefix from URL: /ka/... → /...
  if (urlLocale === defaultLocale) {
    const cleanUrl = new URL(pathWithoutLocale, request.url);
    cleanUrl.search = search;
    return NextResponse.redirect(cleanUrl);
  }

  // Non-default locale prefix passes through: /en/..., /ru/...
  if (urlLocale) {
    return NextResponse.next(withHeaders);
  }

  // Bare `/` with non-default locale preference → redirect to /en or /ru
  if (pathname === '/' && effectiveLocale !== defaultLocale) {
    return NextResponse.redirect(new URL(`/${effectiveLocale}`, request.url));
  }

  // Unprefixed path → render with default locale while keeping URL clean.
  const rewriteTarget = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  const rewriteUrl = new URL(rewriteTarget, request.url);
  rewriteUrl.search = search;
  return NextResponse.rewrite(rewriteUrl, withHeaders);
}

export const config = {
  matcher: ['/((?!api|q/|q$|data-deletion|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
