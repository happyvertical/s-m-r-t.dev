import { describe, expect, it } from 'vitest';
import { createShellScrollMemory } from '$lib/scroll';

describe('shell scroll memory', () => {
	it('starts new route navigations at the top', () => {
		const memory = createShellScrollMemory();
		const destination = new URL('https://s-m-r-t.dev/framework');

		memory.capture(destination, 640);
		expect(memory.destination(destination, 'link')).toBe(0);
		expect(memory.destination(destination, 'goto')).toBe(0);
	});

	it('restores each route on browser back and forward', () => {
		const memory = createShellScrollMemory();
		const framework = new URL('https://s-m-r-t.dev/framework');
		const reference = new URL('https://s-m-r-t.dev/reference?view=packages');

		memory.capture(framework, 480);
		memory.capture(reference, 920);

		expect(memory.destination(framework, 'popstate')).toBe(480);
		expect(memory.destination(reference, 'popstate')).toBe(920);
		expect(memory.destination(new URL('https://s-m-r-t.dev/ui'), 'popstate')).toBe(0);
	});

	it('leaves hash destinations to anchor focus handling', () => {
		const memory = createShellScrollMemory();

		expect(memory.destination(new URL('https://s-m-r-t.dev/#how-it-works'), 'popstate')).toBeNull();
	});
});
