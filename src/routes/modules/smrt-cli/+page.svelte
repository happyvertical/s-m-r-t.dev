<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-cli - Developer CLI | SMRT Framework</title>
	<meta
		name="description"
		content="Developer CLI for the SMRT framework with introspection, code generation, database management, and auto-generated CRUD commands."
	/>
</svelte:head>

<ModulePage
	name="smrt-cli"
	description="Developer CLI for introspection, code generation, database management, and auto-generated CRUD commands for SMRT objects."
	badges={['v0.20.44', 'CLI', 'Developer Tools']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-cli</strong> provides a developer CLI with lazy-loaded commands, manifest
			discovery, and class introspection. It auto-generates CRUD commands for all SMRT objects
			decorated with <code>@smrt({"{ cli: true }"})</code>, plus exposes custom methods as CLI commands.
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
smrt introspect --verbose    # Include detailed field information
smrt objects                 # List all registered SMRT objects
smrt schema <object>         # Show detailed schema for an object
smrt status                  # Show system status (database, AI, registry)`}
			language="bash"
		/>

		<h3>Database</h3>
		<CodeBlock
			code={`smrt db:status               # Show pending schema changes
smrt db:migrate              # Apply pending migrations
smrt db:diff --generate      # Generate migration from schema changes
smrt db:rollback             # Rollback last migration
smrt db:history              # Show migration history`}
			language="bash"
		/>

		<h3>Code Generation</h3>
		<CodeBlock
			code={`smrt generate:mcp            # Generate MCP server from registered objects
smrt generate:types          # Generate TypeScript declarations from manifest`}
			language="bash"
		/>

		<h3>Documentation</h3>
		<CodeBlock
			code={`smrt docs:claude             # Generate .claude/smrt-framework.md for consumer projects`}
			language="bash"
		/>

		<h3>Configuration and Export</h3>
		<CodeBlock
			code={`smrt config:export           # Export agent config for SSG
smrt export                  # Export data in various formats
smrt init                    # Initialize a new SMRT project`}
			language="bash"
		/>

		<h3>Dispatch Management</h3>
		<CodeBlock
			code={`smrt dispatch:list           # List dispatch messages
smrt dispatch:process        # Process pending dispatches
smrt dispatch:retry          # Retry failed dispatches
smrt dispatch:cleanup        # Clean up old dispatch records`}
			language="bash"
		/>

		<h3>Git Integration</h3>
		<CodeBlock
			code={`smrt git:init                # Configure JSON-aware merge driver
smrt merge-json <base> <ours> <theirs>  # Manual JSON merge`}
			language="bash"
		/>

		<h3>Scaffolding</h3>
		<CodeBlock
			code={`smrt gnode create <name>     # Create new gnode from template
smrt gnode list-templates    # Show available templates`}
			language="bash"
		/>
	</section>

	<section>
		<h2>Auto-Generated Object Commands</h2>
		<p>
			For each registered SMRT object with <code>cli: true</code>, the CLI generates CRUD commands
			plus any custom methods:
		</p>
		<CodeBlock
			code={`# Pattern: <object>:<operation>
smrt agent:list              # List agents with filtering
smrt agent:get <id>          # Get agent by ID or slug
smrt agent:create            # Create new agent (interactive)
smrt agent:update <id>       # Update existing agent
smrt agent:delete <id>       # Delete agent

# Custom methods (auto-discovered from manifests)
smrt agent:research abc123 --query "AI safety"`}
			language="bash"
		/>
	</section>

	<section>
		<h2>Configuration</h2>
		<CodeBlock
			code={`// Enable CLI in decorator
@smrt({
  cli: true,  // Enable all operations
  // OR specify operations:
  cli: {
    include: ['list', 'get', 'create', 'incorporateFeedback', 'rollback']
  }
})
class Issue extends SmrtObject {
  // ...
}`}
			language="typescript"
		/>

		<h3>CLI Configuration (smrt.config.js)</h3>
		<CodeBlock
			code={`export default {
  packages: {
    cli: {
      entryPoint: './dist/index.js',  // default: auto-detect from package.json
      database: {
        type: 'sqlite',               // 'sqlite' | 'postgres'
        url: './data.db'              // default: ':memory:'
      },
      format: 'table',                // 'table' | 'json' | 'yaml' | 'plain'
    }
  }
};`}
			language="javascript"
		/>

		<h3>Entry Point Discovery</h3>
		<ol>
			<li>Explicit <code>entryPoint</code> in config</li>
			<li><code>package.json</code> exports <code>['.'].import</code> or <code>['.']</code></li>
			<li><code>package.json</code> <code>main</code> field</li>
			<li>Fallback: <code>./dist/index.js</code></li>
		</ol>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="related-modules">
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>Core framework with @smrt decorator</p>
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
