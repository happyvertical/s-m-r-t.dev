import type { SmrtPlaygroundModule } from '@happyvertical/smrt-playground';

export const AGENT_AWARE_FORM_ENTRY_ID = 's-m-r-t.dev:agent-aware-form';

export const sitePlayground: SmrtPlaygroundModule = {
	packageName: 's-m-r-t.dev',
	displayName: 'Documentation demonstrations',
	description: 'Site-owned demonstrations that compose released s-m-r-t package behavior.',
	entries: [
		{
			id: 'agent-aware-form',
			title: 'Agent-aware form: success and refusal',
			description:
				'A deterministic scripted adapter uses the released control interaction registry. No language model runs in this demonstration.',
			loadComponent: () => import('$lib/ui-showcase/AgentAwareFormDemo.svelte'),
			tags: ['forms', 'interaction', 'agent', 'staging', 'confirmation', 'refusal'],
			modes: {
				mock: {
					label: 'Scripted demonstration',
					description: 'Uses fixed example data and works offline after the static site loads.'
				}
			}
		}
	]
};
