<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-svelte"
	description="Svelte 5 component library for SMRT: Provider, hooks, browser AI (STT/TTS/LLM with warm cache), dual theme system, permission-aware rendering, and the ModuleUIRegistry for cross-package component discovery."
	badges={['v0.29.34', 'Svelte 5', 'Runes', 'Browser AI', 'ModuleUIRegistry']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-svelte</strong> is the canonical UI package for the SMRT
			framework. It provides a root <code>Provider</code> component, seven hooks, 56+ Svelte 5
			components organized into subpath exports, bundled browser AI adapters with a warm client
			cache that survives navigation, a dual theme system, permission actions, and the
			<code>ModuleUIRegistry</code> — the cross-package registry that other SMRT UI shippers (smrt-content,
			smrt-images, smrt-assets, smrt-analytics, smrt-chat, smrt-jobs, smrt-agents) plug into at import
			time.
		</p>

		<h3>Key Capabilities</h3>
		<ul>
			<li>
				<strong>Provider</strong>: root component for <code>+layout.svelte</code> — initialises auth state,
				permissions, WebSocket, AI capabilities, and the warm client cache
			</li>
			<li>
				<strong>7 Hooks</strong>: <code>useAuth</code>, <code>useSocket</code>,
				<code>useAppState</code>, <code>useSTT</code>, <code>useTTS</code>, <code>useLLM</code>,
				<code>useTheme</code>
			</li>
			<li>
				<strong>Bundled Browser AI</strong>: STT (browser-speech, whisper-cpp, whisper-wasm), TTS
				(browser-synthesis), LLM (webllm, transformers-llm). All adapters live inside this package
				now — no separate <code>browser-ai</code> install
			</li>
			<li>
				<strong>Preload strategies + warm cache</strong>: <code>none</code>/<code>eager</code>/<code
					>idle</code
				>/<code>on-visible</code>, plus a module-level <code>Map</code> that survives SvelteKit navigation
				and component remounts
			</li>
			<li>
				<strong>ModuleUIRegistry</strong>: cross-package Svelte component discovery; consumer
				packages register slots via side-effect imports of their <code>/svelte</code> subpath
			</li>
			<li>
				<strong>Permission system</strong>: <code>PermissionCheck</code> component and
				<code>use:permission</code> action
			</li>
			<li>
				<strong>Dual theme system</strong>: simple <code>ThemeProvider</code> with design tokens, plus
				full preset system (material/glass/studio) with CSS generation and runtime switching
			</li>
			<li>
				<strong>Ripple action</strong>: material-style <code>use:ripple</code> for tactile feedback
			</li>
		</ul>

		<aside
			style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 1rem 1.25rem; border-radius: 4px; margin: 24px 0;"
		>
			<strong>Breaking change (v0.29):</strong> the AI Svelte components (<code
				>AILoadingOverlay</code
			>, <code>VoiceInput</code>, <code>CapabilityGate</code>, <code>DownloadProgress</code>,
			<code>STTTest</code>) are no longer exported from the package root. Import them from the
			<code>@happyvertical/smrt-svelte/browser-ai/svelte</code>
			subpath instead.
			<code>AILoadingOverlay</code> is also rendered internally by <code>Provider</code>, so most
			apps get its behaviour automatically. Note <code>LoadingOverlay</code> is a separate, generic
			feedback component exported from the root — it is not a rename of
			<code>AILoadingOverlay</code>.
		</aside>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add @happyvertical/smrt-svelte`} language="bash" />
		<p>
			Peer dependencies (all optional): <code>svelte</code> &gt;=5.18.2,
			<code>@happyvertical/smrt-agents</code>, <code>@happyvertical/smrt-jobs</code>,
			<code>@happyvertical/smrt-profiles</code>, <code>@happyvertical/smrt-users</code>.
		</p>
	</section>

	<section id="quick-start">
		<h2>Quick Start</h2>

		<h3>Provider Setup</h3>
		<CodeBlock
			code={`<!-- +layout.svelte -->
<script>
  import { Provider } from '@happyvertical/smrt-svelte';
  let { data, children } = $props();
</script>

<Provider user={data.user} permissions={data.permissions}
  ai={{ preload: 'idle', stt: { type: 'whisper-cpp' } }}>
  {@render children()}
</Provider>`}
			language="svelte"
		/>

		<h3>Using Hooks</h3>
		<CodeBlock
			code={`<script>
  import { useAuth, useSTT } from '@happyvertical/smrt-svelte';

  const { user, isAuthenticated, hasPermission } = useAuth();
  const { start, stop, isListening, lastResult } = useSTT();
</script>

{#if isAuthenticated}
  <p>Hello, {user.displayName}</p>
  <button onclick={() => isListening ? stop() : start()}>
    {isListening ? 'Stop' : 'Listen'}
  </button>
  <p>{lastResult}</p>
{/if}`}
			language="svelte"
		/>
	</section>

	<section id="hooks">
		<h2>Hooks</h2>
		<table>
			<thead>
				<tr>
					<th>Hook</th>
					<th>Returns</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>useAuth()</code></td>
					<td
						><code>user</code>, <code>isAuthenticated</code>, <code>permissions</code>,
						<code>hasPermission()</code></td
					>
				</tr>
				<tr>
					<td><code>useSocket()</code></td>
					<td
						><code>status</code>, <code>isConnected</code>, <code>send()</code>,
						<code>reconnect()</code>, <code>disconnect()</code></td
					>
				</tr>
				<tr>
					<td><code>useAppState()</code></td>
					<td>Full <code>SmrtAppStateManager</code> — mode, AI adapters, capabilities</td>
				</tr>
				<tr>
					<td><code>useSTT()</code></td>
					<td
						><code>start()</code>, <code>stop()</code>, <code>isListening</code>,
						<code>lastResult</code>, <code>interimResult</code></td
					>
				</tr>
				<tr>
					<td><code>useTTS()</code></td>
					<td
						><code>speak()</code>, <code>stop()</code>, <code>isSpeaking</code>,
						<code>getVoices()</code></td
					>
				</tr>
				<tr>
					<td><code>useLLM()</code></td>
					<td
						><code>chat()</code>, <code>initialize()</code>, <code>unload()</code>,
						<code>isGenerating</code>, <code>downloadProgress</code></td
					>
				</tr>
				<tr>
					<td><code>useTheme()</code></td>
					<td>Theme context from <code>ThemeProvider</code></td>
				</tr>
			</tbody>
		</table>
	</section>

	<section id="entry-points">
		<h2>Subpath Exports</h2>
		<p>
			The package uses subpath exports to organise components by category. Import from the specific
			subpath for tree-shaking.
		</p>
		<table>
			<thead>
				<tr>
					<th>Import Path</th>
					<th>Contents</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>@happyvertical/smrt-svelte</code></td>
					<td>Provider, DataTable, permission utilities, hooks, state, core components</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/admin</code></td>
					<td>AgentAdminPanel, AgentAdminTabs, AgentSettingsShell</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/calendar</code></td>
					<td>Calendar, DayView</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/forms</code></td>
					<td
						>TextInput, Select, MoneyInput, DateTimeInput, Toggle, FileUpload, AddressInput, and
						more</td
					>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/layout</code></td>
					<td>Container, Grid, Header, Footer, Masthead, PageHeader, EmptyState, SummaryCard</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/ui</code></td>
					<td>Button, Card, Badge, Pagination</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/themes</code></td>
					<td>ThemeProvider, presets (material/glass/studio), CSS generation</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/registry</code></td>
					<td>ModuleUIRegistry — the cross-package component registry</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/browser-ai</code></td>
					<td>Bundled browser AI client (STT/TTS/LLM adapters, capability detection)</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/browser-ai/svelte</code></td>
					<td>Svelte AI components (VoiceInput, CapabilityGate, DownloadProgress, etc.)</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/styles/tokens.css</code></td>
					<td>Design tokens CSS</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section id="module-ui-registry">
		<h2>ModuleUIRegistry</h2>
		<p>
			<code>ModuleUIRegistry</code> is the global singleton that lets SMRT UI-shipping packages
			advertise Svelte components keyed by <em>(moduleName, slotId)</em>. Host applications discover
			components by name without hard-coding imports; consumer packages register their slots via
			side-effect imports of their <code>/svelte</code> subpath.
		</p>

		<h3>Subpath Contract (PR #1213)</h3>
		<p>
			Every UI-shipping package exposes a <code>./svelte</code> conditional export with only
			<code>types</code> and <code>import</code> keys —
			<strong>no <code>svelte</code> condition</strong>. Vite's pre-bundler resolves the subpath
			like any other ESM entry, which avoids the dual package hazards we hit when both
			<code>svelte</code>
			and <code>import</code> conditions resolved to different files.
		</p>

		<CodeBlock
			code={`{
  "exports": {
    "./svelte": {
      "types": "./dist/svelte/index.d.ts",
      "import": "./dist/svelte/index.js"
    }
  }
}`}
			language="json"
		/>

		<h3>API Surface</h3>
		<table>
			<thead>
				<tr>
					<th>Method</th>
					<th>Purpose</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>registerModule(meta)</code></td>
					<td>Register a module's <code>SmrtModuleMeta</code> (name, version, slots)</td>
				</tr>
				<tr>
					<td><code>register(moduleName, slotId, component)</code></td>
					<td>Register a Svelte component for a slot</td>
				</tr>
				<tr>
					<td><code>get(moduleName, slotId)</code></td>
					<td>Look up a component; returns <code>undefined</code> if missing</td>
				</tr>
				<tr>
					<td><code>has(moduleName, slotId)</code></td>
					<td>Existence check</td>
				</tr>
				<tr>
					<td><code>getSlots(moduleName)</code></td>
					<td>List slot IDs for a module</td>
				</tr>
				<tr>
					<td><code>getModules()</code></td>
					<td>List registered module names</td>
				</tr>
			</tbody>
		</table>

		<h3>Consumer Registration (smrt-commerce example)</h3>
		<CodeBlock
			code={`// packages/commerce/src/svelte/index.ts
import { ModuleUIRegistry } from '@happyvertical/smrt-svelte/registry';
import { COMMERCE_MODULE_META } from '../ui.js';

import InvoiceCard from './components/InvoiceCard.svelte';
import InvoiceHeader from './components/InvoiceHeader.svelte';
import InvoiceLineItems from './components/InvoiceLineItems.svelte';

// Side-effect: register module metadata + slots at import time
ModuleUIRegistry.registerModule(COMMERCE_MODULE_META);
ModuleUIRegistry.register('@happyvertical/smrt-commerce', 'invoice-card', InvoiceCard);
ModuleUIRegistry.register('@happyvertical/smrt-commerce', 'invoice-header', InvoiceHeader);
ModuleUIRegistry.register('@happyvertical/smrt-commerce', 'invoice-line-items', InvoiceLineItems);

// Also re-export for direct imports
export { InvoiceCard, InvoiceHeader, InvoiceLineItems };`}
			language="typescript"
		/>

		<h3>Host Lookup</h3>
		<CodeBlock
			code={`// SvelteKit host app
import { ModuleUIRegistry } from '@happyvertical/smrt-svelte/registry';
import '@happyvertical/smrt-commerce/svelte';  // side-effect import registers slots
import '@happyvertical/smrt-content/svelte';
import '@happyvertical/smrt-images/svelte';

const InvoiceCard = ModuleUIRegistry.get('@happyvertical/smrt-commerce', 'invoice-card');
// Render <InvoiceCard ... /> if present, fall back to placeholder otherwise.`}
			language="typescript"
		/>

		<h3>Packages that register slots</h3>
		<div class="link-grid">
			<a href="/modules/smrt-content" class="link-card"
				><h3>smrt-content</h3>
				<p>Article/Document cards, thumbnails</p></a
			>
			<a href="/modules/smrt-images" class="link-card"
				><h3>smrt-images</h3>
				<p>Image editing + categorization slots</p></a
			>
			<a href="/modules/smrt-assets" class="link-card"
				><h3>smrt-assets</h3>
				<p>Asset list/picker slots</p></a
			>
			<a href="/modules/smrt-analytics" class="link-card"
				><h3>smrt-analytics</h3>
				<p>Report viewers</p></a
			>
			<a href="/modules/smrt-chat" class="link-card"
				><h3>smrt-chat</h3>
				<p>Room + thread slots</p></a
			>
			<a href="/modules/smrt-jobs" class="link-card"
				><h3>smrt-jobs</h3>
				<p>Task/schedule dashboard slots</p></a
			>
			<a href="/modules/smrt-agents" class="link-card"
				><h3>smrt-agents</h3>
				<p>Agent admin slots</p></a
			>
		</div>

		<p>
			See also <a href="/modules/smrt-playground"><strong>smrt-playground</strong></a>, the
			discovery host that renders every registered slot for live exploration.
		</p>
	</section>

	<section id="browser-ai">
		<h2>Browser AI</h2>
		<p>
			The browser AI system (previously the separate <code>browser-ai</code> package, consolidated
			in v0.20) is bundled inside smrt-svelte and provides on-device speech-to-text, text-to-speech,
			and LLM inference. A module-level warm client cache (a singleton <code>Map</code>) survives
			navigation and remounts, avoiding repeated WASM and AI model downloads.
		</p>

		<h3>Preload Strategies</h3>
		<ul>
			<li><code>none</code> — load on first use</li>
			<li><code>eager</code> — load immediately on mount</li>
			<li><code>idle</code> — load when browser is idle (recommended)</li>
			<li><code>on-visible</code> — load when component enters viewport</li>
		</ul>

		<h3>Adapters</h3>
		<table>
			<thead>
				<tr><th>Capability</th><th>Adapters</th></tr>
			</thead>
			<tbody>
				<tr
					><td>STT</td><td
						><code>browser-speech</code> (Web Speech API), <code>whisper-cpp</code>,
						<code>whisper-wasm</code></td
					></tr
				>
				<tr><td>TTS</td><td><code>browser-synthesis</code> (SpeechSynthesis API)</td></tr>
				<tr><td>LLM</td><td><code>webllm</code>, <code>transformers-llm</code></td></tr>
			</tbody>
		</table>

		<h3>Warm Cache API</h3>
		<CodeBlock
			code={`import {
  getCachedSTT,
  getCachedTTS,
  getCachedLLM,
  getCacheStats,
  clearAllCaches,
} from '@happyvertical/smrt-svelte';

// Check what's loaded
const stats = getCacheStats();
console.log(stats);
// { stt: { count, types }, tts: { count, types }, llm: { count, keys } }

// Get a cached adapter (returns undefined if not loaded);
// pass the adapter type (LLM also takes an optional modelId)
const stt = getCachedSTT('whisper-cpp');`}
			language="typescript"
		/>
	</section>

	<section id="permissions">
		<h2>Permission-Aware Rendering</h2>
		<CodeBlock
			code={`<script>
  import { PermissionCheck, permission } from '@happyvertical/smrt-svelte';
</script>

<!-- Component-based -->
<PermissionCheck requires="admin:write">
  <button>Admin Action</button>
</PermissionCheck>

<!-- Action-based (disables element by default) -->
<div use:permission={{ slug: 'articles.delete', permissions: userPermissions }}>
  Delete
</div>

<!-- Hide-only variant (removes from layout if not permitted) -->
<div use:permission={{ slug: 'articles.delete', permissions: userPermissions, hideOnly: true }}>
  Delete
</div>`}
			language="svelte"
		/>
	</section>

	<section id="themes">
		<h2>Theme System</h2>
		<p>Two layered theme systems for different levels of customisation:</p>
		<ul>
			<li>
				<strong><code>src/theme/</code></strong>: simple <code>ThemeProvider</code> with design tokens
				— drop-in for apps that only need light/dark + a couple of overrides
			</li>
			<li>
				<strong><code>src/themes/</code></strong>: full preset system with <code>material</code>,
				<code>glass</code>, and <code>studio</code> presets, CSS generation at build, and runtime
				switching via <code>ThemeSwitcher</code>
			</li>
		</ul>
		<CodeBlock
			code={`<script>
  import { ThemeProvider, ThemeSwitcher } from '@happyvertical/smrt-svelte/themes';
</script>

<ThemeProvider preset="glass" colorScheme="system">
  <ThemeSwitcher />
  {@render children()}
</ThemeProvider>`}
			language="svelte"
		/>
	</section>

	<section id="key-files">
		<h2>Key Files</h2>
		<ul>
			<li><code>src/Provider.svelte</code> — root component, state initialisation</li>
			<li>
				<code>src/state/</code> — <code>SmrtAppStateManager</code> ($state rune), warm client cache
			</li>
			<li>
				<code>src/hooks/</code> — <code>useAuth</code>, <code>useSocket</code>,
				<code>useAppState</code>, <code>useSTT</code>, <code>useTTS</code>, <code>useLLM</code>,
				<code>useTheme</code>
			</li>
			<li><code>src/components/</code> — UI components by category</li>
			<li>
				<code>src/themes/</code> — <code>ThemeProvider</code>, <code>ThemeSwitcher</code>, CSS
				presets
			</li>
			<li>
				<code>src/browser-ai/</code> — STT/TTS/LLM adapters, capability detection (bundled, not external)
			</li>
			<li>
				<code>src/registry/</code> — <code>ModuleUIRegistry</code> for cross-package component discovery
			</li>
		</ul>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Core framework and ORM</p>
			</a>
			<a href="/modules/smrt-users" class="link-card">
				<h3>smrt-users</h3>
				<p>Auth, RBAC, and SvelteKit hooks</p>
			</a>
			<a href="/modules/smrt-playground" class="link-card">
				<h3>smrt-playground</h3>
				<p>Discovery host for every registered ModuleUIRegistry slot</p>
			</a>
			<a href="/components" class="link-card">
				<h3>Component Catalog</h3>
				<p>Individual component documentation</p>
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

	h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 16px;
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

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 24px 0;
	}

	th,
	td {
		text-align: left;
		padding: 12px;
		border-bottom: 1px solid #e0e0e0;
	}

	th {
		font-weight: 600;
		background: #f9f9f9;
	}

	td code {
		white-space: nowrap;
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
