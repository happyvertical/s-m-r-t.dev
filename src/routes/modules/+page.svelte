<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';

	const foundation = [
		{ name: '@smrt/types', description: 'Shared TypeScript type definitions' },
		{ name: '@smrt/config', description: 'Configuration management with cosmiconfig' },
		{ name: '@smrt/core', description: 'Core framework with ORM, code generation, AI integration' },
		{ name: '@smrt/cli', description: 'CLI generator and runtime' }
	];

	const domain = [
		{ name: '@smrt/profiles', description: 'Profile and organization models with relationships' },
		{ name: '@smrt/events', description: 'Event management with participants and hierarchies' },
		{ name: '@smrt/content', description: 'Content processing and management' },
		{ name: '@smrt/assets', description: 'Asset management with versioning and metadata' },
		{ name: '@smrt/agents', description: 'Agent framework for autonomous actors' },
		{ name: '@smrt/places', description: 'Place management with geo integration' },
		{ name: '@smrt/tags', description: 'Hierarchical tagging system' },
		{ name: '@smrt/products', description: 'Product catalog and microservice template' },
		{ name: '@smrt/projects', description: 'Project management' },
		{ name: '@smrt/messages', description: 'Messaging system' }
	];

	const business = [
		{ name: '@smrt/commerce', description: 'E-commerce functionality' },
		{ name: '@smrt/ledgers', description: 'Financial ledger management' },
		{ name: '@smrt/ads', description: 'Advertising/promotion system' },
		{ name: '@smrt/properties', description: 'Property/real estate management' }
	];

	const infrastructure = [
		{ name: '@smrt/gnode', description: 'Federation library for local knowledge bases' },
		{ name: '@smrt/dev-mcp', description: 'Development MCP server for code generation' },
		{ name: '@smrt/vitest', description: 'Vitest configuration and utilities' },
		{ name: '@smrt/svelte', description: 'Svelte 5 component library' }
	];
</script>

<svelte:head>
	<title>Modules | s-m-r-t</title>
</svelte:head>

<Grid>
	<div class="header">
		<h1>Modules</h1>
		<p>SMRT packages organized by purpose. Mix and match based on your needs.</p>
	</div>

	<section class="section">
		<h2>Foundation</h2>
		<p class="section-desc">Core packages required for any SMRT application.</p>
		<div class="packages">
			{#each foundation as pkg}
				<div class="package">
					<code>{pkg.name}</code>
					<span>{pkg.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>Domain Modules</h2>
		<p class="section-desc">Pre-built domain models for common use cases.</p>
		<div class="packages">
			{#each domain as pkg}
				<div class="package">
					<code>{pkg.name}</code>
					<span>{pkg.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>Business</h2>
		<p class="section-desc">Specialized business logic packages.</p>
		<div class="packages">
			{#each business as pkg}
				<div class="package">
					<code>{pkg.name}</code>
					<span>{pkg.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>Infrastructure</h2>
		<p class="section-desc">Development tools and runtime support.</p>
		<div class="packages">
			{#each infrastructure as pkg}
				<div class="package">
					<code>{pkg.name}</code>
					<span>{pkg.description}</span>
				</div>
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

	.package code {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 500;
		flex-shrink: 0;
		width: 200px;
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
