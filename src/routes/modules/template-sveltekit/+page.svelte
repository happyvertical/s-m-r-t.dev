<script lang="ts">
  import ModulePage from '$lib/components/ModulePage.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>template-sveltekit - Full-Stack Template | SMRT Framework</title>
  <meta name="description" content="Full-stack SvelteKit template with SMRT integration, database, and authentication." />
</svelte:head>

<ModulePage 
  name="template-sveltekit" 
  description="Full-stack SvelteKit application template with SMRT framework, database integration, and authentication."
  badges={['v0.19.0', 'Template', 'Full-Stack', 'Database']}
>
  <section>
    <h2>Overview</h2>
    <p>
      <strong>template-sveltekit</strong> is a production-ready SvelteKit template with SMRT framework integration,
      database models, authentication, and deployment configuration.
    </p>
  </section>

  <section>
    <h2>Features</h2>
    <ul>
      <li>SvelteKit 2.x with server-side rendering</li>
      <li>SMRT framework with auto-generated APIs</li>
      <li>PostgreSQL/SQLite database</li>
      <li>Authentication with OIDC support</li>
      <li>Multi-tenancy ready</li>
      <li>Deployment configs (Docker, Kubernetes)</li>
    </ul>
  </section>

  <section>
    <h2>Usage</h2>
    <CodeBlock
      code={`npm create smrt-app@latest my-app -- --template sveltekit
cd my-app
npm install
npm run dev`}
      language="bash"
    />
  </section>

  <nav>
    <a href="/modules">← Back to Modules</a>
    <a href="/modules/smrt-core">Next: smrt-core →</a>
  </nav>
</ModulePage>
