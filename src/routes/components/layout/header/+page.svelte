<script lang="ts">
	import { Header } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const headerProps = [
		{
			name: 'logo',
			type: 'Snippet',
			description: 'Content for the logo area (left side)'
		},
		{
			name: 'nav',
			type: 'Snippet',
			description: 'Content for the navigation area (right side)'
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
		Site header component with slots for logo and navigation. Uses primary color background with
		responsive layout.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Header } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Header with logo and navigation links.</p>

	<ComponentExample
		code={`<Header>
  {#snippet logo()}
    <a href="/"><h1>My App</h1></a>
  {/snippet}
  {#snippet nav()}
    <a href="/docs">Docs</a>
    <a href="/about">About</a>
  {/snippet}
</Header>`}
	>
		<Header>
			{#snippet logo()}
				<a href="/"><h1 style="margin: 0; font-size: 1.25rem;">My App</h1></a>
			{/snippet}
			{#snippet nav()}
				<a href="/docs">Docs</a>
				<a href="/about">About</a>
			{/snippet}
		</Header>
	</ComponentExample>

	<h2>Logo Only</h2>
	<p>Header with just a logo.</p>

	<ComponentExample
		code={`<Header>
  {#snippet logo()}
    <a href="/"><h1>Brand Name</h1></a>
  {/snippet}
</Header>`}
	>
		<Header>
			{#snippet logo()}
				<a href="/"><h1 style="margin: 0; font-size: 1.25rem;">Brand Name</h1></a>
			{/snippet}
		</Header>
	</ComponentExample>

	<h2>With More Navigation</h2>
	<p>Header with multiple navigation links.</p>

	<ComponentExample
		code={`<Header>
  {#snippet logo()}
    <a href="/"><h1>SMRT</h1></a>
  {/snippet}
  {#snippet nav()}
    <a href="/components">Components</a>
    <a href="/modules">Modules</a>
    <a href="/docs">Docs</a>
    <a href="/faq">FAQ</a>
  {/snippet}
</Header>`}
	>
		<Header>
			{#snippet logo()}
				<a href="/"><h1 style="margin: 0; font-size: 1.25rem;">SMRT</h1></a>
			{/snippet}
			{#snippet nav()}
				<a href="/components">Components</a>
				<a href="/modules">Modules</a>
				<a href="/docs">Docs</a>
				<a href="/faq">FAQ</a>
			{/snippet}
		</Header>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={headerProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Header } from '@happyvertical/smrt-svelte';

interface Props {
  logo?: Snippet;
  nav?: Snippet;
}`}
		language="typescript"
	/>

	<h2>Responsive Behavior</h2>
	<p>
		On mobile, the header stacks vertically. On desktop, logo and nav are side-by-side. Consider
		using a mobile menu for complex navigation.
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
