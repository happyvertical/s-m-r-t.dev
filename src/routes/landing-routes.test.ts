import { cleanup, fireEvent, render, within } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KITCHEN_COMMAND } from '$lib/commands';
import { featureSections, featuresInSection } from '$lib/data/features';
import { contentRoutes, stripQueryAndHash } from '$lib/server/route-inventory';
import { toolingGuides } from '$lib/data/tooling';
import { SMRT_VERSION } from '$lib/version';
import Landing from './+page.svelte';
import Demo from './demo/+page.svelte';
import Tools from './tools/+page.svelte';

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));

beforeEach(() => {
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
	cleanup();
	document.head.innerHTML = '';
	vi.restoreAllMocks();
});

// The static build serves each of these without JavaScript: one heading and one
// JSON-LD graph (`scripts/check-agent-metadata.mjs` checks the same on the build).
const pages = { '/': Landing, '/demo': Demo, '/tools': Tools };

describe.each(Object.keys(pages) as (keyof typeof pages)[])('%s', (path) => {
	it('renders one h1 and one JSON-LD graph', () => {
		const { container } = render(pages[path] as typeof Tools);

		expect(container.querySelectorAll('h1')).toHaveLength(1);
		expect(document.head.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
	});
});

const text = (node: Element | null | undefined) => node?.textContent?.replace(/\s+/g, ' ') ?? '';

describe('/ (the landing page, #397 and #411)', () => {
	it('carries the chosen headline and line, and the two calls to action', () => {
		const { container } = render(Landing);

		expect(text(container.querySelector('h1'))).toBe(
			'Build agentic software for people and agents.'
		);
		expect([...container.querySelectorAll('h1 em')].map(text)).toEqual([
			'agentic software',
			'and agents'
		]);
		expect(text(container.querySelector('.sub'))).toContain(
			'smrt gives you the screens people use and the tools agents use'
		);
		expect(
			[...container.querySelectorAll('.cta a')].map((a) => [text(a), a.getAttribute('href')])
		).toEqual([
			['Get started', '/docs/getting-started'],
			['See the demo', '/demo']
		]);
	});

	it('prints the kitchen command Getting Started prints, at the documented release', () => {
		const { container } = render(Landing);

		expect(text(container.querySelector('.cmd'))).toBe(KITCHEN_COMMAND);
		expect(KITCHEN_COMMAND).toBe(`npx -y @happyvertical/smrt-cli@${SMRT_VERSION} kitchen my-app`);
	});

	it('orders the sections as the issue lists them', () => {
		const { container } = render(Landing);

		expect([...container.querySelectorAll('h2')].map(text)).toEqual([
			'Agentic features, out of the box.',
			'The parts every app needs are already built.',
			'One model, every way in.',
			'Three ways to a running app.',
			'Agents are welcome here too.'
		]);
		expect(container.querySelectorAll('.ways-in li')).toHaveLength(6);
		expect(container.querySelectorAll('.ways .way')).toHaveLength(3);
	});

	it('leads with the agentic features, each linked to its page (#411)', () => {
		const { container } = render(Landing);
		const cards = [...container.querySelectorAll('.agentic a')];

		expect(cards.map((card) => [text(card.querySelector('b')), card.getAttribute('href')])).toEqual(
			[
				['An assistant that sees the page', '/docs/reference/components/assistant-dock'],
				['Page tools', '/docs/capabilities/webmcp'],
				['Agents on a schedule', '/features/assistant/agents'],
				['Approvals', '/features/team/approvals'],
				['Reports on request', '/docs/capabilities/reports'],
				['AI usage', '/docs/capabilities/ai-usage'],
				['Inference tuning', '/docs/capabilities/inference-tuning'],
				['Ingestion', '/docs/capabilities/ingestion']
			]
		);
		for (const card of cards) {
			expect(text(card.querySelector('span')).length).toBeGreaterThan(40);
		}
		// Upstream ships ingestion as a preview with automation off; the card says so.
		expect(text(cards.at(-1))).toMatch(/A reviewer decides\..*preview.*automation off/);

		expect(text(container.querySelector('.also')).trim()).toBe(
			'Also in the box: agent memory, search by meaning, voice on the device.'
		);
		expect(
			[...container.querySelectorAll('.also a')].map((a) => [text(a), a.getAttribute('href')])
		).toEqual([
			['agent memory', '/features/assistant/memory'],
			['search by meaning', '/docs/guides/semantic-search'],
			['voice on the device', '/docs/reference/packages/smrt-svelte']
		]);
	});

	it('gives the two feature sections different openings, and none that points at the hero', () => {
		const { container } = render(Landing);
		const intros = [...container.querySelectorAll('.band .head p')].map(text);

		expect(intros).toHaveLength(5);
		expect(intros[0]).toContain('what agents do inside a smrt app');
		expect(intros[1]).toContain('the everyday parts');
		expect(intros[2].trim()).toMatch(/^You write a model once, as a TypeScript class\./);
		// "That class" pointed at the hero panel while this section sat directly under it.
		expect(intros.join(' ')).not.toContain('That class');
	});

	it('generates the nine group cards from features.ts', () => {
		const { container } = render(Landing);
		const cards = [...container.querySelectorAll('.groups a')];

		expect(cards).toHaveLength(9);
		expect(cards.map((card) => [text(card.querySelector('b')), card.getAttribute('href')])).toEqual(
			featureSections.map((section) => [section.word, `/features/${section.id}`])
		);
		for (const [index, section] of featureSections.entries()) {
			expect(text(cards[index].querySelector('.words'))).toBe(
				featuresInSection(section.id)
					.map((item) => item.word)
					.join(', ')
			);
		}
	});

	it('answers a person by default and an agent on request, from the same widgets', async () => {
		const { container } = render(Landing);
		const panel = within(container.querySelector('.panel') as HTMLElement);
		const person = panel.getByRole('button', { name: 'A person' });
		const agent = panel.getByRole('button', { name: 'An agent' });
		const [screen, toolCall] = [...container.querySelectorAll('.answer > div')] as HTMLElement[];

		expect(person.getAttribute('aria-pressed')).toBe('true');
		expect(screen.hidden).toBe(false);
		expect(toolCall.hidden).toBe(true);

		await fireEvent.click(agent);
		expect(agent.getAttribute('aria-pressed')).toBe('true');
		expect(person.getAttribute('aria-pressed')).toBe('false');
		expect(screen.hidden).toBe(true);
		expect(toolCall.hidden).toBe(false);

		expect(text(toolCall)).toContain('widget_list');
		expect(screen.querySelectorAll('tbody tr')).toHaveLength(3);
		expect(text(screen.querySelector('caption'))).toContain('3 of 3');
		for (const row of screen.querySelectorAll('tbody tr')) {
			expect(text(toolCall)).toContain(JSON.stringify(text(row.querySelector('td'))));
		}
		expect(text(container.querySelector('.same'))).toContain('widgets.read');
	});

	it('announces the switch through a status line, not the panels', async () => {
		const { container } = render(Landing);
		const panel = within(container.querySelector('.panel') as HTMLElement);
		const status = panel.getByRole('status');

		expect(text(status)).toBe('Showing what a person sees');
		expect(container.querySelector('.answer')?.closest('[aria-live]')).toBeNull();
		expect(container.querySelector('.answer [aria-live], .answer[aria-live]')).toBeNull();

		await fireEvent.click(panel.getByRole('button', { name: 'An agent' }));
		expect(text(status)).toBe('Showing what an agent sees');
		await fireEvent.click(panel.getByRole('button', { name: 'A person' }));
		expect(text(status)).toBe('Showing what a person sees');
	});

	it('links only to routes and files the build emits', () => {
		const { container } = render(Landing);
		const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));

		expect(new Set(hrefs)).toEqual(
			new Set([
				'/docs/getting-started',
				'/demo',
				'/docs/reference/components/assistant-dock',
				'/docs/capabilities/webmcp',
				'/features/assistant/agents',
				'/features/team/approvals',
				'/docs/capabilities/reports',
				'/docs/capabilities/ai-usage',
				'/docs/capabilities/inference-tuning',
				'/docs/capabilities/ingestion',
				'/features/assistant/memory',
				'/docs/guides/semantic-search',
				'/docs/reference/packages/smrt-svelte',
				...featureSections.map((section) => `/features/${section.id}`),
				'/features',
				'/build-a-boilerplate',
				'/docs/getting-started#cookbook',
				'/docs/getting-started/smrt-start',
				'/llms.txt',
				'/docs/tooling/dev-mcp',
				'/docs/tooling/app-mcp'
			])
		);
	});

	it('links to pages, never to a redirect', () => {
		const { container } = render(Landing);
		const served = new Set(contentRoutes.map((route) => route.path));
		const paths = [...container.querySelectorAll('a')]
			.map((a) => stripQueryAndHash(a.getAttribute('href') ?? ''))
			// A generated file, not a route.
			.filter((path) => path !== '/llms.txt');

		expect(paths.length).toBeGreaterThan(20);
		for (const path of paths) expect(served.has(path), path).toBe(true);
	});

	it('keeps the words the redesign dropped out of the copy', () => {
		const { container } = render(Landing);

		// The string is split because the product-name guard flags the uppercase spelling in source.
		expect(text(container)).not.toMatch(
			new RegExp(['domain-specific', 'software agents', 'SM' + 'RT\\b'].join('|'))
		);
	});
});

describe('/tools', () => {
	it('lists build-a-boilerplate at its own URL and points to the tooling docs', () => {
		const { container } = render(Tools);
		const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));

		expect(hrefs).toContain('/build-a-boilerplate');
		expect(hrefs).toContain('/docs/tooling');
	});

	it('presents build-a-boilerplate as the tool, with the kitchen command beside it', () => {
		const { container } = render(Tools);

		expect(text(container.querySelector('.tool h2'))).toBe('build-a-boilerplate');
		expect(container.querySelector('.tool .btn')?.getAttribute('href')).toBe(
			'/build-a-boilerplate'
		);
		expect(text(container.querySelector('.cmd'))).toBe(KITCHEN_COMMAND);
	});

	it('lists every tooling guide from tooling.ts', () => {
		const { container } = render(Tools);

		expect(
			[...container.querySelectorAll('.list a')].map((a) => [text(a), a.getAttribute('href')])
		).toEqual(toolingGuides.map((guide) => [guide.navTitle, `/docs/tooling/${guide.slug}`]));
	});
});
