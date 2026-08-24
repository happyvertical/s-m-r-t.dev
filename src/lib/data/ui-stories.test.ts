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

function storyText(id: string): string {
	const story = uiStories.find((entry) => entry.id === id);
	expect(story, `Missing UI story: ${id}`).toBeDefined();
	return JSON.stringify(story);
}

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
		}
	});

	it('covers the released DataTable contract and makes the story prominent', () => {
		const text = storyText('data-table-and-collections');

		for (const mechanism of [
			'search',
			'filter',
			'sorting',
			'pagination',
			'expansion',
			'density',
			'selection',
			'rowKey',
			'agentAddressable',
			'local',
			'manual',
			'controlled',
			'serializable',
			'duplicate',
			'stale'
		]) {
			expect(text.toLowerCase()).toContain(mechanism.toLowerCase());
		}
	});

	it('documents agent-addressable controls, forms, chat, shell, and browser AI boundaries', () => {
		const controls = storyText('agent-addressable-components');
		for (const term of [
			'stable form and control IDs',
			'options',
			'constraints',
			'sensitivity',
			'command source',
			'stage',
			'validate',
			'confirmation',
			'undo'
		]) {
			expect(controls.toLowerCase()).toContain(term.toLowerCase());
		}

		const forms = storyText('model-driven-forms');
		for (const term of ['model', 'field policy', 'rich', 'validation', 'secret', 'voice']) {
			expect(forms.toLowerCase()).toContain(term.toLowerCase());
		}

		const chat = storyText('chat-and-tool-calls');
		for (const term of [
			'AgentChat',
			'MessageBubble',
			'ToolCallDisplay',
			'user, agent, system, and tool',
			'arguments',
			'results',
			'errors',
			'duration',
			'field-change',
			'Apply',
			'session',
			'loading'
		]) {
			expect(chat.toLowerCase()).toContain(term.toLowerCase());
		}

		const shell = uiStories.find((entry) => entry.id === 'application-shell');
		expect(storyText('application-shell')).toContain('active ShellState');
		expect(shell?.lede).toContain('live AdminShell example');
		expect(shell?.links.some((link) => link.kind === 'playground')).toBe(true);
		expect(shell?.links.some((link) => link.kind === 'gap')).toBe(true);

		const browserAi = storyText('voice-and-browser-ai');
		for (const term of [
			'capability',
			'speech input and output',
			'readiness',
			'download progress',
			'adapter wiring'
		]) {
			expect(browserAi.toLowerCase()).toContain(term.toLowerCase());
		}
	});
});
