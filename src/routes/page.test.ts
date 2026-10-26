import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { blockBranches, buildingBlocks } from '$lib/data/blocks';
import { frameworkModelProjections } from '$lib/data/framework';
import { homepageFeatures } from '$lib/data/homepage-features';
import { SMRT_VERSION } from '$lib/version';
import Page from './+page.svelte';

afterEach(cleanup);

const follows = (a: Node, b: Node) =>
	Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

// Template line breaks reach textContent as runs of whitespace.
const text = (node: Element | null | undefined) => node?.textContent?.replace(/\s+/g, ' ') ?? '';

describe('documentation home page', () => {
	it('shows the category H1, the agentic-software lede and the concrete line passage', () => {
		const { container } = render(Page);

		const h1 = screen.getByRole('heading', { level: 1, name: 'The s-m-r-t application stack' });
		// Phase 2 of the homepage refresh (#321) makes the H1 visible: the OG
		// image already shows it, so the page should match.
		expect(h1.classList.contains('visually-hidden')).toBe(false);
		const lede = text(container.querySelector('.lede'));
		// #335: "agentic software", never "business software"; "agents", never
		// "software agents"; the product name stays lowercase at sentence start.
		expect(lede).toContain(
			'stack for agentic software: applications that people and agents use through the same screens, rules and permissions'
		);
		expect(lede).toContain(
			'build-a-boilerplate puts an example application together in your browser for you to play with and customize.'
		);
		expect(container.textContent).not.toMatch(/business software|software agents?/i);
		// #335 brings "blurs the line between application and agent" back as a
		// concrete passage; each sentence has an evidence row. #337 moves it under
		// the video, where the outcome line used to be.
		const passage = container.querySelector('.hero-intro .hero-passage')!;
		expect(text(passage)).toContain(
			'A s-m-r-t application blurs the line between application and agent.'
		);
		expect(text(passage)).toContain('through the same doors, under the same checks.');
		expect(follows(container.querySelector('figure.planner-screencast')!, passage)).toBe(true);
		expect(container.querySelector('.outcome-line')).toBeNull();
		expect(container.textContent).not.toContain('You leave with a cookbook file');
		expect(container.textContent).not.toContain('better demonstrated than explained');
	});

	it('puts the primary build-a-boilerplate link above the recording and the line passage', () => {
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
		// #337 dropped the caption; the video's aria-label is its accessible name.
		expect(intro?.querySelector('figcaption')).toBeNull();
		expect(video!.getAttribute('aria-label')).toContain('build-a-boilerplate');
		expect(intro?.querySelector('.playback')).toBeTruthy();

		const cta = intro?.querySelector('a.primary-link--hero');
		expect(cta?.getAttribute('href')).toBe('/build-a-boilerplate');
		expect(cta?.textContent).toContain('build-a-boilerplate');
		// Order: H1, lede, the button, the video, then the line passage.
		const h1 = intro!.querySelector('h1')!;
		const lede = intro!.querySelector('.lede')!;
		const passage = intro!.querySelector('.hero-passage')!;
		expect(follows(h1, lede)).toBe(true);
		expect(follows(lede, cta!)).toBe(true);
		expect(follows(cta!, video!)).toBe(true);
		expect(follows(video!, passage)).toBe(true);
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
			'Agentic building blocks',
			'Getting Started'
		]);

		// Slice B of #321 mounts the six feature sections here, between "What
		// you get" and the blocks map: six sections, then the one
		// money sentence.
		const slot = container.querySelector('[data-slot="homepage-features"]');
		expect(slot).toBeTruthy();
		expect(slot!.querySelectorAll(':scope > section')).toHaveLength(6);
		expect(slot!.querySelector(':scope > p.money-note')).toBeTruthy();
		expect(follows(container.querySelector('#what-you-get')!, slot!)).toBe(true);
		expect(follows(slot!, container.querySelector('#one-description')!)).toBe(true);
		expect(
			follows(container.querySelector('#one-description')!, container.querySelector('#blocks')!)
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
			['blocks', 'Agentic building blocks'],
			['start-here', 'Getting Started']
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

	it('replaces the five-layer scope section with the building blocks map (#356)', () => {
		const { container } = render(Page);
		const section = container.querySelector('#blocks')!;

		expect(section.querySelector('h2')?.textContent).toBe('Agentic building blocks');
		expect(text(section.querySelector('.section-heading p'))).toBe(
			"Capabilities you won't build from scratch. Pick them in build-a-boilerplate."
		);
		expect(section.querySelectorAll('svg a.leaf')).toHaveLength(buildingBlocks.length);
		expect(blockBranches).toHaveLength(4);
		expect(container.querySelector('#scope, .mini-scope-map, .layer-band, .scale-line')).toBeNull();
		expect(container.textContent).not.toContain('Five layers');
		expect(container.textContent).not.toContain('working examples');
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
		// Slice D dropped the "In plain terms" gloss and #337 the pronunciation:
		// the aside holds the definition and the link only.
		expect(text(container.querySelector('.saadl-definition'))).not.toContain('Pronounced');
		expect(text(container.querySelector('.saadl-definition'))).not.toContain('In plain terms');
	});

	it('offers four getting-started guides and the coding-agent note', () => {
		const { container } = render(Page);
		const paths = [...container.querySelectorAll('#start-here nav a')];

		expect(
			paths.map((link) => ({
				label: link.querySelector('strong')?.textContent,
				href: link.getAttribute('href')
			}))
		).toEqual([
			{ label: 'build-a-boilerplate', href: '/build-a-boilerplate' },
			{ label: 'Start from a cookbook', href: '/starters#cookbook' },
			{ label: 'Clone smrt-start', href: '/starters/smrt-start' },
			{ label: 'Hand it to your agent', href: '#agent-prompt' }
		]);
		// build-a-boilerplate is always lowercase and hyphenated.
		expect(container.textContent).not.toContain('Build a boilerplate');
		expect(container.querySelector('#start-here .start-note a')?.getAttribute('href')).toBe(
			'/tooling'
		);
	});

	it('carries a copyable agent prompt pinned to the installed release (#337)', () => {
		const { container } = render(Page);
		const block = container.querySelector('#start-here #agent-prompt');
		const prompt = block?.querySelector('pre code')?.textContent ?? '';

		expect(block?.querySelector('h3')?.textContent).toBe('Hand it to your agent');
		expect(block?.querySelector('button[aria-label="Copy code"]')).toBeTruthy();
		expect(prompt).toContain('Create a new s-m-r-t app.');
		// The CLI pin and the cookbook URL's release tag both follow SMRT_VERSION.
		expect(prompt).toContain(`npx -y @happyvertical/smrt-cli@${SMRT_VERSION} cookbook apply`);
		expect(prompt).toContain(
			`https://raw.githubusercontent.com/happyvertical/smrt/v${SMRT_VERSION}/packages/cli/cookbooks/`
		);
		// Every version in the prompt is the installed release; nothing is typed.
		const versions = prompt.match(/\d+\.\d+\.\d+/g) ?? [];
		expect(versions.length).toBeGreaterThan(0);
		expect(new Set(versions)).toEqual(new Set([SMRT_VERSION]));
		// Not on the page until they work: `smrt onboard` (smrt#4139) is a source
		// comment, `smrt kitchen` is broken in the installed release.
		expect(prompt).not.toContain('onboard');
		expect(prompt).not.toContain('kitchen');
		expect(prompt).not.toContain('<!--');
	});

	it('ends the page with the evidence note, after Getting Started (#337)', () => {
		const { container } = render(Page);
		const note = container.querySelector('.evidence-note')!;
		const article = container.querySelector('article.homepage')!;

		expect(follows(container.querySelector('#start-here')!, note)).toBe(true);
		expect(article.lastElementChild).toBe(note);
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
