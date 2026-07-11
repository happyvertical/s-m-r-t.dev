import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// adapter-static only emits catch-all routes returned here. Keep the complete
// inventory of removed component pages so existing links reach the package
// workbench instead of becoming deployment-only 404s.
const legacyEntriesBySection = {
	admin: ['', 'agent-admin-panel', 'agent-admin-tabs', 'agent-settings-shell'],
	agents: [
		'',
		'agent-dashboard',
		'agent-run-history',
		'agent-schedule-form',
		'agent-schedule-list'
	],
	ai: ['', 'download-progress', 'loading-overlay', 'voice-input'],
	calendar: ['', 'calendar', 'day-view'],
	commerce: [
		'',
		'invoice-actions',
		'invoice-card',
		'invoice-header',
		'invoice-line-items',
		'invoice-totals',
		'unbilled-items'
	],
	content: ['', 'article-card', 'article-list', 'markdown'],
	data: ['', 'data-table'],
	display: ['', 'confidence-badge', 'currency-display', 'date-display', 'icon', 'status-badge'],
	events: ['', 'meeting-view'],
	feedback: ['', 'confirm-dialog', 'loading-overlay', 'modal', 'progress-bar'],
	forms: [
		'',
		'address',
		'checkbox',
		'daterange',
		'datetime',
		'form',
		'form-group',
		'form-mic-button',
		'measurement',
		'money',
		'number',
		'phone',
		'smrt-select',
		'text-input',
		'textarea'
	],
	hooks: ['', 'use-app-state', 'use-auth', 'use-llm', 'use-socket', 'use-stt', 'use-tts'],
	jobs: ['', 'job-dashboard', 'job-detail', 'job-list', 'job-stats'],
	layout: [
		'',
		'container',
		'empty-state',
		'footer',
		'grid',
		'header',
		'masthead',
		'page-header',
		'summary-card'
	],
	memberships: ['membership-card', 'membership-list'],
	nav: ['', 'filter-chips', 'tabs'],
	permissions: ['permission-check'],
	projects: [
		'',
		'approval-actions',
		'bulk-actions',
		'duration-display',
		'reject-dialog',
		'time-entry-card',
		'time-entry-list',
		'time-summary'
	],
	roles: ['role-badge', 'role-selector'],
	tenants: ['tenant-card', 'tenant-switcher'],
	theme: ['', 'theme-switcher'],
	ui: ['', 'badge', 'button', 'card', 'pagination'],
	users: ['', 'invite-user', 'user-avatar', 'user-card', 'user-form', 'user-list', 'user-menu']
} as const;

const legacyEntries = Object.entries(legacyEntriesBySection).flatMap(([section, pages]) =>
	pages.map((page) => (page ? `${section}/${page}` : section))
);

const packageBySection: Record<string, string> = {
	agents: 'smrt-agents',
	admin: 'smrt-svelte',
	content: 'smrt-content',
	commerce: 'smrt-commerce',
	events: 'smrt-events',
	jobs: 'smrt-jobs',
	projects: 'smrt-projects',
	tenants: 'smrt-tenancy',
	users: 'smrt-users',
	ui: 'smrt-ui',
	theme: 'smrt-ui'
};

export const prerender = true;

export const entries = () => legacyEntries.map((legacy) => ({ legacy }));

export const load: PageServerLoad = ({ params }) => {
	const section = params.legacy?.split('/')[0] ?? '';
	const pkg = packageBySection[section] ?? 'smrt-svelte';
	redirect(301, `/packages/${pkg}`);
};
