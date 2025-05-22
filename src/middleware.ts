import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

// Add paths that should be publicly accessible
const publicPaths = [
  '/',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/[kindeAuth]',
  '/api/auth/kinde_callback',
  '/auth-callback',
  '/configure/upload',
  '/configure/design',
  '/configure/preview', // Add preview to public paths
  '/api/uploadthing',  // Add this line to allow uploadthing API
  '/api/webhooks',     // Add this line to allow webhook endpoints
  '/diagnostics',      // Image diagnostics page
];

// Check if the current path is a public path
const isPublicPath = (path: string) => {
  // Check exact matches
  if (publicPaths.includes(path)) return true;
  
  // API routes that should be public
  if (
    path.startsWith('/api/uploadthing') || 
    path.startsWith('/api/webhooks') ||
    path.startsWith('/api/auth') ||
    path.includes('kinde_callback')
  ) {
    return true;
  }
  
  // Check if path starts with any of the public paths, including query params
  return publicPaths.some(
    (publicPath) => {
      // Exact match or starts with path + /
      return path === publicPath || 
             path.startsWith(publicPath + '/') || 
             path.startsWith(publicPath + '?');
    }
  );
};

export async function middleware(request: NextRequest) {
  // Get pathname of the request
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // For protected paths, verify auth
  const { isAuthenticated } = getKindeServerSession();
  if (!await isAuthenticated()) {
    // Store the original URL to redirect back after login
    const redirectUrl = new URL('/api/auth/login', request.url);
    redirectUrl.searchParams.set('post_login_redirect_url', pathname);
    
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (.ico, .svg, .png, .jpg, .jpeg)
     * - api/uploadthing (UploadThing API routes)
     * - api/webhooks (Webhook endpoints)
     * - api/auth (Auth API routes including Kinde callbacks)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|api/uploadthing|api/webhooks|api/auth).*)',
  ],
};
