import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readSmrtVersion } from './scripts/smrt-version.js';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__SMRT_VERSION__: JSON.stringify(readSmrtVersion())
	},
	server: {
		port: 5183
	}
});
