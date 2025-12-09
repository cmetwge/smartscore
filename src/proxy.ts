// src/proxy.ts
import { NextResponse } from 'next/server'

export function proxy(request: Request) {
  const isDemoUser = request.cookies.get('admin-auth')?.value === 'true'
  const pathname = new URL(request.url).pathname

  // Allow login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Protected demo routes
  const protectedPaths = ['/demo', '/demo-lite', '/demo-calibration', '/demo-score']
  const isProtected = protectedPaths.some(p => pathname === p || pathname.startsWith(p + '/'))

  if (isProtected && !isDemoUser) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/login', '/demo/:path*'],
}