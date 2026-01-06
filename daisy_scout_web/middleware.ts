import { isPublicCloud } from '@/util/envHelper';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedPaths = [
    '/pick-list',
    '/raw-data',
    '/casino',
    '/dcmp-prescout',
    '/cmp-prescout',
  ];

  const requestHeaders = new Headers(request.headers);
  const desiredPath = request.nextUrl.pathname;
  requestHeaders.set('x-pathname', desiredPath);

  if (
    protectedPaths.some((prefix) =>
      desiredPath.toLowerCase().startsWith(prefix.toLowerCase())
    ) &&
    isPublicCloud
  ) {
    return NextResponse.redirect(new URL('/404', request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
