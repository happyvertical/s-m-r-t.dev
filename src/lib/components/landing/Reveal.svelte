<script lang="ts">
	/**
	 * "The reveal": one @smrt() class -> four generated surfaces.
	 *
	 * The Product class is passed to CodeBlock as a string (so no Svelte brace
	 * escaping is needed). The four surface panels show the EXACT generated
	 * artifacts, verified against the smrt source. A staggered fade-in plays on
	 * the panels, gated behind prefers-reduced-motion.
	 */
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	// The single definition. Plain template-literal string -> CodeBlock renders
	// the braces literally, the build-time template check never sees them.
	const productClass = `import { smrt, field, SmrtObject, SmrtCollection } from '@happyvertical/smrt-core';

@smrt({ api: true, cli: true, mcp: true })
export class Product extends SmrtObject {
  name: string = '';
  price: number = 0.0;
  quantity: number = 0;

  // Per-field @field() decorators shape the column and its generated API:
  @field({ sensitive: true })   // never returned by the API; not filterable
  wholesalePrice: number = 0.0;

  @field({ unique: true })      // unique constraint in the generated schema
  sku: string = '';

  @field({ readonly: true })    // server-set only; stripped from write bodies
  externalId: string = '';

  // A custom async method is exposed on every surface too.
  async research(query: string) {
    return this.do(\`Research the product and answer: \${query}\`);
  }
}

class ProductCollection extends SmrtCollection<Product> {
  static readonly _itemClass = Product;
}

// Work with instances — ORM + AI methods are built in:
const products = await ProductCollection.create({ db: 'shop.db' });
const widget = await products.create({ name: 'Smart Widget', price: 29.99 });

const onSale  = await widget.is('a clearance item');  // → boolean
const blurb   = await widget.do('write a launch tweet');  // → string
const summary = await widget.describe();  // → string
const json    = widget.toPublicJSON();  // → object, minus wholesalePrice
await widget.save();
`;

	type Panel = {
		key: string;
		label: string;
		hint: string;
		lines: { verb?: string; text: string }[];
	};

	// Exact generated artifacts. Verbs are split out so REST/SQL read clearly.
	const panels: Panel[] = [
		{
			key: 'rest',
			label: 'REST',
			hint: 'SvelteKit routes under /api',
			lines: [
				{ verb: 'GET POST', text: '/api/products' },
				{ verb: 'GET PUT DELETE', text: '/api/products/[id]' },
				{ verb: 'POST', text: '/api/products/[id]/research' }
			]
		},
		{
			key: 'cli',
			label: 'CLI',
			hint: 'colon-namespaced commands',
			lines: [
				{ text: 'product:list' },
				{ text: 'product:get <id>' },
				{ text: 'product:create' },
				{ text: 'product:research <id> --query' }
			]
		},
		{
			key: 'mcp',
			label: 'MCP',
			hint: 'tools an agent can call',
			lines: [
				{ text: 'product_list' },
				{ text: 'product_get' },
				{ text: 'product_create' },
				{ text: 'product_research' }
			]
		},
		{
			key: 'sql',
			label: 'SQL',
			hint: 'generated from your fields',
			lines: [
				{ text: 'create table products (' },
				{ text: '  name             TEXT,' },
				{ text: '  price            DECIMAL,' },
				{ text: '  quantity         INTEGER,' },
				{ text: '  wholesale_price  DECIMAL,' },
				{ text: '  sku              TEXT,' },
				{ text: '  external_id      TEXT' },
				{ text: ')  — id + timestamps auto' }
			]
		}
	];

	const proofChips = [
		'Endpoints are fail-closed by default',
		'Embeddings + vector search built in',
		'Swap AI providers by one field',
		'~49 packages, released in lockstep'
	];
</script>

