import type { SmrtPlaygroundModule } from '@happyvertical/smrt-playground';
import ui from '@happyvertical/smrt-ui/playground';
import agents from '@happyvertical/smrt-agents/playground';
import analytics from '@happyvertical/smrt-analytics/playground';
import assets from '@happyvertical/smrt-assets/playground';
import chat from '@happyvertical/smrt-chat/playground';
import commerce from '@happyvertical/smrt-commerce/playground';
import content from '@happyvertical/smrt-content/playground';
import events from '@happyvertical/smrt-events/playground';
import fields from '@happyvertical/smrt-fields/playground';
import images from '@happyvertical/smrt-images/playground';
import jobs from '@happyvertical/smrt-jobs/playground';
import messages from '@happyvertical/smrt-messages/playground';
import projects from '@happyvertical/smrt-projects/playground';
import tenancy from '@happyvertical/smrt-tenancy/playground';
import users from '@happyvertical/smrt-users/playground';
import { sitePlayground } from '$lib/data/site-playground';

export const playgroundModules: SmrtPlaygroundModule[] = [
	ui,
	agents,
	analytics,
	assets,
	chat,
	commerce,
	content,
	events,
	fields,
	images,
	jobs,
	messages,
	projects,
	tenancy,
	users,
	sitePlayground
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
	'smrt-fields': ['Policy-Driven Form', 'Generated ObjectForm'],
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

export interface ResolvedPlaygroundSlug {
	/** `${module.packageName}:${entry.id}`, the id `<PlaygroundHost selectedEntryId>` expects. */
	qualifiedId: string;
	packageName: string;
	entryId: string;
	entryTitle: string;
}

/**
 * Slug scheme for `/playground?entry=<slug>` deep links.
 *
 * Every playground entry's own `id` is already a short, kebab-case
 * identifier chosen by its owning package (e.g. `job-dashboard`,
 * `agent-aware-form`), so that `id` is the canonical public slug whenever it
 * is unique across the whole `playgroundModules` registry.
 *
 * When two or more modules ship an entry with the same `id` (e.g.
 * `message-list` exists in both `smrt-chat` and `smrt-messages`), the bare
 * id is ambiguous and is deliberately *not* registered as a slug. Instead
 * every entry sharing that id gets a package-qualified slug of the form
 * `<package-short-name>-<entry-id>`, where the short name is the package's
 * name with any `@scope/` prefix stripped (`smrt-chat-message-list`,
 * `smrt-messages-message-list`). Prefixing only happens where it's needed
 * to disambiguate, so today's unprefixed links (`agent-aware-form`,
 * `job-dashboard`, ...) stay stable.
 *
 * `agent-aware-form` (the site's own demo, deep-linked from the homepage,
 * /ui, and /agents) resolves through this same generic path — its id is
 * unique across the registry, so no special case is needed.
 */
function packageShortName(packageName: string): string {
	return packageName.replace(/^@[^/]+\//, '');
}

function buildPlaygroundSlugIndex(
	modules: SmrtPlaygroundModule[]
): Map<string, ResolvedPlaygroundSlug> {
	const byEntryId = new Map<string, ResolvedPlaygroundSlug[]>();
	for (const module of modules) {
		for (const entry of module.entries) {
			const resolved: ResolvedPlaygroundSlug = {
				qualifiedId: `${module.packageName}:${entry.id}`,
				packageName: module.packageName,
				entryId: entry.id,
				entryTitle: entry.title
			};
			const existing = byEntryId.get(entry.id);
			if (existing) {
				existing.push(resolved);
			} else {
				byEntryId.set(entry.id, [resolved]);
			}
		}
	}

	const index = new Map<string, ResolvedPlaygroundSlug>();
	for (const [entryId, resolvedEntries] of byEntryId) {
		if (resolvedEntries.length === 1) {
			index.set(entryId, resolvedEntries[0]);
			continue;
		}
		for (const resolved of resolvedEntries) {
			index.set(`${packageShortName(resolved.packageName)}-${entryId}`, resolved);
		}
	}
	return index;
}

export const playgroundSlugIndex = buildPlaygroundSlugIndex(playgroundModules);

/** Resolve a `/playground?entry=<slug>` slug to its module/entry, or `null` if unknown. */
export function resolvePlaygroundSlug(slug: string): ResolvedPlaygroundSlug | null {
	return playgroundSlugIndex.get(slug) ?? null;
}

/** Every valid `/playground?entry=<slug>` slug, sorted, for discovery/debugging. */
export function listPlaygroundSlugs(): string[] {
	return Array.from(playgroundSlugIndex.keys()).sort();
}
