<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const coreClasses = [
		{ name: 'SmrtObject', description: 'Base class for persistent entities with AI methods (is, do, describe)' },
		{ name: 'SmrtCollection', description: 'Collection manager for querying, CRUD, and batch operations' },
		{ name: 'ObjectRegistry', description: 'Runtime registry for class/field metadata (globalThis singleton)' },
		{ name: 'DispatchBus', description: 'Inter-agent asynchronous messaging with persistent subscriptions' },
		{ name: 'GlobalInterceptors', description: 'Plugin system for beforeList/Get/Save/Delete hooks' },
		{ name: 'SchemaComparer', description: 'Compares current vs. desired database schema' },
		{ name: 'ManifestManager', description: 'Reads, writes, and generates build-time manifests' }
	];

	const decorators = [
		{ name: '@smrt()', description: 'Register a class with the framework for code generation' },
		{ name: '@field()', description: 'Configure field constraints (required, unique, nullable, transient)' },
		{ name: '@meta()', description: 'Mark field for STI meta storage in _meta_data JSONB' },
		{ name: '@foreignKey()', description: 'Many-to-one relationship (same-package only)' },
		{ name: '@oneToMany()', description: 'One-to-many relationship (transient, no DB column)' },
		{ name: '@manyToMany()', description: 'Many-to-many via junction table (transient, no DB column)' }
	];

	const aiMethods = [
		{ name: 'is(criteria)', description: 'Send criteria string to the model, returns boolean' },
		{ name: 'do(instructions)', description: 'Send instruction string to the model, returns string' },
		{ name: 'describe(options?)', description: 'Generate a concise description, returns string' }
	];

	const objectMethods = [
		{ name: 'save()', description: 'Upsert with STI validation, interceptors, auto-embeddings' },
		{ name: 'delete()', description: 'Delete object from database' },
		{ name: 'initialize()', description: 'Load field initializers, apply options, load from DB' },
		{ name: 'loadRelated(field)', description: 'Lazy-load a foreignKey relationship (cached)' },
		{ name: 'loadRelatedMany(field)', description: 'Lazy-load a oneToMany relationship' },
		{ name: 'getSlug()', description: 'Auto-generate slug from name/title/label/id' },
		{ name: 'transformJSON(data)', description: 'Override point for custom JSON serialization' },
		{ name: 'generateEmbeddings(options?)', description: 'Compute embeddings for configured fields (Promise<void>)' },
		{ name: 'hasStaleEmbeddings()', description: 'Whether stored embeddings are out of date (Promise<boolean>)' },
		{ name: 'getEmbedding(field, model?)', description: 'Fetch a stored embedding vector (Promise<number[] | null>)' }
	];

	const collectionMethods = [
		{ name: 'create(options)', description: 'Static factory to create collection instance' },
		{ name: 'get(id|slug|filter)', description: 'Retrieve single object by ID, slug, or filter' },
		{ name: 'list(options)', description: 'Query with where, orderBy, limit, offset, include' },
		{ name: 'count(options)', description: 'Count objects matching criteria' },
		{ name: 'listByIds(ids)', description: 'Batch fetch multiple objects in a single query' },
		{ name: 'query(sql, params)', description: 'Execute raw SQL query' },
		{ name: 'getOrUpsert(match, defaults)', description: 'Get existing or create new object' }
	];

	const whereOperators = [
		{ name: '= (default)', description: "{ status: 'active' }" },
		{ name: '>, <, >=, <=', description: "{ 'price >': 100 }" },
		{ name: '!=', description: "{ 'status !=': 'archived' }" },
		{ name: 'in', description: "{ 'category in': ['A', 'B'] } or auto-detected from arrays" },
		{ name: 'not in', description: "{ 'status not in': ['archived', 'deleted'] }" },
		{ name: 'like', description: "{ 'name like': '%widget%' }" },
		{ name: 'contains', description: "{ 'tags contains': 'featured' } (JSON)" }
	];

	const dispatchMethods = [
		{ name: 'emit(type, payload, meta)', description: 'Emit an event to the dispatch queue' },
		{ name: 'subscribe(options)', description: 'Create persistent subscription (survives restarts)' },
		{ name: 'on(pattern, handler)', description: 'In-memory handler (immediate, fire-and-forget)' },
		{ name: 'process(subscriber, handler)', description: 'Process pending dispatches for subscriber' },
		{ name: 'retry(options)', description: 'Reset failed dispatches for retry' },
		{ name: 'cleanup(options)', description: 'Delete old completed/failed dispatches' },
		{ name: 'list(filters)', description: 'Query dispatches with status/source/type filters' }
	];

	const agentExports = [
		{ name: 'Agent', description: 'Base agent class with lifecycle, dispatch, interests' },
		{ name: 'AgentConfig', description: 'DB-persisted agent configuration model' },
		{ name: 'AgentSchedule', description: 'Cron-based schedule model (_smrt_agent_schedules)' },
		{ name: 'TenantAgent', description: 'Agent-to-tenant junction with hierarchy resolution' },
		{ name: 'AgentUIRegistry', description: 'Singleton registry for agent admin panels (from /ui)' }
	];

	const cliCommands = [
		{ name: 'smrt introspect', description: 'Discover SMRT objects in project' },
		{ name: 'smrt db:status', description: 'Show pending schema changes' },
		{ name: 'smrt db:migrate', description: 'Apply migrations' },
		{ name: 'smrt db:diff --generate', description: 'Generate migration from changes' },
		{ name: 'smrt db:rollback', description: 'Rollback migrations' },
		{ name: 'smrt docs:agents', description: 'Generate AGENTS.md (docs:claude is a deprecated alias)' },
		{ name: 'smrt generate:mcp', description: 'Generate MCP server' },
		{ name: 'smrt config:export', description: 'Export agent config for SSG' },
		{ name: 'smrt dispatch:*', description: 'Dispatch management (list/process/retry/cleanup)' }
	];
