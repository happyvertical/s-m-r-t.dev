<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import SEO from '$lib/components/SEO.svelte';

	interface Module {
		name: string;
		package: string;
		description: string;
		href?: string;
	}

	const foundation: Module[] = [
		{
			name: 'smrt-core',
			package: '@happyvertical/smrt-core',
			description: 'ORM (SmrtObject/SmrtCollection), @smrt() decorator, code generators (REST/CLI/MCP), DispatchBus, STI',
			href: '/modules/smrt-core'
		},
		{
			name: 'smrt-config',
			package: '@happyvertical/smrt-config',
			description: 'Cosmiconfig loader, secret sanitization, SSG export',
			href: '/modules/smrt-config'
		},
		{
			name: 'smrt-cli',
			package: '@happyvertical/smrt-cli',
			description: 'Developer CLI: smrt db:*, smrt docs:claude, introspection, code generation',
			href: '/modules/smrt-cli'
		},
		{
			name: 'smrt-types',
			package: '@happyvertical/smrt-types',
			description: 'Shared TypeScript types/enums — zero runtime code',
			href: '/modules/smrt-types'
		},
		{
			name: 'smrt-vitest',
			package: '@happyvertical/smrt-vitest',
			description: 'Test plugin: auto-manifest generation, cross-package class loading, DB isolation',
			href: '/modules/smrt-vitest'
		},
		{
			name: 'smrt-scanner',
			package: '@happyvertical/smrt-scanner',
			description: 'oxc-parser AST scanner for class/field metadata extraction',
			href: '/modules/smrt-scanner'
		},
		{
			name: 'smrt-tenancy',
			package: '@happyvertical/smrt-tenancy',
			description: 'Multi-tenancy: AsyncLocalStorage context, auto-filtering interceptors, adapters',
			href: '/modules/smrt-tenancy'
		}
	];

	const agentsRuntime: Module[] = [
		{
			name: 'smrt-agents',
			package: '@happyvertical/smrt-agents',
			description: 'Agent lifecycle, DispatchBus inter-agent messaging, interests-based discovery, scheduling',
			href: '/modules/smrt-agents'
		},
		{
			name: 'smrt-jobs',
			package: '@happyvertical/smrt-jobs',
			description: 'Background execution: TaskRunner, ScheduleRunner, fluent JobBuilder, withBackgroundJobs()',
			href: '/modules/smrt-jobs'
		},
		{
			name: 'smrt-users',
			package: '@happyvertical/smrt-users',
			description: 'Auth/RBAC: 4-level permission cascade, hierarchical tenants, sessions, SvelteKit hooks',
			href: '/modules/smrt-users'
		},
		{
			name: 'smrt-profiles',
			package: '@happyvertical/smrt-profiles',
			description: 'Identity: multi-auth (Nostr/OIDC/API keys/magic links), relationships, audit logging',
			href: '/modules/smrt-profiles'
		}
	];

	const contentMedia: Module[] = [
		{
			name: 'smrt-content',
			package: '@happyvertical/smrt-content',
			description: 'STI content types (Article/Document/Mirror), thumbnails, asset associations',
			href: '/modules/smrt-content'
		},
		{
			name: 'smrt-messages',
			package: '@happyvertical/smrt-messages',
			description: 'Multi-channel messaging (Email/Twitter/Slack) as STI hierarchy, credential encryption',
			href: '/modules/smrt-messages'
		},
		{
			name: 'smrt-chat',
			package: '@happyvertical/smrt-chat',
			description: 'Chat rooms (public/private/DM/agent), threads, agent sessions with tool whitelisting',
			href: '/modules/smrt-chat'
		},
		{
			name: 'smrt-assets',
			package: '@happyvertical/smrt-assets',
			description: 'Provider-agnostic asset management, versioning, polymorphic AssetAssociation',
			href: '/modules/smrt-assets'
		},
		{
			name: 'smrt-images',
			package: '@happyvertical/smrt-images',
			description: 'Image ops: AI categorization, editing, cross-package STI extending Asset',
			href: '/modules/smrt-images'
		},
		{
			name: 'smrt-video',
			package: '@happyvertical/smrt-video',
			description: 'Video production: Character/Performer/Scene, ComfyUI workflows, frame-based durations',
			href: '/modules/smrt-video'
		},
		{
			name: 'smrt-voice',
			package: '@happyvertical/smrt-voice',
			description: 'TTS voice profiles, cloning from samples, word timings for lip-sync',
			href: '/modules/smrt-voice'
		}
	];

	const business: Module[] = [
		{
			name: 'smrt-commerce',
			package: '@happyvertical/smrt-commerce',
			description: 'Customer/Vendor, Contract (5 STI types), Invoice with ledger integration, Fulfillment',
			href: '/modules/smrt-commerce'
		},
		{
			name: 'smrt-products',
			package: '@happyvertical/smrt-products',
			description: 'Product catalog — reference template for triple-consumption (npm/federation/standalone)',
			href: '/modules/smrt-products'
		},
		{
			name: 'smrt-ads',
			package: '@happyvertical/smrt-ads',
			description: 'Ad delivery: priority waterfall, weighted A/B variations, immutable event tracking',
			href: '/modules/smrt-ads'
		},
		{
			name: 'smrt-affiliates',
			package: '@happyvertical/smrt-affiliates',
			description: 'Revenue sharing: multi-type partners, multi-tier commissions, payout processing',
			href: '/modules/smrt-affiliates'
		},
		{
			name: 'smrt-ledgers',
			package: '@happyvertical/smrt-ledgers',
			description: 'Double-entry accounting, balance enforcement (EPSILON=0.01), journal lifecycle',
			href: '/modules/smrt-ledgers'
		},
		{
			name: 'smrt-analytics',
			package: '@happyvertical/smrt-analytics',
			description: 'GA4/Plausible: properties, data streams, server-side events, AI-powered reports',
			href: '/modules/smrt-analytics'
		}
	];

	const domain: Module[] = [
		{
			name: 'smrt-events',
			package: '@happyvertical/smrt-events',
			description: 'Infinite-nesting event hierarchy, series, participant roles/placements',
			href: '/modules/smrt-events'
		},
		{
			name: 'smrt-places',
			package: '@happyvertical/smrt-places',
			description: 'Hierarchical places, geocoding via lookupOrCreate(), Haversine proximity search',
			href: '/modules/smrt-places'
		},
		{
			name: 'smrt-facts',
			package: '@happyvertical/smrt-facts',
			description: 'Knowledge base: semantic dedup (3-zone reconciliation), evolution chains, confidence',
			href: '/modules/smrt-facts'
		},
		{
			name: 'smrt-sites',
			package: '@happyvertical/smrt-sites',
			description: 'Site lifecycle management, agent bindings with priority ordering',
			href: '/modules/smrt-sites'
		},
		{
			name: 'smrt-properties',
			package: '@happyvertical/smrt-properties',
			description: 'Digital properties with hierarchical zones for content/ad placement',
			href: '/modules/smrt-properties'
		},
		{
			name: 'smrt-tags',
			package: '@happyvertical/smrt-tags',
			description: 'Hierarchical tagging: context-scoped slugs, multi-language aliases',
			href: '/modules/smrt-tags'
		},
		{
			name: 'smrt-social',
			package: '@happyvertical/smrt-social',
			description: 'Social media OAuth (YouTube/Threads/X/Bluesky), post scheduling',
			href: '/modules/smrt-social'
		},
		{
			name: 'smrt-secrets',
			package: '@happyvertical/smrt-secrets',
			description: 'Envelope encryption (AMK to TDEK to secret), key rotation, audit logging',
			href: '/modules/smrt-secrets'
		},
		{
			name: 'smrt-projects',
			package: '@happyvertical/smrt-projects',
			description: 'Provider-agnostic project management',
			href: '/modules/smrt-projects'
		}
	];

	const tooling: Module[] = [
		{
			name: 'smrt-svelte',
			package: '@happyvertical/smrt-svelte',
			description: 'Svelte 5: Provider, browser AI (STT/TTS/LLM) with warm cache, theme system',
			href: '/components'
		},
		{
			name: 'smrt-dev-mcp',
			package: '@happyvertical/smrt-dev-mcp',
			description: 'Tier 2 dev MCP: generate-smrt-class, introspect-project',
			href: '/modules/smrt-dev-mcp'
		},
		{
			name: 'smrt-gnode',
			package: '@happyvertical/smrt-gnode',
			description: 'Federation library — stubs only, not implemented',
			href: '/modules/smrt-gnode'
		},
		{
			name: 'smrt-template-sveltekit',
			package: '@happyvertical/smrt-template-sveltekit',
			description: 'Base SvelteKit scaffold with SMRT integration',
			href: '/modules/template-sveltekit'
		},
		{
			name: 'smrt-template-site-static-json',
			package: '@happyvertical/smrt-template-site-static-json',
			description: 'Community news site scaffold with Praeco/Caelus',
			href: '/modules/template-site-static-json'
		}
	];
