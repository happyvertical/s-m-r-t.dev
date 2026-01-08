<script lang="ts">
	import { ArticleList } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const sampleArticles = [
		{
			id: '1',
			slug: 'getting-started-with-smrt',
			title: 'Getting Started with SMRT Framework',
			description:
				'Learn how to build powerful AI agents using the SMRT framework. This comprehensive guide covers installation, configuration, and your first agent.',
			publish_date: '2024-01-15',
			author: 'Jane Developer',
			tags: 'tutorial,smrt,ai'
		},
		{
			id: '2',
			slug: 'advanced-patterns',
			title: 'Advanced SMRT Patterns',
			description:
				'Deep dive into advanced patterns for building scalable and maintainable AI agents with SMRT.',
			publish_date: '2024-02-20',
			author: 'John Smith',
			tags: 'patterns,advanced'
		},
		{
			id: '3',
			slug: 'building-gnodes',
			title: 'Building Local Knowledge Bases with Gnodes',
			description:
				'Create federated knowledge bases for your community using the gnode architecture.',
			publish_date: '2024-03-10',
			author: 'Sarah Johnson',
			tags: 'gnodes,federation'
		}
	];

	const emptyArticles: typeof sampleArticles = [];

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
			description: 'Number of grid columns, or auto for responsive layout'
		},
		{
			name: 'showExcerpt',
			type: 'boolean',
			default: 'true',
			description: 'Whether to show article descriptions'
		},
		{
			name: 'showDate',
			type: 'boolean',
			default: 'true',
			description: 'Whether to show publication dates'
		},
		{
			name: 'showAuthor',
			type: 'boolean',
			default: 'true',
			description: 'Whether to show author names'
		},
		{
			name: 'showTags',
			type: 'boolean',
			default: 'false',
			description: 'Whether to show article tags'
		},
		{
			name: 'emptyMessage',
			type: 'string',
			default: "'No articles published yet. Check back soon for updates!'",
			description: 'Message shown when articles array is empty'
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
		A responsive grid layout for displaying multiple article cards. Automatically handles empty states
		and supports configurable column layouts.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { ArticleList } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display a list of articles in a responsive grid:</p>

	<ComponentExample
		code={`<script lang="ts">
  const articles = [
    {
      id: '1',
      slug: 'getting-started',
      title: 'Getting Started with SMRT',
      description: 'Learn how to build AI agents...',
      publish_date: '2024-01-15',
      author: 'Jane Developer',
      tags: 'tutorial,smrt'
    },
    // ... more articles
  ];
</script>

<ArticleList {articles} />`}
	>
		<ArticleList articles={sampleArticles} />
	</ComponentExample>

	<h2>Fixed Column Layout</h2>
	<p>Set a specific number of columns:</p>

	<ComponentExample
		code={`<ArticleList articles={articles} columns={2} />`}
	>
		<ArticleList articles={sampleArticles} columns={2} />
	</ComponentExample>

	<h2>With Tags</h2>
	<p>Enable tags on all article cards:</p>

	<ComponentExample
		code={`<ArticleList articles={articles} showTags={true} />`}
	>
		<ArticleList articles={sampleArticles} showTags={true} />
	</ComponentExample>

	<h2>Minimal Display</h2>
	<p>Show only titles by hiding metadata:</p>

	<ComponentExample
		code={`<ArticleList
  articles={articles}
  showExcerpt={false}
  showDate={false}
  showAuthor={false}
/>`}
	>
		<ArticleList
			articles={sampleArticles}
			showExcerpt={false}
			showDate={false}
			showAuthor={false}
		/>
	</ComponentExample>

	<h2>Empty State</h2>
	<p>When there are no articles, a customizable empty message is displayed:</p>

	<ComponentExample
		code={`<ArticleList articles={[]} />

<!-- Or with custom message -->
<ArticleList
  articles={[]}
  emptyMessage="No news articles available at this time."
/>`}
	>
		<ArticleList articles={emptyArticles} emptyMessage="No news articles available at this time." />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={articleListProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`interface Article {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  publish_date: string | null;
  author: string | null;
  tags: string;
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
