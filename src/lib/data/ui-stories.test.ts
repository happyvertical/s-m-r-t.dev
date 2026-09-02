import { describe, expect, it } from 'vitest';
import {
	batteryPointKinds,
	contractPointKinds,
	uiStories,
	uiStoryGroups,
	type UIStoryGroup
} from './ui-stories';

const expectedStoryIds: Record<UIStoryGroup, string[]> = {
	contract: [
		'agent-addressable-components',
		'data-table-and-collections',
		'model-driven-forms',
		'chat-and-tool-calls',
		'application-shell',
		'voice-and-browser-ai',
		'feedback-and-focused-work',
		'themes-and-accessibility'
	],
	battery: [
		'staged-review',
		'content-routes',
		'module-ui-registry',
		'translations',
		'agent-admin-shells',
		'auth-and-sessions'
	]
};

describe('UI showcase stories', () => {
	it('defines every story once, grouped and in the intended order', () => {
		expect(uiStoryGroups.map((group) => group.id)).toEqual(['contract', 'battery']);
		for (const group of uiStoryGroups) {
			expect(
				uiStories.filter((story) => story.group === group.id).map((story) => story.id)
			).toEqual(expectedStoryIds[group.id]);
		}
		expect(new Set(uiStories.map((story) => story.id))).toHaveLength(uiStories.length);
		expect(uiStories.map((story) => story.group)).toEqual([
			...expectedStoryIds.contract.map(() => 'contract'),
			...expectedStoryIds.battery.map(() => 'battery')
		]);
	});

	it('uses the person, agent, confirmation, refusal, preview, and reference template', () => {
		for (const story of uiStories.filter((story) => story.group === 'contract')) {
			expect(story.points.map((point) => point.kind)).toEqual(contractPointKinds);
			expect(story.links.some((link) => link.kind === 'playground' || link.kind === 'gap')).toBe(
				true
			);
		}
	});

	it('uses the gets, wiring, and boundary template for batteries-included stories', () => {
		for (const story of uiStories.filter((story) => story.group === 'battery')) {
			expect(story.points.map((point) => point.kind)).toEqual(batteryPointKinds);
		}
	});

	it('keeps every story linked, populated, and free of duplicate points or links', () => {
		for (const story of uiStories) {
			expect(story.links.some((link) => link.kind === 'reference')).toBe(true);
			expect(story.components.length).toBeGreaterThan(0);
			expect(story.highlights.length).toBeGreaterThan(0);
			expect(new Set(story.points.map((point) => point.kind))).toHaveLength(story.points.length);
			expect(new Set(story.links.map((link) => link.href))).toHaveLength(story.links.length);
		}
	});
});
