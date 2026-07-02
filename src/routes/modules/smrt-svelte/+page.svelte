<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-svelte"
	description="Top-of-stack Svelte 5 integration layer for SMRT: Provider, seven hooks, browser AI (STT/TTS/LLM with warm cache), Provider-backed form inputs, the ModulePanel, and the SSR-safe workspace shell. The domain-agnostic visual primitives, theme system, i18n client, and ModuleUIRegistry moved to the companion @happyvertical/smrt-ui package."
	badges={['v0.37.2', 'Svelte 5', 'Runes', 'Browser AI', 'Workspace Shell']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-svelte</strong> is the top-of-stack Svelte 5 integration layer for
			the SMRT framework. It provides a root <code>Provider</code> component, seven hooks, bundled
			browser AI adapters with a warm client cache that survives navigation, the Provider-backed
			form inputs, the <code>ModulePanel</code>, and the SSR-safe workspace shell primitives.
		</p>
		<aside
			style="background: #e7f3ff; border-left: 4px solid #1976d2; padding: 1rem 1.25rem; border-radius: 4px; margin: 24px 0;"
		>
			<strong>0.37 UI split (#1582 / #1589):</strong> the domain-agnostic
			<strong>visual primitives</strong> (Button, Card, Badge, Modal, DataTable, layout, feedback,
			display, nav, calendar, chat, roles/memberships), the <strong>theme system</strong>, the
			<strong>i18n client</strong>, and the <code>ModuleUIRegistry</code> now live in the companion
			<strong>@happyvertical/smrt-ui</strong> package. Import them from there (e.g.
			<code>@happyvertical/smrt-ui/ui</code>, <code>@happyvertical/smrt-ui/i18n</code>,
			<code>@happyvertical/smrt-ui/registry</code>). The <strong>agent-admin shells</strong>
			(<code>AgentAdminPanel</code>, <code>AgentAdminTabs</code>, <code>AgentSettingsShell</code>)
			moved to <code>@happyvertical/smrt-agents/svelte</code>. This page documents what remains in
			smrt-svelte; the packages that register slots plug into the <code>ModuleUIRegistry</code> from smrt-ui.
		</aside>

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
				<strong>Provider-backed form inputs</strong> (<code>/forms</code>): <code>TextInput</code>,
				<code>MoneyInput</code>, the date/measurement/address/file inputs,
				<code>CheckboxInput</code>, and the rich <code>Form</code> — they call the AI hooks /
				<code>useAppState</code>
				and carry i18n + spoken-input logic. The Provider-free base inputs (<code>Input</code>,
				<code>Select</code>, <code>Textarea</code>, <code>Toggle</code>, <code>FormGroup</code>)
				come from <code>@happyvertical/smrt-ui/forms</code> and are re-exported here for a full barrel
			</li>
			<li>
				<strong>ModulePanel</strong>: the domain-aware module composite exported from the root
			</li>
			<li>
				<strong>Workspace shell</strong> (<code>/workspace</code>): SSR-safe
				<code>WorkspaceShell</code>, <code>RoleShell</code>, <code>NavTree</code>,
				<code>Breadcrumbs</code>, <code>ToolsDock</code>, and <code>navTreeFromManifest</code>
			</li>
			<li>
				<strong>Moved to <code>@happyvertical/smrt-ui</code></strong>: the
				<code>ModuleUIRegistry</code>
				(cross-package slot discovery), <code>PermissionCheck</code> + the
				<code>use:permission</code>
				/ <code>use:ripple</code> actions, the theme system (<code>ThemeProvider</code> + material/glass/studio
				presets), and every domain-agnostic visual primitive
			</li>
		</ul>

		<aside
			style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 1rem 1.25rem; border-radius: 4px; margin: 24px 0;"
		>
			<strong>Browser-AI Svelte components:</strong> the AI Svelte components (<code
				>AILoadingOverlay</code
			>, <code>VoiceInput</code>, <code>CapabilityGate</code>,
			<code>DownloadProgress</code>, <code>STTTest</code>) are exported from the
			<code>@happyvertical/smrt-svelte/browser-ai/svelte</code> subpath, not the package root.
			<code>AILoadingOverlay</code> is also rendered internally by <code>Provider</code>, so most
			apps get its behaviour automatically. The generic <code>LoadingOverlay</code> feedback
			component (not a rename of <code>AILoadingOverlay</code>) now lives in
			<code>@happyvertical/smrt-ui/feedback</code> alongside the other visual primitives.
		</aside>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add @happyvertical/smrt-svelte`} language="bash" />
		<p>
			<code>@happyvertical/smrt-ui</code> is a hard dependency and is installed automatically. Peer
			dependencies (all optional): <code>svelte</code> &gt;=5.18.2 plus the browser-AI engines (<code
				>@huggingface/transformers</code
			>, <code>@mlc-ai/web-llm</code>,
			<code>@remotion/whisper-web</code>, <code>@xenova/transformers</code>) and
			<code>chrono-node</code>. At 0.37 smrt-svelte no longer peer-depends on smrt-agents /
			smrt-jobs / smrt-profiles / smrt-users.
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
			At 0.37 the export map is deliberately small: the Provider, hooks, Provider-backed form
			inputs, the <code>ModulePanel</code>, browser AI, the workspace shell, and the Node-only i18n
			server bridge. Import from the specific subpath for tree-shaking.
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
					<td
						>Provider, the 7 hooks, state + warm-cache API, the Provider-backed form inputs, and <code
							>ModulePanel</code
						></td
					>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/forms</code></td>
					<td
						>Provider-backed inputs: <code>TextInput</code>, <code>MoneyInput</code>,
						date/measurement/address/file inputs, <code>CheckboxInput</code>, and the rich
						<code>Form</code>. Re-exports the base <code>Input</code>/<code>Select</code>/<code
							>Textarea</code
						>/<code>Toggle</code>/<code>FormGroup</code> from smrt-ui (but not the plain
						<code>Form</code>)</td
					>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/workspace</code></td>
					<td
						>WorkspaceShell, RoleShell, NavTree, Breadcrumbs, navTreeFromManifest, ToolsDock +
						defineToolsDock</td
					>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-svelte/workspace/server</code></td>
					<td>composeDockAvailability — server-side tool gate evaluation</td>
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
					<td><code>@happyvertical/smrt-svelte/i18n/server</code></td>
					<td>buildI18nSnapshot — Node-only server snapshot builder</td>
				</tr>
			</tbody>
		</table>

		<h3>Moved to <code>@happyvertical/smrt-ui</code> (companion package)</h3>
		<p>
			The domain-agnostic UI runtime — visual primitives, the theme system, the i18n client, and the
			module registry — now ship from the companion <code>@happyvertical/smrt-ui</code>
			package. Its subpaths:
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
					<td><code>@happyvertical/smrt-ui/ui</code></td>
					<td>Button, Card, Badge, Avatar, Chip, Skeleton, Tooltip, Dropdown, Tree, Pagination</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-ui/feedback</code></td>
					<td>Modal, ConfirmDialog, LoadingOverlay, ProgressBar</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-ui/layout</code></td>
					<td>Container, Grid, Header, Footer, PageHeader, EmptyState</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-ui/calendar</code></td>
					<td>Calendar, DayView</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-ui/chat</code></td>
					<td>MessageBubble, ReactionPicker, TypingIndicator</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-ui/forms</code></td>
					<td>Provider-free base primitives: Form, Input, Select, Textarea, Toggle, FormGroup</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-ui/i18n</code></td>
					<td>Client i18n: useI18n, Trans, defineMessages, renderTemplate (languages-free)</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-ui/registry</code></td>
					<td>ModuleUIRegistry — the cross-package component registry</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-ui/theme</code> &amp; <code>/themes</code></td>
					<td
						>ThemeProvider + the material/glass/studio/smrt preset token system and CSS generation</td
					>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-ui/styles/tokens.css</code></td>
					<td>Base design-tokens CSS</td>
				</tr>
				<tr>
					<td><code>@happyvertical/smrt-ui</code> (root)</td>
					<td
						>Barrel re-export of the above plus PermissionCheck, the permission/ripple actions,
						DataTable, and RoleBadge/RoleSelector/MembershipCard/MembershipList</td
					>
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
			side-effect imports of their <code>/svelte</code> subpath. As of 0.37 the registry ships from
			the companion <code>@happyvertical/smrt-ui</code> package (import it from
			<code>@happyvertical/smrt-ui</code> or <code>@happyvertical/smrt-ui/registry</code>), so
			consumer packages depend on smrt-ui rather than smrt-svelte to register.
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
import { ModuleUIRegistry } from '@happyvertical/smrt-ui';
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
import { ModuleUIRegistry } from '@happyvertical/smrt-ui';
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

	<section id="workspace">
		<h2>Workspace Shell Primitives</h2>
		<p>
			The <code>@happyvertical/smrt-svelte/workspace</code> subpath ships SvelteKit-agnostic,
			SSR-safe admin-shell primitives: a layout shell, a multi-role wrapper, nav primitives, and a
			right-rail tools dock. They carry no domain coupling and consume <code>--smrt-color-*</code> tokens
			directly — drop them into any Svelte 5 app.
		</p>

		<h3>WorkspaceShell &amp; RoleShell</h3>
		<p>
			<code>WorkspaceShell</code> is a composition of snippet slots (<code>brand</code>,
			<code>nav</code>, <code>sidebarFooter</code>, <code>topbarActions</code>,
			<code>inspectorRail</code>, …) that lays out a sidebar + sticky topbar + main content +
			optional inspector panel. It is responsive (sidebar collapses to an icon rail on tablet,
			becomes a drawer on mobile) and owns no domain logic. <code>RoleShell</code> is an opinionated
			thin wrapper over it: pass a list of <code>RoleConfig</code>s and the active role id, and it
			wires that role's nav
			<code>sections</code> into the sidebar and breadcrumb trail. An optional <code>color</code> on
			the role is exposed as a <code>--smrt-role-color</code> custom property for theming. (Missing-role
			behaviour: throws in dev, degrades to the first/empty role in production.)
		</p>
		<CodeBlock
			code={`<script lang="ts">
  import { RoleShell } from '@happyvertical/smrt-svelte/workspace';
  import type { RoleConfig } from '@happyvertical/smrt-svelte/workspace';
  import { page } from '$app/state';

  const roles: RoleConfig[] = [
    {
      id: 'admin',
      label: 'Admin',
      color: 'blue',
      sections: [
        { label: 'Content', children: [
          { href: '/api/v1/articles', label: 'Articles' },
        ] },
      ],
    },
  ];
</script>

<RoleShell {roles} currentRole="admin" currentPath={page.url.pathname}>
  {#snippet topbarActions()}<AccountMenu />{/snippet}
</RoleShell>`}
			language="svelte"
		/>

		<h3>navTreeFromManifest — manifest-driven nav</h3>
		<p>
			Rather than hand-writing nav config for dozens of <code>@smrt()</code> classes,
			<code>navTreeFromManifest(manifest, options)</code> is a pure (data-in/data-out) helper that
			turns a SMRT manifest into the <code>NavSection[]</code> shape <code>NavTree</code> and
			<code>RoleConfig.sections</code> consume. It filters out collection classes,
			<code>visibility: 'internal' | 'test'</code> entries, and objects with no REST
			<code>list</code>
			route, then groups the rest into sections (alphabetically sorted for deterministic output).
		</p>
		<ul>
			<li>
				<strong>STI ancestor-walk dedup</strong> — STI subtypes that share an ancestor's
				<code>collection</code> (and thus the same polymorphic REST URL) are suppressed by walking
				the
				<code>extends</code> chain, so you get one nav link per route instead of duplicates.
			</li>
			<li>
				<strong>Decoupled from RBAC</strong> — pass <code>permittedResources</code> (a plain array
				of qualified class names) to filter per role; resolve the allow-list with your
				<code>PermissionResolver</code> at the <code>+layout.server.ts</code> level. The helper also expands
				the allow-list up STI parents so a permitted subtype keeps its shared-route link.
			</li>
			<li>
				<strong>Labels/icons/sections</strong> —
				<code>@smrt({'{'} ui: {'{'} label, icon {'}'} {'}'})</code>
				drives the item label/icon; <code>sectionHints</code> maps a qualifier substring to a
				section title; <code>basePath</code> (default <code>/api/v1</code>) prefixes hrefs.
			</li>
		</ul>
		<CodeBlock
			code={`import { manifest } from '$lib/manifest';
import { navTreeFromManifest } from '@happyvertical/smrt-svelte/workspace';

const sections = navTreeFromManifest(manifest, {
  sectionHints: {
    '@happyvertical/smrt-content': 'Content',
    '@happyvertical/smrt-commerce': 'Commerce',
  },
  permittedResources: editorAllowList, // optional per-role filter
});
// → feed straight into RoleConfig.sections or <NavTree items={sections} />`}
			language="typescript"
		/>

		<h3>ToolsDock &amp; defineToolsDock</h3>
		<p>
			<code>defineToolsDock(options)</code> creates a reactive right-rail dock registry; the
			<code>ToolsDock</code> component renders it, and <code>useToolsDock()</code> reads the
			instance from context. Each <code>ToolDef</code> has an arbitrary string <code>id</code>, a
			<code>label</code>, an icon (glyph or <code>iconComponent</code>), and a panel
			<code>component</code> rendered when active. The dock exposes a small reactive API (<code
				>open()</code
			>/<code>close()</code>/<code>toggle()</code>, <code>setContext()</code>,
			<code>refreshAvailability()</code>, typed <code>on()</code>/<code>emit()</code> events) and
			the context blob (<code>{'{'} type, title, url, data, actions {'}'}</code>) is generically
			typed so tool components get typed <code>context.data</code> / <code>context.actions</code> without
			a cast.
		</p>
		<p>
			Tools can declare <code>gates</code> (e.g. <code>'permission:articles.publish'</code>,
			<code>'feature:video-tools'</code>) evaluated <strong>server-side</strong> via
			<code>composeDockAvailability</code> from
			<code>@happyvertical/smrt-svelte/workspace/server</code>. Each gate's prefix selects a
			caller-supplied evaluator; the framework ships no built-in evaluators and throws on an unknown
			prefix (loud-fail beats silent-leak).
		</p>
		<CodeBlock
			code={`import { defineToolsDock } from '@happyvertical/smrt-svelte/workspace';
import ChatPanel from './ChatPanel.svelte';
import MessageSquare from 'lucide-svelte/icons/message-square';

const dock = defineToolsDock({
  tools: [
    {
      id: 'chat',
      label: 'Chat',
      iconComponent: MessageSquare,
      component: ChatPanel,
      gates: ['permission:chat.use'], // evaluated server-side
    },
  ],
});

dock.setContext({ type: 'route', data: { siteSlug: 'demo' } });
dock.open('chat');`}
			language="typescript"
		/>
	</section>

	<section id="i18n">
		<h2>Internationalization (i18n)</h2>
		<p>
			The i18n system is a two-layer split that keeps the heavy languages resolver out of the client
			bundle. As of 0.37 the two layers live in different packages: the languages-free browser
			client (<code>useI18n</code>, <code>&lt;Trans&gt;</code>, <code>defineMessages</code>) ships
			from
			<code>@happyvertical/smrt-ui/i18n</code>, while the Node-only server bridge (<code
				>@happyvertical/smrt-svelte/i18n/server</code
			>) pulls
			<a href="/modules/smrt-languages">smrt-languages</a> and stays here — it is the one i18n
			export smrt-svelte still owns. The <code>Provider</code> (from smrt-svelte) accepts the resolved
			snapshot and puts the store on context.
		</p>
		<ul>
			<li>
				<strong><code>defineMessages()</code></strong> — a package registers its English
				code-default templates (keys like <code>chat.message_input.placeholder</code>).
			</li>
			<li>
				<strong><code>buildI18nSnapshot({'{'} locale, tenantId?, db?, keys? {'}'})</code></strong> —
				server-side, resolves a <code>{'{'} locale, messages {'}'}</code> snapshot by walking each
				key through the code → app/tenant override → locale chain. Variables are <em>not</em> applied
				server-side; the client interpolates with the same renderer.
			</li>
			<li>
				<strong><code>useI18n()</code></strong> — returns the reactive store with
				<code>t(key, vars)</code> and a reactive <code>locale</code>. Safe to call outside a
				<code>Provider</code> (falls back to registered English defaults).
				<code>&lt;Trans&gt;</code>
				is the component form.
			</li>
		</ul>
		<CodeBlock
			code={`// +layout.server.ts -- resolve the snapshot for the request locale
import { buildI18nSnapshot } from '@happyvertical/smrt-svelte/i18n/server';

export async function load({ locals }) {
  const i18n = await buildI18nSnapshot({
    locale: locals.locale ?? 'en',
    tenantId: locals.tenantId,
    db: locals.db,          // omit to resolve code defaults only
  });
  return { i18n };
}`}
			language="typescript"
		/>
		<CodeBlock
			code={`<!-- +layout.svelte -- hand the snapshot to Provider -->
<script>
  import { Provider } from '@happyvertical/smrt-svelte';
  let { data, children } = $props();
</script>

<Provider i18n={data.i18n}>{@render children()}</Provider>

<!-- any component -->
<script lang="ts">
  import { useI18n } from '@happyvertical/smrt-ui/i18n';
  const { t } = useI18n();
</script>
<input placeholder={t('chat.message_input.placeholder')} />`}
			language="svelte"
		/>
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

		<h3>Streaming chat with useLLM</h3>
		<p>
			<code>useLLM()</code> runs an LLM fully on-device. Streaming is surfaced through the
			<code>onToken</code> callback on <code>chat(text, {'{'} systemPrompt?, onToken? {'}'})</code>
			— tokens arrive incrementally and the same full string is also returned when generation finishes.
			The hook exposes reactive <code>isInitializing</code>, <code>isGenerating</code>,
			<code>downloadProgress</code> (a percent), <code>isReady</code>, <code>currentModel</code>,
			and
			<code>error</code>, plus <code>initialize()</code> / <code>unload()</code>.
		</p>
		<CodeBlock
			code={`<script lang="ts">
  import { useLLM } from '@happyvertical/smrt-svelte';

  const llm = useLLM({ systemPrompt: 'You are a helpful assistant.' });

  let input = $state('');
  let response = $state('');

  async function send() {
    response = '';
    // onToken streams partial output; the resolved value is the full text.
    await llm.chat(input, {
      onToken: (token) => { response += token; },
    });
  }
</script>

{#if llm.isInitializing}
  <p>Loading model… {llm.downloadProgress}%</p>
{:else}
  <form onsubmit={send}>
    <input bind:value={input} />
    <button disabled={llm.isGenerating}>Send</button>
  </form>
  <p>{response}</p>
{/if}`}
			language="svelte"
		/>
	</section>

	<section id="permissions">
		<h2>Permission-Aware Rendering</h2>
		<p>
			The <code>PermissionCheck</code> component and the <code>use:permission</code> action moved to
			<code>@happyvertical/smrt-ui</code> at 0.37 (import from the root or
			<code>@happyvertical/smrt-ui</code>). Feed them the permissions from smrt-svelte's
			<code>useAuth()</code>.
		</p>
		<CodeBlock
			code={`<script>
  import { PermissionCheck, permission } from '@happyvertical/smrt-ui';
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
		<p>
			The theme system moved to <code>@happyvertical/smrt-ui</code> at 0.37. It is two layered systems
			for different levels of customisation, exported from two subpaths:
		</p>
		<ul>
			<li>
				<strong><code>@happyvertical/smrt-ui/theme</code></strong>: the simple
				<code>ThemeProvider</code>
				+ context — a drop-in for apps that only need light/dark plus a couple of token overrides. smrt-svelte's
				<code>useTheme()</code> hook consumes this context.
			</li>
			<li>
				<strong><code>@happyvertical/smrt-ui/themes</code></strong>: the canonical preset token
				system with <code>material</code>, <code>glass</code>, <code>studio</code>, and
				<code>smrt</code> presets, CSS generation at build, and runtime switching via
				<code>ThemeSwitcher</code> / <code>ColorSchemeToggle</code>.
			</li>
		</ul>
		<CodeBlock
			code={`<script>
  import { ThemeProvider } from '@happyvertical/smrt-ui/theme';
  import { ThemeSwitcher } from '@happyvertical/smrt-ui/themes';
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
			<li>
				<code>src/components/forms/</code> — the Provider-backed form inputs (<code>TextInput</code
				>,
				<code>MoneyInput</code>, date/measurement/address/file inputs, <code>CheckboxInput</code>,
				the rich <code>Form</code>)
			</li>
			<li>
				<code>src/components/module/</code> — <code>ModulePanel</code>
			</li>
			<li>
				<code>src/browser-ai/</code> — STT/TTS/LLM adapters, capability detection (bundled, not external)
			</li>
			<li>
				<code>src/components/workspace/</code> — <code>WorkspaceShell</code>,
				<code>RoleShell</code>,
				<code>NavTree</code>, <code>navTreeFromManifest</code>, tools dock
			</li>
			<li>
				<code>src/i18n/server.ts</code> — the Node-only <code>buildI18nSnapshot</code> bridge (the
				client i18n layer now lives in <code>@happyvertical/smrt-ui/i18n</code>)
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
			<a href="/modules/smrt-languages" class="link-card">
				<h3>smrt-languages</h3>
				<p>Translation resolver behind the i18n server snapshot</p>
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
