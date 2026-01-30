<script lang="ts">
	import { InvoiceHeader } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
</script>

<svelte:head><title>InvoiceHeader | s-m-r-t</title></svelte:head>

<article class="prose">
	<h1>InvoiceHeader</h1>
	<p class="lead">Invoice header displaying company info, logo, and invoice number.</p>
	<h2>Installation</h2>
	<CodeBlock code={`import { InvoiceHeader } from '@happyvertical/smrt-svelte';`} language="typescript" />
	<h2>Usage</h2>
	<CodeBlock code={`<InvoiceHeader invoice={invoice} company={company} />`} language="svelte" />
</article>

<style>
	.prose h1 { font-size: 2rem; font-weight: 600; margin-bottom: 16px; }
	.prose .lead { font-size: 1.1rem; color: #666; margin-bottom: 48px; padding-bottom: 48px; border-bottom: 1px solid #e5e5e5; }
	.prose h2 { font-size: 1.25rem; font-weight: 600; margin-top: 48px; margin-bottom: 16px; }
</style>
