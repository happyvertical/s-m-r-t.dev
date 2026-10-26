<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { SMRT_VERSION } from '$lib/version';

	// Four ways to a project on the smrt-start template. The homepage's
	// Getting Started section links each of these targets; keep the hrefs and
	// the `#cookbook` id stable.
	const paths = [
		{
			label: 'build-a-boilerplate',
			body: 'Pick recipes in the browser and export a cookbook file, or a prompt for your coding agent. Nothing to install.',
			href: '/build-a-boilerplate'
		},
		{
			label: 'Start from a cookbook',
			body: 'smrt cookbook apply turns a cookbook file into a project on the smrt-start template, pinned to the current release.',
			href: '#cookbook'
		},
		{
			label: 'Clone smrt-start',
			body: 'The template on its own: one owner, local SQLite, a Note model, an assistant and read-only MCP.',
			href: '/docs/getting-started/smrt-start'
		},
		{
			label: 'Hand it to your agent',
			body: 'Copy a prompt into Claude Code, Codex or another coding agent. It runs the smrt CLI and creates the app.',
			href: '/#agent-prompt'
		}
	];

	// The CLI package ships four library cookbooks under `cookbooks/` (bakery,
	// mechanic, welder, yoga-studio); the same files are in the smrt repository
	// at the release tag, which is what the URL example below fetches.
	const cli = `npx -y @happyvertical/smrt-cli@${SMRT_VERSION}`;

	const applyFile = `${cli} cookbook validate my.cookbook.json
${cli} cookbook apply my.cookbook.json my-app
cd my-app
pnpm app:setup
pnpm app:doctor
pnpm dev                    # http://127.0.0.1:5173
pnpm app:open               # in a second terminal: the one-time owner setup page`;

	const applyLibrary = `${cli} cookbook apply \\
  https://raw.githubusercontent.com/happyvertical/smrt/v${SMRT_VERSION}/packages/cli/cookbooks/bakery.cookbook.json \\
  bakery`;
</script>

<SEO
	title="Getting Started"
	description="Four ways to a s-m-r-t project on the smrt-start template: build-a-boilerplate, smrt cookbook apply, a clone of smrt-start, or a prompt for your coding agent."
	url="https://s-m-r-t.dev/docs/getting-started"
/>

<article class="starter-index">
	<header>
		<p>Getting Started</p>
		<h1>Four ways to a running application.</h1>
		<span
			>Each one ends with a SvelteKit project on the smrt-start template, with the s-m-r-t packages
			installed. Pick by how you want to begin.</span
		>
	</header>

	<nav class="path-list" aria-label="Getting started paths">
		{#each paths as path, index (path.href)}
			<a href={path.href}>
				<span class="index">0{index + 1}</span>
				<strong>{path.label}</strong>
				<p>{path.body}</p>
			</a>
		{/each}
	</nav>

	<section id="cookbook">
		<h2>Start from a cookbook</h2>
		<p>
			A cookbook is a JSON file naming the recipes an application is made of. build-a-boilerplate
			exports one. The smrt CLI ships four of its own: bakery, mechanic, welder and yoga-studio.
		</p>
		<p>
			<code>smrt cookbook apply</code> copies the smrt-start template, adds the packages the recipes
			need, pins every s-m-r-t package to the CLI's own release ({SMRT_VERSION}), and writes the
			cookbook to <code>smrt.cookbook.json</code>. Nothing else changes, and no sample data is
			created. You need Node 26 or newer, git and pnpm 11; no account or token.
		</p>
		<CodeBlock code={applyFile} language="bash" filename="terminal" />
		<p>
			A library cookbook has no name of its own, so give the directory. The file can be a path or a
			URL; this one is the bakery at the release tag.
		</p>
		<CodeBlock code={applyLibrary} language="bash" filename="terminal" />
		<ul>
			<li><code>--dry-run</code> prints what apply would do without writing anything.</li>
			<li>
				<code>--into my-app</code> applies an edited cookbook to an existing project. Edit the
				cookbook and re-apply; do not hand-edit <code>smrt.cookbook.json</code>.
			</li>
			<li>
				<code>pnpm app:setup</code> builds, creates the local database and issues a one-time owner
				invitation; <code>pnpm app:open</code> opens the page that claims it.
			</li>
		</ul>
	</section>

	<aside>
		<h2>Coding agents</h2>
		<p>
			Each installed <code>@happyvertical/smrt-*</code> package ships an <code>AGENTS.md</code>
			written for its exact version, under <code>node_modules</code>.
			<a href="/docs/tooling">Developer tooling</a>
			covers the rest.
		</p>
	</aside>
</article>

<style>
	.starter-index {
		width: min(920px, calc(100% - 48px));
		margin: 0 auto;
		padding: 58px 0 88px;
	}

	header {
		max-width: 750px;
		padding-bottom: 44px;
	}

	header > p,
	.path-list .index {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	h1 {
		margin-top: 13px;
		font-size: clamp(2.15rem, 5vw, 3.2rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}

	header > span {
		display: block;
		max-width: 680px;
		margin-top: 18px;
		color: var(--site-muted);
		font-size: 0.95rem;
		line-height: 1.65;
	}

	.path-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.path-list > a {
		display: flex;
		flex-direction: column;
		padding: 22px 25px 25px;
		border: 1px solid var(--site-line-strong);
		border-radius: 10px;
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}

	.path-list > a:hover {
		border-color: var(--site-accent-strong);
	}

	.path-list strong {
		margin-top: 18px;
		font-size: 1.15rem;
		letter-spacing: -0.02em;
	}

	.path-list p,
	section > p,
	section li,
	aside p {
		color: var(--site-muted);
		font-size: 0.84rem;
		line-height: 1.6;
	}

	.path-list p {
		margin-top: 9px;
	}

	section {
		margin-top: 44px;
		padding-top: 34px;
		border-top: 1px solid var(--site-line);
	}

	section h2 {
		font-size: 1.35rem;
		letter-spacing: -0.025em;
	}

	section > p {
		max-width: 680px;
		margin-top: 12px;
	}

	section :global(.code-block) {
		margin-top: 18px;
	}

	section ul {
		max-width: 680px;
		margin: 18px 0 0;
		padding-left: 20px;
	}

	section li + li {
		margin-top: 6px;
	}

	code {
		font-family: var(--site-font-mono);
		font-size: 0.92em;
	}

	aside {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 28px;
		margin-top: 40px;
		padding: 22px 0;
		border-top: 1px solid var(--site-line);
	}

	aside h2 {
		font-size: 0.9rem;
	}

	aside a {
		color: var(--site-ink);
	}

	@media (max-width: 720px) {
		.starter-index {
			width: min(100% - 28px, 920px);
			padding-top: 38px;
		}

		.path-list,
		aside {
			grid-template-columns: 1fr;
		}
	}
</style>
