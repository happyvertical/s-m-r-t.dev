<script lang="ts">
	import { Container, Card } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const containerProps = [
		{
			name: 'maxWidth',
			type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
			default: "'lg'",
			description: 'Maximum width of the container'
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'Container content',
			required: true
		}
	];
</script>

<svelte:head>
	<title>Container | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/layout">Layout</a>
		<span>/</span>
		<span>Container</span>
	</nav>

	<h1>Container</h1>
	<p class="lead">
		A responsive wrapper component that centers content and applies consistent horizontal padding
		with configurable maximum width.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Container } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>The Container component centers content and adds responsive horizontal padding.</p>

	<ComponentExample
		code={`<Container>
  <p>Content is centered with consistent padding.</p>
</Container>`}
	>
		<div class="demo-bg">
			<Container>
				<Card>
					<p>Content is centered with consistent padding.</p>
				</Card>
			</Container>
		</div>
	</ComponentExample>

	<h2>Max Width</h2>
	<p>
		Control the maximum width with the <code>maxWidth</code> prop. Options are: <code>sm</code> (640px),
		<code>md</code> (768px), <code>lg</code> (1024px, default), <code>xl</code> (1280px), and
		<code>full</code> (100%).
	</p>

	<ComponentExample
		code={`<Container maxWidth="sm">Small (640px)</Container>
<Container maxWidth="md">Medium (768px)</Container>
<Container maxWidth="lg">Large (1024px)</Container>
<Container maxWidth="xl">Extra Large (1280px)</Container>
<Container maxWidth="full">Full Width</Container>`}
	>
		<div class="width-demos">
			<div class="demo-bg">
				<Container maxWidth="sm">
					<Card><strong>sm</strong> - 640px max</Card>
				</Container>
			</div>
			<div class="demo-bg">
				<Container maxWidth="md">
					<Card><strong>md</strong> - 768px max</Card>
				</Container>
			</div>
			<div class="demo-bg">
				<Container maxWidth="lg">
					<Card><strong>lg</strong> - 1024px max</Card>
				</Container>
			</div>
			<div class="demo-bg">
				<Container maxWidth="xl">
					<Card><strong>xl</strong> - 1280px max</Card>
				</Container>
			</div>
			<div class="demo-bg">
				<Container maxWidth="full">
					<Card><strong>full</strong> - 100% width</Card>
				</Container>
			</div>
		</div>
	</ComponentExample>

	<h2>Responsive Padding</h2>
	<p>
		The Container automatically adjusts horizontal padding based on viewport width. On smaller
		screens, it uses <code>--spacing-md</code>, and on screens 640px and wider, it uses
		<code>--spacing-lg</code>.
	</p>

	<h2>Props</h2>
	<PropsTable props={containerProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { MaxWidth } from '@happyvertical/svelte';

// MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full'`}
		language="typescript"
	/>
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

	.demo-bg {
		background: #f0f0f0;
		padding: 16px 0;
		border-radius: 4px;
	}

	.width-demos {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	:global(.width-demos .card) {
		text-align: center;
	}

	:global(.width-demos .card p) {
		margin: 0;
	}
</style>
