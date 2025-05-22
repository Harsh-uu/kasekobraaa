/**
 * Enhanced logging utility for production debugging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  // Whether to include timestamp
  timestamp?: boolean;
  // Whether to include the caller component/file
  source?: string;
  // Additional metadata to include
  meta?: Record<string, any>;
}

/**
 * Centralized logger with production safety features
 */
class Logger {
  private static instance: Logger;
  private isDev = process.env.NODE_ENV !== 'production';

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log a debug message (only in development)
   */
  public debug(message: string, options?: LogOptions): void {
    this.log('debug', message, options);
  }

  /**
   * Log an info message
   */
  public info(message: string, options?: LogOptions): void {
    this.log('info', message, options);
  }

  /**
   * Log a warning message
   */
  public warn(message: string, options?: LogOptions): void {
    this.log('warn', message, options);
  }

  /**
   * Log an error message
   */
  public error(message: string | Error, options?: LogOptions): void {
    if (message instanceof Error) {
      this.log('error', message.message, {
        ...options,
        meta: {
          ...options?.meta,
          stack: message.stack,
          name: message.name,
        },
      });
    } else {
      this.log('error', message, options);
    }
  }

  private log(level: LogLevel, message: string, options?: LogOptions): void {
    // In production, only log info and above
    if (level === 'debug' && !this.isDev) return;

    const timestamp = options?.timestamp ? new Date().toISOString() : undefined;
    const source = options?.source;
    const meta = options?.meta;

    const logObject = {
      level,
      message,
      ...(timestamp ? { timestamp } : {}),
      ...(source ? { source } : {}),
      ...(meta ? { meta } : {}),
    };

    switch (level) {
      case 'debug':
        console.debug(JSON.stringify(logObject));
        break;
      case 'info':
        console.info(JSON.stringify(logObject));
        break;
      case 'warn':
        console.warn(JSON.stringify(logObject));
        break;
      case 'error':
        console.error(JSON.stringify(logObject));
        break;
    }
  }
}

// Export a singleton instance
export const logger = Logger.getInstance();
