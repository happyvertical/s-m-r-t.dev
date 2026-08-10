import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { readSmrtVersion } from './scripts/smrt-version.js';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	define: {
		__SMRT_VERSION__: JSON.stringify(readSmrtVersion())
	},
	resolve: {
		conditions: mode === 'test' ? ['browser'] : []
	},
	test: {
		// `scripts/` is covered too: the data-freshness audit lives there and its
		// baseline is only trustworthy if something asserts it still matches the
		// installed tree.
		include: ['src/**/*.{test,spec}.{js,ts}', 'scripts/**/*.{test,spec}.{js,mjs,ts}'],
		environment: 'jsdom'
	}
}));
