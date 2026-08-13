import { describe, expect, it } from 'vitest';
import { isSidebarItemActive, sidebarAriaCurrent } from './navigation';

describe('sidebar navigation state', () => {
	it('scroll-spies the homepage overview without selecting other page groups', () => {
		expect(isSidebarItemActive('/#how-it-works', '/', '/#how-it-works')).toBe(true);
		expect(isSidebarItemActive('/', '/', '/#how-it-works')).toBe(false);
		expect(isSidebarItemActive('/#what-you-get', '/', '/#how-it-works')).toBe(false);
		expect(isSidebarItemActive('/starters', '/', '/#how-it-works')).toBe(false);
	});

	it('does not leave the starting-point index active on a child route', () => {
		expect(isSidebarItemActive('/starters', '/starters')).toBe(true);
		expect(isSidebarItemActive('/starters', '/starters/ground-up')).toBe(false);
		expect(isSidebarItemActive('/starters/ground-up', '/starters/ground-up')).toBe(true);
	});

	it('uses location semantics for in-page destinations', () => {
		expect(sidebarAriaCurrent('/#how-it-works')).toBe('location');
		expect(sidebarAriaCurrent('/')).toBe('page');
		expect(sidebarAriaCurrent('/starters/ground-up')).toBe('page');
	});
});
