import { describe, expect, it } from 'vitest';
import { capabilityGuides } from './guides';
import { interactionContent } from './interaction';
import { getReferenceGuide } from './reference';
import { AGENT_AWARE_FORM_ENTRY_ID, sitePlayground } from './site-playground';
import { uiStories } from './ui-stories';

const UI_DEMO = '/ui#agent-addressable-components';
const PLAYGROUND_DEMO = '/playground?entry=agent-aware-form';
const REFERENCE_CONTRACT = '/reference/control-interaction';

describe('agent-aware form demonstration discovery', () => {
	it('registers the canonical scripted demonstration in the Playground', () => {
		expect(AGENT_AWARE_FORM_ENTRY_ID).toBe('s-m-r-t.dev:agent-aware-form');
		expect(sitePlayground.entries).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: 'agent-aware-form',
					modes: expect.objectContaining({ mock: expect.any(Object) })
				})
			])
		);
	});

	it('links the UI story, Interaction concept, Guide, and Reference contract', () => {
		const story = uiStories.find((entry) => entry.id === 'agent-addressable-components');
		const interaction = interactionContent.guides.find(
			(entry) => entry.slug === 'commands-and-lifecycle'
		);
		const guide = capabilityGuides.find((entry) => entry.slug === 'agent-assisted-forms');
		const reference = getReferenceGuide('control-interaction');

		expect(story?.links.map((link) => link.href)).toEqual(
			expect.arrayContaining([PLAYGROUND_DEMO, REFERENCE_CONTRACT])
		);
		expect(interaction?.related?.map((link) => link.href)).toEqual(
			expect.arrayContaining([UI_DEMO, PLAYGROUND_DEMO, REFERENCE_CONTRACT])
		);
		expect(guide?.related?.map((link) => link.href)).toEqual(
			expect.arrayContaining([UI_DEMO, PLAYGROUND_DEMO, REFERENCE_CONTRACT])
		);
		expect(reference?.related?.map((link) => link.href)).toEqual(
			expect.arrayContaining([UI_DEMO, PLAYGROUND_DEMO])
		);
	});
});
