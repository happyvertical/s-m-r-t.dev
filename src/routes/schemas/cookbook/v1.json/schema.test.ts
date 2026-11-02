import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GET } from './+server';

const URL = 'https://s-m-r-t.dev/schemas/cookbook/v1.json';

describe('/schemas/cookbook/v1.json (#307)', () => {
	it('serves the installed smrt-core cookbook schema at its own $id', async () => {
		const response = await GET({} as Parameters<typeof GET>[0]);
		const body = await response.json();
		expect(response.headers.get('content-type')).toContain('application/schema+json');
		expect(body.$id).toBe(URL);
		expect(body.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
	});

	it('is the schema the CLI library cookbooks point at', () => {
		// smrt-cli exports no package.json, so read it through the direct dependency's link.
		const cli = join(process.cwd(), 'node_modules/@happyvertical/smrt-cli');
		const cookbooks = readdirSync(join(cli, 'cookbooks')).filter((f) => f.endsWith('.json'));
		expect(cookbooks.length).toBeGreaterThan(0);
		for (const file of cookbooks) {
			const cookbook = JSON.parse(readFileSync(join(cli, 'cookbooks', file), 'utf8'));
			expect(cookbook.$schema, file).toBe(URL);
		}
	});
});
