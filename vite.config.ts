import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readSmrtVersion } from './scripts/smrt-version.js';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__SMRT_VERSION__: JSON.stringify(readSmrtVersion())
	},
	optimizeDeps: {
		// These packages' `playground.js` entries lazy-import `.svelte` files but
		// their package.json has no `svelte` field, so Vite's dev dep scanner
		// prebundles them with esbuild, which has no .svelte loader and crashes
		// (`vite build` is unaffected). Serve them unbundled so the svelte plugin
		// compiles them. Upstream: ship a `svelte` field / exclude in the packages
		// (https://github.com/happyvertical/smrt/issues/3843).
		exclude: [
			'@happyvertical/smrt-agents',
			'@happyvertical/smrt-analytics',
			'@happyvertical/smrt-assets',
			'@happyvertical/smrt-chat',
			'@happyvertical/smrt-commerce',
			'@happyvertical/smrt-content',
			'@happyvertical/smrt-events',
			'@happyvertical/smrt-fields',
			'@happyvertical/smrt-images',
			'@happyvertical/smrt-jobs',
			'@happyvertical/smrt-messages',
			'@happyvertical/smrt-projects',
			'@happyvertical/smrt-tenancy',
			'@happyvertical/smrt-users',
			'@happyvertical/smrt-ui',
			'@happyvertical/smrt-svelte',
			'@happyvertical/smrt-planner',
			'@happyvertical/smrt-playground'
		],
		// `smrt-planner` (excluded above) imports `smrt-core/cookbook/engine`,
		// whose `utils/naming` default-imports the CommonJS `pluralize`. Served
		// unbundled, that import has no default export and the planner's
		// client-side load fails in dev (`vite build` is unaffected). Prebundle
		// just that one package. Upstream: https://github.com/happyvertical/smrt/issues/4054
		// (removal tracked in #310).
		include: ['@happyvertical/smrt-planner > @happyvertical/smrt-core > pluralize']
	},
	server: {
		port: 5183
	}
});
