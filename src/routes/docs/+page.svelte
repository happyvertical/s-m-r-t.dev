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
		<li>
			<a href="/docs/how-it-works">How It Works</a> — The codegen pipeline: one class becomes a
			REST API, CLI, MCP tools, and SQL schema
		</li>
		<li>
			<a href="/docs/security">Security</a> — Generated-surface defaults: fail-closed auth,
			sensitive and read-only fields
		</li>
		<li><a href="/docs/objects">Objects</a> — Persistent entities with AI-powered methods</li>
		<li><a href="/docs/collections">Collections</a> — Query, filter, and manage sets of objects</li>
		<li><a href="/docs/agents">Agents</a> — Autonomous actors with persistent state</li>
		<li><a href="/docs/agents/dispatch">Dispatch</a> — Inter-agent async messaging</li>
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
