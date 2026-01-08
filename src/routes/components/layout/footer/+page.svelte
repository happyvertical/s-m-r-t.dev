<script lang="ts">
	import { Footer } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const footerProps = [
		{
			name: 'children',
			type: 'Snippet',
			description: 'Optional footer links or additional content'
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
		A site footer component that displays copyright information with the current year and optional
		footer links. Automatically updates the year.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Footer } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>
		The Footer automatically displays a copyright notice with the current year. No props are
		required.
	</p>

	<ComponentExample
		code={`<Footer />`}
	>
		<div class="footer-demo">
			<Footer />
		</div>
	</ComponentExample>

	<h2>With Links</h2>
	<p>Add footer links using the default slot (children).</p>

	<ComponentExample
		code={`<Footer>
  <a href="/privacy">Privacy Policy</a>
  <a href="/terms">Terms of Service</a>
  <a href="/contact">Contact Us</a>
</Footer>`}
	>
		<div class="footer-demo">
			<Footer>
				<a href="/privacy">Privacy Policy</a>
				<a href="/terms">Terms of Service</a>
				<a href="/contact">Contact Us</a>
			</Footer>
		</div>
	</ComponentExample>

	<h2>With External Links</h2>
	<p>Include social or external links.</p>

	<ComponentExample
		code={`<Footer>
  <a href="https://github.com/happyvertical">GitHub</a>
  <a href="https://twitter.com/happyvertical">Twitter</a>
  <a href="/docs">Documentation</a>
</Footer>`}
	>
		<div class="footer-demo">
			<Footer>
				<a href="https://github.com/happyvertical">GitHub</a>
				<a href="https://twitter.com/happyvertical">Twitter</a>
				<a href="/docs">Documentation</a>
			</Footer>
		</div>
	</ComponentExample>

	<h2>Styling</h2>
	<p>The Footer component applies several styles:</p>
	<ul>
		<li>
			Background uses <code>--color-neutral-gray100</code>
		</li>
		<li>
			Border top uses <code>--color-neutral-gray200</code>
		</li>
		<li>Centered text alignment</li>
		<li>
			Links use <code>--color-primary-main</code> with underline on hover
		</li>
		<li>
			Automatic margin top of <code>--spacing-3xl</code>
		</li>
	</ul>

	<h2>Props</h2>
	<PropsTable props={footerProps} />
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

	.footer-demo {
		border-radius: 8px;
		overflow: hidden;
	}

	.footer-demo :global(.site-footer) {
		margin-top: 0;
	}
</style>
