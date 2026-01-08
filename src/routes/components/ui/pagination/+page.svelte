<script lang="ts">
	import { Pagination } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let currentPage = $state(1);

	const paginationProps = [
		{
			name: 'currentPage',
			type: 'number',
			description: 'The currently active page (1-indexed)',
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
			description: 'Base URL for pagination links'
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
		A navigation component for paginated content. Automatically handles page number display,
		ellipsis for large page counts, and previous/next navigation.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Pagination } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Provide the current page and total pages.</p>

	<ComponentExample
		code={`<Pagination currentPage={1} totalPages={5} baseUrl="/blog" />`}
	>
		<Pagination currentPage={1} totalPages={5} baseUrl="/blog" />
	</ComponentExample>

	<h2>Middle Page</h2>
	<p>Navigation shows pages around the current page.</p>

	<ComponentExample
		code={`<Pagination currentPage={3} totalPages={5} baseUrl="/blog" />`}
	>
		<Pagination currentPage={3} totalPages={5} baseUrl="/blog" />
	</ComponentExample>

	<h2>Last Page</h2>
	<p>Next button is disabled on the last page.</p>

	<ComponentExample
		code={`<Pagination currentPage={5} totalPages={5} baseUrl="/blog" />`}
	>
		<Pagination currentPage={5} totalPages={5} baseUrl="/blog" />
	</ComponentExample>

	<h2>Many Pages (with Ellipsis)</h2>
	<p>When there are many pages, ellipsis (...) indicates hidden page numbers.</p>

	<ComponentExample
		code={`<!-- Near the start -->
<Pagination currentPage={2} totalPages={20} baseUrl="/articles" />

<!-- In the middle -->
<Pagination currentPage={10} totalPages={20} baseUrl="/articles" />

<!-- Near the end -->
<Pagination currentPage={19} totalPages={20} baseUrl="/articles" />`}
	>
		<div class="pagination-stack">
			<div>
				<p class="pagination-label">Near the start (page 2 of 20):</p>
				<Pagination currentPage={2} totalPages={20} baseUrl="/articles" />
			</div>
			<div>
				<p class="pagination-label">In the middle (page 10 of 20):</p>
				<Pagination currentPage={10} totalPages={20} baseUrl="/articles" />
			</div>
			<div>
				<p class="pagination-label">Near the end (page 19 of 20):</p>
				<Pagination currentPage={19} totalPages={20} baseUrl="/articles" />
			</div>
		</div>
	</ComponentExample>

	<h2>Few Pages</h2>
	<p>All page numbers are shown when there are fewer pages.</p>

	<ComponentExample
		code={`<Pagination currentPage={1} totalPages={3} baseUrl="/posts" />`}
	>
		<Pagination currentPage={1} totalPages={3} baseUrl="/posts" />
	</ComponentExample>

	<h2>Single Page</h2>
	<p>Pagination is hidden when there is only one page.</p>

	<ComponentExample
		code={`<Pagination currentPage={1} totalPages={1} baseUrl="/posts" />
<!-- Nothing renders -->`}
	>
		<div class="single-page-note">
			<Pagination currentPage={1} totalPages={1} baseUrl="/posts" />
			<p class="note">(Pagination is hidden when totalPages is 1)</p>
		</div>
	</ComponentExample>

	<h2>Custom Base URL</h2>
	<p>Configure the base URL for pagination links. Page 1 links to <code>baseUrl</code>, other pages link to <code>baseUrl/page/N</code>.</p>

	<ComponentExample
		code={`<!-- Links: /products, /products/page/2, /products/page/3 -->
<Pagination currentPage={1} totalPages={10} baseUrl="/products" />

<!-- Links: /blog/posts, /blog/posts/page/2 -->
<Pagination currentPage={2} totalPages={5} baseUrl="/blog/posts" />`}
	>
		<div class="pagination-stack">
			<div>
				<p class="pagination-label">Products:</p>
				<Pagination currentPage={1} totalPages={10} baseUrl="/products" />
			</div>
			<div>
				<p class="pagination-label">Blog posts:</p>
				<Pagination currentPage={2} totalPages={5} baseUrl="/blog/posts" />
			</div>
		</div>
	</ComponentExample>

	<h2>URL Structure</h2>
	<p>The component generates the following URL patterns:</p>
	<ul>
		<li><code>Page 1:</code> <code>/baseUrl</code> (or just <code>/</code> if baseUrl is empty)</li>
		<li><code>Page 2+:</code> <code>/baseUrl/page/N</code></li>
	</ul>

	<CodeBlock
		code={`// With baseUrl="/articles"
// Page 1: /articles
// Page 2: /articles/page/2
// Page 3: /articles/page/3

// With baseUrl="/blog/posts"
// Page 1: /blog/posts
// Page 2: /blog/posts/page/2`}
		language="typescript"
	/>

	<h2>Props</h2>
	<PropsTable props={paginationProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`interface Props {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}`}
		language="typescript"
	/>

	<h2>Accessibility</h2>
	<p>The Pagination component includes these accessibility features:</p>
	<ul>
		<li><code>aria-label="Pagination"</code> on the nav element</li>
		<li><code>aria-current="page"</code> on the current page</li>
		<li><code>aria-label</code> on prev/next links for screen readers</li>
		<li><code>aria-hidden="true"</code> on decorative ellipsis</li>
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

	.pagination-stack {
		display: flex;
		flex-direction: column;
		gap: 24px;
		width: 100%;
	}

	.pagination-label {
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 8px;
	}

	.single-page-note {
		text-align: center;
	}

	.note {
		font-size: 0.85rem;
		color: #999;
		font-style: italic;
	}
</style>
