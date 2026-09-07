import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const packageIndex = readFileSync('src/lib/components/PackageIndex.svelte', 'utf8');
const packageWorkbench = readFileSync('src/lib/components/PackageWorkbench.svelte', 'utf8');
const referenceIndex = readFileSync('src/routes/reference/+page.svelte', 'utf8');

describe('Reference-owned discovery contracts', () => {
	it('defaults package back-links to the canonical Reference base — /packages is a redirect, not a second home', () => {
		expect(packageIndex).toContain("backHref = '/reference/packages'");
		expect(packageWorkbench).toContain("backHref = '/reference/packages'");
		expect(readFileSync('src/routes/reference/packages/+page.svelte', 'utf8')).toContain(
			'<PackageIndex />'
		);
		expect(readFileSync('src/routes/reference/packages/[slug]/+page.svelte', 'utf8')).toContain(
			'<PackageWorkbench pkg={data.pkg} />'
		);
		expect(readFileSync('src/routes/packages/+page.server.ts', 'utf8')).toContain(
			"redirect(301, '/reference/packages')"
		);
		expect(readFileSync('src/routes/packages/[slug]/+page.server.ts', 'utf8')).toContain(
			'redirect(301, `/reference/packages/${params.slug}`)'
		);
	});

	it('links package contracts to application stories and applicable guides', () => {
		expect(packageWorkbench).toContain('href="/modules"');
		expect(packageWorkbench).toContain('taskGuides.filter');
		expect(packageWorkbench).toContain('guide.packages.includes(pkg.slug)');
	});

	it('makes Reference search the primary landing action', () => {
		expect(referenceIndex).toContain('role="search"');
		expect(referenceIndex).toContain('Search packages, UI components, props');
		expect(referenceIndex.indexOf('class="reference-search"')).toBeLessThan(
			referenceIndex.indexOf('Reference families')
		);
	});
});
