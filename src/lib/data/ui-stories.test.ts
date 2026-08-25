import { describe, expect, it } from 'vitest';
import { uiStories, type UIStoryPointKind } from './ui-stories';

const expectedStoryIds = [
	'agent-addressable-components',
	'data-table-and-collections',
	'model-driven-forms',
	'chat-and-tool-calls',
	'application-shell',
	'voice-and-browser-ai',
	'feedback-and-focused-work',
	'themes-and-accessibility'
];

const requiredPointKinds: UIStoryPointKind[] = [
	'person',
	'discover',
	'operate',
	'confirm',
	'failure'
];

describe('UI showcase stories', () => {
	it('defines the eight required stories once and in the intended order', () => {
		expect(uiStories.map((story) => story.id)).toEqual(expectedStoryIds);
		expect(new Set(uiStories.map((story) => story.id))).toHaveLength(uiStories.length);
	});

	it('uses the person, agent, confirmation, refusal, preview, and reference template', () => {
		for (const story of uiStories) {
			expect(story.points.map((point) => point.kind)).toEqual(requiredPointKinds);
			expect(story.links.some((link) => link.kind === 'reference')).toBe(true);
			expect(story.links.some((link) => link.kind === 'playground' || link.kind === 'gap')).toBe(
				true
			);
			expect(story.components.length).toBeGreaterThan(0);
			expect(story.highlights.length).toBeGreaterThan(0);
			expect(new Set(story.points.map((point) => point.kind))).toHaveLength(story.points.length);
			expect(new Set(story.links.map((link) => link.href))).toHaveLength(story.links.length);
		}
	});
});
