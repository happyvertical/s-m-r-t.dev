<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>browser-ai - On-Device AI | SMRT Framework</title>
	<meta
		name="description"
		content="Browser-based AI with WebGPU acceleration, ONNX models, and offline capabilities."
	/>
</svelte:head>

<ModulePage
	name="browser-ai"
	description="Client-side AI inference with WebGPU acceleration, ONNX Runtime, and offline-first capabilities."
	badges={['v0.19.0', 'Browser AI', 'ONNX', 'WebGPU']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>browser-ai</strong> enables client-side AI inference in the browser using ONNX Runtime Web
			with WebGPU/WebAssembly. Provides embedding generation, text generation, and model management.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Client-side AI inference with ONNX Runtime Web</li>
				<li>Text embedding generation for semantic search</li>
				<li>Model downloading and caching</li>
				<li>WebGPU acceleration support</li>
				<li>Zero server-side AI costs</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/browser-ai`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
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

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>AI integration framework</p>
			</a>
			<a href="/modules/smrt-agents">
				<h3>smrt-agents</h3>
				<p>Agent framework for AI workflows</p>
			</a>
		</nav>
	</section>

	<footer>
		<nav>
			<a href="/modules">← Back to Modules</a>
			<a href="/modules/template-site-static-json">Next: template-site-static-json →</a>
		</nav>
	</footer>
</ModulePage>
