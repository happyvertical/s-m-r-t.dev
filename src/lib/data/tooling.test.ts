import { describe, expect, it } from 'vitest';
import { getToolingGuide, toolingGuides, toolingSurfaceBoundaries } from './tooling';

const guideText = (slug: string): string => JSON.stringify(getToolingGuide(slug));

describe('Tooling information architecture', () => {
	it('keeps every approved Tooling family at a stable route', () => {
		expect(toolingGuides.map((guide) => guide.slug)).toEqual([
			'development-workflow',
			'knowledge',
			'dev-mcp',
			'app-mcp',
			'agent-plugin',
			'compatibility'
		]);
	});

	it('identifies the distinct developer, coding-agent, and application-agent surfaces', () => {
		expect(toolingSurfaceBoundaries.map((surface) => surface.label)).toEqual([
			'CLI, templates, and scanner',
			'Knowledge commands',
			'Development MCP',
			'Generated local MCP',
			'Hosted application MCP',
			'WebMCP',
			'Agent Plugin'
		]);

		expect(toolingSurfaceBoundaries.map((surface) => surface.eyebrow)).toEqual(
			expect.arrayContaining([
				'Developers and CI',
				'Coding agents',
				'Local application agents',
				'Remote application agents',
				'Browser-session application agents'
			])
		);
	});

	it('keeps each MCP authority boundary explicit', () => {
		const surface = (name: string) =>
			toolingSurfaceBoundaries.find((entry) => entry.label === name)?.description ?? '';

		expect(surface('Development MCP')).toMatch(/local, read-only stdio server/);
		expect(surface('Development MCP')).toMatch(/cannot access the running application/);
		expect(surface('Generated local MCP')).toMatch(/credentials from its environment/);
		expect(surface('Generated local MCP')).toMatch(/stays local/);
		expect(surface('Hosted application MCP')).toMatch(/gateway terminates authorization/);
		expect(surface('Hosted application MCP')).toMatch(/principal for each request/);
		expect(surface('WebMCP')).toMatch(/signed-in page user/);
		expect(surface('WebMCP')).toMatch(/not a separate server/);
	});

	it('covers the required human-development workflow', () => {
		const text = guideText('development-workflow');

		for (const required of [
			'CLI',
			'SvelteKit template',
			'SaaS starter',
			'scanner',
			'manifest',
			'migration',
			'smrtVitestPlugin',
			'local loop'
		]) {
			expect(text).toContain(required);
		}
	});

	it('keeps coding-agent evidence separate from application-agent authority', () => {
		expect(guideText('knowledge')).toMatch(/selected source and diagnostics/);
		expect(guideText('knowledge')).toMatch(/does not prove that a caller has authority/);
		expect(guideText('dev-mcp')).toMatch(/coding agent/);
		expect(guideText('dev-mcp')).toMatch(/read-only/);
		expect(guideText('app-mcp')).toMatch(/application agent/);
		expect(guideText('app-mcp')).toMatch(/WebMCP is not the local stdio server/);
	});

	it('uses Agent Plugin only for the portable coding-agent package', () => {
		const text = guideText('agent-plugin');

		expect(text).toMatch(/precise name for the portable coding-agent integration package/);
		expect(text).toMatch(/plugin\.json/);
		expect(text).toMatch(/mcp\.json/);
		expect(text).toMatch(/Skills are found/);
		expect(text).toMatch(/Schemas are pinned/);
		expect(text).toMatch(/Credentials stay with the client/);
	});
});
