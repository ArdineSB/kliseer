import { timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

function sameSecret(actual: string, expected: string) {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export function proxy(request: NextRequest) {
  const username = process.env.DEMO_USER;
  const password = process.env.DEMO_PASS;
  if (!username || !password) {
    return new Response('Demo access is not configured', { status: 503 });
  }

  const authorization = request.headers.get('authorization') ?? '';
  const match = /^Basic\s+([A-Za-z0-9+/]+={0,2})$/i.exec(authorization);
  if (match) {
    try {
      const decoded = Buffer.from(match[1], 'base64').toString('utf8');
      const separator = decoded.indexOf(':');
      if (separator >= 0) {
        const user = decoded.slice(0, separator);
        const pass = decoded.slice(separator + 1);
        if (sameSecret(user, username) && sameSecret(pass, password)) {
          return NextResponse.next();
        }
      }
    } catch {
      // Invalid credentials fall through to the same challenge response.
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Kliseer demo", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
