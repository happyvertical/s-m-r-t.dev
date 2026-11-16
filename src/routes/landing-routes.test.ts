import { cleanup, fireEvent, render, within } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KITCHEN_COMMAND } from '$lib/commands';
import { featureSections, featuresInSection } from '$lib/data/features';
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

describe('/ (the landing page, #397)', () => {
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
			'One model, every way in.',
			'The parts every app needs are already built.',
			'Three ways to a running app.',
			'Agents are welcome here too.'
		]);
		expect(container.querySelectorAll('.ways-in li')).toHaveLength(6);
		expect(container.querySelectorAll('.ways .way')).toHaveLength(3);
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

	it('links only to routes and files the build emits', () => {
		const { container } = render(Landing);
		const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));

		expect(new Set(hrefs)).toEqual(
			new Set([
				'/docs/getting-started',
				'/demo',
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

	it('keeps the words the redesign dropped out of the copy', () => {
		const { container } = render(Landing);

		expect(text(container)).not.toMatch(/domain-specific|software agents|SMRT\b/);
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
