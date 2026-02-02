<script lang="ts">
	import { ArticleList, Grid } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const mockArticles = [
		{
			id: '1',
			slug: 'getting-started',
			title: 'Getting Started with SMRT',
			description: 'Learn how to build your first SMRT application in under 5 minutes.',
			publish_date: '2025-01-15',
			author: 'Jane Smith',
			tags: 'tutorial,beginner'
		},
		{
			id: '2',
			slug: 'advanced-patterns',
			title: 'Advanced SMRT Patterns',
			description: 'Explore advanced patterns for building scalable applications.',
			publish_date: '2025-01-10',
			author: 'John Doe',
			tags: '["advanced", "patterns"]'
		},
		{
			id: '3',
			slug: 'api-design',
			title: 'Designing APIs with SMRT',
			description: 'Best practices for API design using the SMRT framework.',
			publish_date: '2025-01-05',
			author: 'Alice Chen',
			tags: 'api,design'
		}
	];

	const articleListProps = [
		{
			name: 'articles',
			type: 'Article[]',
			description: 'Array of article objects to display',
			required: true
		},
		{
			name: 'columns',
			type: "number | 'auto'",
			default: "'auto'",
			description: 'Number of grid columns or auto for responsive'
		},
		{
			name: 'showExcerpt',
			type: 'boolean',
			default: 'true',
			description: 'Show article descriptions'
		},
		{
			name: 'showDate',
			type: 'boolean',
			default: 'true',
			description: 'Show publication dates'
		},
		{
			name: 'showAuthor',
			type: 'boolean',
			default: 'true',
			description: 'Show author names'
		},
		{
			name: 'showTags',
			type: 'boolean',
			default: 'false',
			description: 'Show article tags as badges'
		},
		{
			name: 'emptyMessage',
			type: 'string',
			default: "'No articles published yet...'",
			description: 'Message shown when no articles'
		}
	];
</script>

<svelte:head>
	<title>ArticleList | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/content">Content</a>
		<span>/</span>
		<span>ArticleList</span>
	</nav>

	<h1>ArticleList</h1>
	<p class="lead">
		Grid layout for displaying multiple article cards. Automatically handles responsive columns and
		empty states.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { ArticleList } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Display articles in a responsive grid layout.</p>

	<ComponentExample code={`<ArticleList articles={articles} />`}>
		<ArticleList articles={mockArticles} />
	</ComponentExample>

	<h2>Fixed Columns</h2>
	<p>Specify exact number of columns.</p>

	<ComponentExample code={`<ArticleList articles={articles} columns={2} />`}>
		<ArticleList articles={mockArticles} columns={2} />
	</ComponentExample>

	<h2>With Tags</h2>
	<p>Show article tags as badges.</p>

	<ComponentExample code={`<ArticleList articles={articles} showTags />`}>
		<ArticleList articles={mockArticles} showTags />
	</ComponentExample>

	<h2>Minimal Display</h2>
	<p>Show only titles and excerpts.</p>

	<ComponentExample
		code={`<ArticleList
  articles={articles}
  showDate={false}
  showAuthor={false}
/>`}
	>
		<ArticleList articles={mockArticles} showDate={false} showAuthor={false} />
	</ComponentExample>

	<h2>Empty State</h2>
	<p>Custom message when no articles available.</p>

	<ComponentExample
		code={`<ArticleList
  articles={[]}
  emptyMessage="No blog posts yet. Check back soon!"
/>`}
	>
		<ArticleList articles={[]} emptyMessage="No blog posts yet. Check back soon!" />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={articleListProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { ArticleList } from '@happyvertical/smrt-svelte';

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
  articles: Article[];
  columns?: number | 'auto';
  showExcerpt?: boolean;
  showDate?: boolean;
  showAuthor?: boolean;
  showTags?: boolean;
  emptyMessage?: string;
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
