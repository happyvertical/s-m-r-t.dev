<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>Migration Guide: 0.19 to 0.29+ | s-m-r-t</title>
	<meta
		name="description"
		content="Migration guide for upgrading from SMRT 0.19 to 0.29+, covering component moves, import changes, CLI updates, and API changes."
	/>
</svelte:head>

<article class="prose">
	<h1>Migration Guide: 0.19 to 0.29+</h1>
	<p class="lead">
		The 0.20 line reorganized Svelte components into their domain packages and consolidated
		browser-ai into smrt-svelte. This guide covers all breaking changes through the current release,
		0.29.34.
	</p>

	<h2>Component Import Changes</h2>
	<p>
		Domain-specific components have moved from <code>@happyvertical/smrt-svelte</code> to their
		respective package's <code>/svelte</code> subpath. Core UI components (forms, layout, feedback, themes)
		remain in smrt-svelte.
	</p>

	<h3>Users</h3>
	<CodeBlock
		code={`// Before
import { UserCard, UserAvatar, UserList } from '@happyvertical/smrt-svelte';

// After
import { UserCard, UserAvatar, UserList } from '@happyvertical/smrt-users/svelte';`}
		language="typescript"
	/>

	<h3>Commerce</h3>
	<CodeBlock
		code={`// Before
import { InvoiceCard, InvoiceLineItems } from '@happyvertical/smrt-svelte';

// After
import { InvoiceCard, InvoiceLineItems } from '@happyvertical/smrt-commerce/svelte';`}
		language="typescript"
	/>

	<h3>Tenancy</h3>
	<CodeBlock
		code={`// Before
import { TenantSwitcher, TenantCard } from '@happyvertical/smrt-svelte';

// After
import { TenantSwitcher, TenantCard } from '@happyvertical/smrt-tenancy/svelte';`}
		language="typescript"
	/>

	<h3>Jobs</h3>
	<CodeBlock
		code={`// Before
import { JobDashboard, JobList } from '@happyvertical/smrt-svelte';

// After
import { JobDashboard, JobList } from '@happyvertical/smrt-jobs/svelte';`}
		language="typescript"
	/>

	<h3>Agents</h3>
	<CodeBlock
		code={`// Before
import { AgentDashboard, AgentRunHistory } from '@happyvertical/smrt-svelte';

// After
import { AgentDashboard, AgentRunHistory } from '@happyvertical/smrt-agents/svelte';`}
		language="typescript"
	/>

	<h3>Content</h3>
	<CodeBlock
		code={`// Before
import { ArticleCard, ArticleList } from '@happyvertical/smrt-svelte';

// After
import { ArticleCard, ArticleList } from '@happyvertical/smrt-content/svelte';`}
		language="typescript"
	/>

	<h3>Events</h3>
	<CodeBlock
		code={`// Before
import { MeetingView } from '@happyvertical/smrt-svelte';

// After
import { MeetingView } from '@happyvertical/smrt-events/svelte';`}
		language="typescript"
	/>

	<h3>Projects</h3>
	<CodeBlock
		code={`// Before
import { TimeEntryCard, ApprovalActions } from '@happyvertical/smrt-svelte';

// After
import { TimeEntryCard, ApprovalActions } from '@happyvertical/smrt-projects/svelte';`}
		language="typescript"
	/>

	<h3>What stays in smrt-svelte</h3>
	<p>These categories remain in <code>@happyvertical/smrt-svelte</code>:</p>
	<ul>
		<li>Forms (TextInput, Select, DateTime, etc.)</li>
		<li>Layout (PageHeader, Grid, EmptyState, etc.)</li>
		<li>Feedback (Modal, ConfirmDialog, ProgressBar)</li>
		<li>Navigation (Tabs, FilterChips)</li>
		<li>Display (StatusBadge, CurrencyDisplay, DateDisplay)</li>
		<li>Themes (ThemeSwitcher, ColorSchemeToggle)</li>
		<li>Hooks (useSTT, useTTS, useLLM, useAuth, useSocket)</li>
		<li>Provider, permissions, roles, memberships</li>
	</ul>
	<p>
		As of 0.29, the AI Svelte components (<code>VoiceInput</code>, <code>DownloadProgress</code>,
		<code>AILoadingOverlay</code>, <code>STTTest</code>, <code>CapabilityGate</code>) are no longer
		exported from the main <code>@happyvertical/smrt-svelte</code> barrel. Import them from the
		<code>@happyvertical/smrt-svelte/browser-ai/svelte</code> subpath instead.
		<code>AILoadingOverlay</code> is also rendered internally by <code>Provider</code>, so most apps
		get its behavior just by wrapping in <code>&lt;Provider&gt;</code>.
	</p>

	<h2>browser-ai Consolidated</h2>
	<p>
		The standalone <code>@happyvertical/browser-ai</code> package has been merged into
		<code>@happyvertical/smrt-svelte</code>. Remove the browser-ai dependency and update imports:
	</p>
	<CodeBlock
		code={`// Before
import { BrowserAI } from '@happyvertical/browser-ai';
import type { STTAdapter, TTSAdapter } from '@happyvertical/browser-ai';

// After — use hooks instead
import { useSTT, useTTS, useLLM } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>TenantSwitcher API Change</h2>
	<p>
		The <code>TenantSwitcher</code> component now accepts a <code>Map</code> of tenants and a
		separate <code>memberships</code> array, and uses <code>onchange</code> instead of
		<code>onswitch</code>:
	</p>
	<CodeBlock
		code={`// Before
<TenantSwitcher
  tenants={tenantsArray}
  currentTenantId={id}
  onswitch={handleSwitch}
/>

// After
<TenantSwitcher
  tenants={tenantsMap}
  memberships={memberships}
  currentTenantId={id}
  onchange={handleSwitch}
/>`}
		language="svelte"
	/>

	<h2>MembershipCard / MembershipList API Change</h2>
	<p>
		These components now accept separate <code>tenant</code> and <code>role</code> props instead of embedding
		them in the membership object:
	</p>
	<CodeBlock
		code={`// Before
<MembershipCard membership={membershipWithEverything} />

// After
<MembershipCard {membership} {tenant} {role} />

// MembershipList uses MembershipWithContext objects
<MembershipList memberships={[
  { membership, tenant, role },
  ...
]} />`}
		language="svelte"
	/>

	<h2>PermissionCheck API Change</h2>
	<p>
		<code>PermissionCheck</code> now requires an explicit <code>userPermissions</code> array and uses
		a Snippet for fallback content:
	</p>
	<CodeBlock
		code={`// Before
<PermissionCheck permission="users.edit" fallback="No access">
  <button>Edit</button>
</PermissionCheck>

// After
<PermissionCheck permission="users.edit" userPermissions={currentPermissions}>
  {#snippet fallback()}<span>No access</span>{/snippet}
  <button>Edit</button>
</PermissionCheck>`}
		language="svelte"
	/>

	<h2>Profiles: Tenancy Peer Dependency</h2>
	<p>
		<code>@happyvertical/smrt-profiles</code> now lists <code>@happyvertical/smrt-tenancy</code>
		as a peer dependency. Install it if you use multi-tenant features:
	</p>
	<CodeBlock code={`pnpm add @happyvertical/smrt-tenancy`} language="bash" />

	<h2>CSS Custom Properties</h2>
	<p>
		All theme tokens now use the <code>--smrt-color-*</code> prefix following Material Design 3 naming.
		If you were using older token names, update to the new prefix:
	</p>
	<CodeBlock
		code={`/* New token format */
--smrt-color-primary
--smrt-color-on-primary
--smrt-color-primary-container
--smrt-color-surface
--smrt-color-surface-variant
--smrt-color-outline`}
		language="css"
	/>

	<h2>Post-0.20.0 Changes (through 0.29.34)</h2>

	<h3>CLI Migration Commands</h3>
	<p>
		Migration commands have been updated. The old <code>smrt migrations generate</code> syntax is replaced:
	</p>
	<CodeBlock
		code={`# Generate migration from schema changes
smrt db:diff --generate

# Check pending schema changes
smrt db:status

# Apply migrations
smrt db:migrate

# Rollback migrations
smrt db:rollback`}
		language="bash"
	/>

	<h3>Config Shape</h3>
	<p>
		The <code>smrt.config.ts</code> top-level keys have been reorganized. Replace old
		<code>database</code>/<code>api</code>/<code>cli</code>/<code>mcp</code> keys with the new structure:
	</p>
	<CodeBlock
		code={`import { defineConfig } from '@happyvertical/smrt-config';

// Before (old shape - no longer valid)
export default defineConfig({
  database: { type: 'postgresql', host: '...' },
  api: { enabled: true, port: 3000 },
  cli: { enabled: true },
  mcp: { enabled: true, port: 3100 }
});

// After (current shape)
export default defineConfig({
  smrt: {
    logLevel: 'info',
    environment: 'production',
    embeddings: { provider: 'local' }
  },
  modules: {
    'my-agent': { cronSchedule: '0 2 * * *' }
  },
  packages: {
    ai: { defaultModel: 'gpt-4o' }
  }
});`}
		language="typescript"
	/>

	<h3>Agent Signal Handling</h3>
	<p>
		Agents now automatically register SIGTERM/SIGINT handlers during <code>initialize()</code>
		for graceful shutdown. If you had custom signal handling, it is now built-in. Always call
		<code>super.shutdown()</code> to clean up signal handlers.
	</p>

	<h3>Relationship Decorators</h3>
	<p>
		Relationship fields (<code>foreignKey</code>, <code>oneToMany</code>, <code>manyToMany</code>)
		are now decorators, not plain assignment helpers:
	</p>
	<CodeBlock
		code={`// Before (plain assignment - no longer valid)
class Order extends SmrtObject {
  customerId = foreignKey(Customer);
  items = oneToMany(OrderItem);
}

// After (decorators)
class Order extends SmrtObject {
  @foreignKey(Customer)
  customerId: string = '';

  @oneToMany(OrderItem)
  items: OrderItem[] = [];
}`}
		language="typescript"
	/>

	<h3>Collection _itemClass</h3>
	<p>
		The <code>_itemClass</code> static property must now be <code>readonly</code>:
	</p>
	<CodeBlock
		code={`// Before
class MyCollection extends SmrtCollection<MyObject> {
  static itemClass = MyObject;
}

// After
class MyCollection extends SmrtCollection<MyObject> {
  static readonly _itemClass = MyObject;
}`}
		language="typescript"
	/>
</article>

<style>
	.prose {
		max-width: 720px;
	}

	.prose h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.prose .lead {
		font-size: 1.1rem;
		color: #666;
		margin-bottom: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid var(--color-grid);
	}

	.prose h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
	}

	.prose h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 24px;
		margin-bottom: 12px;
	}

	.prose p {
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
	}

	.prose ul {
		color: #666;
		margin-bottom: 16px;
		padding-left: 24px;
	}

	.prose li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}

	.prose a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.prose a:hover {
		text-decoration: underline;
	}
</style>
