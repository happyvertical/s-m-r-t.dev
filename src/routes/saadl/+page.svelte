<script lang="ts">
	/**
	 * /saadl — the canonical definition page for the term the site is built
	 * around.
	 *
	 * Register: clinical and informative (per the epic brief in docs/). Define
	 * SAADL once, state the properties, ground the design rationale, contrast
	 * what doesn't qualify, and point at how s-m-r-t implements it. Claims are
	 * structural rather than version-dependent counts, so this page doesn't
	 * drift with releases; specifics live on /modules and /docs.
	 */
	import Grid from '$lib/components/Grid.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	// One definition -> generated surfaces. Kept as a plain template-literal
	// string so CodeBlock renders braces literally (check:templates-safe).
	const shapeExample = `@smrt({ api: true, cli: true, mcp: true })
export class Product extends SmrtObject {
  name: string = '';
  price: number = 0.0;

  async research(query: string) {
    return this.do(\`Research this product and answer: \${query}\`);
  }
}

// One definition. The operational surfaces are generated from it:
//   REST   GET /api/v1/products · POST /api/v1/products · ...
//   CLI    product:list · product:get · product:create · product:research
//   MCP    product_list · product_get · product_create · product_research
//   UI     composed from the component library, typed against the model`;
</script>

<svelte:head>
	<title>What is a SAADL? - s-m-r-t Framework</title>
	<meta
		name="description"
		content="SAADL — Software as Agentic Domain Logic: software whose domain logic exposes the same operations to human users (UI, HTTP, CLI) and to software agents (callable tools). The definition, the rationale, and how s-m-r-t implements it."
	/>
</svelte:head>

<Grid>
	<div class="page-header">
		<nav class="breadcrumb">
			<span>SAADL</span>
		</nav>
		<h1>What is a SAADL?</h1>
		<p class="lead">
			<strong>SAADL</strong> (pronounced <em>saddle</em>) is <strong>S</strong>oftware
			<strong>a</strong>s <strong>A</strong>gentic <strong>D</strong>omain
			<strong>L</strong>ogic: software whose domain logic exposes the same operations to human
			users — a UI, HTTP, a command line — and to software agents, as callable tools.
		</p>
	</div>

	<section>
		<h2>The shape</h2>
		<p>
			In a SAADL application the domain model is the single source of truth. The interfaces are
			projections of it: the screens people use, the REST API, the CLI, and the tools an agent
			calls are generated from — or resolve to — one definition. Parity between the human surface
			and the agent surface is a property of the build, not a feature that has to be kept alive by
			hand.
		</p>
		<CodeBlock code={shapeExample} language="typescript" />
	</section>

	<section>
		<h2>Agents on both sides of the software</h2>
		<p>A SAADL is built for two kinds of agent, and they benefit from the same properties.</p>
		<ul>
			<li>
				<strong>Agent operators</strong> use the running application. Every operation a person
				performs through the UI exists as a callable tool, resolved through the same collections,
				the same permission checks, and the same field policies. The agent is a first-class
				operator — not a client of a reduced, separately-maintained “bot API,” so its surface
				cannot fall behind the human one.
			</li>
			<li>
				<strong>Agentic coders</strong> build and maintain the application. The domain idiom is one
				pattern repeated — define a class, get the surfaces — and the build emits a
				machine-readable manifest of every object, field, relationship, and generated tool. An
				agent working on the codebase orients from the manifest instead of crawling the tree, and
				writes one definition instead of five surfaces.
			</li>
		</ul>
	</section>

	<section>
		<h2>Design rationale</h2>
		<p>The pattern follows from a few constraints, stated plainly:</p>
		<ul>
			<li>
				<strong>Tokens are a real cost.</strong> Agents write, read, and review by the token. One
				definition that generates the schema, API, CLI, and agent tools is cheaper to produce — and
				cheaper to re-read — than five hand-written surfaces kept in agreement. The same goes for
				UI: a shared component library beats regenerating the same table, form, and modal in every
				project.
			</li>
			<li>
				<strong>Review concentrates where the risk is.</strong> Business logic is authored in one
				place. The generated surfaces are derived from it, so reviewing the definition reviews the
				system — there is no drift between what the API does and what the CLI does.
			</li>
			<li>
				<strong>The codebase carries its own map.</strong> The build scans the source and emits a
				manifest of every object, field, and generated tool. The generators consume that same
				manifest, so the map cannot go stale — and an agent maintaining the system starts from a
				map rather than re-deriving structure file by file.
			</li>
			<li>
				<strong>Agents operate at full capability.</strong> The agent surface is generated from the
				same definition as the human surfaces, with the same permission model and the same
				sensitive-field policy. Nothing about it is hand-maintained, and nothing about it is
				second-class.
			</li>
			<li>
				<strong>Infrastructure is swappable.</strong> AI providers and databases sit behind
				adapters selected by a config field, and the dependency count is kept low. The domain
				logic outlives any particular vendor, model, or engine.
			</li>
			<li>
				<strong>Hardening flows downstream.</strong> Fixes and improvements land once, upstream in
				the framework, and applications receive them as ordinary version bumps. Ten projects don’t
				mean ten copies of auth, tenancy, and billing to maintain.
			</li>
		</ul>
	</section>

	<section>
		<h2>What a SAADL is not</h2>
		<ul>
			<li>
				<strong>A chatbot beside an app.</strong> A chat panel wired to a hand-picked subset of
				endpoints gives the agent a partial, separately-maintained surface. Parity is the point; a
				sidebar is not parity.
			</li>
			<li>
				<strong>A UI generator.</strong> The human screens are composed from a component library,
				not conjured. What is generated is the operational surface beneath them — schema, API, CLI,
				and tools.
			</li>
			<li>
				<strong>Agent-only tooling.</strong> If people can’t operate it through an ordinary
				interface, it’s an agent tool, not agentic domain logic. The definition cuts both ways.
			</li>
		</ul>
	</section>

	<section class="last">
		<h2>s-m-r-t is a SAADL framework</h2>
		<p>
			Everything above is what s-m-r-t generates from a single <code>@smrt()</code> TypeScript
			class. The <a href="/">homepage</a> shows one definition becoming its surfaces, the
			<a href="/docs">docs</a> cover each surface in detail, and the
			<a href="/modules">modules index</a> lists what ships in the ecosystem.
		</p>
	</section>
</Grid>

<style>
	.page-header {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.breadcrumb {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
		margin-bottom: 1rem;
		font-size: 0.875rem;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.lead {
		font-size: 1.125rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 16px;
		line-height: 1.6;
		max-width: 820px;
	}

	section {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	section.last {
		border-bottom: none;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 24px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	p {
		margin-bottom: 12px;
		line-height: 1.7;
		color: var(--smrt-color-on-surface, #333);
		max-width: 820px;
	}

	ul {
		margin-bottom: 16px;
		padding-left: 24px;
		max-width: 820px;
	}

	li {
		margin-bottom: 14px;
		line-height: 1.7;
		color: var(--smrt-color-on-surface, #333);
	}

	li strong {
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	code {
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 2px 6px;
		border-radius: var(--smrt-radius-sm, 4px);
		font-family: var(--smrt-font-family-mono, ui-monospace, monospace);
		font-size: 0.9em;
		color: var(--smrt-color-on-surface, #333);
	}

	a {
		color: var(--smrt-color-primary, #1976d2);
	}
</style>
