import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { validateCookbook } from '@happyvertical/smrt-core/cookbook';
import { libraryCookbooks } from '@happyvertical/smrt-planner/core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const schema = JSON.parse(
	readFileSync(
		fileURLToPath(import.meta.resolve('@happyvertical/smrt-core/cookbook/v1.schema.json')),
		'utf8'
	)
) as { $id: string };
const source = readFileSync(join(root, 'infra/modules/havesmrt/url-rewrite.js'), 'utf8');
const context: { handler?: (_event: { request: { uri: string } }) => { uri: string } } = {};
runInNewContext(source, context);

function rewrite(uri: string): string {
	return context.handler!({ request: { uri } }).uri;
}

describe('CloudFront request routing', () => {
	it.each([
		['/plan', '/plan/index.html'],
		['/plan/', '/plan/index.html'],
		['/plan/ai', '/plan/ai/index.html'],
		['/plan/m/products/Product/', '/plan/m/products/Product/index.html']
	])('serves planner pages from their prerendered directories', (request, expected) => {
		expect(rewrite(request)).toBe(expected);
	});

	it.each([
		'/plan/_app/immutable/entry/app.js',
		'/plan/_app/missing.js',
		'/plan/missing.json',
		'/schemas/cookbook/v1.json'
	])('leaves file-like requests for the origin to resolve or 404: %s', (request) => {
		expect(rewrite(request)).toBe(request);
	});

	it('keeps the existing documentation rewrite outside the planner', () => {
		expect(rewrite('/guides/')).toBe('/guides/index.html');
		expect(rewrite('/guides/testing-your-app')).toBe('/guides/testing-your-app.html');
	});
});

describe('published planner artifacts', () => {
	it('uses the canonical public schema URL and validates every library cookbook', () => {
		expect(schema.$id).toBe('https://s-m-r-t.dev/schemas/cookbook/v1.json');
		for (const entry of libraryCookbooks) {
			expect(validateCookbook(entry.document), entry.id).toMatchObject({ ok: true });
		}
	});

	it('assembles planner and schema files before the protected root sync', () => {
		const workflow = readFileSync(join(root, '.github/workflows/build-deploy.yaml'), 'utf8');
		expect(workflow).toContain("node-version: '26'");
		expect(workflow).toContain('path: s-m-r-t.dev/build/');
		expect(workflow.match(/aws s3 sync build\/ .* --delete/g)).toHaveLength(2);
		expect(workflow).not.toMatch(/aws s3 sync .*\bplan\//);
	});
});
