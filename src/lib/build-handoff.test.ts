import { recipes } from '@happyvertical/smrt-planner/core';
import { describe, expect, it } from 'vitest';
import { buildHref, parseFeatures, recipesFor, seedFor } from './build-handoff';
import { features } from '$lib/data/features';

describe('feature recipes', () => {
	const catalog = new Set(recipes.map((recipe) => recipe.id));

	it('names only recipes that exist in the planner catalog', () => {
		for (const feature of features) {
			for (const recipe of feature.recipes) {
				expect(catalog.has(recipe), `${feature.id}: ${recipe}`).toBe(true);
			}
		}
	});
});

describe('build hand-off', () => {
	it('round-trips a selection through the build query', () => {
		const href = buildHref(['chat', 'commerce', 'nope', 'chat']);
		expect(href).toBe('/build-a-boilerplate?features=chat,commerce');
		expect(parseFeatures(href.slice(href.indexOf('?')))).toEqual(['chat', 'commerce']);
		expect(buildHref([])).toBe('/build-a-boilerplate');
		expect(parseFeatures('?features=x,y')).toEqual([]);
	});

	it('collects each recipe once and seeds the assistant with the feature names', () => {
		expect(recipesFor(['chat', 'chat'])).toEqual(['chat.assistant', 'chat.rooms']);
		const seed = seedFor(['chat', 'commerce']);
		expect(seed.id).toBe('map-selection:chat,commerce');
		expect(seed.messages[0].content).toContain('Chat, Commerce');
	});
});
