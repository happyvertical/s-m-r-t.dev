<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';

	const coreClasses = [
		{ name: 'SmrtObject', description: 'Base class for persistent entities with AI methods' },
		{ name: 'SmrtCollection', description: 'Collection manager for querying and batch operations' },
		{ name: 'ObjectRegistry', description: 'Runtime registry for object metadata' },
		{ name: 'DispatchBus', description: 'Inter-agent asynchronous messaging' },
		{ name: 'MigrationTracker', description: 'Database migration management' }
	];

	const decorators = [
		{ name: '@smrt()', description: 'Register a class with the framework' },
		{ name: '@field()', description: 'Configure field constraints and validation' },
		{ name: '@meta()', description: 'Mark field for STI meta storage' },
		{ name: 'foreignKey()', description: 'Define many-to-one relationship' },
		{ name: 'oneToMany()', description: 'Define one-to-many relationship' },
		{ name: 'manyToMany()', description: 'Define many-to-many relationship' }
	];

	const aiMethods = [
		{ name: 'is()', description: 'Evaluate criteria against object, returns boolean' },
		{ name: 'do()', description: 'Perform action based on instructions, returns string' },
		{ name: 'describe()', description: 'Generate description of object' }
	];

	const collectionMethods = [
		{ name: 'create()', description: 'Static factory to create collection instance' },
		{ name: 'get()', description: 'Retrieve single object by ID, slug, or filter' },
		{ name: 'list()', description: 'Query objects with filtering, sorting, pagination' },
		{ name: 'count()', description: 'Count objects matching criteria' },
		{ name: 'listByIds()', description: 'Batch fetch multiple objects by ID' },
		{ name: 'query()', description: 'Execute raw SQL query' },
		{ name: 'getOrUpsert()', description: 'Get existing or create new object' }
	];

	const dispatchMethods = [
		{ name: 'emit()', description: 'Emit an event to the dispatch queue' },
		{ name: 'subscribe()', description: 'Create persistent subscription' },
		{ name: 'process()', description: 'Process pending dispatches for subscriber' },
		{ name: 'retry()', description: 'Reset failed dispatches for retry' },
		{ name: 'cleanup()', description: 'Delete old dispatches' }
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
		<h2>Decorators & Helpers</h2>
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
		<h2>AI Methods</h2>
		<p class="section-desc">Available on all SmrtObject instances.</p>
		<div class="items">
			{#each aiMethods as item}
				<div class="item">
					<code>{item.name}</code>
					<span>{item.description}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>Collection Methods</h2>
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
		width: 220px;
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
