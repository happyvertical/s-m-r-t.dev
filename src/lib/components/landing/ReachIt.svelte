<script lang="ts">
	/**
	 * "Reach it however you work — or however your agent works": the same
	 * Product, reached four ways. Each snippet is a plain string rendered in a
	 * <pre> (no Svelte brace escaping needed). The UI example uses a real
	 * exported smrt-svelte component (DataTable) rather than an invented one.
	 */
	type Lane = {
		key: string;
		label: string;
		who: string;
		lang: string;
		code: string;
	};

	const lanes: Lane[] = [
		{
			key: 'http',
			label: 'HTTP / API',
			who: 'for any client or service',
			lang: 'ts',
			code: `const res = await fetch('/api/products');
const products = await res.json();`
		},
		{
			key: 'cli',
			label: 'CLI',
			who: 'for scripts and humans',
			lang: 'sh',
			code: `$ smrt product:list
$ smrt product:create --name "Widget"`
		},
		{
			key: 'mcp',
			label: 'MCP',
			who: 'for an AI agent',
			lang: 'json',
			code: `// agent calls a generated tool
{ "tool": "product_list" }`
		},
		{
			key: 'ui',
			label: 'UI component',
			who: 'for your app',
			lang: 'svelte',
			code: `<DataTable collection={products} />`
		}
	];
</script>

<div class="lanes">
	{#each lanes as lane (lane.key)}
		<article class="lane lane--{lane.key}">
			<div class="lane-head">
				<span class="lane-label">{lane.label}</span>
				<span class="lane-who">{lane.who}</span>
			</div>
			<pre class="lane-body"><code>{lane.code}</code></pre>
		</article>
	{/each}
</div>

<style>
	.lanes {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.lane {
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: var(--smrt-radius-md, 8px);
		background: var(--smrt-color-surface, #fff);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.lane-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #eee);
		background: color-mix(in srgb, var(--smrt-color-surface-container, #f5f5f5) 50%, transparent);
	}

	.lane-label {
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.lane-who {
		font-size: 0.75rem;
		color: var(--smrt-color-on-surface-variant, #888);
	}

	.lane-body {
		margin: 0;
		padding: 16px;
		overflow-x: auto;
		flex: 1;
	}

	.lane-body code {
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-size: 0.82rem;
		line-height: 1.6;
		color: var(--smrt-color-on-surface, #1a1a1a);
		white-space: pre;
	}

	@media (max-width: 640px) {
		.lanes {
			grid-template-columns: 1fr;
		}
	}
</style>
