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
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom'
	}
}));
