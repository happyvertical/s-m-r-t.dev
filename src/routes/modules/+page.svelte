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
		{ name: 'smrt-core', package: '@happyvertical/smrt-core', description: 'Core AI agent framework with ORM and code generation', href: '/modules/smrt-core' },
		{ name: 'smrt-types', package: '@happyvertical/smrt-types', description: 'Shared TypeScript type definitions', href: '/modules/smrt-types' },
		{ name: 'smrt-config', package: '@happyvertical/smrt-config', description: 'Configuration management', href: '/modules/smrt-config' },
		{ name: 'smrt-scanner', package: '@happyvertical/smrt-scanner', description: 'TypeScript scanner for manifest generation', href: '/modules/smrt-scanner' }
	];

	const userAccess: Module[] = [
		{ name: 'smrt-users', package: '@happyvertical/smrt-users', description: 'Multi-tenant user management with RBAC', href: '/modules/smrt-users' },
		{ name: 'smrt-profiles', package: '@happyvertical/smrt-profiles', description: 'Profile management with relationships', href: '/modules/smrt-profiles' }
	];

	const domain: Module[] = [
		{ name: 'smrt-assets', package: '@happyvertical/smrt-assets', description: 'Asset management with versioning and AI', href: '/modules/smrt-assets' },
		{ name: 'smrt-commerce', package: '@happyvertical/smrt-commerce', description: 'Commerce models (contracts, fulfillments, payments)', href: '/modules/smrt-commerce' },
		{ name: 'smrt-events', package: '@happyvertical/smrt-events', description: 'Hierarchical event management', href: '/modules/smrt-events' },
		{ name: 'smrt-ledgers', package: '@happyvertical/smrt-ledgers', description: 'Double-entry accounting', href: '/modules/smrt-ledgers' },
		{ name: 'smrt-places', package: '@happyvertical/smrt-places', description: 'Hierarchical place management with geo', href: '/modules/smrt-places' },
		{ name: 'smrt-products', package: '@happyvertical/smrt-products', description: 'Product catalog and inventory', href: '/modules/smrt-products' },
		{ name: 'smrt-projects', package: '@happyvertical/smrt-projects', description: 'Provider-agnostic project management', href: '/modules/smrt-projects' },
		{ name: 'smrt-properties', package: '@happyvertical/smrt-properties', description: 'Digital property and zone management', href: '/modules/smrt-properties' },
		{ name: 'smrt-tags', package: '@happyvertical/smrt-tags', description: 'Reusable tagging system', href: '/modules/smrt-tags' }
	];

	const content: Module[] = [
		{ name: 'smrt-content', package: '@happyvertical/smrt-content', description: 'Content processing (documents, web, media)', href: '/modules/smrt-content' },
		{ name: 'smrt-messages', package: '@happyvertical/smrt-messages', description: 'Email persistence with AI integration', href: '/modules/smrt-messages' },
		{ name: 'smrt-analytics', package: '@happyvertical/smrt-analytics', description: 'Analytics integration (GA, Plausible)', href: '/modules/smrt-analytics' },
		{ name: 'smrt-ads', package: '@happyvertical/smrt-ads', description: 'Advertising delivery and tracking', href: '/modules/smrt-ads' }
	];

	const agents: Module[] = [
		{ name: 'smrt-agents', package: '@happyvertical/smrt-agents', description: 'Agent framework for autonomous actors', href: '/modules/smrt-agents' },
		{ name: 'smrt-gnode', package: '@happyvertical/smrt-gnode', description: 'Federation library for local knowledge bases', href: '/modules/smrt-gnode' }
	];

	const devTools: Module[] = [
		{ name: 'smrt-cli', package: '@happyvertical/smrt-cli', description: 'Developer CLI for SMRT framework', href: '/modules/smrt-cli' },
		{ name: 'smrt-dev-mcp', package: '@happyvertical/smrt-dev-mcp', description: 'Development MCP server', href: '/modules/smrt-dev-mcp' },
		{ name: 'smrt-vitest', package: '@happyvertical/smrt-vitest', description: 'Vitest plugin for cross-package testing', href: '/modules/smrt-vitest' }
	];

	const ui: Module[] = [
		{ name: 'smrt-svelte', package: '@happyvertical/smrt-svelte', description: 'Svelte 5 components for SMRT', href: '/components' },
		{ name: 'browser-ai', package: '@happyvertical/browser-ai', description: 'Framework-agnostic browser AI (STT, TTS, LLM)', href: '/modules/browser-ai' }
	];

	const templates: Module[] = [
		{ name: 'template-site-static-json', package: '@happyvertical/template-site-static-json', description: 'Static site template with JSON storage', href: '/modules/template-site-static-json' },
		{ name: 'template-sveltekit', package: '@happyvertical/template-sveltekit', description: 'SvelteKit project template with SMRT', href: '/modules/template-sveltekit' }
	];
