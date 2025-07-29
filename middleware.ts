// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/',                // landing
  '/contact',
  '/about',
  '/privacypolicy',
  '/termspage',
  '/signin',
  '/signup',
  '/blocked',
  '/deleted',
  '/demo',
  '/bkash',           // if you want this public
];

const ADMIN_PREFIX = '/admin';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Public paths pass through
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);

  // 2) Call backend /auth/verify with cookies
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const verifyUrl = `${apiBase}/api/verify`;

  const res = await fetch(verifyUrl, {
    method: 'GET',
    headers: {
      cookie: req.headers.get('cookie') || '',
    },
    // @ts-ignore - Next edge runtime
    cache: 'no-store',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));

    // redirect blocked/deleted specifically
    if (data.code === 'BLOCKED') {
      const url = req.nextUrl.clone();
      url.pathname = '/blocked';
      url.searchParams.set('email', data.user?.email || '');
      return NextResponse.redirect(url);
    }
    if (data.code === 'DELETED') {
      const url = req.nextUrl.clone();
      url.pathname = '/deleted';
      url.searchParams.set('email', data.user?.email || '');
      return NextResponse.redirect(url);
    }

    // otherwise unauthenticated
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  const { user } = await res.json();

  // 3) Admin gate
  if (isAdminRoute && user.role !== 1) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run middleware for everything except:
     * - static files
     * - _next
     * - images
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
