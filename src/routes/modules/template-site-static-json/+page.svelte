<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>template-site-static-json - Static Site Template | SMRT Framework</title>
  <meta name="description" content="Static site template with JSON data source and SvelteKit adapter-static." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">template-site-static-json</h1>
    <p class="text-xl text-gray-600 mb-4">
      Static site template powered by JSON files, SvelteKit, and adapter-static for CDN deployment.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Template</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Static</span>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">JSON</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>template-site-static-json</strong> is a SvelteKit template that generates static sites from JSON data files.
      Perfect for documentation sites, portfolios, and content sites deployable to any CDN.
    </p>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Features</h2>
    <ul class="list-disc list-inside space-y-2">
      <li>JSON-based content management</li>
      <li>Static site generation with SvelteKit</li>
      <li>CDN-ready (CloudFront, Netlify, Vercel)</li>
      <li>SEO optimized with meta tags</li>
      <li>Fast page loads with pre-rendering</li>
    </ul>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Usage</h2>
    <CodeBlock
      code={`npm create smrt-site@latest my-site -- --template static-json
cd my-site
npm install
npm run dev`}
      language="bash"
    />
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/template-sveltekit" class="text-blue-600 hover:underline">Next: template-sveltekit →</a>
    </div>
  </div>
</div>
