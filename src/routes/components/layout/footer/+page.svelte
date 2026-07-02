<script lang="ts">
	import { Footer } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const footerProps = [
		{
			name: 'children',
			type: 'Snippet',
			description: 'Content for footer links'
		}
	];
</script>

<svelte:head>
	<title>Footer | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/layout">Layout</a>
		<span>/</span>
		<span>Footer</span>
	</nav>

	<h1>Footer</h1>
	<p class="lead">
		Site footer component with automatic copyright year and optional links. Uses a subtle background
		color and centered layout.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Footer } from '@happyvertical/smrt-ui';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Footer with automatic copyright year.</p>

	<ComponentExample code={`<Footer />`}>
		<Footer />
	</ComponentExample>

	<h2>With Links</h2>
	<p>Add footer links using the children snippet.</p>

	<ComponentExample
		code={`<Footer>
  <a href="/privacy">Privacy Policy</a>
  <a href="/terms">Terms of Service</a>
  <a href="/contact">Contact</a>
</Footer>`}
	>
		<Footer>
			<a href="/privacy">Privacy Policy</a>
			<a href="/terms">Terms of Service</a>
			<a href="/contact">Contact</a>
		</Footer>
	</ComponentExample>

	<h2>Common Pattern</h2>
	<p>Footer typically placed at the bottom of your layout.</p>

	<CodeBlock
		code={`<script>
  import { Header, Container, Footer } from '@happyvertical/smrt-ui';
</script>

<div class="app">
  <Header>
    {#snippet logo()}
      <a href="/"><h1>My App</h1></a>
    {/snippet}
  </Header>

  <main>
    <Container>
      <slot />
    </Container>
  </main>

  <Footer>
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </Footer>
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  main {
    flex: 1;
  }
</style>`}
		language="svelte"
	/>

	<h2>Props</h2>
	<PropsTable props={footerProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Footer } from '@happyvertical/smrt-ui';

interface Props {
  children?: Snippet;
}`}
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
</style>
