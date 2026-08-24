import { createShellState, type ShellPanelDefaults } from '@happyvertical/smrt-svelte/workspace';

export const docsShellConfig: ShellPanelDefaults = {
	top: {
		label: 'Documentation',
		initial: 'collapsed',
		presentation: 'overlay',
		hotkey: null,
		collapsedSize: '3.5rem',
		expandedSize: 'min(34rem, calc(100svh - 3.5rem))'
	},
	left: false,
	right: false,
	bottom: false
};

export function createDocsShellState() {
	return createShellState({
		config: docsShellConfig,
		storageKey: 'smrt-docs-shell'
	});
}
