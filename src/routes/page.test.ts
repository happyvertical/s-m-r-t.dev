import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { appLayers, buildingBlockNouns, layerNames, unlayeredPackageCount } from '$lib/data/layers';
import { applicationModuleClusters } from '$lib/data/modules';
import { packages } from '$lib/data/packages';
import { playgroundModules } from '$lib/data/playgrounds';
import { uiComponents } from '$lib/data/ui-components.generated';
import { whySmrtClaims } from '$lib/data/why-smrt-claims';
import Page from './+page.svelte';

afterEach(cleanup);

const buildingBlocksIndex = appLayers.findIndex((layer) => layer.id === 'building-blocks');

describe('documentation home page', () => {
	it('names the s-m-r-t application stack and keeps the participant map', () => {
		render(Page);

		expect(
			screen.getByRole('heading', {
				level: 1,
				name: 'The s-m-r-t application stack'
			})
		).toBeTruthy();
		for (const participant of ['Persons', 'Application agents', 'Developers', 'Coding agents']) {
			expect(screen.getByText(participant, { selector: 'strong' })).toBeTruthy();
		}
	});

	it('renders the five plain layer names in the hero lede and the mini scope map', () => {
		const { container } = render(Page);

		const ledeNames = [...container.querySelectorAll('.layer-lede-list strong')].map(
			(node) => node.textContent
		);
		const miniMapNames = [...container.querySelectorAll('.mini-name')].map(
			(node) => node.textContent
		);

		expect(ledeNames).toEqual(layerNames);
		expect(miniMapNames).toEqual(layerNames);
	});

	it('links the shared Ready-made building blocks nouns identically in the hero lede and the scope map', () => {
		const { container } = render(Page);
		const expectedHrefs = buildingBlockNouns.map((noun) => noun.href);
		const expectedLabels = buildingBlockNouns.map((noun) => noun.label).join(', ');

		const ledeItem = container.querySelectorAll('.layer-lede-list li')[buildingBlocksIndex];
		expect(ledeItem?.textContent).toContain(expectedLabels);
		expect([...ledeItem!.querySelectorAll('a')].map((link) => link.getAttribute('href'))).toEqual(
			expectedHrefs
		);

		const scopeBand = container.querySelectorAll('.layer-band')[buildingBlocksIndex];
		const scopeRole = scopeBand.querySelector('.layer-role');
		expect(scopeRole?.textContent).toContain(expectedLabels);
		expect([...scopeRole!.querySelectorAll('a')].map((link) => link.getAttribute('href'))).toEqual(
			expectedHrefs
		);
	});

	it('anchors every hero mini-map band to the full scope map', () => {
		const { container } = render(Page);

		expect(container.querySelector('#scope')).toBeTruthy();
		const miniMapLinks = [...container.querySelectorAll('.mini-scope-map a')];
		expect(miniMapLinks).toHaveLength(appLayers.length);
		expect(miniMapLinks.every((link) => link.getAttribute('href') === '#scope')).toBe(true);
	});

	it('follows the approved narrative order', () => {
		render(Page);

		expect(
			screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
		).toEqual([
			'Describe the record once',
			'An agent can propose a change. A person applies it.',
			'Five layers, one release',
			'What you can build',
			'Built for the people who build it',
			'Every claim on this page has a source',
			'Follow one supported job from start to finish'
		]);
	});

	it('maps every approved documentation destination from the scope map', () => {
		const { container } = render(Page);
		const featureLinks = [...container.querySelectorAll('.scope-feature-links a')];

		expect(
			featureLinks.map((link) => ({
				label: link.querySelector('.feature-label')?.textContent,
				href: link.getAttribute('href')
			}))
		).toEqual([
			{ label: 'Framework', href: '/framework' },
			{ label: 'Interaction', href: '/interaction' },
			{ label: 'UI', href: '/ui' },
			{ label: 'Modules', href: '/modules' },
			{ label: 'Tooling', href: '/tooling' },
			{ label: 'Playground', href: '/playground' },
			{ label: 'Reference', href: '/reference' }
		]);
		expect(screen.getByRole('link', { name: /browse guides/i })).toBeTruthy();
	});

	it('keeps the homepage content coherent with the existing anchor labels', () => {
		const { container } = render(Page);

		for (const [id, label] of [
			['how-it-works', 'How it works'],
			['what-you-get', 'What you get'],
			['what-you-lose', 'What you lose']
		]) {
			expect(container.querySelector(`#${id}`)?.textContent).toContain(label);
		}
	});

	it('runs the agent-aware form demo live inside the how-it-works section', () => {
		const { container } = render(Page);
		const section = container.querySelector('#how-it-works');

		expect(section?.querySelector('.agent-demo-embed .agent-form-demo')).toBeTruthy();
	});

	it('builds four solution groups, the first running the live DataTable', () => {
		const { container } = render(Page);
		const cards = [...container.querySelectorAll('.solution-group')];

		expect(cards).toHaveLength(4);
		expect(cards.map((card) => card.querySelector('h3')?.textContent)).toEqual([
			'Working with records',
			'Content management',
			'Reports and analytics',
			'Conversation'
		]);
		expect(cards[0].querySelector('.live-table-embed table')).toBeTruthy();
		for (const card of cards) {
			expect(card.querySelector('.includes a')).toBeTruthy();
		}
	});

	it('generates the inventory strip from the real catalog instead of a hand-picked teaser', () => {
		const { container } = render(Page);
		const tiles = [...container.querySelectorAll('.inventory-strip a')];

		expect(
			tiles.map((tile) => ({
				count: tile.querySelector('strong')?.textContent,
				label: tile.querySelector('span')?.textContent,
				href: tile.getAttribute('href')
			}))
		).toEqual([
			{ count: String(packages.length), label: 'documented packages', href: '/packages' },
			{
				count: String(uiComponents.length),
				label: 'documented components',
				href: '/reference/components'
			},
			{
				count: String(
					playgroundModules.reduce((total, module) => total + (module.entries?.length ?? 0), 0)
				),
				label: 'working examples',
				href: '/playground'
			},
			{
				count: String(applicationModuleClusters.length),
				label: 'building-block groups',
				href: '/modules'
			}
		]);
	});

	it('reconciles the five-layer diagram against the full catalog total', () => {
		const { container } = render(Page);
		const layeredCount = appLayers.reduce((total, layer) => total + layer.packages.length, 0);

		// The five layers never cover the whole catalog (native mobile and
		// coding-agent/CI tooling sit outside them) — the reconciliation note
		// must account for the gap instead of leaving it unexplained.
		expect(layeredCount + unlayeredPackageCount).toBe(packages.length);
		expect(container.querySelector('.scope-reconciliation')?.textContent).toContain(
			`${layeredCount} of the catalog's ${packages.length}`
		);
	});

	it('shows the record description example and drops the chat transcript', () => {
		render(Page);

		expect(screen.queryByText(/export class Article/)).not.toBeNull();
		expect(screen.queryByText(/assistant:/i)).toBeNull();
	});

	it('renders the locked SAADL definition sentence verbatim', () => {
		const { container } = render(Page);

		expect(container.querySelector('.saadl-definition strong')?.textContent).toBe(
			'SAADL — Software as Agentic Domain Logic: software whose domain logic exposes the same ' +
				'operations to human users (UI, HTTP, CLI) and to software agents (callable tools).'
		);
	});

	it('renders one evidence row per rendered claim, deliberately excluding the unpublished mobile row', () => {
		const { container } = render(Page);
		const rows = [...container.querySelectorAll('.evidence-table tbody tr')];

		// The homepage evidence strip filters out the mobile claim (unpublished
		// smrt-mobile / smrt-android / smrt-ios packages); asserting both counts
		// keeps a future restoration of that row a deliberate, visible edit.
		expect(whySmrtClaims).toHaveLength(7);
		expect(rows).toHaveLength(6);
		expect(rows.map((row) => row.querySelector('td')?.textContent)).not.toContain(
			whySmrtClaims.find((claim) => claim.id === 'mobile-kmp')?.display
		);
	});
});
