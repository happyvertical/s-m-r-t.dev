<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-types"
	description="Shared TypeScript types and enums for the SMRT framework. Prevents circular dependencies between packages by centralizing types that more than one package needs. Zero runtime code except for enums."
	badges={['v0.29.34', 'Core Foundation', 'ESM', 'Zero Runtime']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<code>@happyvertical/smrt-types</code> is a small, dependency-free package that exists to keep
			shared types out of <code>smrt-core</code> and break the circular dependencies that would otherwise
			form between domain packages. If two or more packages need the same type, it lives here.
		</p>
		<p>
			The package ships <strong>zero runtime code except enums</strong> -- everything else is erased by
			the TypeScript compiler.
		</p>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add @happyvertical/smrt-types`} language="bash" />
		<p class="note">
			<strong>Note:</strong> You rarely need to install this directly. It's a transitive dependency
			of every <code>@happyvertical/smrt-*</code> package.
		</p>
	</section>

	<section id="exports">
		<h2>Exports</h2>

		<table>
			<thead>
				<tr>
					<th>File</th>
					<th>Types</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>signals.ts</code></td>
					<td>
						<code>Signal</code>, <code>SignalType</code>, <code>SignalAdapter</code> -- universal signaling
						system
					</td>
				</tr>
				<tr>
					<td><code>module.ts</code></td>
					<td>
						<code>SmrtModuleMeta</code>, <code>ModuleUISlot</code>,
						<code>ModuleComponentType</code> -- module registration and admin UI slots
					</td>
				</tr>
				<tr>
					<td><code>user.ts</code></td>
					<td>
						<code>UserStatus</code>, <code>TenantStatus</code>, <code>MembershipStatus</code>,
						<code>SessionStatus</code>, <code>OverrideEffect</code>,
						<code>TenantPermissionEffect</code> -- lifecycle/permission status
						<strong>enums</strong> (runtime values)
					</td>
				</tr>
				<tr>
					<td><code>ai-usage.ts</code></td>
					<td>
						<code>AiTokenUsage</code>, <code>AiUsageSnapshot</code>, <code>AiUsageStats</code>,
						<code>SmrtAiUsageEvent</code>, <code>SmrtAiUsageRecord</code> (and related options types)
						-- AI token-usage accounting
					</td>
				</tr>
				<tr>
					<td><code>knowledge.ts</code></td>
					<td>
						<code>DomainKnowledgeConfig</code>, <code>DomainKnowledgeManifest</code>,
						<code>DomainKnowledgeObject</code>, <code>DomainKnowledgeSurface</code> -- domain knowledge
						surfaces
					</td>
				</tr>
				<tr>
					<td><code>routes.ts</code></td>
					<td>
						<code>SmrtRouteDefinition</code>, <code>SmrtRouteModule</code>,
						<code>SmrtRouteNavigationItem</code>, <code>SmrtRouteNavigationMeta</code> -- route definition
						and navigation metadata
					</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section id="usage">
		<h2>Usage</h2>

		<h3>Type-only imports (Signal, Module)</h3>
		<p>
			For the type-only exports, always use <code>import type</code> so the bundler can drop them completely:
		</p>
		<CodeBlock
			code={`import type {
  Signal,
  SignalType,
  SignalAdapter,
} from '@happyvertical/smrt-types';

import type {
  SmrtModuleMeta,
  ModuleUISlot,
  ModuleComponentType,
  ModuleUIBaseProps,
  ModuleUIRegistryInterface,
} from '@happyvertical/smrt-types';`}
			language="typescript"
		/>

		<h3>Enum imports (User, Tenant, Membership, Session)</h3>
		<p>
			Status enums have runtime values, so use a regular <code>import</code>:
		</p>
		<CodeBlock
			code={`import {
  UserStatus,
  TenantStatus,
  MembershipStatus,
  SessionStatus,
  OverrideEffect,
  TenantPermissionEffect,
} from '@happyvertical/smrt-types';

const status = UserStatus.ACTIVE; // OK at runtime`}
			language="typescript"
		/>
	</section>

	<section id="signal-types">
		<h2>Signal Types</h2>
		<p>
			The <code>Signal</code> family models the framework's universal signaling system. Adapters in downstream
			packages (logging, metrics, pub/sub, tracing) consume these signals.
		</p>
		<CodeBlock
			code={`import type { Signal, SignalType, SignalAdapter } from '@happyvertical/smrt-types';

// Lifecycle stages for a tracked method execution
type SignalType = 'start' | 'step' | 'end' | 'error';

// Adapter contract -- implement this in your logging/metrics/tracing layer
class MyAdapter implements SignalAdapter {
  async handle(signal: Signal): Promise<void> {
    // Errors are caught by the signal bus, but it's good practice to log them yourself
  }
}`}
			language="typescript"
		/>
	</section>

	<section id="module-types">
		<h2>Module UI Types</h2>
		<p>Used by packages that register admin-panel UI slots (e.g. smrt-svelte, smrt-users):</p>
		<CodeBlock
			code={`import type {
  SmrtModuleMeta,
  ModuleUISlot,
  ModuleComponentType,
  ModuleUIBaseProps,
  ModuleUIRegistryInterface,
} from '@happyvertical/smrt-types';`}
			language="typescript"
		/>
	</section>

	<section id="rules">
		<h2>Rules</h2>
		<ul>
			<li>
				<strong>Zero runtime code</strong> -- only type definitions and enums live here. No implementations,
				no classes, no constants beyond enum members.
			</li>
			<li>
				<strong>Always <code>import type</code></strong> for non-enum exports. Use a regular
				<code>import</code> only for enums.
			</li>
			<li>
				<strong>Add shared types here</strong> if two or more packages need the same definition --
				don't duplicate them in <code>smrt-core</code>.
			</li>
		</ul>
	</section>

	<section id="next-steps">
		<h2>Next Steps</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>← smrt-core</h3>
				<p>Where these types are consumed</p>
			</a>
			<a href="/modules/smrt-config" class="link-card">
				<h3>smrt-config →</h3>
				<p>Configuration management</p>
			</a>
		</div>
	</section>
</ModulePage>

<style>
	.note {
		padding: 16px;
		background: #f0f7ff;
		border-left: 4px solid #0066cc;
		margin: 16px 0;
		font-size: 0.95rem;
	}

	:global(.prose) h2 {
		font-size: 1.75rem;
		font-weight: 600;
		margin-top: 64px;
		margin-bottom: 24px;
		padding-top: 16px;
		border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	:global(.prose) h2:first-of-type {
		border-top: none;
		margin-top: 0;
	}

	:global(.prose) h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 16px;
	}

	:global(.prose) p {
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 16px;
		line-height: 1.7;
	}

	:global(.prose) ul,
	:global(.prose) ol {
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 16px;
		padding-left: 24px;
		line-height: 1.7;
	}

	:global(.prose) li {
		margin-bottom: 8px;
	}

	:global(.prose) code:not(pre code) {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		border-radius: 3px;
		color: #d63384;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 24px 0;
		font-size: 0.9rem;
	}

	th {
		text-align: left;
		padding: 12px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		font-weight: 600;
		border-bottom: 2px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	td {
		padding: 12px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		vertical-align: top;
	}

	.link-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
		margin-top: 24px;
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
