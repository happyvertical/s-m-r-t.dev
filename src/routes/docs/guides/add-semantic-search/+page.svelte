<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { SMRT_VERSION_LABEL } from '$lib/version';
</script>

<svelte:head>
	<title>Add semantic search to a model | SMRT Guides</title>
	<meta
		name="description"
		content="A runnable guide: take an existing SMRT model from keyword-only to meaning-based search by configuring embeddings, backfilling vectors, and calling semanticSearch()."
	/>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/docs">Docs</a>
		<span>/</span>
		<span>Guides</span>
		<span>/</span>
		<span>Add semantic search</span>
	</nav>

	<h1>Add semantic search to a model</h1>
	<p class="lead">
		This guide takes an existing model from no search to meaning-based search in four steps: declare
		which fields to embed, install an embedding provider, backfill vectors for existing rows, then
		query with <code>semanticSearch()</code>. By default it runs locally — no API key.
	</p>

	<Callout variant="note" title="Starting point">
		We start with a plain <code>Article</code> model and end with working "search by meaning" and
		"more like this" features. No database migration is needed — embeddings live in their own
		<code>_smrt_embeddings</code> system table.
	</Callout>

	<section>
		<h2>Step 1 — Declare the embedded fields</h2>
		<p>
			Add an <code>embeddings</code> block to the model's <code>@smrt()</code> decorator listing the fields
			whose text should be searchable.
		</p>
		<CodeBlock
			code={`// src/lib/models/Article.ts — before
import { smrt, SmrtObject } from '@happyvertical/smrt-core';

@smrt({ api: true })
export class Article extends SmrtObject {
  title: string = '';
  content: string = '';
}`}
			language="typescript"
		/>
		<CodeBlock
			code={`// src/lib/models/Article.ts — after
import { smrt, SmrtObject } from '@happyvertical/smrt-core';

@smrt({
  api: true,
  embeddings: {
    fields: ['title', 'content'] // index both fields
  }
})
export class Article extends SmrtObject {
  title: string = '';
  content: string = '';
}`}
			language="typescript"
		/>
		<p>
			Want title and body matched as a single unit? Add a <code>combinedField</code> with a template:
		</p>
		<CodeBlock
			code={`embeddings: {
  fields: ['title', 'content'],
  combinedField: { name: 'fulltext', template: '{title}\\n\\n{content}' }
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Step 2 — Pick a provider</h2>
		<p>
			The default provider is <strong>local</strong>: a model runs in-process, no API key, vectors
			stored as JSON so it works on any database. Install the local transformer runtime:
		</p>
		<CodeBlock code={`pnpm add @huggingface/transformers`} language="bash" />
		<p>
			That is enough to start. To use a hosted model instead, set the provider in
			<a href="/docs/concepts/configuration"><code>smrt.config.ts</code></a> and configure an AI client:
		</p>
		<CodeBlock
			code={`// smrt.config.ts
import { defineConfig } from '@happyvertical/smrt-config';

export default defineConfig({
  smrt: {
    embeddings: {
      provider: 'ai',                  // use a hosted model
      aiModel: 'text-embedding-3-small',
      dimensions: 1536
    }
  },
  packages: {
    ai: { provider: 'openai', apiKey: process.env.OPENAI_API_KEY }
  }
});`}
			language="typescript"
		/>
		<Callout variant="note" title="Keep dimensions consistent">
			If you switch providers or models after embedding data, the vector dimensions change. Re-embed
			existing rows (Step 3 with <code>force</code>) so old and new vectors are comparable.
		</Callout>
	</section>

	<section>
		<h2>Step 3 — Backfill existing rows</h2>
		<p>
			New and updated objects embed automatically on <code>save()</code> (when
			<code>autoGenerate</code> is on and an AI client is available). Rows that already existed have no
			vectors yet, so backfill them once:
		</p>
		<CodeBlock
			code={`// scripts/backfill-embeddings.ts
import { ArticleCollection } from '$lib/models/ArticleCollection.js';

const articles = await ArticleCollection.create({
  db: { type: 'postgres', url: process.env.DATABASE_URL! }
});

const result = await articles.generateMissingEmbeddings({
  batchSize: 50,
  onProgress: ({ completed, total }) => {
    console.log(\`Embedded \${completed}/\${total}\`);
  }
});

console.log(result); // { generated: N, skipped: M }`}
			language="typescript"
		/>
		<p>
			To force a full re-embed (e.g. after changing the model) call it per object with <code
				>force</code
			>:
		</p>
		<CodeBlock
			code={`for (const article of await articles.list()) {
  await article.generateEmbeddings({ force: true });
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Step 4 — Search</h2>
		<p>
			Query by meaning with <code>semanticSearch()</code>. Each result carries a
			<code>_similarity</code> score (0–1); raise <code>minSimilarity</code> to tighten relevance.
		</p>
		<CodeBlock
			code={`// src/routes/search/+page.server.ts
import { ArticleCollection } from '$lib/models/ArticleCollection.js';

export async function load({ url }) {
  const q = url.searchParams.get('q') ?? '';
  if (!q) return { results: [] };

  const articles = await ArticleCollection.create({
    db: { type: 'postgres', url: process.env.DATABASE_URL! }
  });

  const results = await articles.semanticSearch(q, {
    limit: 10,
    minSimilarity: 0.7,
    where: { status: 'published' } // combine with normal filters
  });

  return {
    results: results.map((a) => ({
      id: a.id,
      title: a.title,
      score: a._similarity
    }))
  };
}`}
			language="typescript"
		/>
		<p>Add a "related articles" section with <code>findSimilar()</code>:</p>
		<CodeBlock
			code={`const article = await articles.get(params.id);
const related = await articles.findSimilar(article, { limit: 5 });`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Tuning</h2>
		<table>
			<thead><tr><th>Symptom</th><th>Lever</th></tr></thead>
			<tbody>
				<tr
					><td>Too many loosely-related hits</td><td
						>Raise <code>minSimilarity</code> (e.g. 0.7 → 0.8).</td
					></tr
				>
				<tr
					><td>Relevant items missing</td><td
						>Lower <code>minSimilarity</code>, or embed more fields / add a
						<code>combinedField</code>.</td
					></tr
				>
				<tr
					><td>Search returns nothing</td><td
						>Confirm rows are embedded — run <code>generateMissingEmbeddings()</code>.</td
					></tr
				>
				<tr
					><td>Slow on large tables</td><td
						>Use <code>storage: 'native'</code> with pgvector on Postgres instead of JSON.</td
					></tr
				>
			</tbody>
		</table>
		<Callout variant="warning" title="Search needs embeddings to exist">
			<code>semanticSearch()</code> and <code>findSimilar()</code> only match rows that already have vectors.
			After adding the config to a model with existing data, the Step 3 backfill is required — otherwise
			results come back empty.
		</Callout>
	</section>

	<section>
		<h2>Related</h2>
		<ul>
			<li>
				<a href="/docs/concepts/semantic-search">Concept: Semantic Search</a> — providers, storage, and
				the full method reference.
			</li>
			<li>
				<a href="/docs/concepts/configuration">Configuration</a> — the <code>smrt.embeddings</code> project
				defaults.
			</li>
			<li>
				<a href="/docs/objects#semantic-search">Objects → Semantic Search</a> — API on collections.
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
