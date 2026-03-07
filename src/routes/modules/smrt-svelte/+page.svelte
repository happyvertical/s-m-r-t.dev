<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-svelte"
	description="Svelte 5 component library for SMRT: Provider, hooks, browser AI (STT/TTS/LLM with warm cache), dual theme system, permission-aware rendering, and module UI registry."
	badges={['v0.20.44', 'Svelte 5', 'Runes', 'Browser AI']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-svelte</strong> is the UI package for the SMRT framework. It provides
			a root Provider component, 7 hooks, 56+ Svelte 5 components across 14 subdirectories,
			browser-based AI adapters with warm client cache, a dual theme system, permission actions,
			and a module UI registry for cross-package component discovery.
		</p>

		<h3>Key Capabilities</h3>
		<ul>
			<li><strong>Provider</strong>: Root component wrapping your app in <code>+layout.svelte</code> -- provides auth state, permissions, WebSocket, and AI capabilities</li>
			<li><strong>7 Hooks</strong>: <code>useAuth</code>, <code>useSocket</code>, <code>useAppState</code>, <code>useSTT</code>, <code>useTTS</code>, <code>useLLM</code>, <code>useTheme</code></li>
			<li><strong>Browser AI</strong>: STT (browser-speech, whisper-cpp, whisper-wasm), TTS (browser-synthesis), LLM (webllm, transformers-llm) with preload strategies and warm client cache that survives navigation</li>
			<li><strong>Permission system</strong>: <code>PermissionCheck</code> component and <code>use:permission</code> action for permission-aware rendering</li>
			<li><strong>Dual theme system</strong>: Simple ThemeProvider with design tokens, plus full preset system (material/glass/studio) with CSS generation and runtime switching via ThemeSwitcher</li>
			<li><strong>Module UI Registry</strong>: Cross-package component discovery for agent admin panels</li>
			<li><strong>Ripple action</strong>: Material-style <code>use:ripple</code> for interactive feedback</li>
		</ul>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add @happyvertical/smrt-svelte`} language="bash" />
		<p>Peer dependencies (all optional): <code>svelte</code> >=5.18.2, <code>@happyvertical/smrt-agents</code>, <code>@happyvertical/smrt-jobs</code>, <code>@happyvertical/smrt-profiles</code>, <code>@happyvertical/smrt-users</code>.</p>
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

	<section id="entry-points">
		<h2>Subpath Exports</h2>
		<p>
			The package uses subpath exports to organize components by category. Import from the
			specific subpath for tree-shaking.
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
					<td>TextInput, Select, MoneyInput, DateTimeInput, Toggle, FileUpload, AddressInput, and more</td>
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
					<td>ModuleUIRegistry for agent admin panels</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/browser-ai</code></td>
					<td>Browser AI client (STT/TTS/LLM adapters, capability detection)</td>
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

	<section id="component-categories">
		<h2>Component Categories</h2>
		<p>
			56+ components organized across 14 subdirectories. See the
			<a href="/components">component catalog</a> for individual component documentation.
		</p>

		<table>
			<thead>
				<tr>
					<th>Category</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><strong>Forms</strong></td>
					<td>TextInput, Select, MoneyInput, DateTimeInput, Toggle, FileUpload, AddressInput, PhoneInput, NumberInput, DateRangeInput, MeasurementInput, SearchInput, Textarea, CheckboxInput, and more</td>
				</tr>
				<tr>
					<td><strong>Layout</strong></td>
					<td>Container, Grid, Header, Footer, Masthead, PageHeader, EmptyState, SummaryCard</td>
				</tr>
				<tr>
					<td><strong>UI</strong></td>
					<td>Button, Card, Badge, Pagination</td>
				</tr>
				<tr>
					<td><strong>Display</strong></td>
					<td>ConfidenceBadge, CurrencyDisplay, DateDisplay, Icon, StatusBadge</td>
				</tr>
				<tr>
					<td><strong>Feedback</strong></td>
					<td>ConfirmDialog, LoadingOverlay, Modal, ProgressBar</td>
				</tr>
				<tr>
					<td><strong>Navigation</strong></td>
					<td>FilterChips, Tabs</td>
				</tr>
				<tr>
					<td><strong>Data</strong></td>
					<td>DataTable</td>
				</tr>
				<tr>
					<td><strong>Permissions</strong></td>
					<td>PermissionCheck, RoleBadge, RoleSelector</td>
				</tr>
				<tr>
					<td><strong>Admin</strong></td>
					<td>AgentAdminPanel, AgentAdminTabs, AgentSettingsShell</td>
				</tr>
				<tr>
					<td><strong>Calendar</strong></td>
					<td>Calendar, DayView</td>
				</tr>
				<tr>
					<td><strong>Memberships</strong></td>
					<td>MembershipCard, MembershipList</td>
				</tr>
				<tr>
					<td><strong>Module</strong></td>
					<td>ModulePanel</td>
				</tr>
				<tr>
					<td><strong>Roles</strong></td>
					<td>RoleBadge, RoleSelector</td>
				</tr>
				<tr>
					<td><strong>Theme</strong></td>
					<td>ThemeProvider, ThemeSwitcher</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section id="browser-ai">
		<h2>Browser AI</h2>
		<p>
			The browser AI system (previously a separate <code>browser-ai</code> package, consolidated
			in v0.20) provides on-device speech-to-text, text-to-speech, and LLM inference. A
			module-level warm client cache (Map) survives navigation and remounts, avoiding
			re-downloading WASM modules and AI models.
		</p>

		<h3>Preload Strategies</h3>
		<ul>
			<li><code>none</code> -- load on first use</li>
			<li><code>eager</code> -- load immediately on mount</li>
			<li><code>idle</code> -- load when browser is idle (recommended)</li>
			<li><code>on-visible</code> -- load when component enters viewport</li>
		</ul>

		<h3>Cache API</h3>
		<CodeBlock
			code={`import { getCachedSTT, getCachedTTS, getCachedLLM, getCacheStats, clearAllCaches }
  from '@happyvertical/smrt-svelte/browser-ai';

// Check what's loaded
const stats = getCacheStats();
console.log(stats); // { stt: true, tts: false, llm: true }

// Get a cached adapter (returns undefined if not loaded)
const stt = getCachedSTT();`}
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

<!-- Action-based (hides or disables element) -->
<div use:permission={{ slug: 'articles.delete', permissions: userPermissions }}>
  Delete
</div>
<div use:permission={{ slug: 'articles.delete', permissions: userPermissions, hideOnly: true }}>
  Delete (hidden if no permission)
</div>`}
			language="svelte"
		/>
	</section>

	<section id="themes">
		<h2>Theme System</h2>
		<p>Two theme systems for different levels of customization:</p>
		<ul>
			<li><strong><code>src/theme/</code></strong>: Simple ThemeProvider with design tokens</li>
			<li><strong><code>src/themes/</code></strong>: Full preset system with material, glass, and studio presets, CSS generation, and runtime switching</li>
		</ul>
		<CodeBlock
			code={`<script>
  import { ThemeProvider } from '@happyvertical/smrt-svelte/themes';
</script>

<ThemeProvider preset="glass" colorScheme="system">
  {@render children()}
</ThemeProvider>`}
			language="svelte"
		/>
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
			<a href="/modules/smrt-agents" class="link-card">
				<h3>smrt-agents</h3>
				<p>Agent framework for AI workflows</p>
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
