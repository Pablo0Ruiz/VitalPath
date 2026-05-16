import { NextRequest, NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

const PORTAL_ROLES = ['admin', 'trabajador_centro', 'medico'];

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/patients',
  '/doctors',
  '/appointments',
  '/reports',
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('message', 'no_token_found');
    return NextResponse.redirect(url);
  }

  try {
    const payload = decodeJwt(token);
    const role = payload.role as string | undefined;

    if (!role || !PORTAL_ROLES.includes(role)) {
      const url = new URL('/login', request.url);
      url.searchParams.set('message', 'not_authorized');
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(
      new URL('/login?message=session_expired', request.url),
    );
    response.cookies.delete('access_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/patients/:path*',
    '/doctors/:path*',
    '/appointments/:path*',
    '/reports/:path*',
  ],
};
