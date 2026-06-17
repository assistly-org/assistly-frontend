import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ⚡ Changed function name from middleware to proxy
export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value
  const currentPath = request.nextUrl.pathname

  const isAuthRoute = currentPath.startsWith('/login') || currentPath.startsWith('/register')
  const isProtectedRoute = currentPath.startsWith('/dashboard') || currentPath.startsWith('/organizations')

  // Scenario 1: Not logged in, trying to access protected page -> Kick to login
  if (isProtectedRoute && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Scenario 2: Logged in, trying to access login/register page -> Push to organizations
  if (isAuthRoute && refreshToken) {
    return NextResponse.redirect(new URL('/organizations', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/organizations/:path*', '/login', '/register'],
}