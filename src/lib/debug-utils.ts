/**
 * Production debugging utilities
 */

import { logger } from "./logger";

interface ErrorInfo {
  message: string;
  source?: string;
  stack?: string;
  data?: any;
}

// Global error handler to track production errors
export const setupGlobalErrorHandler = () => {
  if (typeof window !== 'undefined') {
    // Only run in browser environment
    const originalOnError = window.onerror;
    
    window.onerror = function(message, source, lineno, colno, error) {
      // Log to our centralized logger
      logger.error(`Global error: ${message}`, {
        source: 'window.onerror',
        meta: {
          source,
          lineno,
          colno,
          stack: error?.stack
        }
      });
      
      // Store in session storage for diagnostics
      const errors = JSON.parse(sessionStorage.getItem('app_errors') || '[]');
      errors.push({
        message,
        source,
        lineno,
        colno,
        stack: error?.stack,
        time: new Date().toISOString()
      });
      sessionStorage.setItem('app_errors', JSON.stringify(errors.slice(-10))); // Keep last 10 errors
      
      // Call original handler if exists
      if (originalOnError) {
        return originalOnError.apply(this, arguments as any);
      }
      
      return false;
    };
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
      logger.error('Unhandled promise rejection', {
        source: 'unhandledrejection',
        meta: {
          reason: event.reason,
          stack: event.reason?.stack
        }
      });
      
      // Store in session storage
      const errors = JSON.parse(sessionStorage.getItem('app_errors') || '[]');
      errors.push({
        type: 'unhandledrejection',
        reason: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        time: new Date().toISOString()
      });
      sessionStorage.setItem('app_errors', JSON.stringify(errors.slice(-10))); // Keep last 10 errors
    });
  }
};

// Track auth-related events
export const trackAuthEvent = (event: string, details?: any) => {
  logger.info(`Auth event: ${event}`, {
    source: 'auth-tracking',
    meta: details
  });
  
  // Store auth events for diagnostics
  if (typeof window !== 'undefined') {
    const events = JSON.parse(sessionStorage.getItem('auth_events') || '[]');
    events.push({
      event,
      details,
      time: new Date().toISOString()
    });
    sessionStorage.setItem('auth_events', JSON.stringify(events.slice(-20))); // Keep last 20 events
  }
};

// Track image loading events
export const trackImageEvent = (event: string, url: string, details?: any) => {
  logger.info(`Image event: ${event}`, {
    source: 'image-tracking',
    meta: {
      url,
      ...details
    }
  });
  
  // Store image events for diagnostics
  if (typeof window !== 'undefined') {
    const events = JSON.parse(sessionStorage.getItem('image_events') || '[]');
    events.push({
      event,
      url,
      details,
      time: new Date().toISOString()
    });
    sessionStorage.setItem('image_events', JSON.stringify(events.slice(-20))); // Keep last 20 events
  }
};

// Get all tracked diagnostic data
export const getDiagnosticData = () => {
  if (typeof window === 'undefined') {
    return {
      errors: [],
      authEvents: [],
      imageEvents: []
    };
  }
  
  return {
    errors: JSON.parse(sessionStorage.getItem('app_errors') || '[]'),
    authEvents: JSON.parse(sessionStorage.getItem('auth_events') || '[]'),
    imageEvents: JSON.parse(sessionStorage.getItem('image_events') || '[]')
  };
};

// Clear diagnostic data
export const clearDiagnosticData = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('app_errors');
    sessionStorage.removeItem('auth_events');
    sessionStorage.removeItem('image_events');
  }
};