</script>

<SEO
	title="Modules"
	description="Explore 38 SMRT modules for building full-stack applications: core framework, agents, commerce, content, domain models, and more. Complete TypeScript documentation."
	url="https://havesmrt.com/modules"
	type="website"
/>

<Grid>
	<div class="header">
		<h1>Modules</h1>
		<p class="description">
			SMRT packages organized by purpose. Mix and match based on your needs.
		</p>
	</div>

	{#snippet moduleList(modules: Module[])}
		<div class="packages">
			{#each modules as mod}
				{#if mod.href}
					<a href={mod.href} class="package package-link" data-sveltekit-preload-data="hover">
						<code>{mod.package}</code>
						<span>{mod.description}</span>
					</a>
				{:else}
					<div class="package">
						<code>{mod.package}</code>
						<span>{mod.description}</span>
					</div>
				{/if}
			{/each}
		</div>
	{/snippet}

	<section class="section">
		<h2>Foundation (7 modules)</h2>
		<p class="section-desc">Essential packages required for any SMRT application.</p>
		{@render moduleList(foundation)}
	</section>

	<section class="section">
		<h2>Agents & Runtime (4 modules)</h2>
		<p class="section-desc">Agent lifecycle, background jobs, authentication, and identity management.</p>
		{@render moduleList(agentsRuntime)}
	</section>

	<section class="section">
		<h2>Content & Media (7 modules)</h2>
		<p class="section-desc">Content types, messaging, chat, assets, images, video, and voice.</p>
		{@render moduleList(contentMedia)}
	</section>

	<section class="section">
		<h2>Business (6 modules)</h2>
		<p class="section-desc">Commerce, products, advertising, affiliates, accounting, and analytics.</p>
		{@render moduleList(business)}
	</section>

	<section class="section">
		<h2>Domain (9 modules)</h2>
		<p class="section-desc">Pre-built domain models for events, places, knowledge, social, and more.</p>
		{@render moduleList(domain)}
	</section>

	<section class="section">
		<h2>Tooling (5 modules)</h2>
		<p class="section-desc">UI components, dev tools, federation, and project templates.</p>
		{@render moduleList(tooling)}
	</section>

	<section class="section">
		<h2>Installation</h2>
		<pre><code
				>{`# Install core framework
npm install @happyvertical/smrt-core

# Add domain modules as needed
npm install @happyvertical/smrt-profiles
npm install @happyvertical/smrt-events
npm install @happyvertical/smrt-content`}</code
			></pre>
	</section>

	<section class="section last">
		<h2>SDK Dependencies</h2>
		<p class="section-desc">
			SMRT builds on the HappyVertical SDK for foundational infrastructure.
		</p>
		<div class="packages">
			<div class="package">
				<code>@happyvertical/ai</code>
				<span>Multi-provider AI client (OpenAI, Anthropic, Google, AWS)</span>
			</div>
			<div class="package">
				<code>@happyvertical/sql</code>
				<span>Database operations (SQLite, Postgres, DuckDB)</span>
			</div>
			<div class="package">
				<code>@happyvertical/files</code>
				<span>File system operations (local and remote)</span>
			</div>
			<div class="package">
				<code>@happyvertical/utils</code>
				<span>ID generation, string manipulation, date handling</span>
			</div>
		</div>
	</section>
</Grid>

<style>
	.header {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.header h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 8px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.header .description {
		font-size: 1.1rem;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	.section {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.section.last {
		border-bottom: none;
	}

	h2 {
		font-size: 1.1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 8px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.section-desc {
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 24px;
	}

	.packages {
		display: flex;
		flex-direction: column;
	}

	.package {
		display: flex;
		gap: 24px;
		padding: 16px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		align-items: baseline;
	}

	.package:last-child {
		border-bottom: none;
	}

	.package-link {
		text-decoration: none;
		transition: all 0.2s;
	}

	.package-link:hover {
		background: var(--smrt-color-surface-container-low, #fafafa);
		padding-left: 12px;
		padding-right: 12px;
		margin-left: -12px;
		margin-right: -12px;
		border-radius: var(--smrt-radius-md, 8px);
	}

	.package-link:hover code {
		color: var(--smrt-color-primary, #1976d2);
	}

	.package code {
		font-family: var(--smrt-font-family-mono, ui-monospace, monospace);
		font-size: 0.9rem;
		font-weight: 500;
		flex-shrink: 0;
		width: 250px;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.package span {
		font-size: 0.9rem;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	pre {
		background: var(--smrt-color-surface-container-highest, #1a1a1a);
		color: var(--smrt-color-on-surface, #f0f0f0);
		padding: 20px;
		overflow-x: auto;
		font-family: var(--smrt-font-family-mono, ui-monospace, monospace);
		font-size: 0.85rem;
		line-height: 1.6;
		border-radius: var(--smrt-radius-md, 8px);
	}

	@media (max-width: 700px) {
		.package {
			flex-direction: column;
			gap: 4px;
		}

		.package code {
			width: auto;
		}
	}
</style>
