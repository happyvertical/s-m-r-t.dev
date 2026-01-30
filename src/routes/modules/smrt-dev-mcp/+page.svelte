<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>smrt-dev-mcp - MCP Server | SMRT Framework</title>
  <meta name="description" content="Model Context Protocol server for Claude integration with SMRT objects." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">smrt-dev-mcp</h1>
    <p class="text-xl text-gray-600 mb-4">
      Model Context Protocol (MCP) server for Claude Code integration, providing direct object access from Claude chat.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">MCP</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Claude</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>smrt-dev-mcp</strong> is an MCP server that exposes SMRT objects to Claude Code, enabling natural
      language interactions with your database objects directly from Claude chat.
    </p>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Installation</h2>
    <CodeBlock code={`npm install @happyvertical/smrt-dev-mcp`} language="bash" />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Quick Start</h2>
    <CodeBlock
      code={`// smrt.config.ts
export default {
  mcp: {
    enabled: true,
    port: 3100
  }
};

// Enable MCP in decorator
@smrt({
  mcp: true,  // Enable all operations
  // OR specify operations:
  mcp: {
    include: ['list', 'get', 'sync', 'incorporateFeedback']
  }
})
class Issue extends SmrtObject {
  // ...
}

// Start MCP server
npx smrt-dev-mcp start`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Claude Code Integration</h2>
    <p class="mb-4">
      Once running, Claude Code can interact with your objects:
    </p>
    <CodeBlock
      code={`User: List all open issues
Claude: [Uses MCP to call issues.list({ where: { state: 'open' } })]

User: Incorporate feedback on issue-42
Claude: [Uses MCP to call issues.incorporateFeedback(issue-42)]`}
      language="text"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Related Modules</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="/modules/smrt-core" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-core</h3>
        <p class="text-sm text-gray-600">Core framework with @smrt decorator</p>
      </a>
      <a href="/modules/smrt-cli" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-cli</h3>
        <p class="text-sm text-gray-600">Command-line interface</p>
      </a>
    </div>
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/smrt-vitest" class="text-blue-600 hover:underline">Next: smrt-vitest →</a>
    </div>
  </div>
</div>
