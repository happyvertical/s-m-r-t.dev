import { readFileSync } from 'node:fs';
import { globSync } from 'glob';
import { describe, expect, it } from 'vitest';

describe('site shell contract', () => {
	it('mounts one released AdminShell for all documentation routes', () => {
		const layout = readFileSync('src/routes/+layout.svelte', 'utf8');
		const siteShell = readFileSync('src/lib/components/SiteShell.svelte', 'utf8');

		expect(layout).toContain("page.url.pathname === '/playground'");
		expect(layout).toContain('<SiteShell');
		expect(siteShell).toContain("from '@happyvertical/smrt-svelte/workspace'");
		expect(siteShell).toContain('<AdminShell');
		expect(siteShell).toContain('{#snippet appBar()}');
		// The docs panel exists only inside Docs (#365).
		expect(siteShell).toContain('{#snippet docsPanel()}');
		expect(siteShell).toContain('appPanel={inDocs ? docsPanel : undefined}');
		expect(siteShell).toContain('edgeToggles={{ top: inDocs }}');
		// The demo (`/demo`) has no site header (#381); `/` and every other page do.
		expect(siteShell).toContain('pathname === DEMO_PATH');
		expect(siteShell).toContain('appBar={onDemo ? undefined : appBar}');
		expect(siteShell).toContain('brandInSlot={onDemo}');
		expect(readFileSync('src/lib/data/doors.ts', 'utf8')).toContain("DEMO_PATH = '/demo'");
	});

	it('does not retain or nest a second application shell', () => {
		const applicationFiles = globSync('src/**/*.{svelte,ts}', {
			// The generated UI reference quotes the packages' own prose, which may
			// mention a shell tag; it is documentation, not site markup.
			ignore: ['src/**/*.test.ts', 'src/**/*.test.svelte', 'src/**/*.generated.ts']
		});
		const sources = applicationFiles.map((file) => [file, readFileSync(file, 'utf8')] as const);
		const adminShellSources = sources.filter(([, source]) => source.includes('<AdminShell'));

		expect(adminShellSources.map(([file]) => file)).toEqual([
			'src/lib/components/SiteShell.svelte'
		]);
		for (const [, source] of sources) {
			expect(source).not.toContain('<DocsShell');
			expect(source).not.toContain('<WorkspaceShell');
			expect(source).not.toContain('<RoleShell');
		}
	});
});
