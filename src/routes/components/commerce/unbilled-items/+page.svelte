<script lang="ts">
	import { UnbilledItems } from '@happyvertical/smrt-commerce/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head><title>UnbilledItems | s-m-r-t</title></svelte:head>

<article class="prose">
	<h1>UnbilledItems</h1>
	<p class="lead">List of unbilled time entries, expenses, and items awaiting invoice creation.</p>
	<h2>Installation</h2>
	<CodeBlock
		code={`import { UnbilledItems } from '@happyvertical/smrt-commerce/svelte';`}
		language="typescript"
	/>
	<h2>Usage</h2>
	<CodeBlock
		code={`<UnbilledItems items={unbilledItems} oncreate={createInvoice} />`}
		language="svelte"
	/>
</article>

<style>
	.prose h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 16px;
	}
	.prose .lead {
		font-size: 1.1rem;
		color: #666;
		margin-bottom: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid #e5e5e5;
	}
	.prose h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
	}
</style>
