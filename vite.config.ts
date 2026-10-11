import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readSmrtVersion } from './scripts/smrt-version.js';

const plannerPreviewRoutes = {
	name: 'planner-preview-routes',
	configurePreviewServer(server: {
		middlewares: {
			use: (
				_handler: (
					_request: { url?: string },
					_response: {
						writeHead: (_status: number, _headers: Record<string, string>) => void;
						end: () => void;
					},
					_next: () => void
				) => void
			) => void;
		};
	}) {
		server.middlewares.use((request, response, next) => {
			const url = new URL(request.url ?? '/', 'http://preview.local');
			if (url.pathname === '/plan') {
				response.writeHead(308, { location: `/plan/${url.search}` });
				response.end();
				return;
			}
			if (url.pathname === '/plan/') {
				url.pathname = '/plan/index.html';
			} else if (
				url.pathname.startsWith('/plan/') &&
				!url.pathname.split('/').pop()?.includes('.')
			) {
				url.pathname = '/plan/404.html';
			}
			request.url = `${url.pathname}${url.search}`;
			next();
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), plannerPreviewRoutes],
	define: {
		__SMRT_VERSION__: JSON.stringify(readSmrtVersion())
	},
	server: {
		port: 5183
	}
});
