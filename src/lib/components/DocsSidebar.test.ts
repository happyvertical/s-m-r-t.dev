import { movedHref } from '$lib/data/doc-moves';
import { cleanup, render, screen, within } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import {
	docsNavigation,
	documentationSectionForPathname,
	documentationSections,
	getDocumentationSection
} from '$lib/data/navigation';
import DocsSidebar from './DocsSidebar.svelte';

afterEach(cleanup);

const sidebar = () => screen.getByRole('navigation', { name: 'Documentation' });
const sectionHrefs = new Set(documentationSections.map((section) => section.href));

describe('docs sidebar', () => {
	it('is one navigation landmark named Documentation', () => {
		render(DocsSidebar, { props: { pathname: '/docs/framework' } });

		expect(screen.getAllByRole('navigation')).toEqual([sidebar()]);
	});

	it('lists the six sections first, in canonical order', () => {
		render(DocsSidebar, { props: { pathname: '/docs/tooling' } });
		const links = within(sidebar()).getAllByRole('link').slice(0, 6);

		expect(links.map((link) => link.getAttribute('href'))).toEqual([
			'/docs',
			'/docs/framework',
			'/docs/ui',
			'/docs/tooling',
			'/docs/guides',
			'/docs/reference'
		]);
		expect(links.map((link) => link.textContent?.replace(/^\s*\d+\s*/, '').trim())).toEqual(
			documentationSections.map((section) => section.label)
		);
	});

	it("lists the current section's groups and pages, and no other section's", () => {
		render(DocsSidebar, { props: { pathname: '/docs/tooling/dev-mcp' } });
		const tooling = getDocumentationSection('tooling');

		for (const group of tooling.groups) {
			const list = screen.getByRole('list', { name: group.label });
			expect(
				within(list)
					.getAllByRole('link')
					.map((link) => link.getAttribute('href'))
			).toEqual(group.items.map((item) => item.href));
		}
		// "Task guides" belongs to Guides, "Foundations" to Framework.
		expect(screen.queryByRole('list', { name: 'Task guides' })).toBeNull();
		expect(screen.queryByRole('list', { name: 'Foundations' })).toBeNull();
	});

	it('leaves out a group that only repeats the section list', () => {
		render(DocsSidebar, { props: { pathname: '/docs' } });

		expect(screen.getByRole('list', { name: 'For developers' })).toBeTruthy();
		expect(screen.queryByRole('list', { name: 'Sections' })).toBeNull();
	});

	it('marks the current page link with aria-current="page"', () => {
		render(DocsSidebar, { props: { pathname: '/docs/tooling/dev-mcp' } });
		const current = within(sidebar())
			.getAllByRole('link')
			.filter((link) => link.getAttribute('aria-current') === 'page');

		expect(current.map((link) => link.getAttribute('href'))).toEqual(['/docs/tooling/dev-mcp']);
	});

	it.each([
		movedHref('applicationShell'),
		movedHref('policyAwareForms'),
		movedHref('fieldPolicyLayers'),
		movedHref('fieldPolicyOperations')
	])('lists %s under UI and marks it the current page', (pathname) => {
		expect(documentationSectionForPathname(pathname).id).toBe('ui');
		render(DocsSidebar, { props: { pathname } });
		const current = within(sidebar())
			.getAllByRole('link')
			.filter((link) => link.getAttribute('aria-current') === 'page');

		expect(current.map((link) => link.getAttribute('href'))).toEqual([pathname]);
	});

	it('marks a section landing as the current page in the section list', () => {
		render(DocsSidebar, { props: { pathname: '/docs/guides' } });
		const [docs, , , , guides] = within(sidebar()).getAllByRole('link');

		expect(guides.getAttribute('aria-current')).toBe('page');
		expect(docs.getAttribute('aria-current')).toBeNull();
	});

	// The active rule is a prefix match, so an overview and a page under it both
	// match; only the page itself may claim aria-current="page".
	it('marks only the deepest matching page, not its overview', () => {
		const framework = getDocumentationSection('framework');
		const foundations = framework.groups.find((group) => group.label === 'Foundations');
		const page = foundations?.items.find((item) => item.href.startsWith('/docs/foundations/'));
		expect(page).toBeTruthy();
		render(DocsSidebar, { props: { pathname: page?.href as string } });
		const list = screen.getByRole('list', { name: 'Foundations' });
		const current = within(list)
			.getAllByRole('link')
			.filter((link) => link.hasAttribute('aria-current'));

		expect(current.map((link) => link.getAttribute('href'))).toEqual([page?.href]);
	});

	it('marks a matching anchor as the current location, as the docs panel does', () => {
		const anchor = getDocumentationSection('framework')
			.groups.flatMap((group) => group.items)
			.find((item) => item.href.includes('#'));
		expect(anchor).toBeTruthy();
		const url = new URL(anchor?.href as string, 'https://smrt.happyvertical.com');
		render(DocsSidebar, { props: { pathname: url.pathname, hash: url.hash } });
		const links = within(sidebar()).getAllByRole('link');
		const located = links.filter((link) => link.getAttribute('aria-current') === 'location');

		expect(located.map((link) => link.getAttribute('href'))).toEqual([anchor?.href]);
		expect(
			links.some(
				(link) =>
					link.getAttribute('href') === url.pathname && link.getAttribute('aria-current') === 'page'
			)
		).toBe(true);
	});

	// The sidebar lists what `documentationSections` groups list, and nothing
	// else. A registered page no group lists still gets its section marked
	// current (`aria-current="true"`); it just has no page link of its own.
	// `ungrouped` names those pages, so a new one is a decision, not an accident.
	it('marks the section for every registered docs page, and the page where a group lists it', async () => {
		const { rerender } = render(DocsSidebar, { props: { pathname: '/docs' } });
		const sectionMisses: string[] = [];
		const ungrouped: string[] = [];

		for (const item of docsNavigation.flatMap((group) => group.items)) {
			const url = new URL(item.href, 'https://smrt.happyvertical.com');
			if (!url.pathname.startsWith('/docs')) continue;
			await rerender({ pathname: url.pathname, hash: url.hash });
			const links = within(sidebar()).getAllByRole('link');
			const current = links.filter((link) => link.hasAttribute('aria-current'));
			const section = documentationSectionForPathname(url.pathname);

			if (!current.some((link) => link.getAttribute('href') === section.href)) {
				sectionMisses.push(item.href);
			}
			if (
				!sectionHrefs.has(url.pathname) &&
				!current.some((link) => link.getAttribute('aria-current') !== 'true')
			) {
				ungrouped.push(item.href);
			}
		}

		expect(sectionMisses).toEqual([]);
		expect(ungrouped).toEqual(['/docs/reference/api']);
	}, 20000);

	it('renders plain links only, so the tab order is the reading order', () => {
		render(DocsSidebar, { props: { pathname: '/docs/reference' } });
		const nav = sidebar();

		expect(nav.querySelectorAll('button, [tabindex], input, select, summary')).toHaveLength(0);
		expect(nav.contains(document.activeElement)).toBe(false);
	});
});
