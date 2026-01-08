<script lang="ts">
	import { Markdown } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const basicMarkdown = `# Welcome to SMRT

This is a paragraph with **bold text** and *italic text*.

## Features

- Define business logic once
- Auto-generate APIs and CLI
- AI-powered methods

### Getting Started

Check out the documentation to learn more.`;

	const headingsMarkdown = `# Heading 1
## Heading 2
### Heading 3`;

	const formattingMarkdown = `This text contains **bold words** and *italicized words*.

You can combine **bold and *nested italic*** for emphasis.`;

	const listMarkdown = `- First item in the list
- Second item with more details
- Third item completes the set`;

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
		A simple markdown renderer that converts common markdown syntax to styled HTML.
		Supports headings, bold, italic, and lists.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Markdown } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Render markdown content with automatic styling:</p>

	<ComponentExample
		code={`<script lang="ts">
  const content = \`# Welcome to SMRT

This is a paragraph with **bold text** and *italic text*.

## Features

- Define business logic once
- Auto-generate APIs and CLI
- AI-powered methods

### Getting Started

Check out the documentation to learn more.\`;
</script>

<Markdown {content} />`}
	>
		<Markdown content={basicMarkdown} />
	</ComponentExample>

	<h2>Headings</h2>
	<p>Three levels of headings are supported:</p>

	<ComponentExample
		code={`<Markdown content="# Heading 1
## Heading 2
### Heading 3" />`}
	>
		<Markdown content={headingsMarkdown} />
	</ComponentExample>

	<h2>Text Formatting</h2>
	<p>Bold and italic text formatting:</p>

	<ComponentExample
		code={`<Markdown content="This text contains **bold words** and *italicized words*.

You can combine **bold and *nested italic*** for emphasis." />`}
	>
		<Markdown content={formattingMarkdown} />
	</ComponentExample>

	<h2>Lists</h2>
	<p>Unordered lists with the dash syntax:</p>

	<ComponentExample
		code={`<Markdown content="- First item in the list
- Second item with more details
- Third item completes the set" />`}
	>
		<Markdown content={listMarkdown} />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={markdownProps} />

	<h2>Supported Syntax</h2>
	<CodeBlock
		code={`# Heading 1
## Heading 2
### Heading 3

**bold text**
*italic text*

- list item
- another item

Paragraphs separated by blank lines.`}
		language="markdown"
	/>

	<h2>TypeScript</h2>
	<CodeBlock
		code={`interface Props {
  content: string;
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
