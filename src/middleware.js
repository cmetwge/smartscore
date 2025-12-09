// src/middleware.ts   (or src/middleware.js / src/proxy.ts)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const isDemoUser = request.cookies.get('admin-auth')?.value === 'true';
  const pathname = request.nextUrl.pathname;

  // Allow the login page itself
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect ALL demo routes — add as many as you want here
  const protectedDemoPaths = [
    '/demo',              // full Pro demo
    '/demo-score',        // SmartScore only
    '/demo-calibration',  // Team Calibration only
    // add more later like '/demo-pilot' if you ever want
  ];

  const isProtectedDemoPage = protectedDemoPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );

  if (isProtectedDemoPage && !isDemoUser) {
    // Not logged in → send to login (and remember where they wanted to go)
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Everything else = allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/login',
    '/demo',
    '/demo/:path*',           // covers /demo, /demo-score, /demo-calibration, etc.
  ],
};