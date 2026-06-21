<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { SMRT_VERSION_LABEL } from '$lib/version';
</script>

<svelte:head>
	<title>Context Memory | SMRT Concepts</title>
	<meta
		name="description"
		content="Let SMRT objects remember and recall learned strategies with confidence scoring and hierarchical scopes, backed by the _smrt_contexts table."
	/>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/docs">Docs</a>
		<span>/</span>
		<span>Concepts</span>
		<span>/</span>
		<span>Context Memory</span>
	</nav>

	<h1>Context Memory</h1>
	<p class="lead">
		Every <code>SmrtObject</code> can store and retrieve small pieces of learned context — a parsing
		strategy that worked, a per-source override, a cached decision — keyed by a scope and a key,
		with a confidence score. It is built into the base class and persists to the
		<code>_smrt_contexts</code> system table.
	</p>

	<section>
		<h2>When to reach for it</h2>
		<p>
			Context memory is for knowledge an object accumulates over time, not for its primary fields.
			Typical uses: remembering which CSS selector extracted an article from a given site, caching
			the shape of a third-party response, or recording a strategy an agent should reuse on its next
			run. Each entry carries a <strong>confidence</strong> so you can prefer high-confidence knowledge
			and discard the rest.
		</p>
		<Callout variant="note" title="Per object, per class">
			Entries are scoped to the specific object instance (<code>owner_class</code> +
			<code>owner_id</code>). Two objects of the same class do not share remembered context unless
			you deliberately store under the same owner.
		</Callout>
	</section>

	<section>
		<h2>remember</h2>
		<p>
			Store a value under a <code>scope</code> and <code>key</code>. The value is any
			JSON-serializable data. <code>confidence</code> defaults to <code>1.0</code>.
		</p>
		<CodeBlock
			code={`// Remember a parsing strategy that worked for this document's source
await document.remember({
  scope: 'parser/example.com',
  key: 'article-selector',
  value: { pattern: '.article-content p' },
  confidence: 0.9
});`}
			language="typescript"
		/>
		<p>The full options:</p>
		<table>
			<thead><tr><th>Option</th><th>Type</th><th>Notes</th></tr></thead>
			<tbody>
				<tr
					><td><code>scope</code></td><td>string</td><td
						>Slash-delimited path, e.g. <code>'parser/example.com/article'</code>.</td
					></tr
				>
				<tr><td><code>key</code></td><td>string</td><td>Lookup key within the scope.</td></tr>
				<tr><td><code>value</code></td><td>any</td><td>JSON-serialized on write.</td></tr>
				<tr
					><td><code>confidence</code></td><td>number</td><td
						>0–1. Default <code>1.0</code>. Higher entries win on recall.</td
					></tr
				>
				<tr
					><td><code>version</code></td><td>number</td><td
						>Default <code>1</code>. Part of the upsert key, so versions coexist.</td
					></tr
				>
				<tr><td><code>metadata</code></td><td>any</td><td>Optional JSON sidecar.</td></tr>
				<tr
					><td><code>expiresAt</code></td><td>Date</td><td
						>Optional expiry timestamp stored with the entry.</td
					></tr
				>
			</tbody>
		</table>
		<Callout variant="note" title="initialize() first">
			Context methods use the object's system database. Call <code>initialize()</code> (or create
			the object through a collection) before calling <code>remember</code>/<code>recall</code>.
		</Callout>
	</section>

	<section>
		<h2>recall and hierarchical scopes</h2>
		<p>
			<code>recall()</code> returns the best matching value — highest confidence, then highest
			version — or <code>null</code>. Its most useful feature is <code>includeAncestors</code>: when
			the exact scope has no entry, it walks up the scope path one segment at a time, ending at
			<code>global</code>.
		</p>
		<CodeBlock
			code={`const strategy = await document.recall({
  scope: 'parser/example.com/article',
  key: 'article-selector',
  includeAncestors: true, // tries example.com/article -> example.com -> parser -> global
  minConfidence: 0.7      // ignore low-confidence entries
});

if (strategy) {
  // use strategy.pattern
}`}
			language="typescript"
		/>
		<p>
			This lets you store a general default at a broad scope and override it at a narrower one — the
			narrowest match wins, with graceful fallback.
		</p>
	</section>

	<section>
		<h2>recallAll, forget, forgetScope</h2>
		<p>Bulk-read or clear remembered context:</p>
		<CodeBlock
			code={`// Read every entry in a scope as a Map<key, value>
const all = await document.recallAll({
  scope: 'parser/example.com',
  includeDescendants: true, // also include parser/example.com/*
  minConfidence: 0.5
});

// Delete a single entry
await document.forget({ scope: 'parser/example.com', key: 'article-selector' });

// Delete an entire scope (and optionally its descendants); returns the count
const removed = await document.forgetScope({
  scope: 'parser/example.com',
  includeDescendants: true
});`}
			language="typescript"
		/>
		<table>
			<thead><tr><th>Method</th><th>Returns</th><th>Purpose</th></tr></thead>
			<tbody>
				<tr
					><td><code>remember(options)</code></td><td><code>void</code></td><td
						>Upsert one entry.</td
					></tr
				>
				<tr
					><td><code>recall(options)</code></td><td><code>any | null</code></td><td
						>Best single match, with optional ancestor fallback.</td
					></tr
				>
				<tr
					><td><code>recallAll(options)</code></td><td><code>Map&lt;string, any&gt;</code></td><td
						>All entries in a scope (optionally including descendants).</td
					></tr
				>
				<tr
					><td><code>forget(options)</code></td><td><code>void</code></td><td
						>Delete one entry by scope + key.</td
					></tr
				>
				<tr
					><td><code>forgetScope(options)</code></td><td><code>number</code></td><td
						>Delete a whole scope; returns rows removed.</td
					></tr
				>
			</tbody>
		</table>
	</section>

	<section>
		<h2>Confidence and expiry</h2>
		<p>
			<code>confidence</code> is how you let knowledge improve over time: re-<code>remember</code>
			the same scope/key with a higher score as evidence accumulates, and read with
			<code>minConfidence</code> to filter out weak entries. Because <code>version</code> is part of the
			upsert key, you can also keep multiple versions of an entry side by side.
		</p>
		<Callout variant="note" title="expiresAt is stored, not auto-swept">
			An <code>expiresAt</code> timestamp is persisted with the entry so your own code can treat
			stale knowledge as expired. SMRT records it; it does not run a background job that deletes
			expired rows for you. Use <code>forget</code>/<code>forgetScope</code> to prune.
		</Callout>
	</section>

	<section>
		<h2>Worked example: an agent that learns</h2>
		<CodeBlock
			code={`@smrt()
class Scraper extends Agent {
  protected config = {};

  async scrape(url: string): Promise<string> {
    const host = new URL(url).host;

    // Try a previously-learned selector for this host (falling back upward)
    const learned = await this.recall({
      scope: \`parser/\${host}\`,
      key: 'selector',
      includeAncestors: true,
      minConfidence: 0.6
    });

    const selector = learned?.pattern ?? '.content';
    const text = await this.extract(url, selector);

    // If extraction looked good, reinforce the strategy
    if (text.length > 500) {
      await this.remember({
        scope: \`parser/\${host}\`,
        key: 'selector',
        value: { pattern: selector },
        confidence: 0.9
      });
    }
    return text;
  }
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Related</h2>
		<ul>
			<li>
				<a href="/docs/objects#context-memory">Objects → Context Memory</a> — the method reference
				on <code>SmrtObject</code>.
			</li>
			<li>
				<a href="/docs/concepts/semantic-search">Semantic Search</a> — for finding objects by
				meaning, a different system table (<code>_smrt_embeddings</code>).
			</li>
			<li><a href="/docs/agents">Agents</a> — the most common consumer of context memory.</li>
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
