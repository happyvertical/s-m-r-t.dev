<script lang="ts">
	import { ArticleCard } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const sampleArticle = {
		id: '1',
		slug: 'getting-started-with-smrt',
		title: 'Getting Started with SMRT Framework',
		description:
			'Learn how to build powerful AI agents using the SMRT framework. This comprehensive guide covers installation, configuration, and your first agent.',
		publish_date: '2024-01-15',
		author: 'Jane Developer',
		tags: 'tutorial,smrt,ai'
	};

	const articleWithTags = {
		id: '2',
		slug: 'advanced-patterns',
		title: 'Advanced SMRT Patterns',
		description:
			'Deep dive into advanced patterns for building scalable and maintainable AI agents with SMRT.',
		publish_date: '2024-02-20',
		author: 'John Smith',
		tags: '["patterns", "advanced", "best-practices"]'
	};

	const minimalArticle = {
		id: '3',
		slug: 'quick-tip',
		title: 'Quick Tip: Using Decorators',
		description: null,
		publish_date: null,
		author: null,
		tags: ''
	};

	const articleCardProps = [
		{
			name: 'article',
			type: 'Article',
			description: 'Article object containing id, slug, title, description, publish_date, author, and tags',
			required: true
		},
		{
			name: 'showExcerpt',
			type: 'boolean',
			default: 'true',
			description: 'Whether to show the article description'
		},
		{
			name: 'showDate',
			type: 'boolean',
			default: 'true',
			description: 'Whether to show the publication date'
		},
		{
			name: 'showAuthor',
			type: 'boolean',
			default: 'true',
			description: 'Whether to show the author name'
		},
		{
			name: 'showTags',
			type: 'boolean',
			default: 'false',
			description: 'Whether to show article tags as badges'
		}
	];
</script>

<svelte:head>
	<title>ArticleCard | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/content">Content</a>
		<span>/</span>
		<span>ArticleCard</span>
	</nav>

	<h1>ArticleCard</h1>
	<p class="lead">
		A card component for displaying article previews with title, excerpt, author, date, and optional tags.
		Links to the full article page.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { ArticleCard } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display an article with all default options enabled:</p>

	<ComponentExample
		code={`<script lang="ts">
  const article = {
    id: '1',
    slug: 'getting-started-with-smrt',
    title: 'Getting Started with SMRT Framework',
    description: 'Learn how to build powerful AI agents...',
    publish_date: '2024-01-15',
    author: 'Jane Developer',
    tags: 'tutorial,smrt,ai'
  };
</script>

<ArticleCard {article} />`}
	>
		<ArticleCard article={sampleArticle} />
	</ComponentExample>

	<h2>With Tags</h2>
	<p>Enable tag display with the <code>showTags</code> prop. Tags can be comma-separated strings or JSON arrays:</p>

	<ComponentExample
		code={`<ArticleCard
  article={article}
  showTags={true}
/>`}
	>
		<ArticleCard article={articleWithTags} showTags={true} />
	</ComponentExample>

	<h2>Minimal Display</h2>
	<p>Hide metadata for a cleaner look:</p>

	<ComponentExample
		code={`<ArticleCard
  article={article}
  showExcerpt={false}
  showDate={false}
  showAuthor={false}
/>`}
	>
		<ArticleCard article={sampleArticle} showExcerpt={false} showDate={false} showAuthor={false} />
	</ComponentExample>

	<h2>Handling Missing Data</h2>
	<p>The component gracefully handles articles with missing optional fields:</p>

	<ComponentExample
		code={`<script lang="ts">
  const article = {
    id: '3',
    slug: 'quick-tip',
    title: 'Quick Tip: Using Decorators',
    description: null,
    publish_date: null,
    author: null,
    tags: ''
  };
</script>

<ArticleCard {article} />`}
	>
		<ArticleCard article={minimalArticle} />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={articleCardProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`interface Article {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  publish_date: string | null;
  author: string | null;
  tags: string; // comma-separated or JSON array
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
