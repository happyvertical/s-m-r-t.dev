<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-cli - Command Line Interface | SMRT Framework</title>
	<meta
		name="description"
		content="Auto-generated CLI commands for SMRT objects with CRUD operations, queries, and custom actions."
	/>
</svelte:head>

<ModulePage
	name="smrt-cli"
	description="Developer CLI for SMRT framework with code generation, project scaffolding, and deployment tools."
	badges={['v0.19.0', 'CLI', 'Developer Tools']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-cli</strong> automatically generates CLI commands for all SMRT objects decorated
			with @smrt({'{ cli: true }'}). Provides list, get, create, update, delete operations plus
			custom methods.
		</p>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install -g @happyvertical/smrt-cli`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`# List all available commands
smrt --help

# List objects
smrt events list --limit 10
smrt profiles list --where '{"status":"active"}'

# Get object by ID
smrt events get event-123

# Create object
smrt profiles create --name "John Doe" --email "john@example.com"

# Update object
smrt profiles update profile-456 --status inactive

# Delete object
smrt events delete event-789

# Custom methods (from @smrt decorator)
smrt issues incorporateFeedback issue-42 --applyUpdate true
smrt issues rollback issue-42`}
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
				<p>MCP server for Claude integration</p>
			</a>
		</div>
	</section>

	<nav class="page-nav">
		<a href="/modules">← Back to Modules</a>
		<a href="/modules/smrt-dev-mcp">Next: smrt-dev-mcp →</a>
	</nav>
</ModulePage>
