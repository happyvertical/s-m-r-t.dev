<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-cli - Developer CLI | SMRT Framework</title>
	<meta
		name="description"
		content="Developer CLI for the SMRT framework with introspection, code generation, database management, dispatch tools, and auto-generated CRUD commands."
	/>
</svelte:head>

<ModulePage
	name="smrt-cli"
	description="Developer CLI with lazy-loaded commands, manifest discovery, and class introspection. Auto-generates CRUD commands for SMRT objects with cli: true in their @smrt() decorator."
	badges={['v0.29.34', 'CLI', 'Developer Tools']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-cli</strong> is the developer-facing CLI for the SMRT framework. Commands are
			lazy-loaded via dynamic import (~100ms overhead on first use), and the CLI auto-discovers your
			project's <code>.smrt/manifest.json</code> plus every installed
			<code>@happyvertical/smrt-*</code> package. For each registered SMRT object with
			<code>cli: true</code> in its <code>@smrt()</code> decorator, the CLI generates CRUD commands and
			exposes custom methods as additional subcommands.
		</p>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add -D @happyvertical/smrt-cli`} language="bash" />
	</section>

	<section>
		<h2>Commands</h2>

		<h3>Introspection</h3>
		<CodeBlock
			code={`smrt introspect              # Discover SMRT objects in project
smrt objects                 # List all registered SMRT objects
smrt schema <object>         # Show detailed schema for an object`}
			language="bash"
		/>

		<h3>Database</h3>
		<CodeBlock
			code={`smrt db:status               # Show migration status (applied, pending, drift)
smrt db:migrate              # Apply pending schema changes
smrt db:diff                 # Compare manifest schema to database
smrt db:rollback             # Rollback last migration
smrt db:history              # Show migration history`}
			language="bash"
		/>
		<p>
			File-backed migrations are no longer supported, so <code>db:diff</code>'s old
			<code>--generate</code> / <code>--name</code> flags now report "unsupported" — schema changes
			are applied directly via <code>db:migrate</code>.
		</p>

		<h3>Documentation</h3>
		<CodeBlock
			code={`smrt docs:agents             # Generate AGENTS.md for consumer projects (canonical)
smrt docs:claude             # Deprecated alias of docs:agents (Claude-compatible output)`}
			language="bash"
		/>
		<p>
			<code>docs:agents</code> concatenates the <code>AGENTS.md</code> files of every installed
			<code>@happyvertical/smrt-*</code> package, prefixed with version tables, into a single
			downstream-ready file. <code>docs:claude</code> remains as a deprecated compatibility alias.
			Source: <code>packages/cli/src/commands/docs-claude.ts</code>.
		</p>

		<h3>Dispatch Management</h3>
		<CodeBlock
			code={`smrt dispatch:list           # List dispatch messages
smrt dispatch:process        # Process pending dispatches
smrt dispatch:retry          # Retry failed dispatches
smrt dispatch:cleanup        # Clean up old dispatch records`}
			language="bash"
		/>

		<h3>Playground & Code Generation</h3>
		<CodeBlock
			code={`smrt playground:init         # Scaffold a developer playground
smrt playground:dev          # Run the developer playground
smrt generate-mcp            # Generate MCP server from registered objects (alias: mcp)
smrt config:export           # Export agent config for SSG
smrt init                    # Initialize a new SMRT project (alias: setup)
smrt gnode create            # Scaffold a gnode site`}
			language="bash"
		/>

		<aside>
			<p>
				<strong>Deprecated:</strong> <code>smrt test</code> still exists but is deprecated -- run
				<code>pnpm exec vitest</code> via the
				<a href="/modules/smrt-vitest">smrt-vitest plugin</a> instead (the plugin generates the test manifest
				automatically).
			</p>
		</aside>
	</section>

	<section>
		<h2>Auto-Generated Object Commands</h2>
		<p>
			Every SMRT object registered with <code>cli: true</code> gets a generated CRUD command group, plus
			custom methods discovered from the manifest:
		</p>
		<CodeBlock
			code={`# Pattern: <object>:<operation>
smrt agent:list                                # List agents with filtering
smrt agent:get <id>                            # Get agent by ID or slug
smrt agent:create --name "researcher"          # Create new agent (interactive supported)
smrt agent:update <id> --name "updated"        # Update existing agent
smrt agent:delete <id>                         # Delete agent

# Custom methods (auto-discovered from manifests)
smrt agent:research abc123 --query "AI safety"`}
			language="bash"
		/>
	</section>

	<section>
		<h2>Configuration</h2>
		<CodeBlock
			code={`@smrt({
  cli: true,  // Enable all CRUD operations
  // OR specify operations:
  // cli: { include: ['list', 'get', 'create', 'incorporateFeedback', 'rollback'] }
})
class Issue extends SmrtObject {
  title: string = '';
  status: 'open' | 'closed' = 'open';
}`}
			language="typescript"
		/>

		<h3>CLI Configuration (smrt.config.js)</h3>
		<CodeBlock
			code={`export default {
  packages: {
    cli: {
      entryPoint: './dist/index.js', // default: auto-detected from package.json
      database: {
        type: 'sqlite',              // 'sqlite' | 'postgres'
        url: './data.db'             // default: ':memory:'
      },
      format: 'table',               // 'table' | 'json' | 'yaml' | 'plain'
    }
  }
};`}
			language="javascript"
		/>

		<h3>Entry Point Discovery</h3>
		<ol>
			<li>Explicit <code>entryPoint</code> in config (highest)</li>
			<li>
				<code>package.json</code> <code>exports['.'].import</code> or <code>exports['.']</code>
			</li>
			<li><code>package.json</code> <code>main</code> field</li>
			<li>Fallback: <code>./dist/index.js</code></li>
		</ol>
	</section>

	<section>
		<h2>Architecture</h2>
		<ul>
			<li>
				<strong>Lazy command loading</strong> -- each command is loaded on demand (~100ms first-use overhead)
			</li>
			<li>
				<strong>Manifest discovery</strong> -- auto-finds <code>.smrt/manifest.json</code> and scans
				<code>node_modules/@happyvertical/smrt-*</code>
			</li>
			<li>
				<strong>Class loading order</strong> -- <code>config.entryPoint</code> →
				<code>package.json exports['.']</code> → <code>package.json main</code> →
				<code>./dist/index.js</code>
			</li>
			<li>
				<strong>Object method exposure</strong> -- custom methods on SMRT objects auto-become CLI subcommands
			</li>
		</ul>

		<h3>Key Files</h3>
		<ul>
			<li>
				<code>src/cli-generator.ts</code> -- core dispatcher, lazy command loading, class loading
			</li>
			<li><code>src/commands/</code> -- individual command implementations</li>
			<li>
				<code>src/loaders/</code> -- class-loader, local-loader, npm-loader, git-loader, template-loader
			</li>
			<li><code>src/discovery/manifest-discovery.ts</code> -- manifest auto-discovery</li>
			<li>
				<code>src/commands/docs-claude.ts</code> -- downstream CLAUDE.md generation (~550 lines)
			</li>
		</ul>
	</section>

	<section>
		<h2>Gotchas</h2>
		<ul>
			<li>
				<strong>Test mode detection</strong>: checks <code>NODE_ENV=test</code>,
				<code>VITEST=true</code>, and globals like <code>it</code> / <code>describe</code> -- can collide
				with other test runners.
			</li>
			<li>
				<strong>External package load failures are silenced</strong>: one broken package won't
				prevent others from loading.
			</li>
			<li>
				<strong>Schema history nuance</strong>: <code>db:status</code> / <code>db:history</code> should
				distinguish active live drift from superseded failed generated schema repairs. Treating every
				failed row as a current blocker is a known follow-up.
			</li>
		</ul>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="related-modules">
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>Core framework with the @smrt() decorator</p>
			</a>
			<a href="/modules/smrt-dev-mcp">
				<h3>smrt-dev-mcp</h3>
				<p>Tier 2 MCP server for development</p>
			</a>
			<a href="/modules/smrt-config">
				<h3>smrt-config</h3>
				<p>Configuration loading</p>
			</a>
		</div>
	</section>

	<nav class="page-nav">
		<a href="/modules">← Back to Modules</a>
		<a href="/modules/smrt-dev-mcp">Next: smrt-dev-mcp →</a>
	</nav>
</ModulePage>

<style>
	aside {
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 16px;
		border-radius: 8px;
		margin: 16px 0;
		border-left: 4px solid var(--smrt-color-primary, #1976d2);
	}

	aside p {
		margin: 0;
	}

	.related-modules {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
		margin-top: 24px;
	}

	.related-modules a {
		padding: 20px;
		background: #fafafa;
		text-decoration: none;
		border: 1px solid transparent;
		transition: all 0.2s;
	}

	.related-modules a:hover {
		background: var(--smrt-color-surface-container, #f0f0f0);
		border-color: var(--smrt-color-primary, #1976d2);
	}

	.related-modules h3 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 8px 0;
	}

	.related-modules p {
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin: 0;
	}

	.page-nav {
		display: flex;
		justify-content: space-between;
		margin: 48px 0 24px;
		padding-top: 24px;
		border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}
</style>
