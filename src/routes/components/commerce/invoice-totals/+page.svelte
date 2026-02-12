<script lang="ts">
	import { InvoiceTotals } from '@happyvertical/smrt-commerce/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head><title>InvoiceTotals | s-m-r-t</title></svelte:head>

<article class="prose">
	<h1>InvoiceTotals</h1>
	<p class="lead">Display subtotal, tax, discounts, and total with automatic calculations.</p>
	<h2>Installation</h2>
	<CodeBlock
		code={`import { InvoiceTotals } from '@happyvertical/smrt-commerce/svelte';`}
		language="typescript"
	/>
	<h2>Usage</h2>
	<CodeBlock code={`<InvoiceTotals invoice={invoice} />`} language="svelte" />
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