</script>

<SEO
	title="Modules"
	description="Explore 29 SMRT modules for building full-stack applications: core framework, user management, commerce, projects, agents, analytics, and more. Complete TypeScript documentation."
	url="https://havesmrt.com/modules"
	type="website"
/>

<Grid>
	<div class="header">
		<h1>Modules</h1>
		<p>SMRT packages organized by purpose. Mix and match based on your needs.</p>
	</div>

	<section class="section">
		<h2>Core Foundation (4 modules)</h2>
		<p class="section-desc">Essential packages required for any SMRT application.</p>
		<div class="packages">
			{#each foundation as mod}
				{#if mod.href}
					<a href={mod.href} class="package package-link">
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
	</section>

	<section class="section">
		<h2>User & Access Management (2 modules)</h2>
		<p class="section-desc">Multi-tenancy, authentication, and role-based access control.</p>
		<div class="packages">
			{#each userAccess as mod}
				{#if mod.href}
					<a href={mod.href} class="package package-link">
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
	</section>

	<section class="section">
		<h2>Domain Models & Data (9 modules)</h2>
		<p class="section-desc">Pre-built domain models for common business use cases.</p>
		<div class="packages">
			{#each domain as mod}
				{#if mod.href}
					<a href={mod.href} class="package package-link">
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
	</section>

	<section class="section">
		<h2>Content & Communication (4 modules)</h2>
		<p class="section-desc">Content processing, messaging, analytics, and advertising.</p>
		<div class="packages">
			{#each content as mod}
				{#if mod.href}
					<a href={mod.href} class="package package-link">
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
	</section>

	<section class="section">
		<h2>Agents & Automation (2 modules)</h2>
		<p class="section-desc">Build autonomous agents and federated knowledge systems.</p>
		<div class="packages">
			{#each agents as mod}
				{#if mod.href}
					<a href={mod.href} class="package package-link">
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
	</section>

	<section class="section">
		<h2>Developer Tools & CLI (3 modules)</h2>
		<p class="section-desc">Development tools, testing utilities, and MCP integration.</p>
		<div class="packages">
			{#each devTools as mod}
				{#if mod.href}
					<a href={mod.href} class="package package-link">
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
	</section>

	<section class="section">
		<h2>UI Components & Frontend (2 modules)</h2>
		<p class="section-desc">Svelte components and browser-based AI capabilities.</p>
		<div class="packages">
			{#each ui as mod}
				{#if mod.href}
					<a href={mod.href} class="package package-link">
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
	</section>

	<section class="section">
		<h2>Project Templates (2 modules)</h2>
		<p class="section-desc">Starter templates for building SMRT applications.</p>
		<div class="packages">
			{#each templates as mod}
				{#if mod.href}
					<a href={mod.href} class="package package-link">
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
	</section>

	<section class="section">
		<h2>Installation</h2>
		<pre><code>{`# Install core framework
npm install @happyvertical/smrt-core

# Add domain modules as needed
npm install @happyvertical/smrt-profiles
npm install @happyvertical/smrt-events
npm install @happyvertical/smrt-content`}</code></pre>
	</section>

	<section class="section last">
		<h2>SDK Dependencies</h2>
		<p class="section-desc">SMRT builds on the HappyVertical SDK for foundational infrastructure.</p>
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
		border-bottom: 1px solid var(--color-grid);
	}

	.header h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.header p {
		font-size: 1.1rem;
		color: #666;
	}

	.section {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
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
	}

	.section-desc {
		color: #666;
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
		border-bottom: 1px solid var(--color-grid);
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
		background: #fafafa;
		padding-left: 12px;
		padding-right: 12px;
		margin-left: -12px;
		margin-right: -12px;
	}

	.package-link:hover code {
		color: var(--color-accent);
	}

	.package code {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 500;
		flex-shrink: 0;
		width: 250px;
		color: #1a1a1a;
	}

	.package span {
		font-size: 0.9rem;
		color: #666;
	}

	pre {
		background: #1a1a1a;
		color: #f0f0f0;
		padding: 20px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.6;
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
