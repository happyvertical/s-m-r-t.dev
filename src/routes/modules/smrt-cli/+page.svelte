<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>smrt-cli - Command Line Interface | SMRT Framework</title>
  <meta name="description" content="Auto-generated CLI commands for SMRT objects with CRUD operations, queries, and custom actions." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">smrt-cli</h1>
    <p class="text-xl text-gray-600 mb-4">
      Auto-generated command-line interface for SMRT objects with CRUD operations, queries, and custom actions.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">CLI</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Auto-generated</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>smrt-cli</strong> automatically generates CLI commands for all SMRT objects decorated with @smrt({'{ cli: true }'}).
      Provides list, get, create, update, delete operations plus custom methods.
    </p>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Installation</h2>
    <CodeBlock code={`npm install -g @happyvertical/smrt-cli`} language="bash" />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Quick Start</h2>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Configuration</h2>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Related Modules</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="/modules/smrt-core" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-core</h3>
        <p class="text-sm text-gray-600">Core framework with @smrt decorator</p>
      </a>
      <a href="/modules/smrt-dev-mcp" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-dev-mcp</h3>
        <p class="text-sm text-gray-600">MCP server for Claude integration</p>
      </a>
    </div>
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/smrt-dev-mcp" class="text-blue-600 hover:underline">Next: smrt-dev-mcp →</a>
    </div>
  </div>
</div>
