 // middleware-proxy.js
import { NextResponse } from 'next/server'

export function proxy(request) {
  // Your proxy/middleware logic here
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}