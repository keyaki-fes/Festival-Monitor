import { NextRequest, NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = (await getToken({ req, secret: process.env.SECRET })) as any
  if (pathname === '/') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    return NextResponse.next()
  } else if (!token || !token.isAdmin) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/'],
}