</script>

<svelte:head>
	<title>API Reference | s-m-r-t</title>
</svelte:head>

<Grid>
	<div class="header">
		<h1>API Reference</h1>
		<p>Quick reference for SMRT framework APIs. See documentation for detailed usage.</p>
	</div>

	<section class="section">
		<h2>Core Classes</h2>
		<div class="items">
			{#each coreClasses as item}
				<div class="item">
					<code>{item.name}</code>
					<span>{item.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>Decorators</h2>
		<div class="items">
			{#each decorators as item}
				<div class="item">
					<code>{item.name}</code>
					<span>{item.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>AI Methods (SmrtObject)</h2>
		<div class="items">
			{#each aiMethods as item}
				<div class="item">
					<code>{item.name}</code>
					<span>{item.description}</span>
				</div>
			{/each}
		</div>
		<Callout variant="warning" title="These methods send your prompt, not the object">
			<code>is()</code>, <code>do()</code>, and <code>describe()</code> pass only your
			criteria/instruction string to the model. The object's field data is not serialized into the
			prompt, so include any values you want the model to consider directly in the text you pass.
		</Callout>
	</section>

	<section class="section">
		<h2>Object Methods (SmrtObject)</h2>
		<div class="items">
			{#each objectMethods as item}
				<div class="item">
					<code>{item.name}</code>
					<span>{item.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>Collection Methods (SmrtCollection)</h2>
		<div class="items">
			{#each collectionMethods as item}
				<div class="item">
					<code>{item.name}</code>
					<span>{item.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>WHERE Operators</h2>
		<p class="section-desc">String operators in the field key. Arrays auto-detect as IN.</p>
		<div class="items">
			{#each whereOperators as item}
				<div class="item">
					<code>{item.name}</code>
					<span>{item.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>DispatchBus Methods</h2>
		<div class="items">
			{#each dispatchMethods as item}
				<div class="item">
					<code>{item.name}</code>
					<span>{item.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>Agent Exports</h2>
		<div class="items">
			{#each agentExports as item}
				<div class="item">
					<code>{item.name}</code>
					<span>{item.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>CLI Commands</h2>
		<div class="items">
			{#each cliCommands as item}
				<div class="item">
					<code>{item.name}</code>
					<span>{item.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>Internal Tables</h2>
		<div class="items">
			<div class="item">
				<code>_smrt_migrations</code>
				<span>Framework schema version tracking</span>
			</div>
			<div class="item">
				<code>_smrt_schema_migrations</code>
				<span>User schema migration tracking</span>
			</div>
			<div class="item">
				<code>_smrt_registry</code>
				<span>Object metadata persistence</span>
			</div>
			<div class="item">
				<code>_smrt_contexts</code>
				<span>Remembered context and learned patterns</span>
			</div>
			<div class="item">
				<code>_smrt_embeddings</code>
				<span>Vector embeddings for semantic search</span>
			</div>
			<div class="item">
				<code>_smrt_dispatch</code>
				<span>Inter-agent dispatch queue</span>
			</div>
			<div class="item">
				<code>_smrt_dispatch_subscriptions</code>
				<span>Persistent dispatch subscriptions</span>
			</div>
			<div class="item">
				<code>_smrt_signals</code>
				<span>Signal history audit log</span>
			</div>
			<div class="item">
				<code>_smrt_agent_schedules</code>
				<span>Cron-based agent schedule definitions</span>
			</div>
		</div>
	</section>

	<section class="section last">
		<h2>TypeDoc Reference</h2>
		<p>Full API documentation is generated from source with TypeDoc.</p>
		<p>
			<a href="https://github.com/happyvertical/smrt" target="_blank" rel="noopener"
				>View on GitHub &rarr;</a
			>
		</p>
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
		margin-bottom: 16px;
	}

	.section-desc {
		color: #666;
		margin-bottom: 16px;
	}

	.items {
		display: flex;
		flex-direction: column;
	}

	.item {
		display: flex;
		gap: 24px;
		padding: 12px 0;
		border-bottom: 1px solid var(--color-grid);
		align-items: baseline;
	}

	.item:last-child {
		border-bottom: none;
	}

	.item code {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 500;
		flex-shrink: 0;
		width: 260px;
		background: #f5f5f5;
		padding: 2px 8px;
	}

	.item span {
		font-size: 0.9rem;
		color: #666;
	}

	a {
		color: var(--color-accent);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	@media (max-width: 700px) {
		.item {
			flex-direction: column;
			gap: 4px;
		}

		.item code {
			width: auto;
		}
	}
</style>
