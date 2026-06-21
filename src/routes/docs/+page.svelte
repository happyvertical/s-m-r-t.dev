<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const quickStartCode = `npm install @happyvertical/smrt-core

import { SmrtObject, smrt } from '@happyvertical/smrt-core';

@smrt()
class Task extends SmrtObject {
  title: string = '';
  completed: boolean = false;
}

const tasks = await TaskCollection.create({ db: 'tasks.db' });
const task = await tasks.create({ title: 'Learn SMRT' });
console.log(task.id); // auto-generated UUID`;
</script>

<svelte:head>
	<title>Documentation | s-m-r-t</title>
</svelte:head>

<article class="prose">
	<h1>Documentation</h1>

	<h2>Quick Start</h2>
	<CodeBlock code={quickStartCode} lang="typescript" />

	<h2>Core Concepts</h2>
	<ul>
		<li><a href="/docs/objects">Objects</a> — Persistent entities with AI-powered methods</li>
		<li><a href="/docs/collections">Collections</a> — Query, filter, and manage sets of objects</li>
		<li><a href="/docs/agents">Agents</a> — Autonomous actors with persistent state</li>
		<li><a href="/docs/agents/dispatch">Dispatch</a> — Inter-agent async messaging</li>
	</ul>

	<h2>Concepts</h2>
	<ul>
		<li>
			<a href="/docs/concepts/testing">Testing</a> — Vitest setup with
			<code>smrtVitestPlugin()</code> and isolated test databases
		</li>
		<li>
			<a href="/docs/concepts/configuration">Configuration</a> — <code>smrt.config.ts</code>,
			<code>defineConfig</code>, and runtime config lookups
		</li>
		<li>
			<a href="/docs/concepts/multi-tenancy">Multi-tenancy</a> — Tenant isolation via
			<code>@TenantScoped</code>, <code>withTenant()</code>, and Postgres RLS
		</li>
		<li>
			<a href="/docs/concepts/context-memory">Context Memory</a> — <code>remember</code>/<code
				>recall</code
			> with confidence and hierarchical scopes
		</li>
		<li>
			<a href="/docs/concepts/semantic-search">Semantic Search</a> — Embeddings,
			<code>semanticSearch()</code>, and <code>findSimilar()</code>
		</li>
	</ul>

	<h2>Guides</h2>
	<ul>
		<li>
			<a href="/docs/guides/multi-tenant-lifecycle">Multi-tenant request lifecycle</a> — One
			<code>hooks.server.ts</code>: session, permissions, tenant context, RLS
		</li>
		<li>
			<a href="/docs/guides/expose-app-via-mcp">Expose your app via MCP</a> — Serve your objects to
			Claude Desktop with <code>smrt-app-mcp</code>
		</li>
		<li>
			<a href="/docs/guides/add-semantic-search">Add semantic search to a model</a> — From keyword-only
			to meaning-based search
		</li>
	</ul>

	<h2>Migration Guides</h2>
	<ul>
		<li>
			<a href="/docs/migration">0.19 → 0.20</a> — Component reorganization, browser-ai consolidation,
			API changes
		</li>
	</ul>
</article>

<style>
	.prose {
		max-width: 720px;
	}

	.prose h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.prose h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
	}

	.prose ul {
		margin: 0;
		padding-left: 24px;
	}

	.prose li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	.prose a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.prose a:hover {
		text-decoration: underline;
	}
</style>