<section class="reveal" aria-labelledby="reveal-title">
	<div class="reveal-inner">
		<header class="reveal-head">
			<p class="reveal-eyebrow">The whole idea</p>
			<h2 id="reveal-title">Write the class. Get the rest for free.</h2>
			<p class="reveal-intro">
				One decorated class is the single source of truth. From it, <span class="wordmark"
					>s-m-r-t</span
				> generates the surfaces your app and your agents actually use.
			</p>
		</header>

		<CodeBlock code={productClass} language="typescript" filename="product.ts" />

		<div class="divider" role="presentation">
			<span class="divider-line"></span>
			<span class="divider-label">one definition &rarr; four surfaces</span>
			<span class="divider-line"></span>
		</div>

		<div class="panels">
			{#each panels as panel, i (panel.key)}
				<article
					class="panel panel--{panel.key} reveal-anim"
					style="--stagger: {i * 90}ms"
				>
					<div class="panel-head">
						<span class="panel-label">{panel.label}</span>
						<span class="panel-hint">{panel.hint}</span>
					</div>
					<div class="panel-body">
						{#each panel.lines as line, li (li)}
							<div class="panel-line">
								{#if line.verb}<span class="verb">{line.verb}</span>{/if}<span
									class="path">{line.text}</span
								>
							</div>
						{/each}
					</div>
				</article>
			{/each}
		</div>

		<ul class="proof" aria-label="What you get out of the box">
			{#each proofChips as chip}
				<li class="proof-chip">
					<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
						<polyline points="20 6 9 17 4 12" />
					</svg>
					<span>{chip}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.reveal {
		padding: 80px 24px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.reveal-inner {
		max-width: 920px;
		margin: 0 auto;
	}

	.reveal-head {
		max-width: 720px;
		margin: 0 auto 40px;
		text-align: center;
	}

	.reveal-eyebrow {
		margin: 0 0 12px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--smrt-color-primary, #1976d2);
	}

	h2 {
		font-size: clamp(1.6rem, 3.5vw, 2.4rem);
		line-height: 1.2;
		font-weight: 700;
		letter-spacing: -0.01em;
		margin: 0 0 16px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.reveal-intro {
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--smrt-color-on-surface-variant, #555);
		margin: 0;
	}

	.wordmark {
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		color: var(--smrt-color-primary, #1976d2);
		white-space: nowrap;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 16px;
		margin: 36px 0 28px;
	}

	.divider-line {
		flex: 1;
		height: 1px;
		background: var(--smrt-color-outline-variant, #e5e5e5);
	}

	.divider-label {
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--smrt-color-on-surface-variant, #888);
		white-space: nowrap;
	}

	.panels {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.panel {
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: var(--smrt-radius-md, 8px);
		background: var(--smrt-color-surface, #fff);
		overflow: hidden;
		border-top: 3px solid var(--panel-accent, var(--smrt-color-primary, #1976d2));
	}

	.panel--rest {
		--panel-accent: var(--smrt-color-primary, #1976d2);
	}
	.panel--cli {
		--panel-accent: var(--smrt-color-tertiary, #7c3aed);
	}
	.panel--mcp {
		--panel-accent: var(--smrt-color-secondary, #0891b2);
	}
	.panel--sql {
		--panel-accent: var(--smrt-color-success, #059669);
	}

	.panel-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #eee);
	}

	.panel-label {
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--panel-accent);
		letter-spacing: 0.02em;
	}

	.panel-hint {
		font-size: 0.75rem;
		color: var(--smrt-color-on-surface-variant, #888);
	}

	.panel-body {
		padding: 14px 16px;
		overflow-x: auto;
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-size: 0.82rem;
		line-height: 1.7;
	}

	.panel-line {
		white-space: pre;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.verb {
		font-weight: 700;
		color: var(--panel-accent);
		margin-right: 0.5ch;
	}

	.path {
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.proof {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 10px 12px;
		justify-content: center;
		margin: 36px 0 0;
		padding: 0;
	}

	.proof-chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 7px 14px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--smrt-color-success, #059669) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--smrt-color-success, #059669) 30%, transparent);
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.proof-chip svg {
		color: var(--smrt-color-success, #059669);
		flex-shrink: 0;
	}

	/* Staggered fade-in, gated behind reduced-motion. */
	.reveal-anim {
		opacity: 0;
		transform: translateY(12px);
		animation: reveal-fade 0.5s ease forwards;
		animation-delay: var(--stagger, 0ms);
	}

	@keyframes reveal-fade {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal-anim {
			opacity: 1;
			transform: none;
			animation: none;
		}
	}

	@media (max-width: 640px) {
		.reveal {
			padding: 56px 16px;
		}
		.panels {
			grid-template-columns: 1fr;
		}
	}
</style>
