import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Capture Replay for 10% of all sessions,
  // plus 100% of sessions with an error
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional SDK configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Environment
  environment: process.env.NEXT_PUBLIC_ENV || 'development',

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    // Network errors
    'NetworkError',
    'Network request failed',
    'Failed to fetch',
    // Random plugins/extensions
    'atomicFindClose',
    'conduitPage',
  ],

  // Filter out transactions
  beforeSend(event, hint) {
    // Filter out events from development
    if (process.env.NODE_ENV === 'development') {
      return null
    }

    // Don't send events for bot traffic
    const userAgent = event.request?.headers?.['user-agent']
    if (userAgent && /bot|crawler|spider/i.test(userAgent)) {
      return null
    }

    return event
  },

  // Add custom context
  initialScope: {
    tags: {
      app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    },
  },
})
