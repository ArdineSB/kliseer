import { randomBytes } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * App auth replaces the old demo Basic Auth (Q1). Anonymous visitors get a random guest
 * token cookie here (the only layer allowed to set cookies on page requests); the seller
 * row is created lazily in lib/session.ts on first data write. Login sessions are issued
 * by /api/auth (Route Handlers can set cookies themselves).
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (!request.cookies.get('kliseer_session') && !request.cookies.get('kliseer_guest')) {
    response.cookies.set('kliseer_guest', randomBytes(32).toString('base64url'), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 86400,
      secure: process.env.NODE_ENV === 'production',
    });
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
