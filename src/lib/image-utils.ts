/**
 * Image utilities for handling image loading and errors
 */

/**
 * Preloads an image and returns a promise that resolves when the image loads
 * or rejects if the image fails to load
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Converts an image URL to use CORS-friendly version if needed
 * This can help with cross-origin issues in production
 */
export const getCorsProxyUrl = (url: string): string => {
  if (!url) return url;
  
  // Only apply for production URLs that need it
  if (process.env.NODE_ENV === 'production') {
    // Log the URL for debugging
    console.log('Processing URL for CORS:', url);
    
    // Handle UploadThing URLs
    if (url.startsWith('https://utfs.io') || url.includes('uploadthing')) {
      // Ensure the URL has the appropriate headers for CORS
      // Note: UploadThing should already set appropriate CORS headers,
      // but if there are issues, you might need to use a CORS proxy
      return url;
    }
  }
  return url;
};

/**
 * Check if a URL is an UploadThing URL
 */
export const isUploadThingUrl = (url: string): boolean => {
  if (!url) return false;
  return url.startsWith('https://utfs.io') || url.includes('uploadthing');
};
