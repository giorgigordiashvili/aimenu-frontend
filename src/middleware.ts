import { NextRequest, NextResponse } from 'next/server';

import { locales, defaultLocale, isValidLocale } from './i18n/config';

// Routes that require authentication
const protectedPaths = ['/profile', '/reservations', '/orders'];

// Routes that should redirect to home if already authenticated
const authPaths = ['/login', '/register', '/password-reset'];

function getLocaleFromRequest(request: NextRequest): string {
  // Check cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // Check Accept-Language header
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, api routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Get the actual path without locale prefix for auth checks
  let pathWithoutLocale = pathname;
  if (pathnameHasLocale) {
    const locale = locales.find(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`);
    if (locale) {
      pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    }
  }

  // Check for access token in cookies
  const token = request.cookies.get('access_token')?.value;

  // Get locale for redirects
  const locale = pathnameHasLocale
    ? locales.find(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) || defaultLocale
    : getLocaleFromRequest(request);

  // Redirect to login if accessing protected route without token
  if (protectedPaths.some(p => pathWithoutLocale.startsWith(p)) && !token) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if accessing auth pages while logged in
  if (authPaths.some(p => pathWithoutLocale.startsWith(p)) && token) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to locale-prefixed path
  const newUrl = new URL(`/${locale}${pathname}`, request.url);

  // Preserve query parameters
  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
