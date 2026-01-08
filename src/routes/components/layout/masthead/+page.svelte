<script lang="ts">
	import { Masthead } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const mastheadProps = [
		{
			name: 'date',
			type: 'string',
			default: 'Current date formatted',
			description: 'Date string to display'
		},
		{
			name: 'dateHref',
			type: 'string',
			description: 'Optional link for the date'
		},
		{
			name: 'location',
			type: 'string',
			default: "''",
			description: 'Location label (displayed uppercase)'
		},
		{
			name: 'locationHref',
			type: 'string',
			default: "'/'",
			description: 'Link for the location'
		},
		{
			name: 'nav',
			type: 'Snippet',
			description: 'Desktop navigation slot'
		},
		{
			name: 'mobileNav',
			type: 'Snippet',
			description: 'Mobile navigation slot (icons recommended)'
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
		A newspaper-style subheader with location, date, and navigation. Features separate desktop and
		mobile layouts with automatic responsive switching at 640px.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Masthead } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display a date-centered masthead with location and navigation.</p>

	<ComponentExample
		code={`<Masthead location="New York" locationHref="/">
  {#snippet nav()}
    <a href="/news">News</a>
    <a href="/events">Events</a>
    <a href="/about">About</a>
  {/snippet}
</Masthead>`}
	>
		<div class="masthead-demo">
			<Masthead location="New York" locationHref="/">
				{#snippet nav()}
					<a href="/news">News</a>
					<a href="/events">Events</a>
					<a href="/about">About</a>
				{/snippet}
			</Masthead>
		</div>
	</ComponentExample>

	<h2>With Custom Date</h2>
	<p>Override the default date display.</p>

	<ComponentExample
		code={`<Masthead
  location="Boston"
  date="Wednesday, January 1, 2025"
  dateHref="/archive"
>
  {#snippet nav()}
    <a href="/local">Local</a>
    <a href="/sports">Sports</a>
  {/snippet}
</Masthead>`}
	>
		<div class="masthead-demo">
			<Masthead location="Boston" date="Wednesday, January 1, 2025" dateHref="/archive">
				{#snippet nav()}
					<a href="/local">Local</a>
					<a href="/sports">Sports</a>
				{/snippet}
			</Masthead>
		</div>
	</ComponentExample>

	<h2>With Mobile Navigation</h2>
	<p>
		Provide separate navigation for mobile with the <code>mobileNav</code> slot. Icon-based navigation
		is recommended for mobile.
	</p>

	<ComponentExample
		code={`<Masthead location="Chicago">
  {#snippet nav()}
    <a href="/news">News</a>
    <a href="/events">Events</a>
  {/snippet}

  {#snippet mobileNav()}
    <a href="/news" aria-label="News">
      <svg>...</svg>
    </a>
    <a href="/events" aria-label="Events">
      <svg>...</svg>
    </a>
  {/snippet}
</Masthead>`}
	>
		<div class="masthead-demo">
			<Masthead location="Chicago">
				{#snippet nav()}
					<a href="/news">News</a>
					<a href="/events">Events</a>
				{/snippet}

				{#snippet mobileNav()}
					<a href="/news" aria-label="News">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							width="20"
							height="20"
						>
							<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
							<path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
						</svg>
					</a>
					<a href="/events" aria-label="Events">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							width="20"
							height="20"
						>
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
							<line x1="16" y1="2" x2="16" y2="6" />
							<line x1="8" y1="2" x2="8" y2="6" />
							<line x1="3" y1="10" x2="21" y2="10" />
						</svg>
					</a>
				{/snippet}
			</Masthead>
		</div>
	</ComponentExample>

	<h2>Date Only</h2>
	<p>A minimal masthead with just the date.</p>

	<ComponentExample
		code={`<Masthead />`}
	>
		<div class="masthead-demo">
			<Masthead />
		</div>
	</ComponentExample>

	<h2>Responsive Behavior</h2>
	<p>The Masthead has two distinct layouts:</p>
	<ul>
		<li>
			<strong>Desktop (640px+):</strong> Three-column grid with location (left), date (center), and navigation
			(right)
		</li>
		<li>
			<strong>Mobile (&lt;640px):</strong> Two-column flex with home icon (left) and mobile nav (right).
			Date is hidden.
		</li>
	</ul>

	<h2>Props</h2>
	<PropsTable props={mastheadProps} />
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

	.prose ul {
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
		padding-left: 24px;
	}

	.prose li {
		margin-bottom: 8px;
	}

	.masthead-demo {
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #e5e5e5;
	}
</style>
