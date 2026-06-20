<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'data',
			type: 'T[]',
			default: '[]',
			description: 'Array of data items to display'
		},
		{
			name: 'columns',
			type: 'DataTableColumn<T>[]',
			default: '[]',
			description: 'Column definitions'
		},
		{
			name: 'rowKey',
			type: 'keyof T | ((row: T) => string | number)',
			default: 'undefined',
			description: 'Key extractor for row identity'
		},
		{
			name: 'selectable',
			type: 'boolean',
			default: 'false',
			description: 'Enable row selection'
		},
		{
			name: 'selected',
			type: 'Set<string | number>',
			default: 'new Set()',
			description: 'Set of selected row keys (bindable)'
		},
		{
			name: 'sortable',
			type: 'boolean',
			default: 'false',
			description: 'Enable column sorting'
		},
		{
			name: 'sort',
			type: 'SortState',
			default: '{ columnId: null, direction: null }',
			description: 'Current sort state (bindable)'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Show loading state'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Table size variant'
		},
		{
			name: 'striped',
			type: 'boolean',
			default: 'false',
			description: 'Enable alternating row colors'
		},
		{
			name: 'hoverable',
			type: 'boolean',
			default: 'true',
			description: 'Enable row hover effect'
		},
		{
			name: 'stickyHeader',
			type: 'boolean',
			default: 'false',
			description: 'Make header sticky on scroll'
		},
		{
			name: 'dense',
			type: 'boolean',
			default: 'false',
			description: 'Compact padding mode'
		}
	];
</script>

<svelte:head>
	<title>DataTable | s-m-r-t Data</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/data">Data</a>
		<span>/</span>
		<span>DataTable</span>
	</nav>

	<h1>DataTable</h1>
	<p class="lead">
		A flexible, accessible data table component with sorting, row selection, custom cell renderers,
		and Material 3 styling.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { DataTable } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Display data with column definitions.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { DataTable } from '@happyvertical/smrt-svelte';

  interface User {
    id: string;
    name: string;
    email: string;
  }

  const users: User[] = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' }
  ];

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' }
  ];
</script>

<DataTable data={users} columns={columns} rowKey="id" />`}
		language="svelte"
	/>

	<h2>Sortable Columns</h2>
	<p>Enable sorting on specific columns.</p>

	<CodeBlock
		code={`<script lang="ts">
  const columns = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'status', label: 'Status' }  // Not sortable
  ];

  let sort = $state({ columnId: null, direction: null });
</script>

<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  sortable
  bind:sort
  onSortChange={(newSort) => console.log('Sort:', newSort)}
/>`}
		language="svelte"
	/>

	<h2>Row Selection</h2>
	<p>Enable single or multi-select with checkboxes.</p>

	<CodeBlock
		code={`<script lang="ts">
  let selected = $state(new Set<string>());
</script>

<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  selectable
  bind:selected
  onSelectionChange={(newSelected) => {
    console.log('Selected:', [...newSelected]);
  }}
/>`}
		language="svelte"
	/>

	<h2>Custom Cell Rendering</h2>
	<p>Use snippets to customize cell content.</p>

	<CodeBlock
		code={`const columns = [
  { id: 'name', label: 'Name' },
  {
    id: 'status',
    label: 'Status',
    cell: ({ value }) => {
      return value === 'active'
        ? '<span class="badge-green">Active</span>'
        : '<span class="badge-gray">Inactive</span>';
    }
  }
];`}
		language="typescript"
	/>

	<h2>Loading and Empty States</h2>
	<p>Handle loading and empty data gracefully.</p>

	<CodeBlock
		code={`<DataTable
  data={loading ? [] : users}
  columns={columns}
  rowKey="id"
  loading={loading}
>
  {#snippet empty()}
    <div class="empty-state">
      <p>No users found</p>
      <button>Add User</button>
    </div>
  {/snippet}
</DataTable>`}
		language="svelte"
	/>

	<h2>Row Click Handler</h2>
	<p>Handle row clicks for navigation or details.</p>

	<CodeBlock
		code={`<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  onRowClick={(row, index) => {
    goto(\`/users/\${row.id}\`);
  }}
/>`}
		language="svelte"
	/>

	<h2>Styling Options</h2>
	<p>Configure appearance with props.</p>

	<CodeBlock
		code={`<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  size="sm"
  striped
  dense
  stickyHeader
/>`}
		language="svelte"
	/>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { DataTable } from '@happyvertical/smrt-svelte';
import type { DataTableColumn, SortState, SortDirection } from '@happyvertical/smrt-svelte';

interface DataTableColumn<T> {
  id: string;
  label: string;
  accessor?: string | keyof T;
  sortable?: boolean;
  sortFn?: (a: T, b: T, dir: SortDirection) => number;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
  className?: string;
  header?: Snippet<[{ column: DataTableColumn<T> }]>;
  cell?: Snippet<[{ row: T; value: unknown; index: number }]>;
}

interface SortState {
  columnId: string | null;
  direction: 'asc' | 'desc' | null;
}`}
		language="typescript"
	/>

	<h2>Accessibility</h2>
	<ul>
		<li>Semantic <code>&lt;table&gt;</code> structure</li>
		<li>Proper <code>scope</code> attributes on headers</li>
		<li>Keyboard navigation for clickable rows</li>
		<li><code>aria-sort</code> for sorted columns</li>
		<li>Checkbox labels for selection</li>
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
