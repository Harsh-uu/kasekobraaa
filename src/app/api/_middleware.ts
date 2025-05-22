import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run before the main middleware and bypass authentication
// for specific API routes that should be public
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a public API endpoint
  if (
    pathname.startsWith('/api/uploadthing') || 
    pathname.startsWith('/api/webhooks')
  ) {
    // Allow the request to proceed without authentication
    return NextResponse.next();
  }
}

// Configure this middleware to run specifically for UploadThing and webhook routes
export const config = {
  matcher: ['/api/uploadthing/:path*', '/api/webhooks/:path*'],
};
