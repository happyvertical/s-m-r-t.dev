import { describe, expect, it } from 'vitest';
import { listInteractionGuides } from './interaction';

const interactionGuides = listInteractionGuides();

const pageText = (slug: string): string => {
	const guide = interactionGuides.find((candidate) => candidate.slug === slug);
	expect(guide, `missing interaction guide: ${slug}`).toBeDefined();
	return JSON.stringify(guide);
};

describe('Human-Agent Interaction content', () => {
	it('publishes the five required concept families', () => {
		expect(interactionGuides.map((guide) => guide.slug)).toEqual([
			'human-agent-communication',
			'control-discovery',
			'commands-and-lifecycle',
			'input-sources-and-provenance',
			'consent-sensitivity-and-authority'
		]);
	});

	it('keeps each family on the section route as a stable anchor', () => {
		for (const guide of interactionGuides) {
			expect(`#${guide.slug}`).toMatch(/^#[a-z0-9]+(?:-[a-z0-9]+)*$/);
		}
	});

	it('links every concept to UI, Framework, Reference, and a guide', () => {
		for (const guide of interactionGuides) {
			const labels = guide.related?.map((link) => link.label) ?? [];
			expect(labels.some((label) => label.startsWith('UI implementation:'))).toBe(true);
			expect(labels.some((label) => label.startsWith('Framework mechanism:'))).toBe(true);
			expect(labels.some((label) => label.startsWith('Reference contract:'))).toBe(true);
			expect(labels.some((label) => label.startsWith('Related guide:'))).toBe(true);
		}
	});

	it('records shipped communication surfaces and their current connection limit', () => {
		const text = pageText('human-agent-communication');
		expect(text).toContain('natural language');
		expect(text).toContain('Chat');
		expect(text).toContain('Voice');
		expect(text).toContain('do not ship one general adapter');
	});

	it('records the full command lifecycle and confirmation boundary', () => {
		const text = pageText('commands-and-lifecycle');
		for (const step of ['Inspect', 'Reveal', 'Explain', 'Validate', 'Stage', 'Apply', 'Clear']) {
			expect(text).toContain(step);
		}
		expect(text).toContain('Stage does not call the control writer');
		expect(text).toContain(
			'apply, clear, or undo command returns human_confirmation_required under the default policy for an otherwise-permitted control'
		);
	});

	it('names every source and keeps provenance distinct from authentication', () => {
		const text = pageText('input-sources-and-provenance');
		for (const source of ['user', 'voice', 'agent', 'tutorial', 'test']) {
			expect(text).toContain(source);
		}
		expect(text).toContain('does not authenticate actorId or sessionId');
	});

	it('states the released secret and sensitive behavior without widening authority', () => {
		const text = pageText('consent-sensitivity-and-authority');
		expect(text).toContain('secret, non-writable, disabled, and read-only controls');
		expect(text).toContain('Sensitive does not automatically redact');
		expect(text).toContain('Control discovery does not widen a principal permission set');
	});
});
