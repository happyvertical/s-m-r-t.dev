<script lang="ts">
	import { InvoiceCard } from '@happyvertical/smrt-commerce/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const mockInvoice = {
		id: 'inv_001',
		invoiceNumber: 'INV-2025-001',
		customerName: 'Acme Corp',
		total: 125000,
		status: 'sent',
		dueDate: new Date('2025-02-15')
	} as any;

	const props = [
		{ name: 'invoice', type: 'Invoice', description: 'Invoice object', required: true },
		{ name: 'onclick', type: '() => void', description: 'Click handler' }
	];
</script>

<svelte:head>
	<title>InvoiceCard | s-m-r-t Commerce</title>
</svelte:head>

<article class="prose">
	<h1>InvoiceCard</h1>
	<p class="lead">Display invoice summary in card format with status badge.</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { InvoiceCard } from '@happyvertical/smrt-commerce/svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<ComponentExample code={`<InvoiceCard invoice={invoice} />`}>
		<InvoiceCard invoice={mockInvoice} />
	</ComponentExample>

	<h2>With Click Handler</h2>
	<ComponentExample
		code={`<InvoiceCard invoice={invoice} onclick={() => goto(\`/invoices/\${invoice.id}\`)} />`}
	>
		<InvoiceCard invoice={mockInvoice} onclick={() => alert('Clicked invoice')} />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable {props} />
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
	.prose p {
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
	}
</style>
