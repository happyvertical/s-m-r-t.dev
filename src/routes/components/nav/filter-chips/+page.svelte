<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'options',
			type: 'FilterOption[]',
			required: true,
			description: 'Available filter options'
		},
		{
			name: 'selected',
			type: 'string',
			required: true,
			description: 'Currently selected value'
		},
		{
			name: 'onchange',
			type: '(value: string) => void',
			default: 'undefined',
			description: 'Callback when selection changes'
		},
		{
			name: 'size',
			type: "'sm' | 'md'",
			default: "'md'",
			description: 'Chip size variant'
		},
		{
			name: 'showAll',
			type: 'boolean',
			default: 'false',
			description: 'Show an "All" option'
		},
		{
			name: 'allLabel',
			type: 'string',
			default: "'All'",
			description: 'Label for the all option'
		}
	];
</script>

<svelte:head>
	<title>FilterChips | s-m-r-t Navigation</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/nav">Navigation</a>
		<span>/</span>
		<span>FilterChips</span>
	</nav>

	<h1>FilterChips</h1>
	<p class="lead">
		Material 3 styled filter chips for filtering lists. Supports optional counts, "All" option, and
		size variants.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { FilterChips } from '@happyvertical/smrt-ui';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Simple filter selection with controlled state.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { FilterChips } from '@happyvertical/smrt-ui';

  const options = [
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  let selected = $state('pending');
</script>

<FilterChips
  options={options}
  selected={selected}
  onchange={(value) => selected = value}
/>`}
		language="svelte"
	/>

	<h2>With Counts</h2>
	<p>Display item counts next to filter labels.</p>

	<CodeBlock
		code={`const options = [
  { value: 'pending', label: 'Pending', count: 12 },
  { value: 'active', label: 'Active', count: 34 },
  { value: 'completed', label: 'Completed', count: 89 }
];`}
		language="typescript"
	/>

	<h2>With "All" Option</h2>
	<p>Add an "All" option that sums counts automatically.</p>

	<CodeBlock
		code={`<FilterChips
  options={options}
  selected={selected}
  showAll
  allLabel="All Items"
  onchange={(value) => selected = value}
/>`}
		language="svelte"
	/>

	<h2>Size Variants</h2>
	<p>Two sizes available: small and medium (default).</p>

	<CodeBlock
		code={`<FilterChips options={options} {selected} size="sm" />
<FilterChips options={options} {selected} size="md" />`}
		language="svelte"
	/>

	<h2>Disabled Options</h2>
	<p>Mark individual options as disabled.</p>

	<CodeBlock
		code={`const options = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived', disabled: true }
];`}
		language="typescript"
	/>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { FilterChips } from '@happyvertical/smrt-ui';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface Props {
  options: FilterOption[];
  selected: string;
  onchange?: (value: string) => void;
  size?: 'sm' | 'md';
  showAll?: boolean;
  allLabel?: string;
}`}
		language="typescript"
	/>

	<h2>Accessibility</h2>
	<ul>
		<li>Uses <code>role="radiogroup"</code> and <code>role="radio"</code></li>
		<li>Supports <code>aria-checked</code> for active state</li>
		<li>Active chip shows checkmark icon</li>
		<li>Keyboard navigation supported</li>
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
