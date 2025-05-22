import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run before the main middleware and bypass authentication checks
// for all Kinde authentication-related routes
export function middleware(request: NextRequest) {
  // Just pass through all requests without authentication checks
  return NextResponse.next();
}

// Configure this middleware to run specifically for Kinde auth routes
export const config = {
  matcher: [
    '/api/auth/:path*',
    '/api/auth/kinde_callback',
    '/auth-callback',
    '/auth-callback/:path*'
  ],
};
