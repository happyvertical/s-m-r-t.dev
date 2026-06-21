<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { SMRT_VERSION_LABEL } from '$lib/version';
</script>

<svelte:head>
	<title>Semantic Search | SMRT Concepts</title>
	<meta
		name="description"
		content="Search SMRT objects by meaning. Configure embeddings on a class, then use semanticSearch() and findSimilar() — backed by the _smrt_embeddings table, local or AI providers."
	/>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/docs">Docs</a>
		<span>/</span>
		<span>Concepts</span>
		<span>/</span>
		<span>Semantic Search</span>
	</nav>

	<h1>Semantic Search</h1>
	<p class="lead">
		Semantic search finds objects by <em>meaning</em> rather than exact keywords. You declare which
		fields to embed in the <code>@smrt()</code> decorator, and SMRT generates embedding vectors,
		stores them in the <code>_smrt_embeddings</code> table, and ranks results by cosine similarity.
	</p>

	<section>
		<h2>Configure embeddings on a class</h2>
		<p>
			Add an <code>embeddings</code> block to <code>@smrt()</code> listing the fields to index.
			Everything else has a project default, so the minimal config is just <code>fields</code>.
		</p>
		<CodeBlock
			code={`import { smrt, SmrtObject } from '@happyvertical/smrt-core';

@smrt({
  embeddings: {
    fields: ['title', 'content']
  }
})
class Article extends SmrtObject {
  title: string = '';
  content: string = '';
}`}
			language="typescript"
		/>
		<p>The per-class options (<code>ClassEmbeddingConfig</code>):</p>
		<table>
			<thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Purpose</th></tr></thead>
			<tbody>
				<tr
					><td><code>fields</code></td><td>string[]</td><td>—</td><td
						>Which fields to embed (required).</td
					></tr
				>
				<tr
					><td><code>provider</code></td><td><code>'local' | 'ai' | 'auto'</code></td><td
						>project setting</td
					><td>Override the provider for this class.</td></tr
				>
				<tr
					><td><code>autoGenerate</code></td><td>boolean</td><td><code>true</code></td><td
						>Generate embeddings automatically on save.</td
					></tr
				>
				<tr
					><td><code>regenerateOnChange</code></td><td>boolean</td><td><code>true</code></td><td
						>Only re-embed when the source content's hash changes.</td
					></tr
				>
				<tr
					><td><code>combinedField</code></td><td>object</td><td>—</td><td
						>Create one virtual embedding from a template of several fields.</td
					></tr
				>
			</tbody>
		</table>
		<p>
			A <code>combinedField</code> indexes several fields as a single searchable vector — useful when
			a query should match title and body together:
		</p>
		<CodeBlock
			code={`@smrt({
  embeddings: {
    fields: ['title', 'body'],
    combinedField: {
      name: 'content',
      template: '{title}\\n\\n{body}'
    }
  }
})
class Post extends SmrtObject {
  title: string = '';
  body: string = '';
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Providers and storage</h2>
		<p>
			By default SMRT uses a <strong>local</strong> embedding model — no API key, vectors computed
			in-process — and stores them as JSON so search works on any database. You change this globally
			in <a href="/docs/concepts/configuration"><code>smrt.config.ts</code></a> under
			<code>smrt.embeddings</code>.
		</p>
		<CodeBlock
			code={`// smrt.config.ts
import { defineConfig } from '@happyvertical/smrt-config';

export default defineConfig({
  smrt: {
    embeddings: {
      provider: 'local',                    // 'local' | 'ai' | 'auto'
      localModel: 'Xenova/bge-base-en-v1.5', // default local model
      dimensions: 768,                       // default
      storage: 'json'                        // 'json' (portable) | 'native' (DB vectors)
    }
  }
});`}
			language="typescript"
		/>
		<table>
			<thead><tr><th>Provider</th><th>Behavior</th></tr></thead>
			<tbody>
				<tr
					><td><code>'local'</code></td><td
						>Run a local model in Node. No API key required. Default.</td
					></tr
				>
				<tr
					><td><code>'ai'</code></td><td
						>Use your configured AI library (e.g. OpenAI <code>text-embedding-3-small</code>).</td
					></tr
				>
				<tr
					><td><code>'auto'</code></td><td
						>Prefer AI embeddings when an AI client is configured, otherwise use the local model.</td
					></tr
				>
			</tbody>
		</table>
		<Callout variant="note" title="native storage uses pgvector when available">
			With <code>storage: 'native'</code>, SMRT uses the database's vector operations when the
			adapter supports them (e.g. pgvector on Postgres) and falls back to JSON otherwise. JSON
			storage does cosine similarity in memory and works everywhere.
		</Callout>
	</section>

	<section>
		<h2>Generating embeddings</h2>
		<p>
			With <code>autoGenerate</code> on (the default), embeddings refresh in the background when you
			<code>save()</code> an object whose embedded content changed — but only when an AI client is configured,
			so a save never unexpectedly loads a local model. Generate them explicitly when you need to:
		</p>
		<CodeBlock
			code={`// One object, all configured fields
await article.generateEmbeddings();

// Only specific fields
await article.generateEmbeddings({ fields: ['title'] });

// Force regeneration even if content is unchanged
await article.generateEmbeddings({ force: true });`}
			language="typescript"
		/>
		<p>To backfill an existing collection, batch-generate the missing ones:</p>
		<CodeBlock
			code={`const result = await articles.generateMissingEmbeddings({
  batchSize: 50,
  onProgress: ({ completed, total }) => {
    console.log(\`Embedded \${completed}/\${total}\`);
  }
});
console.log(result); // { generated, skipped }`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Searching</h2>
		<p>
			<code>semanticSearch(query, options)</code> embeds the query text and returns matching
			objects, each annotated with a <code>_similarity</code> score (0–1).
		</p>
		<CodeBlock
			code={`const results = await articles.semanticSearch('machine learning trends', {
  limit: 10,
  minSimilarity: 0.7,
  where: { status: 'published' } // combine with regular filters
});

for (const article of results) {
  console.log(\`\${article.title} (\${article._similarity.toFixed(3)})\`);
}`}
			language="typescript"
		/>
		<p>
			<code>findSimilar(object, options)</code> finds objects close to an existing one — for "related
			items" or "more like this":
		</p>
		<CodeBlock
			code={`const article = await articles.get('article-123');
const related = await articles.findSimilar(article, {
  limit: 5,
  excludeSelf: true // default
});`}
			language="typescript"
		/>
		<table>
			<thead><tr><th>Method</th><th>Default limit</th><th>Use</th></tr></thead>
			<tbody>
				<tr
					><td><code>semanticSearch(query, opts)</code></td><td>10</td><td
						>Search by free-text query.</td
					></tr
				>
				<tr
					><td><code>findSimilar(obj, opts)</code></td><td>5</td><td
						>Find items similar to a given object (or its ID).</td
					></tr
				>
				<tr
					><td><code>generateMissingEmbeddings(opts)</code></td><td>—</td><td
						>Backfill embeddings in batches.</td
					></tr
				>
			</tbody>
		</table>
		<Callout variant="warning" title="Embeddings must exist before you search">
			Search only matches objects that already have embeddings. If you add an <code>embeddings</code
			>
			config to a class with existing rows, run <code>generateMissingEmbeddings()</code> once to backfill
			them.
		</Callout>
	</section>

	<section>
		<h2>Related</h2>
		<ul>
			<li>
				<a href="/docs/objects#semantic-search">Objects → Semantic Search</a> — the API on collections.
			</li>
			<li>
				<a href="/docs/concepts/configuration">Configuration</a> — the <code>smrt.embeddings</code> project
				defaults.
			</li>
			<li>
				<a href="/docs/guides/add-semantic-search">Guide: add semantic search to a model</a> — end to
				end.
			</li>
		</ul>
		<p class="version-note">Verified against SMRT {SMRT_VERSION_LABEL}.</p>
	</section>
</article>

<style>
	.prose {
		max-width: 100%;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: var(--smrt-color-on-surface-variant, #666);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--smrt-color-primary, #1976d2);
	}

	.version-note {
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #888);
		font-style: italic;
		margin-top: 32px;
	}
</style>
