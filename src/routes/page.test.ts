import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Page from './+page.svelte';

afterEach(cleanup);

describe('documentation home page', () => {
	it('introduces every participant through one shared application model', () => {
		render(Page);

		expect(
			screen.getByRole('heading', {
				level: 1,
				name: 's-m-r-t gives every participant one application model.'
			})
		).toBeTruthy();
		for (const participant of ['Persons', 'Application agents', 'Developers', 'Coding agents']) {
			expect(screen.getByText(participant, { selector: 'strong' })).toBeTruthy();
		}
	});

	it('follows the approved narrative order', () => {
		render(Page);

		expect(
			screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
		).toEqual([
			'Natural language is an interface',
			'The application describes itself',
			'One definition, every surface',
			'Built for the persons who build it',
			'Choose the next level of detail',
			'Visible controls expose application meaning',
			'Start from a released application outcome',
			'Follow one supported job from start to finish'
		]);
	});

	it('maps every approved documentation destination', () => {
		const { container } = render(Page);
		const featureLinks = [...container.querySelectorAll('.feature-map a')];

		expect(
			featureLinks.map((link) => ({
				label: link.querySelector('h3')?.textContent,
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

	it('links each UI highlight to documentation and the Playground', () => {
		const { container } = render(Page);
		const cards = [...container.querySelectorAll('.ui-grid article')];

		expect(cards).toHaveLength(6);
		for (const card of cards) {
			const hrefs = [...card.querySelectorAll('a')].map((link) => link.getAttribute('href'));
			expect(hrefs).toHaveLength(2);
			expect(hrefs[1]).toBe('/playground');
		}
	});

	it('keeps the module teaser curated and moves the detailed example out of the homepage', () => {
		const { container } = render(Page);
		const moduleLinks = [...container.querySelectorAll('.module-grid a')];

		expect(moduleLinks).toHaveLength(4);
		expect(moduleLinks.every((link) => link.getAttribute('href') === '/modules')).toBe(true);
		expect(screen.queryByText(/export class Article/)).toBeNull();
		expect(screen.queryByText(/assistant:/i)).toBeNull();
	});
});
