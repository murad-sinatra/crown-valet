import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicStaffPaths = new Set(['/staff/login', '/staff/signup'])

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicStaffPaths.has(pathname)) {
    return NextResponse.next()
  }

  if (
    (pathname.startsWith('/staff') || pathname.startsWith('/dashboard')) &&
    !request.cookies.get('cv_staff_session')
  ) {
    return NextResponse.redirect(new URL('/staff/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/staff/:path*', '/dashboard/:path*'],
}
