/**
 * Sentry Error Tracking Integration
 *
 * To enable:
 * 1. Sign up at https://sentry.io
 * 2. Create a new project
 * 3. Set VITE_SENTRY_DSN in .env
 * 4. Run: npm install @sentry/sveltekit
 * 5. Uncomment initialization in hooks.client.ts
 */

interface SentryConfig {
	dsn: string;
	environment: 'development' | 'staging' | 'production';
	tracesSampleRate?: number;
	replaysSessionSampleRate?: number;
	replaysOnErrorSampleRate?: number;
}

/**
 * Initialize Sentry (call this in hooks.client.ts)
 * @param config - Sentry configuration
 */
export function initSentry(_config: SentryConfig): void {
	if (typeof window === 'undefined') return;
	void _config;

	console.log('Sentry initialization placeholder. Install @sentry/sveltekit to enable.');

	// Uncomment after installing @sentry/sveltekit:
	/*
	import * as Sentry from '@sentry/sveltekit';

	Sentry.init({
		dsn: config.dsn,
		environment: config.environment,
		tracesSampleRate: config.tracesSampleRate ?? 1.0,
		replaysSessionSampleRate: config.replaysSessionSampleRate ?? 0.1,
		replaysOnErrorSampleRate: config.replaysOnErrorSampleRate ?? 1.0,
		integrations: [
			new Sentry.Replay({
				maskAllText: false,
				blockAllMedia: false
			})
		]
	});
	*/
}

/**
 * Capture an exception manually
 * @param error - The error to capture
 * @param context - Additional context
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
	if (typeof window === 'undefined') return;

	console.error('Sentry captureException:', error, context);

	// Uncomment after installing @sentry/sveltekit:
	/*
	import * as Sentry from '@sentry/sveltekit';

	if (context) {
		Sentry.setContext('custom', context);
	}
	Sentry.captureException(error);
	*/
}

/**
 * Capture a message manually
 * @param message - The message to capture
 * @param level - Severity level
 */
export function captureMessage(
	message: string,
	level: 'info' | 'warning' | 'error' = 'info'
): void {
	if (typeof window === 'undefined') return;

	const consoleLevel = level === 'warning' ? 'warn' : level;
	console[consoleLevel]('Sentry captureMessage:', message);

	// Uncomment after installing @sentry/sveltekit:
	/*
	import * as Sentry from '@sentry/sveltekit';
	Sentry.captureMessage(message, level);
	*/
}

/**
 * Set user context for error tracking
 * @param user - User information
 */
export function setUser(user: { id?: string; email?: string; username?: string }): void {
	if (typeof window === 'undefined') return;

	console.log('Sentry setUser:', user);

	// Uncomment after installing @sentry/sveltekit:
	/*
	import * as Sentry from '@sentry/sveltekit';
	Sentry.setUser(user);
	*/
}
