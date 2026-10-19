import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { appLayers, buildingBlockNouns, layerNames, unlayeredPackageCount } from '$lib/data/layers';
import { frameworkModelProjections } from '$lib/data/framework';
import { homepageFeatures } from '$lib/data/homepage-features';
import { curatedChipsFor } from '$lib/data/layer-chips';
import { packages } from '$lib/data/packages';
import { playgroundModules } from '$lib/data/playgrounds';
import { uiComponents } from '$lib/data/ui-components.generated';
import { SMRT_VERSION } from '$lib/version';
import Page from './+page.svelte';

afterEach(cleanup);

const buildingBlocksIndex = appLayers.findIndex((layer) => layer.id === 'building-blocks');

const follows = (a: Node, b: Node) =>
	Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

// Template line breaks reach textContent as runs of whitespace.
const text = (node: Element | null | undefined) => node?.textContent?.replace(/\s+/g, ' ') ?? '';

describe('documentation home page', () => {
	it('shows the category H1 and a plain lede with the metaphor retired', () => {
		const { container } = render(Page);

		const h1 = screen.getByRole('heading', { level: 1, name: 'The s-m-r-t application stack' });
		// Phase 2 of the homepage refresh (#321) makes the H1 visible: the OG
		// image already shows it, so the page should match.
		expect(h1.classList.contains('visually-hidden')).toBe(false);
		expect(text(container.querySelector('.lede'))).toContain(
			'people and agents use through the same screens, rules and permissions'
		);
		expect(container.textContent).not.toContain('blurs the line');
		expect(container.textContent).not.toContain('better demonstrated than explained');
	});

	it('puts the primary build-a-boilerplate link above the recording, its caption and the outcome line', () => {
		const { container } = render(Page);
		const intro = container.querySelector('.hero-intro');
		const video = intro?.querySelector<HTMLVideoElement>('figure.planner-screencast video');

		expect(video).toBeTruthy();
		expect(video!.muted).toBe(true);
		expect(video!.loop).toBe(true);
		expect(video!.hasAttribute('playsinline')).toBe(true);
		expect(video!.getAttribute('preload')).toBe('none');
		// Playback is observer-driven so it waits for the viewport and honours
		// prefers-reduced-motion; a static autoplay attribute would do neither.
		expect(video!.hasAttribute('autoplay')).toBe(false);
		expect(video!.getAttribute('poster')).toMatch(/planner-poster/);
		expect(video!.getAttribute('width')).toBe('1280');
		expect(video!.getAttribute('height')).toBe('720');
		expect(
			[...video!.querySelectorAll('source')].map((source) => source.getAttribute('type'))
		).toEqual(['video/webm', 'video/mp4']);
		expect(intro?.querySelector('figcaption')?.textContent).toContain('build-a-boilerplate');
		expect(intro?.querySelector('.playback')).toBeTruthy();

		const cta = intro?.querySelector('a.primary-link--hero');
		expect(cta?.getAttribute('href')).toBe('/build-a-boilerplate');
		expect(cta?.textContent).toContain('build-a-boilerplate');
		// Order: H1, lede, the button, the video, its caption, then what you
		// leave with.
		const h1 = intro!.querySelector('h1')!;
		const lede = intro!.querySelector('.lede')!;
		const caption = intro!.querySelector('figcaption')!;
		const outcome = intro!.querySelector('.outcome-line')!;
		expect(follows(h1, lede)).toBe(true);
		expect(follows(lede, cta!)).toBe(true);
		expect(follows(cta!, video!)).toBe(true);
		expect(follows(video!, caption)).toBe(true);
		expect(follows(caption, outcome)).toBe(true);
		expect(outcome.textContent).toContain('smrt cookbook apply');
	});

	it('keeps the mini scope map as the hero visual and moves the five-layer list out of the hero', () => {
		const { container } = render(Page);

		const miniMapNames = [...container.querySelectorAll('.mini-name')].map(
			(node) => node.textContent
		);
		expect(miniMapNames).toEqual(layerNames);
		expect(container.querySelector('.hero .layer-lede-list')).toBeNull();
		// The five layers still read as sentences — once, in the scope section.
		const bandNames = [...container.querySelectorAll('#scope .layer-band h3')].map(
			(node) => node.textContent
		);
		expect(bandNames).toEqual(layerNames);
		appLayers.forEach((layer, index) => {
			if (layer.id === 'building-blocks') return;
			expect(container.querySelectorAll('#scope .layer-role')[index]?.textContent?.trim()).toBe(
				layer.scopeCopy
			);
		});
	});

	it('links the shared Ready-made building blocks nouns in the scope map', () => {
		const { container } = render(Page);
		const expectedHrefs = buildingBlockNouns.map((noun) => noun.href);
		const expectedLabels = buildingBlockNouns.map((noun) => noun.label).join(', ');

		const scopeBand = container.querySelectorAll('.layer-band')[buildingBlocksIndex];
		const scopeRole = scopeBand.querySelector('.layer-role');
		expect(scopeRole?.textContent).toContain(expectedLabels);
		expect([...scopeRole!.querySelectorAll('a')].map((link) => link.getAttribute('href'))).toEqual(
			expectedHrefs
		);
	});

	it('renders the curated chips per layer, then an "all N" link with the generated count', () => {
		const { container } = render(Page);
		const bands = [...container.querySelectorAll('.layer-band')];

		expect(bands).toHaveLength(appLayers.length);
		bands.forEach((band, index) => {
			const layer = appLayers[index];
			const curated = curatedChipsFor(layer);
			const chipLinks = [...band.querySelectorAll('.layer-chips li:not(.layer-chips-all) a')];

			expect(chipLinks).toHaveLength(curated.length);
			chipLinks.forEach((link, chipIndex) => {
				expect(link.getAttribute('href')).toBe(`/reference/packages/${curated[chipIndex].slug}`);
				expect(link.textContent).toBe(curated[chipIndex].label);
				expect(link.getAttribute('target')).toBeNull();
			});

			// The count is the layer's full membership, not the curated handful.
			const allLink = band.querySelector('.layer-chips-all a');
			expect(allLink?.getAttribute('href')).toBe('/reference/packages');
			expect(allLink?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
				`all ${layer.packages.length} →`
			);
		});
	});

	it('anchors every hero mini-map band to the full scope map', () => {
		const { container } = render(Page);

		expect(container.querySelector('#scope')).toBeTruthy();
		const miniMapLinks = [...container.querySelectorAll('.mini-scope-map a')];
		expect(miniMapLinks).toHaveLength(appLayers.length);
		expect(miniMapLinks.every((link) => link.getAttribute('href') === '#scope')).toBe(true);
	});

	it('follows the approved section order, with the slice B sections before the record description', () => {
		const { container } = render(Page);

		expect(
			screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
		).toEqual([
			'A working application, not a template',
			'An application can carry its own assistant',
			'An agent can propose. A person confirms.',
			'Say what you want to see',
			'An inbox for the documents a business receives',
			'Rules about data live with the data',
			'Three doors, and each one is a choice',
			'Describe the record once',
			'Five layers, one release',
			'Three ways in'
		]);

		// Slice B of #321 mounts the six feature sections here, between "What
		// you get" and the scope half of the page: six sections, then the one
		// money sentence.
		const slot = container.querySelector('[data-slot="homepage-features"]');
		expect(slot).toBeTruthy();
		expect(slot!.querySelectorAll(':scope > section')).toHaveLength(6);
		expect(slot!.querySelector(':scope > p.money-note')).toBeTruthy();
		expect(follows(container.querySelector('#what-you-get')!, slot!)).toBe(true);
		expect(follows(slot!, container.querySelector('#one-description')!)).toBe(true);
		expect(
			follows(container.querySelector('#one-description')!, container.querySelector('#scope')!)
		).toBe(true);
	});

	it('keeps the homepage anchors the navigation registers', () => {
		const { container } = render(Page);

		// Slice D dropped the section eyebrows ("What you get", "Start here"):
		// each anchor is identified by its H2 alone, and the navigation labels
		// for the first and last are shorter nav names, not page copy.
		for (const [id, heading] of [
			['what-you-get', 'A working application, not a template'],
			['one-description', 'Describe the record once'],
			['scope', 'Five layers, one release'],
			['start-here', 'Three ways in']
		]) {
			expect(container.querySelector(`#${id} h2`)?.textContent).toBe(heading);
		}
		expect(
			container.querySelectorAll('.homepage section:not(.evidence-section) .eyebrow')
		).toHaveLength(0);
		expect(container.querySelector('.hero-actions a[href="#what-you-get"]')).toBeTruthy();
	});

	it('removes the older embeds and the sections build-a-boilerplate replaced', () => {
		const { container } = render(Page);

		// AgentAwareFormDemo and UIShowcaseDataTable stay on /ui, /agents and
		// in the playground; the homepage's demo is the recording.
		expect(container.querySelector('.agent-form-demo')).toBeNull();
		expect(container.querySelector('.live-table-embed, .solution-group')).toBeNull();
		expect(container.querySelector('.participant-map')).toBeNull();
		expect(container.querySelector('.inventory-strip')).toBeNull();
		expect(container.querySelector('.scope-feature-links')).toBeNull();
		expect(container.querySelector('.builder-grid')).toBeNull();
		for (const retired of [
			'What you can build',
			'Built for the people who build it',
			'What you lose',
			'Scripted adapter',
			'Awareness is not authority'
		]) {
			expect(container.textContent).not.toContain(retired);
		}
	});

	it('generates the scale line from the catalog instead of hand-typed counts', () => {
		const { container } = render(Page);
		const line = container.querySelector('.scale-line');
		const playgroundCount = playgroundModules.reduce(
			(total, module) => total + (module.entries?.length ?? 0),
			0
		);

		expect([...line!.querySelectorAll('.mono')].map((node) => node.textContent)).toEqual([
			SMRT_VERSION,
			String(packages.length),
			String(uiComponents.length),
			String(playgroundCount)
		]);
		expect(line?.textContent).toContain('released together');
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

	it('shows the trimmed record description with one link per generated surface', () => {
		const { container } = render(Page);

		expect(screen.queryByText(/export class Article/)).not.toBeNull();
		expect(screen.queryByText(/assistant:/i)).toBeNull();
		expect(
			[...container.querySelectorAll('.projection-list a')].map((link) => ({
				label: text(link).replace('→', '').trim(),
				href: link.getAttribute('href')
			}))
		).toEqual(
			frameworkModelProjections.map((projection) => ({
				label: projection.label,
				href: projection.href
			}))
		);
	});

	it('renders the locked SAADL definition sentence verbatim', () => {
		const { container } = render(Page);

		expect(container.querySelector('.saadl-definition strong')?.textContent).toBe(
			'SAADL — Software as Agentic Domain Logic: software whose domain logic exposes the same ' +
				'operations to human users (UI, HTTP, CLI) and to agents (callable tools).'
		);
		// Slice D dropped the "In plain terms" gloss: the lede already says it in
		// plain words, so the aside holds the definition, its pronunciation and
		// the link only.
		expect(text(container.querySelector('.saadl-definition'))).toContain('Pronounced "saddle."');
		expect(text(container.querySelector('.saadl-definition'))).not.toContain('In plain terms');
	});

	it('offers three start paths and the coding-agent note', () => {
		const { container } = render(Page);
		const paths = [...container.querySelectorAll('#start-here nav a')];

		expect(
			paths.map((link) => ({
				label: link.querySelector('strong')?.textContent,
				href: link.getAttribute('href')
			}))
		).toEqual([
			{ label: 'Try it', href: '/build-a-boilerplate' },
			{ label: 'Build one', href: '/starters/ground-up' },
			{ label: 'Connect an agent', href: '/agents' }
		]);
		expect(container.querySelector('#start-here .start-note a')?.getAttribute('href')).toBe(
			'/tooling'
		);
	});

	it('keeps one H1, an H2 per section and no skipped heading levels', () => {
		const { container } = render(Page);
		const levels = [...container.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((heading) =>
			Number(heading.tagName.slice(1))
		);

		expect(levels.filter((level) => level === 1)).toHaveLength(1);
		expect(levels[0]).toBe(1);
		levels.reduce((previous, level) => {
			expect(level, `h${level} after h${previous}`).toBeLessThanOrEqual(previous + 1);
			return level;
		}, 0);
		for (const section of container.querySelectorAll('.homepage section')) {
			expect(
				section.querySelector('h2'),
				`${section.id || section.className} has an H2`
			).not.toBeNull();
		}
	});

	it('marks every decorative arrow aria-hidden and keeps the Preview chip beside its heading', () => {
		const { container } = render(Page);

		for (const link of container.querySelectorAll('.homepage a')) {
			if (!/[→↓]/.test(link.textContent ?? '')) continue;
			const arrow = [...link.querySelectorAll('[aria-hidden="true"]')].find((node) =>
				/[→↓]/.test(node.textContent ?? '')
			);
			expect(
				arrow,
				`${link.textContent?.trim()} hides its arrow from the accessible name`
			).toBeTruthy();
		}
		const preview = container.querySelector('#paperwork-in-proposals-out .status');
		expect(preview?.textContent).toBe('Preview');
		expect(container.querySelectorAll('.feature .eyebrow, .feature .sketch')).toHaveLength(0);
	});

	it('points at the evidence ledger instead of rendering the table (#321 slice E)', () => {
		const { container } = render(Page);

		// The release-audit table moved to /reference/evidence; the homepage keeps
		// one line so the claim-to-source discipline stays visible without the
		// weight of the table on a landing page.
		expect(container.querySelector('.evidence-table')).toBeNull();
		const note = container.querySelector('.evidence-note');
		expect(text(note)).toContain('Every claim on this page has a source');
		expect(note?.querySelector('a')?.getAttribute('href')).toBe('/reference/evidence');

		// Each feature section's "Sources" link lands on its own row of that page;
		// reference/evidence/page.test.ts pins that every row id is an anchor.
		const sources = [...container.querySelectorAll('.feature a.sources')];
		expect(sources).toHaveLength(homepageFeatures.length);
		expect(sources.map((link) => link.getAttribute('href'))).toEqual(
			homepageFeatures.map((feature) => `/reference/evidence#${feature.evidenceId}`)
		);
	});
});
