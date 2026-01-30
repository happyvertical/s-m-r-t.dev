<script lang="ts">
	import { Markdown } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const basicMarkdown = `# Welcome to SMRT

This is a **paragraph** with *emphasis* and **strong text**.

## Features

- Simple API
- Type safety
- Great documentation`;

	const headingsMarkdown = `# Heading 1
## Heading 2
### Heading 3`;

	const formattingMarkdown = `This text has **bold words** and *italic words*.

You can also combine **bold and *nested italic* text**.`;

	const listMarkdown = `- First item
- Second item
- Third item with more detail`;

	const markdownProps = [
		{
			name: 'content',
			type: 'string',
			description: 'Markdown content to render',
			required: true
		}
	];
</script>

<svelte:head>
	<title>Markdown | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/content">Content</a>
		<span>/</span>
		<span>Markdown</span>
	</nav>

	<h1>Markdown</h1>
	<p class="lead">
		Render markdown content with XSS protection. Supports headings, bold, italic, and lists.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Markdown } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Render markdown content with automatic styling.</p>

	<ComponentExample code={`<Markdown content={markdownText} />`}>
		<Markdown content={basicMarkdown} />
	</ComponentExample>

	<h2>Headings</h2>
	<p>Support for H1, H2, and H3 headings.</p>

	<ComponentExample
		code={`<Markdown content={\`# Heading 1
## Heading 2
### Heading 3\`} />`}
	>
		<Markdown content={headingsMarkdown} />
	</ComponentExample>

	<h2>Text Formatting</h2>
	<p>Bold and italic text formatting.</p>

	<ComponentExample
		code={`<Markdown content="**bold** and *italic*" />`}
	>
		<Markdown content={formattingMarkdown} />
	</ComponentExample>

	<h2>Lists</h2>
	<p>Unordered list support.</p>

	<ComponentExample
		code={`<Markdown content={\`- First item
- Second item
- Third item\`} />`}
	>
		<Markdown content={listMarkdown} />
	</ComponentExample>

	<h2>Security</h2>
	<p>
		The Markdown component automatically escapes HTML to prevent XSS attacks. User-provided content
		is safe to render.
	</p>

	<ComponentExample
		code={`<Markdown content="<script>alert('xss')</script>" />`}
	>
		<Markdown content="<script>alert('xss')</script> - This is escaped and safe!" />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={markdownProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Markdown } from '@happyvertical/smrt-svelte';

interface Props {
  content: string;
}`}
		language="typescript"
	/>

	<h2>Supported Syntax</h2>
	<div class="syntax-table">
		<table>
			<thead>
				<tr>
					<th>Syntax</th>
					<th>Output</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code># Heading 1</code></td>
					<td>H1 heading</td>
				</tr>
				<tr>
					<td><code>## Heading 2</code></td>
					<td>H2 heading</td>
				</tr>
				<tr>
					<td><code>### Heading 3</code></td>
					<td>H3 heading</td>
				</tr>
				<tr>
					<td><code>**bold**</code></td>
					<td>Bold text</td>
				</tr>
				<tr>
					<td><code>*italic*</code></td>
					<td>Italic text</td>
				</tr>
				<tr>
					<td><code>- item</code></td>
					<td>List item</td>
				</tr>
			</tbody>
		</table>
	</div>
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

	.syntax-table {
		margin-top: 16px;
	}

	.syntax-table table {
		width: 100%;
		border-collapse: collapse;
	}

	.syntax-table th,
	.syntax-table td {
		padding: 12px 16px;
		text-align: left;
		border-bottom: 1px solid var(--color-grid);
	}

	.syntax-table th {
		font-weight: 600;
		background: #fafafa;
	}

	.syntax-table td code {
		font-family: var(--font-mono);
		font-size: 0.85em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}
</style>
