<script lang="ts">
	import { ArticleCard } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const mockArticle = {
		id: '1',
		slug: 'getting-started',
		title: 'Getting Started with SMRT',
		description: 'Learn how to build your first SMRT application in under 5 minutes.',
		publish_date: '2025-01-15',
		author: 'Jane Smith',
		tags: 'tutorial,beginner'
	};

	const mockArticle2 = {
		id: '2',
		slug: 'advanced-patterns',
		title: 'Advanced SMRT Patterns',
		description: 'Explore advanced patterns for building scalable applications with SMRT.',
		publish_date: '2025-01-10',
		author: 'John Doe',
		tags: '["advanced", "patterns", "architecture"]'
	};

	const articleCardProps = [
		{
			name: 'article',
			type: 'Article',
			description: 'Article object with id, slug, title, description, publish_date, author, tags',
			required: true
		},
		{
			name: 'showExcerpt',
			type: 'boolean',
			default: 'true',
			description: 'Show article description/excerpt'
		},
		{
			name: 'showDate',
			type: 'boolean',
			default: 'true',
			description: 'Show publication date'
		},
		{
			name: 'showAuthor',
			type: 'boolean',
			default: 'true',
			description: 'Show author name'
		},
		{
			name: 'showTags',
			type: 'boolean',
			default: 'false',
			description: 'Show article tags as badges'
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
		Card component for article previews. Shows title, excerpt, date, author, and optional tags.
		Links to the article detail page.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { ArticleCard } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Article card with all default options.</p>

	<ComponentExample code={`<ArticleCard article={article} />`}>
		<ArticleCard article={mockArticle} />
	</ComponentExample>

	<h2>With Tags</h2>
	<p>Show article tags as badges.</p>

	<ComponentExample code={`<ArticleCard article={article} showTags />`}>
		<ArticleCard article={mockArticle2} showTags />
	</ComponentExample>

	<h2>Minimal Card</h2>
	<p>Title only without metadata.</p>

	<ComponentExample
		code={`<ArticleCard
  article={article}
  showExcerpt={false}
  showDate={false}
  showAuthor={false}
/>`}
	>
		<ArticleCard article={mockArticle} showExcerpt={false} showDate={false} showAuthor={false} />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={articleCardProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { ArticleCard } from '@happyvertical/smrt-svelte';

interface Article {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  publish_date: string | null;
  author: string | null;
  tags: string; // JSON array or comma-separated
}

interface Props {
  article: Article;
  showExcerpt?: boolean;
  showDate?: boolean;
  showAuthor?: boolean;
  showTags?: boolean;
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
