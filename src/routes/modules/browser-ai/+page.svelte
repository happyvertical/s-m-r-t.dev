<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>browser-ai - On-Device AI | SMRT Framework</title>
  <meta name="description" content="Browser-based AI with WebGPU acceleration, ONNX models, and offline capabilities." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">browser-ai</h1>
    <p class="text-xl text-gray-600 mb-4">
      Client-side AI inference with WebGPU acceleration, ONNX Runtime, and offline-first capabilities.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Browser AI</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">ONNX</span>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">WebGPU</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>browser-ai</strong> enables client-side AI inference in the browser using ONNX Runtime Web with WebGPU/WebAssembly.
      Provides embedding generation, text generation, and model management.
    </p>
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <p class="font-semibold mb-2">Key Features:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Client-side AI inference with ONNX Runtime Web</li>
        <li>Text embedding generation for semantic search</li>
        <li>Model downloading and caching</li>
        <li>WebGPU acceleration support</li>
        <li>Zero server-side AI costs</li>
      </ul>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Installation</h2>
    <CodeBlock code={`npm install @happyvertical/browser-ai`} language="bash" />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Quick Start</h2>
    <CodeBlock
      code={`import { BrowserAI } from '@happyvertical/browser-ai';

// Initialize (loads ONNX Runtime in browser)
const ai = await BrowserAI.create();

// Generate embeddings
const embedding = await ai.embed('Hello world');
// Returns: Float32Array of 384 dimensions

// Semantic search
const documents = [
  { id: 1, text: 'Paris is the capital of France' },
  { id: 2, text: 'Tokyo is the capital of Japan' },
  { id: 3, text: 'Berlin is the capital of Germany' }
];

const results = await ai.semanticSearch('What is the capital of France?', documents);
// Returns documents sorted by similarity

// Generate embeddings
const embedding = await ai.generateEmbedding('Machine learning is fascinating');
console.log(embedding); // Float32Array[384]`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Related Modules</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="/modules/smrt-core" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-core</h3>
        <p class="text-sm text-gray-600">AI integration framework</p>
      </a>
      <a href="/modules/smrt-agents" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-agents</h3>
        <p class="text-sm text-gray-600">Agent framework for AI workflows</p>
      </a>
    </div>
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/template-site-static-json" class="text-blue-600 hover:underline">Next: template-site-static-json →</a>
    </div>
  </div>
</div>
