<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>template-sveltekit - Full-Stack Template | SMRT Framework</title>
	<meta
		name="description"
		content="SvelteKit project template with SMRT framework integration, auto-generated REST API routes, TypeScript, and SQLite."
	/>
</svelte:head>

<ModulePage
	name="template-sveltekit"
	description="Base SvelteKit project template used by smrt gnode create. Scaffolds a full-stack app with the SMRT Vite plugin, auto-generated REST routes, TypeScript, and SQLite."
	badges={['v0.29.34', 'Template', 'SvelteKit 2.x', 'Svelte 5.18', 'Vite 7.3', 'TS 5.9']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-template-sveltekit</strong> is the base SvelteKit project template
			that <code>smrt gnode create &lt;name&gt; --template sveltekit</code> scaffolds. The generated
			project ships with the SMRT Vite plugin for automatic REST route generation, an example
			<code>@smrt()</code> object, server-side SMRT initialisation, SQLite, and an
			<code>.env.example</code> to edit before first run.
		</p>
		<p>
			Pinned tooling stack: Vite ^7.3.1, TypeScript ^5.9.3, Svelte ^5.18.0, and
			<code>@sveltejs/kit</code> ^2.46.0. The package declares
			<code>@happyvertical/smrt-core</code> ^0.29.1 as a peer dependency; the generated project pins
			the SMRT runtime packages it depends on (<code>smrt-core</code>, <code>smrt-tenancy</code>,
			<code>smrt-users</code>).
		</p>
	</section>

	<section id="whats-included">
		<h2>What the Template Provides</h2>
		<ul>
			<li>SvelteKit 2.x with Svelte ^5.18 and TypeScript ^5.9</li>
			<li>
				<code>smrtPlugin()</code> Vite ^7.3 integration for automatic REST API route generation
			</li>
			<li>
				Example <code>@smrt()</code> object (<code>template/src/lib/objects/Item.ts</code>) with
				barrel export
			</li>
			<li>Server-side SMRT initialisation (<code>template/src/lib/server/</code>)</li>
			<li><code>smrt.config.ts</code> with SQLite database and optional AI provider</li>
			<li><code>.env.example</code> with starter environment variables</li>
		</ul>
	</section>

	<section id="usage">
		<h2>Usage</h2>

		<h3>With smrt CLI (recommended)</h3>
		<CodeBlock
			code={`smrt gnode create my-app --template sveltekit
cd my-app
pnpm install
cp .env.example .env    # Edit with your values
pnpm dev                # Dev server at http://localhost:5173`}
			language="bash"
		/>

		<h3>Programmatic Usage</h3>
		<CodeBlock
			code={`import { copyTemplate } from '@happyvertical/smrt-template-sveltekit';

copyTemplate('./my-new-project', {
  name: 'my-app',
  overwrite: false,
});`}
			language="typescript"
		/>
	</section>

	<section id="exports">
		<h2>Package Exports</h2>
		<ul>
			<li>
				<code>getTemplatePath()</code> — returns the absolute path to the <code>template/</code> directory
			</li>
			<li>
				<code>copyTemplate(destination, options)</code> — copies template files with project-name
				substitution in <code>package.json</code>
			</li>
			<li>
				<code>templateInfo</code> — metadata object (SvelteKit 2.x, Svelte 5, REST API, SMRT CLI, SQLite)
			</li>
		</ul>
	</section>

	<section id="placeholders-section">
		<h2>Project Name Substitution</h2>
		<p>
			When <code>copyTemplate()</code> runs with a <code>name</code> option, it copies the template
			files verbatim and then rewrites the <code>name</code> field of the generated
			<code>package.json</code>. The template files themselves contain no token placeholders — the
			only substitution is the generated project's package name.
		</p>
	</section>

	<section id="env-vars">
		<h2>Environment Variables</h2>
		<table>
			<thead>
				<tr>
					<th>Variable</th>
					<th>Required</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>DATABASE_URL</code></td>
					<td>Yes</td>
					<td>Database path (default: <code>./data/app.db</code>)</td>
				</tr>
				<tr>
					<td><code>DATABASE_TYPE</code></td>
					<td>Yes</td>
					<td>Database engine (default: <code>sqlite</code>)</td>
				</tr>
				<tr>
					<td><code>PUBLIC_SITE_NAME</code></td>
					<td>No</td>
					<td>Display name for the site</td>
				</tr>
				<tr>
					<td><code>PUBLIC_SITE_URL</code></td>
					<td>No</td>
					<td>Public URL (default: <code>http://localhost:5173</code>)</td>
				</tr>
				<tr>
					<td><code>OPENAI_API_KEY</code></td>
					<td>No</td>
					<td>OpenAI API key for AI features</td>
				</tr>
				<tr>
					<td><code>ANTHROPIC_API_KEY</code></td>
					<td>No</td>
					<td>Anthropic API key (alternative AI provider)</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section id="multi-tenancy">
		<h2>Multi-Tenancy (pre-wired)</h2>
		<p>
			The generated project wires multi-tenancy out of the box:
			<code>src/hooks.server.ts</code> registers the tenancy interceptor, loads sessions, and
			resolves the tenant from a leading subdomain (e.g. <code>acme.demo.local</code> →
			<code>tenantId='acme'</code>). The resolution strategy is swappable in
			<code>src/lib/server/tenancy.ts</code>.
		</p>
	</section>

	<section id="related">
		<h2>Related</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Core framework and ORM</p>
			</a>
			<a href="/modules/smrt-cli" class="link-card">
				<h3>smrt-cli</h3>
				<p>CLI tools including smrt gnode create</p>
			</a>
			<a href="/modules/template-site-static-json" class="link-card">
				<h3>template-site-static-json</h3>
				<p>Static site template with JSON data</p>
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
