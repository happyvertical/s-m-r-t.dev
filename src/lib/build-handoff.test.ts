import { recipes } from '@happyvertical/smrt-planner/core';
import { beforeEach, describe, expect, it } from 'vitest';
import {
	buildHref,
	isMappable,
	markWarp,
	noticeFor,
	parseFeatures,
	recipesFor,
	seedFor,
	splitSelection,
	takeWarp,
	WARP_KEY
} from './build-handoff';
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
		const href = buildHref(['chat', 'customers', 'nope', 'chat']);
		expect(href).toBe('/build-a-boilerplate?features=customers,chat');
		expect(parseFeatures(href.slice(href.indexOf('?')))).toEqual(['customers', 'chat']);
		expect(buildHref([])).toBe('/build-a-boilerplate');
		expect(parseFeatures('?features=x,y')).toEqual([]);
	});

	it('collects each recipe once and seeds the assistant with the feature names', () => {
		expect(recipesFor(['chat', 'chat'])).toEqual(['chat.assistant', 'chat.rooms']);
		const seed = seedFor(['customers', 'chat']);
		expect(seed.id).toBe('map-selection:customers,chat');
		expect(seed.messages[0].content).toContain('Customers, Chat');
	});

	it('marks every feature without a recipe as not in the planner yet', () => {
		const empty = features.filter((feature) => feature.recipes.length === 0);
		expect(empty.length).toBeGreaterThan(0);
		for (const feature of empty) expect(isMappable(feature.id), feature.id).toBe(false);
		const { mapped, unmapped } = splitSelection(features.map((feature) => feature.id));
		expect(unmapped).toEqual(empty.map((feature) => feature.id));
		expect(mapped.length + unmapped.length).toBe(features.length);
	});

	it('names the unmapped features to the assistant and in the notice', () => {
		const off = features.find((feature) => feature.recipes.length === 0)!;
		const seed = seedFor(['chat', off.id]);
		expect(seed.messages[1].content).toContain(`no recipe yet for ${off.word}`);
		expect(noticeFor(['chat', off.id])).toEqual({
			on: 'Switched on: Chat',
			off: `Not in the planner yet: ${off.word}`
		});
		expect(noticeFor([])).toEqual({ on: null, off: null });
	});
});

describe('warp flag', () => {
	beforeEach(() => sessionStorage.clear());

	it('is true once after the map sets it, then cleared', () => {
		expect(takeWarp()).toBe(false);
		markWarp();
		expect(sessionStorage.getItem(WARP_KEY)).not.toBeNull();
		expect(takeWarp()).toBe(true);
		expect(sessionStorage.getItem(WARP_KEY)).toBeNull();
		expect(takeWarp()).toBe(false);
	});

	it('expires a flag an aborted navigation left behind', () => {
		markWarp(1_000);
		expect(takeWarp(1_000 + 60_000)).toBe(false);
		expect(sessionStorage.getItem(WARP_KEY)).toBeNull();
	});
});
