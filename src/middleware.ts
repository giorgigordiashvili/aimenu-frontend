import { NextRequest, NextResponse } from 'next/server';

import { defaultLocale, isValidLocale } from './i18n/config';
import { localePath, stripLocale } from './i18n/routing';

const protectedPaths = ['/profile', '/reservations', '/orders'];
const authPaths = ['/login', '/register', '/password-reset'];

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

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const { locale: urlLocale, pathWithoutLocale } = stripLocale(pathname);
  const effectiveLocale =
    urlLocale ?? (pathname === '/' ? getPreferredLocale(request) : defaultLocale);
  const token = request.cookies.get('access_token')?.value;

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
    return NextResponse.next();
  }

  // Bare `/` with non-default locale preference → redirect to /en or /ru
  if (pathname === '/' && effectiveLocale !== defaultLocale) {
    return NextResponse.redirect(new URL(`/${effectiveLocale}`, request.url));
  }

  // Unprefixed path → render with default locale while keeping URL clean.
  const rewriteTarget = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  const rewriteUrl = new URL(rewriteTarget, request.url);
  rewriteUrl.search = search;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
