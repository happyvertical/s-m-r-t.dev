<script lang="ts">
	import { Masthead } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const mastheadProps = [
		{
			name: 'date',
			type: 'string',
			default: 'Current date',
			description: 'Date to display in center'
		},
		{
			name: 'dateHref',
			type: 'string',
			description: 'URL for the date link'
		},
		{
			name: 'location',
			type: 'string',
			default: "''",
			description: 'Location label on the left'
		},
		{
			name: 'locationHref',
			type: 'string',
			default: "'/'",
			description: 'URL for location link'
		},
		{
			name: 'nav',
			type: 'Snippet',
			description: 'Navigation content for desktop'
		},
		{
			name: 'mobileNav',
			type: 'Snippet',
			description: 'Navigation content for mobile (optional)'
		}
	];
</script>

<svelte:head>
	<title>Masthead | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/layout">Layout</a>
		<span>/</span>
		<span>Masthead</span>
	</nav>

	<h1>Masthead</h1>
	<p class="lead">
		Subheader component for news-style layouts. Shows location, date, and navigation with responsive
		desktop/mobile layouts.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { Masthead } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Simple masthead with date (defaults to current date).</p>

	<ComponentExample code={`<Masthead />`}>
		<Masthead />
	</ComponentExample>

	<h2>With Location</h2>
	<p>Add a location label on the left side.</p>

	<ComponentExample
		code={`<Masthead
  location="San Francisco"
  locationHref="/sf"
/>`}
	>
		<Masthead location="San Francisco" locationHref="/sf" />
	</ComponentExample>

	<h2>With Navigation</h2>
	<p>Add navigation links on the right side.</p>

	<ComponentExample
		code={`<Masthead location="Toronto">
  {#snippet nav()}
    <a href="/news">News</a>
    <a href="/events">Events</a>
    <a href="/about">About</a>
  {/snippet}
</Masthead>`}
	>
		<Masthead location="Toronto">
			{#snippet nav()}
				<a href="/news">News</a>
				<a href="/events">Events</a>
				<a href="/about">About</a>
			{/snippet}
		</Masthead>
	</ComponentExample>

	<h2>Custom Date</h2>
	<p>Override the date display.</p>

	<ComponentExample
		code={`<Masthead
  date="January 15, 2025"
  dateHref="/archive/2025/01/15"
  location="New York"
/>`}
	>
		<Masthead date="January 15, 2025" dateHref="/archive/2025/01/15" location="New York" />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={mastheadProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Masthead } from '@happyvertical/smrt-svelte';

interface Props {
  date?: string;
  dateHref?: string;
  location?: string;
  locationHref?: string;
  nav?: Snippet;
  mobileNav?: Snippet;
}`}
		language="typescript"
	/>

	<h2>Responsive Behavior</h2>
	<p>
		On mobile, the masthead shows a home icon on the left and icon-based navigation on the right.
		Use <code>mobileNav</code> to provide mobile-specific navigation with icons.
	</p>
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

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}
</style>
