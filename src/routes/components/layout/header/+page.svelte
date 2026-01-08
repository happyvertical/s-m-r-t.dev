<script lang="ts">
	import { Header } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const headerProps = [
		{
			name: 'logo',
			type: 'Snippet',
			description: 'Logo/branding content slot'
		},
		{
			name: 'nav',
			type: 'Snippet',
			description: 'Navigation links slot'
		}
	];
</script>

<svelte:head>
	<title>Header | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/layout">Layout</a>
		<span>/</span>
		<span>Header</span>
	</nav>

	<h1>Header</h1>
	<p class="lead">
		A site header component with slots for logo and navigation. Features a primary background color
		with inverse text, and responsive layout that stacks on mobile.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Header } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Use the <code>logo</code> and <code>nav</code> snippet props to add content.</p>

	<ComponentExample
		code={`<Header>
  {#snippet logo()}
    <h1><a href="/">My Site</a></h1>
  {/snippet}

  {#snippet nav()}
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  {/snippet}
</Header>`}
	>
		<div class="header-demo">
			<Header>
				{#snippet logo()}
					<h1><a href="/">My Site</a></h1>
				{/snippet}

				{#snippet nav()}
					<a href="/components">Docs</a>
					<a href="/about">About</a>
					<a href="/contact">Contact</a>
				{/snippet}
			</Header>
		</div>
	</ComponentExample>

	<h2>Logo Only</h2>
	<p>The header works with just a logo slot.</p>

	<ComponentExample
		code={`<Header>
  {#snippet logo()}
    <h1><a href="/">Brand Name</a></h1>
  {/snippet}
</Header>`}
	>
		<div class="header-demo">
			<Header>
				{#snippet logo()}
					<h1><a href="/">Brand Name</a></h1>
				{/snippet}
			</Header>
		</div>
	</ComponentExample>

	<h2>Nav Only</h2>
	<p>Or with just navigation links.</p>

	<ComponentExample
		code={`<Header>
  {#snippet nav()}
    <a href="/features">Features</a>
    <a href="/pricing">Pricing</a>
    <a href="/docs">Docs</a>
  {/snippet}
</Header>`}
	>
		<div class="header-demo">
			<Header>
				{#snippet nav()}
					<a href="/features">Features</a>
					<a href="/pricing">Pricing</a>
					<a href="/docs">Docs</a>
				{/snippet}
			</Header>
		</div>
	</ComponentExample>

	<h2>Responsive Behavior</h2>
	<p>
		The Header component uses flexbox and switches from a stacked column layout on mobile to a row
		layout with space-between alignment on screens 768px and wider.
	</p>

	<h2>Styling</h2>
	<p>The Header component applies several styles:</p>
	<ul>
		<li>
			Background uses <code>--color-primary-main</code>
		</li>
		<li>
			Text color uses <code>--color-text-inverse</code>
		</li>
		<li>
			Navigation links have hover underline effect
		</li>
		<li>
			Box shadow provides elevation with <code>--shadow-md</code>
		</li>
	</ul>

	<h2>Props</h2>
	<PropsTable props={headerProps} />
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

	.header-demo {
		border-radius: 8px;
		overflow: hidden;
	}
</style>
