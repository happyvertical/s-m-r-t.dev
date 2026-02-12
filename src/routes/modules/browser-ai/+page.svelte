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
	description="Browser-based AI capabilities including STT, TTS, and LLM — now built into smrt-svelte."
	badges={['Deprecated in 0.20', 'Merged into smrt-svelte']}
>
	<section>
		<h2>Consolidated into smrt-svelte</h2>
		<p>
			As of <strong>v0.20</strong>, the <code>browser-ai</code> package has been consolidated into
			<a href="/modules/smrt-svelte"><code>@happyvertical/smrt-svelte</code></a>. All browser AI
			functionality — speech-to-text (STT), text-to-speech (TTS), LLM inference, capability
			detection, and model management — is now available directly from smrt-svelte.
		</p>
		<aside>
			<p>This change:</p>
			<ul>
				<li>Eliminates a circular dependency between browser-ai and smrt-svelte</li>
				<li>Simplifies installation — one package instead of two</li>
				<li>Keeps all Svelte components and their AI adapters co-located</li>
				<li>Reduces bundle configuration complexity</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Migration from browser-ai</h2>
		<p>Update your imports to use <code>@happyvertical/smrt-svelte</code>:</p>
		<CodeBlock
			code={`// Before (0.19)
import { BrowserAI } from '@happyvertical/browser-ai';
import type { STTAdapter } from '@happyvertical/browser-ai';

// After (0.20)
import { useSTT, useTTS, useLLM } from '@happyvertical/smrt-svelte';
import { VoiceInput, DownloadProgress, AILoadingOverlay } from '@happyvertical/smrt-svelte';`}
			language="typescript"
		/>
		<p>
			See the <a href="/components/hooks/use-stt">useSTT</a>,
			<a href="/components/hooks/use-tts">useTTS</a>, and
			<a href="/components/hooks/use-llm">useLLM</a> hook documentation for the new API.
		</p>
	</section>

	<section>
		<h2>AI Components</h2>
		<p>All AI-related Svelte components are now in smrt-svelte:</p>
		<nav>
			<a href="/components/ai/voice-input">
				<h3>VoiceInput</h3>
				<p>Microphone button with speech-to-text</p>
			</a>
			<a href="/components/ai/download-progress">
				<h3>DownloadProgress</h3>
				<p>Progress bar for AI model downloads</p>
			</a>
			<a href="/components/ai/loading-overlay">
				<h3>AILoadingOverlay</h3>
				<p>Full-screen overlay during AI initialization</p>
			</a>
		</nav>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-svelte">
				<h3>smrt-svelte</h3>
				<p>Svelte 5 components and AI integration</p>
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
			<a href="/modules/smrt-svelte">smrt-svelte →</a>
		</nav>
	</footer>
</ModulePage>
