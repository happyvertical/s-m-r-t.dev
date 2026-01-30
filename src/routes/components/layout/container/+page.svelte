<script lang="ts">
	import { Container } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const containerProps = [
		{
			name: 'maxWidth',
			type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
			default: "'lg'",
			description: 'Maximum width of the container'
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
		Centered max-width container with responsive padding. Use to constrain content width and
		provide consistent horizontal spacing.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Container } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>The default container with lg max-width (1024px).</p>

	<ComponentExample
		code={`<Container>
  <p>Content inside a centered container</p>
</Container>`}
	>
		<div class="demo-area">
			<Container>
				<div class="demo-content">Content inside a centered container</div>
			</Container>
		</div>
	</ComponentExample>

	<h2>Max Width Sizes</h2>
	<p>Choose from sm (640px), md (768px), lg (1024px), xl (1280px), or full width.</p>

	<ComponentExample
		code={`<Container maxWidth="sm">Small - 640px</Container>
<Container maxWidth="md">Medium - 768px</Container>
<Container maxWidth="lg">Large - 1024px (default)</Container>
<Container maxWidth="xl">Extra Large - 1280px</Container>
<Container maxWidth="full">Full Width</Container>`}
	>
		<div class="size-demos">
			<div class="demo-area">
				<Container maxWidth="sm">
					<div class="demo-content">Small - 640px</div>
				</Container>
			</div>
			<div class="demo-area">
				<Container maxWidth="md">
					<div class="demo-content">Medium - 768px</div>
				</Container>
			</div>
			<div class="demo-area">
				<Container maxWidth="lg">
					<div class="demo-content">Large - 1024px</div>
				</Container>
			</div>
		</div>
	</ComponentExample>

	<h2>Common Patterns</h2>
	<p>Use Container to wrap page content for consistent layout.</p>

	<CodeBlock
		code={`<script>
  import { Container, Header, Footer } from '@happyvertical/smrt-svelte';
</script>

<Header />

<main>
  <Container>
    <h1>Page Title</h1>
    <p>Page content...</p>
  </Container>
</main>

<Footer />`}
		language="svelte"
	/>

	<h2>Props</h2>
	<PropsTable props={containerProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Container } from '@happyvertical/smrt-svelte';

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface Props {
  maxWidth?: MaxWidth;
  children?: Snippet;
}`}
		language="typescript"
	/>

	<h2>Responsive Behavior</h2>
	<p>
		Container automatically adjusts padding on smaller screens. On mobile, padding is reduced
		while maintaining centered content.
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

	.demo-area {
		background: #f0f0f0;
		padding: 16px 0;
		margin-bottom: 16px;
	}

	.demo-content {
		background: #fff;
		padding: 16px;
		text-align: center;
		border: 1px dashed #ccc;
	}

	.size-demos {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
</style>
