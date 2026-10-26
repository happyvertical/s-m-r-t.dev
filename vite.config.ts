import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { readSmrtVersion } from './scripts/smrt-version.js';

/**
 * Keep Vite's `vite:asset-import-meta-url` code filter (`/new\s+URL.+import\.meta\.url/s`,
 * a greedy dot-all scan) from running over `@mlc-ai/web-llm`.
 *
 * `smrt-planner` bundles `web-llm` into its `llm.worker`; the module is one
 * 6.8 MB line, and that filter backtracks across all of it. V8's regexp
 * backtrack stack is right at its limit there, so about three builds in four
 * died with "Maximum call stack size exceeded" (#366). web-llm has no
 * `new URL(..., import.meta.url)` Vite would rewrite (its one is a Node-only
 * fallback), so spelling `new URL` as `new globalThis.URL` is behaviourally
 * identical and the filter fails fast. Upstream:
 * https://github.com/happyvertical/smrt/issues/4376 (Vite's filter is unbounded);
 * remove once the planner stops bundling web-llm into the worker.
 */
function webLlmUrlFilterGuard(): Plugin {
	return {
		name: 'site:web-llm-url-filter-guard',
		enforce: 'pre',
		transform(code, id) {
			if (!/[\\/]@mlc-ai[\\/]web-llm[\\/]lib[\\/]index\.js$/.test(id)) return null;
			return { code: code.replace(/\bnew\s+URL\b/g, 'new globalThis.URL'), map: null };
		}
	};
}

export default defineConfig({
	plugins: [webLlmUrlFilterGuard(), sveltekit()],
	worker: {
		plugins: () => [webLlmUrlFilterGuard()]
	},
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
			'@happyvertical/smrt-reports',
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
