<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>browser-ai - Consolidated into smrt-svelte | SMRT Framework</title>
	<meta
		name="description"
		content="The browser-ai package has been consolidated into @happyvertical/smrt-svelte as of v0.20."
	/>
</svelte:head>

<ModulePage
	name="browser-ai"
	description="Browser-based AI capabilities (STT, TTS, LLM) — consolidated into smrt-svelte since v0.20 and shipped as the bundled @happyvertical/smrt-svelte/browser-ai subpath."
	badges={['v0.29.34', 'Consolidated since v0.20', 'See smrt-svelte']}
>
	<section id="consolidated">
		<h2>Consolidated into smrt-svelte</h2>
		<p>
			<code>browser-ai</code> is <strong>no longer a standalone package</strong>. As of
			<strong>v0.20</strong>
			it was consolidated into
			<a href="/modules/smrt-svelte"><code>@happyvertical/smrt-svelte</code></a>, and that
			consolidation remains the shape on the current <strong>v0.29.34</strong> baseline. All browser
			AI functionality — speech-to-text (STT), text-to-speech (TTS), LLM inference, capability
			detection, model download progress, and the warm client cache — ships inside
			<code>@happyvertical/smrt-svelte</code>. The STT/TTS/LLM adapter classes and capability
			detection live at the bundled <code>@happyvertical/smrt-svelte/browser-ai</code> subpath,
			while the hooks (<code>useSTT</code>/<code>useTTS</code>/<code>useLLM</code>) and warm-client
			cache helpers are exported from the package root.
		</p>
		<aside>
			<p>Why the consolidation stuck:</p>
			<ul>
				<li>Eliminates a circular dependency between browser-ai and smrt-svelte</li>
				<li>Single install: <code>@happyvertical/smrt-svelte</code> brings the adapters along</li>
				<li>
					Co-locates Svelte components with the AI adapters they wrap (VoiceInput, CapabilityGate,
					DownloadProgress)
				</li>
				<li>
					Lets the warm client cache live in the same module graph as the <code>Provider</code> that primes
					it
				</li>
			</ul>
		</aside>
	</section>

	<section id="migration">
		<h2>Migration</h2>
		<p>If you are still on a pre-0.20 import, update to <code>@happyvertical/smrt-svelte</code>:</p>
		<CodeBlock
			code={`// Before (v0.19)
import { BrowserAI } from '@happyvertical/browser-ai';

// After (v0.20+, still current on v0.29.34)
import {
  useSTT,
  useTTS,
  useLLM,
  // Warm-client cache helpers are exported from the package root
  getCachedSTT,
  getCachedTTS,
  getCachedLLM,
  getCacheStats,
  clearAllCaches,
} from '@happyvertical/smrt-svelte';
import {
  VoiceInput,
  CapabilityGate,
  DownloadProgress,
} from '@happyvertical/smrt-svelte/browser-ai/svelte';`}
			language="typescript"
		/>
		<p>
			Available adapters today: STT (<code>browser-speech</code>, <code>whisper-cpp</code>,
			<code>whisper-wasm</code>), TTS (<code>browser-synthesis</code>), LLM (<code>webllm</code>,
			<code>transformers-llm</code>). See the smrt-svelte page for the full <code>Provider</code>
			configuration and preload strategies.
		</p>
	</section>

	<section id="related">
		<h2>Go to smrt-svelte</h2>
		<div class="link-grid">
			<a href="/modules/smrt-svelte" class="link-card">
				<h3>smrt-svelte</h3>
				<p>Svelte 5 components, hooks, browser AI, themes, and more</p>
			</a>
		</div>
	</section>
</ModulePage>

<style>
	section {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	section:last-child {
		border-bottom: none;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 24px;
	}

	p {
		margin-bottom: 16px;
		line-height: 1.7;
		color: var(--smrt-color-on-background, #333);
	}

	ul {
		margin-bottom: 16px;
		padding-left: 24px;
	}

	li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	code {
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 2px 6px;
		border-radius: 3px;
		font-family: var(--font-mono);
		font-size: 0.9em;
	}

	aside {
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 16px;
		border-radius: 8px;
		margin: 16px 0;
		border-left: 4px solid var(--smrt-color-primary, #1976d2);
	}

	.link-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
		margin: 24px 0;
	}

	.link-card {
		padding: 20px;
		background: #fafafa;
		text-decoration: none;
		transition: all 0.2s;
		border: 1px solid transparent;
	}

	.link-card:hover {
		background: var(--smrt-color-surface-container, #f0f0f0);
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border-color: var(--smrt-color-primary, #1976d2);
	}

	.link-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: #1a1a1a;
	}

	.link-card:hover h3 {
		color: var(--smrt-color-primary, #1976d2);
	}

	.link-card p {
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin: 0;
	}
</style>
