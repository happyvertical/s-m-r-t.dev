<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>template-sveltekit - Full-Stack Template | SMRT Framework</title>
  <meta name="description" content="Full-stack SvelteKit template with SMRT integration, database, and authentication." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">template-sveltekit</h1>
    <p class="text-xl text-gray-600 mb-4">
      Full-stack SvelteKit application template with SMRT framework, database integration, and authentication.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Template</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Full-Stack</span>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Database</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>template-sveltekit</strong> is a production-ready SvelteKit template with SMRT framework integration,
      database models, authentication, and deployment configuration.
    </p>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Features</h2>
    <ul class="list-disc list-inside space-y-2">
      <li>SvelteKit 2.x with server-side rendering</li>
      <li>SMRT framework with auto-generated APIs</li>
      <li>PostgreSQL/SQLite database</li>
      <li>Authentication with OIDC support</li>
      <li>Multi-tenancy ready</li>
      <li>Deployment configs (Docker, Kubernetes)</li>
    </ul>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Usage</h2>
    <CodeBlock
      code={`npm create smrt-app@latest my-app -- --template sveltekit
cd my-app
npm install
npm run dev`}
      language="bash"
    />
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/smrt-core" class="text-blue-600 hover:underline">Next: smrt-core →</a>
    </div>
  </div>
</div>
