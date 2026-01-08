<svelte:head>
	<title>Documentation | s-m-r-t</title>
</svelte:head>

<article class="prose">
	<h1>Documentation</h1>
	<p class="lead">Learn how to build AI-powered applications with the SMRT framework.</p>

	<h2>Quick Start</h2>
	<pre><code>{`npm install @happyvertical/smrt-core

import { SmrtObject, smrt } from '@happyvertical/smrt-core';

@smrt()
class Task extends SmrtObject {
  title: string = '';
  completed: boolean = false;
}

const tasks = await TaskCollection.create({ db: 'tasks.db' });
const task = await tasks.create({ title: 'Learn SMRT' });
console.log(task.id); // auto-generated UUID`}</code></pre>

	<h2>Core Concepts</h2>
	<ul>
		<li><a href="/docs/objects">Objects</a> — Persistent entities with AI-powered methods</li>
		<li><a href="/docs/collections">Collections</a> — Query, filter, and manage sets of objects</li>
		<li><a href="/docs/agents">Agents</a> — Autonomous actors with persistent state</li>
		<li><a href="/docs/agents/dispatch">Dispatch</a> — Inter-agent async messaging</li>
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

	.prose .lead {
		font-size: 1.2rem;
		color: #666;
		margin-bottom: 48px;
	}

	.prose h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
	}

	.prose pre {
		background: #1a1a1a;
		color: #f0f0f0;
		padding: 20px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.5;
		margin: 16px 0 24px;
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
