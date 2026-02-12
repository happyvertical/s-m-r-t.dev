<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>Migration Guide: 0.19 → 0.20 | s-m-r-t</title>
	<meta
		name="description"
		content="Migration guide for upgrading from SMRT 0.19 to 0.20, covering component moves, import changes, and API updates."
	/>
</svelte:head>

<article class="prose">
	<h1>Migration Guide: 0.19 → 0.20</h1>
	<p class="lead">
		Version 0.20 reorganizes Svelte components into their domain packages and consolidates
		browser-ai into smrt-svelte. This guide covers all breaking changes.
	</p>

	<h2>Component Import Changes</h2>
	<p>
		Domain-specific components have moved from <code>@happyvertical/smrt-svelte</code> to their
		respective package's <code>/svelte</code> subpath. Core UI components (forms, layout, feedback,
		themes) remain in smrt-svelte.
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
		<li>AI components (VoiceInput, DownloadProgress, AILoadingOverlay)</li>
		<li>Hooks (useSTT, useTTS, useLLM, useAuth, useSocket)</li>
		<li>Provider, permissions, roles, memberships</li>
	</ul>

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
		These components now accept separate <code>tenant</code> and <code>role</code> props instead
		of embedding them in the membership object:
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
		<code>PermissionCheck</code> now requires an explicit <code>userPermissions</code> array
		and uses a Snippet for fallback content:
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
		All theme tokens now use the <code>--smrt-color-*</code> prefix following Material Design 3
		naming. If you were using older token names, update to the new prefix:
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
