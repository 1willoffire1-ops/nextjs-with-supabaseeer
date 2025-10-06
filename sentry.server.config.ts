import * as Sentry from '@sentry/nextjs'

// Sentry disabled for now - uncomment and add DSN when ready for error tracking
const SENTRY_ENABLED = false // Set to true when ready to enable Sentry

if (SENTRY_ENABLED && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment
  environment: process.env.NEXT_PUBLIC_ENV || 'development',

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // Ignore specific errors
  ignoreErrors: [
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    'NetworkError',
  ],

  // Filter sensitive data
  beforeSend(event) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization']
      delete event.request.headers['cookie']
      delete event.request.headers['x-api-key']
    }

    // Remove sensitive body data
    if (event.request?.data) {
      const data = event.request.data
      if (typeof data === 'object') {
        delete data.password
        delete data.token
        delete data.apiKey
        delete data.secret
      }
    }

    return event
  },

  // Add server-specific context
  initialScope: {
    tags: {
      runtime: 'node',
      app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    },
  },
  })
} else {
  // Sentry is disabled - no server error tracking will occur
  console.log('🔇 Server Sentry disabled: Error tracking is off')
}
