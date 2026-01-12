<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>Commerce Components | SMRT</title>
	<meta name="description" content="Invoice and billing components for commerce workflows." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-4">Commerce Components</h1>
	<p class="text-xl text-gray-600 mb-8">
		Comprehensive invoice and billing components from smrt-commerce module.
	</p>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
		<a href="/components/commerce/invoice-card" class="block p-6 border rounded hover:border-blue-500 transition">
			<h3 class="text-xl font-semibold mb-2">InvoiceCard</h3>
			<p class="text-gray-600">Display invoice summary in card format</p>
		</a>
		<a href="/components/commerce/invoice-header" class="block p-6 border rounded hover:border-blue-500 transition">
			<h3 class="text-xl font-semibold mb-2">InvoiceHeader</h3>
			<p class="text-gray-600">Invoice header with company info and invoice number</p>
		</a>
		<a href="/components/commerce/invoice-line-items" class="block p-6 border rounded hover:border-blue-500 transition">
			<h3 class="text-xl font-semibold mb-2">InvoiceLineItems</h3>
			<p class="text-gray-600">Editable line items table with calculations</p>
		</a>
		<a href="/components/commerce/invoice-totals" class="block p-6 border rounded hover:border-blue-500 transition">
			<h3 class="text-xl font-semibold mb-2">InvoiceTotals</h3>
			<p class="text-gray-600">Subtotal, tax, and total calculations</p>
		</a>
		<a href="/components/commerce/invoice-actions" class="block p-6 border rounded hover:border-blue-500 transition">
			<h3 class="text-xl font-semibold mb-2">InvoiceActions</h3>
			<p class="text-gray-600">Send, print, mark paid actions</p>
		</a>
		<a href="/components/commerce/unbilled-items" class="block p-6 border rounded hover:border-blue-500 transition">
			<h3 class="text-xl font-semibold mb-2">UnbilledItems</h3>
			<p class="text-gray-600">List of items awaiting invoice</p>
		</a>
	</div>

	<section class="mb-12">
		<h2 class="text-2xl font-bold mb-4">Usage Example</h2>
		<CodeBlock
			code={`import {
  InvoiceCard,
  InvoiceHeader,
  InvoiceLineItems,
  InvoiceTotals,
  InvoiceActions
} from '@happyvertical/smrt-svelte';

<!-- Full invoice view -->
<InvoiceHeader {invoice} />
<InvoiceLineItems bind:items={invoice.lineItems} />
<InvoiceTotals {invoice} />
<InvoiceActions {invoice} onsend={sendInvoice} />`}
			language="typescript"
		/>
	</section>

	<section>
		<h2 class="text-2xl font-bold mb-4">Related Module</h2>
		<a href="/modules/smrt-commerce" class="text-blue-600 hover:underline">
			→ See smrt-commerce module documentation
		</a>
	</section>
</div>
