import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const packageIndex = readFileSync('src/lib/components/PackageIndex.svelte', 'utf8');
const packageWorkbench = readFileSync('src/lib/components/PackageWorkbench.svelte', 'utf8');
const referenceIndex = readFileSync('src/routes/reference/+page.svelte', 'utf8');

describe('Reference-owned discovery contracts', () => {
	it('keeps the legacy package route compatible while supporting the canonical Reference base', () => {
		expect(packageIndex).toContain("backHref = '/packages'");
		expect(packageWorkbench).toContain("backHref = '/packages'");
		expect(readFileSync('src/routes/packages/+page.svelte', 'utf8')).toContain('<PackageIndex />');
		expect(readFileSync('src/routes/packages/[slug]/+page.svelte', 'utf8')).toContain(
			'<PackageWorkbench pkg={data.pkg} />'
		);
		expect(readFileSync('src/routes/reference/packages/+page.svelte', 'utf8')).toContain(
			'backHref="/reference/packages"'
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
