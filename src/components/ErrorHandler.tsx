'use client';

import { useEffect } from 'react';
import { setupGlobalErrorHandler } from '@/lib/debug-utils';

export default function ErrorHandler() {
  useEffect(() => {
    // Set up global error handling
    setupGlobalErrorHandler();
  }, []);
  
  return null; // This component doesn't render anything
}
