import { describe, expect, it } from 'vitest';
import {
	listPlaygroundSlugs,
	playgroundModules,
	resolvePlaygroundSlug
} from '$lib/data/playgrounds';

describe('resolvePlaygroundSlug', () => {
	it('resolves a known slug per module', () => {
		expect(resolvePlaygroundSlug('job-dashboard')).toMatchObject({
			qualifiedId: '@happyvertical/smrt-jobs:job-dashboard',
			packageName: '@happyvertical/smrt-jobs',
			entryId: 'job-dashboard',
			entryTitle: 'Job Dashboard'
		});
		expect(resolvePlaygroundSlug('base-controls')).toMatchObject({
			qualifiedId: '@happyvertical/smrt-ui:base-controls'
		});
		expect(resolvePlaygroundSlug('agent-dashboard')).toMatchObject({
			qualifiedId: '@happyvertical/smrt-agents:agent-dashboard'
		});
	});

	it('resolves the site-owned agent-aware-form demo through the generic path', () => {
		// This slug is deep-linked from the homepage, /ui, and /agents and must
		// keep resolving to the site's own demo, not fall back to Base Controls.
		expect(resolvePlaygroundSlug('agent-aware-form')).toMatchObject({
			qualifiedId: 's-m-r-t.dev:agent-aware-form',
			packageName: 's-m-r-t.dev',
			entryId: 'agent-aware-form'
		});
	});

	it('disambiguates entry ids that collide across modules', () => {
		// smrt-chat and smrt-messages both ship an entry with id 'message-list'.
		const chatModule = playgroundModules.find((m) => m.packageName === '@happyvertical/smrt-chat');
		const messagesModule = playgroundModules.find(
			(m) => m.packageName === '@happyvertical/smrt-messages'
		);
		expect(chatModule?.entries.some((e) => e.id === 'message-list')).toBe(true);
		expect(messagesModule?.entries.some((e) => e.id === 'message-list')).toBe(true);

		// The bare, ambiguous slug is not registered.
		expect(resolvePlaygroundSlug('message-list')).toBeNull();

		// Each collides entry gets a package-qualified slug instead.
		expect(resolvePlaygroundSlug('smrt-chat-message-list')).toMatchObject({
			qualifiedId: '@happyvertical/smrt-chat:message-list'
		});
		expect(resolvePlaygroundSlug('smrt-messages-message-list')).toMatchObject({
			qualifiedId: '@happyvertical/smrt-messages:message-list'
		});
	});

	it('returns null for an unknown slug', () => {
		expect(resolvePlaygroundSlug('definitely-not-a-real-entry')).toBeNull();
	});

	it('lists every registered slug for discovery', () => {
		const slugs = listPlaygroundSlugs();
		expect(slugs).toContain('agent-aware-form');
		expect(slugs).toContain('job-dashboard');
		expect(slugs).toContain('smrt-chat-message-list');
		expect(slugs).not.toContain('message-list');
		expect(slugs).toEqual([...slugs].sort());
	});
});
