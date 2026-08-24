import { describe, expect, it } from 'vitest';
import { createDocsShellState, docsShellConfig } from '$lib/shell';

describe('documentation shell state', () => {
	it('uses the application edge and hides unused tenant, focus, and system edges', () => {
		const shell = createDocsShellState();

		expect(shell.panels).toEqual({
			top: 'collapsed',
			left: 'hidden',
			right: 'hidden',
			bottom: 'hidden'
		});
		expect(docsShellConfig.top).toMatchObject({
			label: 'Documentation',
			presentation: 'overlay',
			hotkey: null
		});
	});

	it('opens and closes contextual navigation through ShellState', () => {
		const shell = createDocsShellState();

		shell.expandPanel('top');
		expect(shell.panels.top).toBe('expanded');
		shell.closeTopmostExpanded();
		expect(shell.panels.top).toBe('collapsed');
	});
});
