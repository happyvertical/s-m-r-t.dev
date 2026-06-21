<script lang="ts">
	import { Pagination } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const paginationProps = [
		{
			name: 'currentPage',
			type: 'number',
			description: 'Current active page (1-indexed)',
			required: true
		},
		{
			name: 'totalPages',
			type: 'number',
			description: 'Total number of pages',
			required: true
		},
		{
			name: 'baseUrl',
			type: 'string',
			default: "'/articles'",
			description: 'Base URL for pagination links (link mode)'
		},
		{
			name: 'onPageChange',
			type: '(page: number) => void',
			description: 'When provided, renders buttons instead of links and calls this on page change'
		},
		{
			name: 'showFirstLast',
			type: 'boolean',
			description: 'Show first/last page buttons'
		},
		{
			name: 'maxVisible',
			type: 'number',
			description: 'Maximum number of visible page numbers'
		},
		{
			name: 'aria-label',
			type: 'string',
			description: 'Accessible label for the pagination nav'
		}
	];
</script>

<svelte:head>
	<title>Pagination | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ui">UI</a>
		<span>/</span>
		<span>Pagination</span>
	</nav>

	<h1>Pagination</h1>
	<p class="lead">
		Page navigation controls with intelligent ellipsis handling. Automatically generates page
		numbers based on the current page and total pages.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { Pagination } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Simple pagination with current page highlighted.</p>

	<ComponentExample code={`<Pagination currentPage={1} totalPages={5} />`}>
		<Pagination currentPage={1} totalPages={5} />
	</ComponentExample>

	<h2>Middle Page</h2>
	<p>Navigation centered around the current page.</p>

	<ComponentExample code={`<Pagination currentPage={3} totalPages={5} />`}>
		<Pagination currentPage={3} totalPages={5} />
	</ComponentExample>

	<h2>Last Page</h2>
	<p>Next button disabled when on the last page.</p>

	<ComponentExample code={`<Pagination currentPage={5} totalPages={5} />`}>
		<Pagination currentPage={5} totalPages={5} />
	</ComponentExample>

	<h2>Many Pages (with Ellipsis)</h2>
	<p>For many pages, ellipsis are shown to indicate hidden pages.</p>

	<ComponentExample code={`<Pagination currentPage={5} totalPages={20} />`}>
		<Pagination currentPage={5} totalPages={20} />
	</ComponentExample>

	<h2>Near Start</h2>
	<p>Ellipsis positioning when near the beginning.</p>

	<ComponentExample code={`<Pagination currentPage={2} totalPages={20} />`}>
		<Pagination currentPage={2} totalPages={20} />
	</ComponentExample>

	<h2>Near End</h2>
	<p>Ellipsis positioning when near the end.</p>

	<ComponentExample code={`<Pagination currentPage={19} totalPages={20} />`}>
		<Pagination currentPage={19} totalPages={20} />
	</ComponentExample>

	<h2>Custom Base URL</h2>
	<p>Specify a custom base URL for the pagination links.</p>

	<ComponentExample
		code={`<Pagination
  currentPage={1}
  totalPages={10}
  baseUrl="/products"
/>`}
	>
		<Pagination currentPage={1} totalPages={10} baseUrl="/products" />
	</ComponentExample>

	<h2>URL Structure</h2>
	<p>The pagination component generates URLs as follows:</p>
	<ul>
		<li>Page 1: <code>/baseUrl</code></li>
		<li>Page 2+: <code>/baseUrl/page/2</code>, <code>/baseUrl/page/3</code>, etc.</li>
	</ul>

	<h2>Props</h2>
	<PropsTable props={paginationProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Pagination } from '@happyvertical/smrt-svelte';

interface Props {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  onPageChange?: (page: number) => void;
  showFirstLast?: boolean;
  maxVisible?: number;
  'aria-label'?: string;
}`}
		language="typescript"
	/>

	<h2>Accessibility</h2>
	<p>The pagination component includes:</p>
	<ul>
		<li><code>aria-label="Pagination"</code> on the nav element</li>
		<li><code>aria-current="page"</code> on the current page</li>
		<li><code>aria-label</code> on prev/next links</li>
		<li>Disabled buttons are marked with <code>aria-hidden</code></li>
	</ul>
</article>

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: #666;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--color-accent);
	}

	.breadcrumb span:not(:last-child) {
		color: #ccc;
	}

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
		border-bottom: 1px solid var(--color-grid);
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

	.prose ul {
		color: #666;
		margin-bottom: 16px;
		padding-left: 24px;
	}

	.prose li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}
</style>
