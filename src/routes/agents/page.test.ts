import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { agentsDefaultsLadder, agentsDoors, agentsTopics } from '$lib/data/agents';
import Page from './+page.svelte';

afterEach(cleanup);

describe('Agents landing page', () => {
	it('leads with the borrowed-authority hero and links to Tooling for coding agents', () => {
		render(Page);

		expect(
			screen.getByRole('heading', { level: 1, name: 'Agents work with borrowed authority.' })
		).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Tooling' }).getAttribute('href')).toBe('/tooling');
	});

	it('renders all six topics in narrative order', () => {
		render(Page);

		const headings = screen
			.getAllByRole('heading', { level: 2 })
			.map((heading) => heading.textContent);

		for (const topic of agentsTopics) {
			expect(headings).toContain(topic.title);
		}

		const topicIndexes = agentsTopics.map((topic) => headings.indexOf(topic.title));
		expect(topicIndexes).toEqual([...topicIndexes].sort((a, b) => a - b));
		expect(topicIndexes.every((index) => index !== -1)).toBe(true);
	});

	it('renders one doors-table row per tool surface, in order', () => {
		const { container } = render(Page);
		const rows = [...container.querySelectorAll('.doors-row')];

		expect(rows).toHaveLength(agentsDoors.length);
		rows.forEach((row, index) => {
			const door = agentsDoors[index];
			expect(row.querySelector('.doors-index')?.textContent).toBe(door.index);
			expect(row.querySelector('.doors-name')?.textContent).toBe(door.door);
			expect(row.querySelector('.doors-chip')?.textContent).toBe(door.planeChip);
			expect(row.querySelector('.doors-chip')?.getAttribute('data-plane')).toBe(door.plane);
		});
	});

	it('renders the two-plane diagram with an accessible label', () => {
		const { container } = render(Page);

		const diagram = container.querySelector('.two-plane-diagram');
		expect(diagram?.getAttribute('aria-label')).toBe(
			'Two agent planes meeting at one authenticated boundary.'
		);
		expect(container.querySelectorAll('.plane-card')).toHaveLength(2);
	});

	it('embeds the live agent-aware form demo on the state-not-screen topic', () => {
		const { container } = render(Page);

		expect(container.querySelector('.agent-demo-embed .agent-form-demo')).toBeTruthy();
		expect(screen.getByRole('link', { name: 'UI overview' }).getAttribute('href')).toBe('/ui');
		expect(screen.getByRole('link', { name: 'Playground' }).getAttribute('href')).toBe(
			'/playground?entry=agent-aware-form'
		);
	});

	it('renders the defaults ladder with one row per decision', () => {
		const { container } = render(Page);
		const rows = [...container.querySelectorAll('.agents-ladder tbody tr')];

		expect(rows).toHaveLength(agentsDefaultsLadder.length);
		expect(rows[0].querySelector('td')?.textContent).toBe(agentsDefaultsLadder[0].layer);
	});

	it('links every boundary cell to the section that owns the next question', () => {
		const { container } = render(Page);
		const cells = [...container.querySelectorAll('.boundaries a')];

		expect(cells.map((cell) => cell.querySelector('strong')?.textContent)).toEqual([
			'Interaction',
			'Framework',
			'Tooling',
			'Reference',
			'Playground'
		]);
		expect(cells.map((cell) => cell.getAttribute('href'))).toEqual([
			'/interaction',
			'/framework',
			'/tooling',
			'/reference',
			'/playground'
		]);
	});
});
