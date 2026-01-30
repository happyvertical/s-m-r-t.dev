<script lang="ts">
  import ModulePage from '$lib/components/ModulePage.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage 
  name="smrt-dev-mcp" 
  description="Development MCP server for SMRT framework integration."
  badges={['v0.19.0', 'MCP', 'Developer Tools']}
>
  <section>
    <h2>Overview</h2>
    <p>
      <strong>smrt-dev-mcp</strong> is an MCP server that exposes SMRT objects to Claude Code, enabling natural
      language interactions with your database objects directly from Claude chat.
    </p>
  </section>

  <section>
    <h2>Installation</h2>
    <CodeBlock code={`npm install @happyvertical/smrt-dev-mcp`} language="bash" />
  </section>

  <section>
    <h2>Quick Start</h2>
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

  <section>
    <h2>Claude Code Integration</h2>
    <p>
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

  <section>
    <h2>Related Modules</h2>
    <div class="link-grid">
      <a href="/modules/smrt-core" class="link-card">
        <h3>smrt-core</h3>
        <p>Core framework with @smrt decorator</p>
      </a>
      <a href="/modules/smrt-cli" class="link-card">
        <h3>smrt-cli</h3>
        <p>Command-line interface</p>
      </a>
    </div>
  </section>

  <section>
    <div style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);">
      <a href="/modules" style="color: var(--smrt-color-primary, #1976d2); text-decoration: none;">← Back to Modules</a>
      <a href="/modules/smrt-vitest" style="color: var(--smrt-color-primary, #1976d2); text-decoration: none;">Next: smrt-vitest →</a>
    </div>
  </section>
</ModulePage>
