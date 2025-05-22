// Route: /api/diagnostics
import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const dynamic = 'force-dynamic'; // Mark this route as dynamic

export async function GET(request: NextRequest) {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();
    const user = await getUser();
    const authenticated = await isAuthenticated();    // Safe version of user data for diagnostics
    const safeUserData = user ? {
      id: user.id,
      email: user.email,
      firstName: user.given_name,
      lastName: user.family_name,
      hasProfile: !!user.id,
    } : null;

    return NextResponse.json({
      status: 'success',
      authenticated,
      user: safeUserData,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      requestHeaders: {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        // Don't include authorization headers for security reasons
      },
    });
  } catch (error) {
    console.error('Diagnostic API error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    }, { status: 500 });
  }
}
