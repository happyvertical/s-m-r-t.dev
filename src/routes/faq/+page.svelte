<script lang="ts">
	/**
	 * FAQ — reworked for the SAADL positioning and the 0.37 line.
	 *
	 * Register: inform, don't convince. Every technical claim here was verified
	 * against the installed 0.37 packages (or the published npmjs tarballs for
	 * packages the site doesn't depend on: smrt-cli, smrt-vitest). Version
	 * numbers are deliberately absent — surfaces that display a version read it
	 * from $lib/version. The "what does s-m-r-t stand for" item is preserved
	 * verbatim and stays the last question on the page.
	 */
	import Grid from '$lib/components/Grid.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
</script>

<svelte:head>
	<title>FAQ - s-m-r-t Framework</title>
	<meta
		name="description"
		content="Frequently asked questions about the s-m-r-t framework: what it generates, how agents operate it, databases, AI providers, multi-tenancy, background jobs, testing, and troubleshooting."
	/>
</svelte:head>

<Grid>
	<div class="page-header">
		<nav class="breadcrumb">
			<span>FAQ</span>
		</nav>
		<h1>Frequently Asked Questions</h1>
		<p class="lead">
			Common questions about the s-m-r-t framework, setup, troubleshooting, and best practices.
		</p>
	</div>

	<!-- Getting Started -->
	<section>
		<h2>Getting started</h2>

		<div class="faq-item">
			<h3>What is s-m-r-t?</h3>
			<p>
				A TypeScript framework for building software that people and agents both operate. You
				define a domain model once — a class with the <code>@smrt()</code> decorator — and the
				framework generates its database schema, REST API, CLI commands, and MCP tools from that
				one definition. Humans reach the objects through a UI, HTTP, or the command line; agents
				call the same objects as tools.
			</p>
		</div>

		<div class="faq-item">
			<h3>What is a SAADL?</h3>
			<p>
				SAADL (pronounced <em>saddle</em>) is Software as Agentic Domain Logic: software whose
				domain logic exposes the same operations to human users — a UI, HTTP, a command line — and
				to software agents, as callable tools. It complements any harness. s-m-r-t is a SAADL
				framework. <a href="/saadl">Read the full definition</a>.
			</p>
		</div>

		<div class="faq-item">
			<h3>Is s-m-r-t an agent framework or a harness?</h3>
			<p>
				No. s-m-r-t doesn't run agents — it's the application layer agents operate. Whatever runs
				your agent (an IDE agent, a CLI coder, a custom loop) drives the same generated MCP tools,
				CLI, and HTTP API. Nothing about a s-m-r-t application is harness-specific.
			</p>
		</div>

		<div class="faq-item">
			<h3>How do I start a project?</h3>
			<p>Three paths, in order of how much you want pre-wired:</p>
			<ul>
				<li>
					<strong>The SaaS starter</strong> — a working multi-tenant app with auth, billing,
					agents, and UI already assembled. See <a href="/">Get started</a> on the homepage.
				</li>
				<li>
					<strong>An existing SvelteKit app</strong> — run <code>npx smrt init</code> to scaffold
					s-m-r-t into it, or start from the
					<a href="/modules/template-sveltekit">template-sveltekit</a> scaffold.
				</li>
				<li>
					<strong>Just the library</strong> — <code>pnpm add @happyvertical/smrt-core</code> for the
					object + database + AI layer alone.
				</li>
			</ul>
		</div>

		<div class="faq-item">
			<h3>Where do the packages come from?</h3>
			<p>
				The public npm registry, under the <code>@happyvertical</code> scope — around forty
				packages, released in lockstep from one monorepo, so matching versions always work
				together. No registry authentication is required. (Older docs that mention GitHub Packages
				are out of date; the packages moved to npmjs.)
			</p>
		</div>
	</section>

	<!-- Data Modeling -->
	<section>
		<h2>Data modeling</h2>

		<div class="faq-item">
			<h3>What exactly gets generated from a @smrt() class?</h3>
			<p>
				The database schema is always derived from the class. The other surfaces are opt-in flags
				on the decorator:
			</p>
			<CodeBlock
				code={`@smrt({
  api: true,   // REST CRUD + filter operators + an OpenAPI 3.0.3 spec
  cli: true,   // commands like product:list, product:get, product:create
  mcp: true    // agent tools like product_list, product_get, product_create
  // or scope any surface: api: { include: ['list', 'get', 'create'] }
})
class Product extends SmrtObject {
  // ...
}`}
				language="typescript"
			/>
			<p>
				Custom async methods are exposed too — a <code>research()</code> method becomes
				<code>product:research</code> on the CLI and <code>product_research</code> as an MCP tool.
				All surfaces resolve to the same collection; none of them is hand-maintained.
			</p>
		</div>

		<div class="faq-item">
			<h3>How are column types inferred?</h3>
			<p>
				From your field initializers, at build time (an AST scan — not runtime reflection).
				<code>''</code> becomes TEXT, <code>0</code> becomes INTEGER, <code>0.0</code> becomes
				DECIMAL (the decimal point in the source literal is the signal), <code>false</code> becomes
				BOOLEAN, <code>new Date()</code> becomes TIMESTAMP, and arrays/objects become JSON. Every
				table also gets <code>id</code>, <code>created_at</code>, and <code>updated_at</code>.
			</p>
		</div>

		<div class="faq-item">
			<h3>How do I define relationships between models?</h3>
			<p>
				Use <code>@foreignKey()</code> for same-package references — it becomes a UUID column with
				a real foreign-key constraint. For cross-package references use
				<code>@crossPackageRef()</code> (a UUID column without the constraint, which avoids
				circular package dependencies) or a plain string ID:
			</p>
			<CodeBlock
				code={`import { smrt, SmrtObject, foreignKey } from '@happyvertical/smrt-core';

@smrt()
class Order extends SmrtObject {
  // Same-package: real FK constraint
  @foreignKey(Customer)
  customerId: string = '';

  // Cross-package: plain string ID (avoids circular deps)
  tenantId: string = '';
}`}
				language="typescript"
			/>
		</div>

		<div class="faq-item">
			<h3>What's the difference between CTI and STI?</h3>
			<p>
				<strong>CTI (Class Table Inheritance):</strong> Each class gets its own table. More
				normalized but requires joins.<br />
				<strong>STI (Single Table Inheritance):</strong> All subclasses share one table with a discriminator
				field. Faster queries but denormalized.
			</p>
			<p>
				Use CTI when subclasses have many unique fields; use STI when they're similar. STI is
				enabled with <code>tableStrategy: 'sti'</code> on the base class — subclasses share its
				table, discriminated by <code>_meta_type</code>, with child-only fields stored in a
				<code>_meta_data</code> JSON column.
			</p>
		</div>

		<div class="faq-item">
			<h3>How do I add computed properties?</h3>
			<p>Use TypeScript getters with <code>@field({'{'} transient: true {'}'})</code> for non-persisted properties:</p>
			<CodeBlock
				code={`@smrt()
class Order extends SmrtObject {
  subtotal: number = 0.0;    // DECIMAL
  taxRate: number = 0.0;     // DECIMAL

  @field({ transient: true })
  get total(): number {
    return this.subtotal * (1 + this.taxRate);
  }
}`}
				language="typescript"
			/>
		</div>

		<div class="faq-item">
			<h3>Can I use s-m-r-t with an existing database?</h3>
			<p>
				Yes — models map to tables, so you write classes that match your existing tables. s-m-r-t
				does not reverse-engineer classes from a schema; the class you write is the source of
				truth, and the runtime verifies its table exists rather than creating it. Use
				<code>smrt db:diff</code> to see where your models and the live schema disagree, and
				<code>smrt db:validate</code> to check the result.
			</p>
		</div>

		<div class="faq-item">
			<h3>Do I need to know SQL?</h3>
			<p>
				No. s-m-r-t abstracts database operations into TypeScript methods. Understanding basic
				database concepts (tables, relationships, indexes) still helps for building efficient
				applications.
			</p>
		</div>
	</section>

	<!-- AI & Agents -->
	<section>
		<h2>AI &amp; agents</h2>

		<div class="faq-item">
			<h3>How do agents operate my application?</h3>
			<p>
				Set <code>mcp: true</code> on a class and s-m-r-t generates an MCP server with one tool per
				operation — <code>product_list</code>, <code>product_get</code>,
				<code>product_create</code>, <code>product_update</code>, <code>product_delete</code>, plus
				one per exposed custom method. Any MCP-capable client can call them. Agents that prefer a
				shell get the generated CLI; anything else can use the HTTP API. All three resolve to the
				same collections.
			</p>
		</div>

		<div class="faq-item">
			<h3>Do agents bypass permissions or see more data?</h3>
			<p>
				No. Agent tools run through the same collections and the same permission checks as the
				HTTP API and CLI, and fields marked <code>sensitive</code> are stripped from every
				generated surface — REST responses and MCP tool results alike. The agent surface is
				generated with parity, not with elevated access.
			</p>
		</div>

		<div class="faq-item">
			<h3>What are is() and do()?</h3>
			<p>
				Two AI methods every persisted object has. <code>await obj.is('criteria in plain language')</code>
				returns a boolean; <code>await obj.do('an instruction')</code> returns the model's text.
				The instruction is sent to the model along with the object's callable methods as tools —
				the object's field data is not serialized into the prompt; the model reaches data by
				calling the tools.
			</p>
		</div>

		<div class="faq-item">
			<h3>Which AI providers are supported?</h3>
			<p>
				OpenAI, Anthropic, Google Gemini, AWS Bedrock, Hugging Face, Ollama, and a local Claude
				CLI — selected by one <code>type</code> field in config, behind one interface, so calling
				code doesn't change when you switch. Ollama and the Claude CLI run against your own
				machine with no API key.
			</p>
		</div>

		<div class="faq-item">
			<h3>Does semantic search require a separate vector database?</h3>
			<p>
				No. Enable embeddings on a class (<code>embeddings: {'{'} provider: 'local' | 'ai' | 'auto' {'}'}</code>)
				and run <code>semanticSearch()</code> as an ordinary collection query against your existing
				database. Objects also carry a context memory — <code>remember()</code> and
				<code>recall()</code> — persisted alongside your data.
			</p>
		</div>

		<div class="faq-item">
			<h3>What runs in the browser?</h3>
			<p>
				Speech-to-text (Whisper), text-to-speech (the Web Speech API), and small-LLM inference
				(via WebGPU) — on-device, with model weights cached in the browser so they download once.
				A capability gate detects what each browser supports and degrades gracefully. See
				<a href="/modules/smrt-svelte">smrt-svelte</a>.
			</p>
		</div>
	</section>

	<!-- Configuration & Operations -->
	<section>
		<h2>Configuration &amp; operations</h2>

		<div class="faq-item">
			<h3>How do I configure database connections?</h3>
			<p>
				Create a <code>smrt.config.ts</code> with <code>defineConfig()</code>. The top-level keys are
				<code>smrt</code> (global options), <code>modules</code> (module-scoped config), and
				<code>packages</code> (package-scoped config). The CLI's database connection lives under
				<code>packages.cli.database</code> as a <code>{'{'} type, url {'}'}</code> pair:
			</p>
			<CodeBlock
				code={`import { defineConfig } from '@happyvertical/smrt-config';

export default defineConfig({
  smrt: {
    environment: 'production',
    embeddings: { provider: 'local' }
  },
  packages: {
    cli: {
      database: {
        type: 'postgres',
        url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/myapp'
      }
    }
  }
});

// For SQLite: { type: 'sqlite', url: 'myapp.db' }`}
				language="typescript"
			/>
			<Callout variant="note" title="Passing a connection at runtime">
				At runtime you pass the database to a collection or object directly via the
				<code>db</code> option — e.g. <code>await TaskCollection.create({'{'} db {'}'})</code>. The
				config above is what the <code>smrt db:*</code> CLI commands read.
			</Callout>
		</div>

		<div class="faq-item">
			<h3>Which databases are supported?</h3>
			<p>
				SQLite, PostgreSQL, DuckDB, and JSON files — one interface, selected by a config field, so
				the model code doesn't change when you switch. With no database configured, objects use an
				in-memory SQLite database, which is convenient for tests and throwaway scripts.
			</p>
		</div>

		<div class="faq-item">
			<h3>How do I set up multi-tenancy?</h3>
			<p>
				Use the <a href="/modules/smrt-tenancy">smrt-tenancy</a> module with the @TenantScoped decorator.
				All queries will automatically filter by the current tenant context — isolation is applied
				by a framework-level query interceptor, not by remembering to add
				<code>WHERE tenant_id</code> in application code.
			</p>
		</div>

		<div class="faq-item">
			<h3>How do I run migrations?</h3>
			<p>
				Inspect the difference between your models and the live schema, then apply it:
			</p>
			<CodeBlock
				code={`smrt db:diff      # show schema difference
smrt db:migrate   # apply migrations
smrt db:status    # migration state
smrt db:rollback  # roll back`}
				language="bash"
			/>
		</div>

		<div class="faq-item">
			<h3>Do background jobs survive a restart?</h3>
			<p>
				Yes. Defer any object method with <code>obj.bg('methodName')</code> — jobs persist to your
				database, are claimed atomically so multiple workers never run the same job twice, and a
				lease mechanism recovers jobs whose worker died. Retries, priorities, delays, and timeouts
				are configurable per job. See <a href="/modules/smrt-jobs">smrt-jobs</a>.
			</p>
		</div>

		<div class="faq-item">
			<h3>How do I test s-m-r-t applications?</h3>
			<p>
				Use <a href="/modules/smrt-vitest">smrt-vitest</a> with <code>smrtVitestPlugin()</code> in your vitest config and <code>createIsolatedTestDb()</code> for DB isolation:
			</p>
			<CodeBlock
				code={`import { createIsolatedTestDb } from '@happyvertical/smrt-vitest';

describe('Task Tests', () => {
  it('should create task', async () => {
    const db = await createIsolatedTestDb();
    const tasks = await TaskCollection.create({ db });

    const task = await tasks.create({
      title: 'Test Task'
    });

    expect(task.title).toBe('Test Task');
  });
});`}
				language="typescript"
			/>
		</div>

		<div class="faq-item">
			<h3>How do I optimize queries?</h3>
			<ul>
				<li>Use <code>limit</code> and <code>offset</code> for pagination</li>
				<li>Use <code>orderBy</code> for sorted results</li>
				<li>Set <code>conflictColumns</code> in @smrt() for efficient upsert operations</li>
				<li>Use <code>listByIds()</code> for batch fetching (single query)</li>
				<li>Use <code>getOrUpsert()</code> for find-or-create patterns</li>
			</ul>
		</div>
	</section>

	<!-- Troubleshooting -->
	<section>
		<h2>Troubleshooting</h2>

		<div class="faq-item">
			<h3>"No field metadata" errors</h3>
			<p>
				Field metadata comes from a build-time scan, not runtime reflection — so the scan has to
				run. Add <code>smrtPlugin()</code> (from
				<code>@happyvertical/smrt-core/vite-plugin</code>) to your Vite config, and
				<code>smrtVitestPlugin()</code> to your vitest config for tests. Without them there is no
				manifest, and no manifest means no fields.
			</p>
		</div>

		<div class="faq-item">
			<h3>Build fails with "Cannot find module"</h3>
			<p>
				The <code>@happyvertical/smrt-*</code> packages are released in lockstep — mixed versions
				are the usual cause. Align every smrt package to the same version, reinstall, and check
				for peer dependency warnings.
			</p>
		</div>

		<div class="faq-item">
			<h3>API endpoints return 404</h3>
			<p>Verify:</p>
			<ul>
				<li><code>api: true</code> is set in @smrt decorator</li>
				<li>API server is running</li>
				<li>Manifest was generated (run build)</li>
				<li>Correct port and prefix in config</li>
			</ul>
		</div>

		<div class="faq-item">
			<h3>TypeScript errors with decorators</h3>
			<p>
				Enable experimental decorators in <code>tsconfig.json</code>:
			</p>
			<CodeBlock
				code={`{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}`}
				language="json"
			/>
		</div>
	</section>

	<!-- The Name -->
	<section>
		<h2>The name</h2>

		<div class="faq-item">
			<h3>What does s-m-r-t stand for?</h3>
			<p>
				<a
					href="https://www.youtube.com/watch?v=ls5BFzuxGw4"
					target="_blank"
					rel="noopener noreferrer">https://www.youtube.com/watch?v=ls5BFzuxGw4</a
				>
			</p>
		</div>
	</section>

	<!-- More Help -->
	<section class="last">
		<h2>Still Need Help?</h2>
		<ul class="help-links">
			<li>
				<a href="/docs/getting-started">→ Read the Getting Started guide</a>
			</li>
			<li>
				<a href="/modules">→ Browse module documentation</a>
			</li>
			<li>
				<a href="https://github.com/happyvertical/smrt/issues" target="_blank" rel="noopener"
					>→ Report an issue on GitHub</a
				>
			</li>
			<li>
				<a href="https://github.com/happyvertical/smrt/discussions" target="_blank" rel="noopener"
					>→ Ask a question in Discussions</a
				>
			</li>
		</ul>
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

	.faq-item {
		margin-bottom: 32px;
	}

	.faq-item:last-child {
		margin-bottom: 0;
	}

	h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 12px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	p {
		margin-bottom: 12px;
		line-height: 1.7;
		color: var(--smrt-color-on-surface, #333);
	}

	ul {
		margin-bottom: 16px;
		padding-left: 24px;
	}

	li {
		margin-bottom: 8px;
		line-height: 1.6;
		color: var(--smrt-color-on-surface, #333);
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
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.help-links {
		list-style: none;
		padding: 0;
	}

	.help-links li {
		margin-bottom: 12px;
	}

	.help-links a {
		font-weight: 500;
	}
</style>
