import type { SmrtPlaygroundModule } from '@happyvertical/smrt-playground';
import ui from '@happyvertical/smrt-ui/playground';
import agents from '@happyvertical/smrt-agents/playground';
import analytics from '@happyvertical/smrt-analytics/playground';
import assets from '@happyvertical/smrt-assets/playground';
import chat from '@happyvertical/smrt-chat/playground';
import commerce from '@happyvertical/smrt-commerce/playground';
import content from '@happyvertical/smrt-content/playground';
import events from '@happyvertical/smrt-events/playground';
import images from '@happyvertical/smrt-images/playground';
import jobs from '@happyvertical/smrt-jobs/playground';
import messages from '@happyvertical/smrt-messages/playground';
import projects from '@happyvertical/smrt-projects/playground';
import tenancy from '@happyvertical/smrt-tenancy/playground';
import users from '@happyvertical/smrt-users/playground';

/**
 * `@happyvertical/smrt-fields/playground` is deliberately absent.
 *
 * Its `Policy-Driven Form` entry throws on mount — the preview renders
 * `<FormHelp>` outside its `<FieldPolicyProvider>` — so registering the module
 * would put a permanently broken preview on the site. Tracked upstream in
 * happyvertical/smrt#2272 and in this repo's CLAUDE.md; re-add the import and
 * the array entry once a release carries the fix.
 */
export const playgroundModules: SmrtPlaygroundModule[] = [
	ui,
	agents,
	analytics,
	assets,
	chat,
	commerce,
	content,
	events,
	images,
	jobs,
	messages,
	projects,
	tenancy,
	users
] as SmrtPlaygroundModule[];

export const playgroundEntryTitles: Record<string, string[]> = {
	'smrt-ui': [
		'Base Controls',
		'Agent-assisted forms',
		'Feedback & Overlays',
		'Collections & Content Lists',
		'Data Table'
	],
	'smrt-agents': ['Agent Dashboard', 'Agent Schedule Form', 'Agent Run History'],
	'smrt-analytics': ['Analytics Summary', 'Events Table', 'Property Info'],
	'smrt-assets': ['Asset Manager Route', 'Asset Grid'],
	'smrt-chat': ['Room List', 'Message List', 'Message Input'],
	'smrt-commerce': ['Invoice Card', 'Invoice Actions', 'Unbilled Items'],
	'smrt-content': [
		'Article Card',
		'Article List',
		'Markdown Renderer',
		'Content Editor',
		'Contribution Portal',
		'Contribution Inbox',
		'Governance Manager'
	],
	'smrt-events': ['Meeting View'],
	'smrt-images': ['Image Uploader', 'Image Editor', 'Image Studio Route'],
	'smrt-jobs': ['Job Dashboard', 'Job Detail', 'Job Status Badge'],
	'smrt-messages': ['Account List', 'Message List', 'Message Detail', 'Compose Form'],
	'smrt-projects': ['Time Entry List', 'Time Summary', 'Approval Actions'],
	'smrt-tenancy': ['Tenant Card', 'Tenant Switcher'],
	'smrt-users': ['User List', 'User Form', 'Invite User Modal', 'User Menu']
};

export function getPlaygroundEntries(slug: string) {
	return playgroundEntryTitles[slug] ?? [];
}
