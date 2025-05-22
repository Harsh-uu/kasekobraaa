/**
 * Environment variable utilities
 */

/**
 * Gets the appropriate base URL for the current environment
 * In development, this will be localhost
 * In production, this will try to use environment variables or fallback to window.location.origin
 */
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: Use the browser's location
    return window.location.origin;
  }
  
  // Server-side: Use environment variables
  if (process.env.NODE_ENV === 'production') {
    // In production, prefer environment variables
    return process.env.NEXT_PUBLIC_SERVER_URL || 'https://your-production-domain.com';
  }
  
  // In development, use localhost
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
};

/**
 * Gets the auth callback URL for the current environment
 */
export const getAuthCallbackUrl = (): string => {
  return `${getBaseUrl()}/auth-callback`;
};
