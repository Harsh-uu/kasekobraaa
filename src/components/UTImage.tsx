'use client';

import { getCorsProxyUrl } from '@/lib/image-utils';
import { useEffect, useState } from 'react';

interface UTImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackClassName?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * UploadThing Image component that handles cross-origin issues
 * and provides fallback rendering when images fail to load
 */
const UTImage = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  fallbackClassName = '',
  onLoad,
  onError,
}: UTImageProps) => {
  const [processedSrc, setProcessedSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset state when src changes
    setIsLoading(true);
    setHasError(false);
    
    // Process the URL for CORS if needed
    const corsUrl = getCorsProxyUrl(src);
    setProcessedSrc(corsUrl);
    
    // Preload the image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setIsLoading(false);
      onLoad?.();
    };
    img.onerror = (e) => {
      console.error('Failed to load image:', src, e);
      setHasError(true);
      setIsLoading(false);
      onError?.(new Error(`Failed to load image: ${src}`));
    };
    img.src = corsUrl;
  }, [src, onLoad, onError]);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className} ${fallbackClassName}`}>
        <p className="text-sm text-gray-500">Image could not be loaded</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className} ${fallbackClassName}`}>
        <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin border-t-primary"></div>
      </div>
    );
  }

  return (
    <img
      src={processedSrc}
      alt={alt}
      className={`${className} ${imgClassName}`}
      crossOrigin="anonymous"
      onError={() => setHasError(true)}
    />
  );
};

export default UTImage;
