import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './+page.svelte';

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));

beforeEach(() => {
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

const text = (node: Element | null | undefined) => node?.textContent?.replace(/\s+/g, ' ') ?? '';

describe('front page (#361)', () => {
	it('is the feature map first, then three doors', () => {
		const { container } = render(Page);
		const map = container.querySelector('section.map')!;
		const doors = container.querySelector('section.doors')!;

		expect(map.compareDocumentPosition(doors) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(
			[...doors.querySelectorAll('a.door')].map((a) => [
				text(a.querySelector('b')),
				a.getAttribute('href')
			])
		).toEqual([
			['Build', '/build-a-boilerplate'],
			['Features', '/features'],
			['Docs', '/docs']
		]);
		// The licence and version are stated once, in the shell footer.
		expect(container.querySelector('.foot')).toBeNull();
	});

	it('keeps one visually hidden H1 and no headline in the map', () => {
		const { container } = render(Page);

		expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
		expect(container.querySelector('h1')?.classList.contains('visually-hidden')).toBe(true);
		expect(container.querySelector('section.map h1')).toBeNull();
	});

	it('uses no banned phrases', () => {
		const { container } = render(Page);

		expect(container.textContent).not.toMatch(
			/business software|software agents?|AI decision engine|Backend|world models/i
		);
	});
});
