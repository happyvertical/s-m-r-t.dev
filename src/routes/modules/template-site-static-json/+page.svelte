<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="template-site-static-json"
	description="Scaffold template for static community news sites with JSON data storage. Includes a local WeatherHeader shim and stubbed Caelus/Praeco workflow scripts on the v0.29.32 baseline."
	badges={['v0.29.32', 'Template', 'Static Site', 'JSON', 'WeatherHeader shim']}
>
	<section id="status">
		<aside
			style="background: #fff3cd; border: 2px solid #ffc107; padding: 1.25rem 1.5rem; border-radius: 8px; margin-bottom: 2rem;"
		>
			<h2 style="color: #856404; margin-top: 0; font-size: 1.15rem;">
				v0.29.32 Baseline Notes — Read Before Generating
			</h2>
			<ul style="color: #856404; margin-bottom: 0;">
				<li>
					<strong>Local WeatherHeader shim.</strong> <code>smrt-svelte</code> no longer ships a
					<code>WeatherHeader</code> component (it was dropped before the 0.29 line), so the
					template ships
					<code>template/src/lib/components/WeatherHeader.svelte</code> as an inline shim. It
					renders the Caelus-shaped <code>forecast</code> payload; consumers using a different weather
					data layer should customise this file in the generated project.
				</li>
				<li>
					<strong>Workflow scripts are stubs.</strong> <code>workflow:caelus</code> and
					<code>workflow:praeco</code> currently print an &quot;upstream package needs a CLI bin&quot;
					message and exit with status 1. This is a documented contract until upstream changes land —
					see the Workflow Scripts section below.
				</li>
			</ul>
		</aside>
	</section>

	<section id="overview">
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-template-site-static-json</strong> generates a SvelteKit static
			community-news site with JSON file-based data storage. It is the template
			<code>smrt gnode create</code>
			expands when you pass <code>--template site-static-json</code>: pre-built routes (home, about,
			contact), Markdown rendering, config-driven site identity, and integration hooks for weather
			forecasts (Caelus) and council-meeting article generation (Praeco). The build emits static
			HTML for any CDN.
		</p>
	</section>

	<section id="usage">
		<h2>Usage</h2>
		<CodeBlock
			code={`smrt gnode create my-town-site --template site-static-json \\
  --location "My Town, AB" \\
  --lat 53.5 --lon -113.5

cd my-town-site
pnpm install
cp .env.example .env      # Add your GEMINI_API_KEY
pnpm run init-data        # Initialize data directory
pnpm dev                  # Start dev server`}
			language="bash"
		/>
	</section>

	<section id="whats-included">
		<h2>What the Template Provides</h2>
		<ul>
			<li>SvelteKit with <code>adapter-static</code> for static-site generation</li>
			<li>JSON file-based data storage in <code>data/</code></li>
			<li>
				Config-driven site identity, navigation, categories, and theming via <code
					>smrt.config.js</code
				>
			</li>
			<li>
				Caelus-shaped weather payload rendering (via the local <code>WeatherHeader.svelte</code> shim
				— see below)
			</li>
			<li>
				Praeco integration scaffolding for council-meeting scraping and article generation (workflow
				scripts stubbed — see below)
			</li>
			<li>Typed site config helper (<code>initSiteConfig()</code> / <code>getSite()</code>)</li>
			<li>Pre-built routes: home, about, contact</li>
			<li>Markdown utility for content rendering</li>
		</ul>
	</section>

	<section id="weather-header-shim">
		<h2>WeatherHeader Shim</h2>
		<p>
			The template ships <code>template/src/lib/components/WeatherHeader.svelte</code> as a local
			shim. It used to be imported from <code>@happyvertical/smrt-svelte</code>, but that package no
			longer ships the component, so the template inlines an equivalent.
		</p>
		<p>
			The shim renders the Caelus-shaped <code>forecast</code> payload (current conditions plus a
			short outlook). If you wire a different weather provider — or restructure the forecast object
			— edit this file in your generated project to suit your data layer. The shim has no upstream
			dependency, so customising it does not break <code>pnpm update</code>.
		</p>
	</section>

	<section id="workflow-scripts">
		<h2>Workflow Scripts (Stubs on v0.29.32)</h2>
		<p>
			<code>pnpm run workflow:caelus</code> and <code>pnpm run workflow:praeco</code> are documented contracts
			but currently ship as stub scripts. They print an &quot;upstream package needs a CLI bin&quot; message
			and exit with status 1.
		</p>
		<p>Two independent reasons today's scaffold cannot run them:</p>
		<ol>
			<li>
				<strong>Upstream packages are library-only.</strong> <code>@happyvertical/caelus</code> and
				<code>@happyvertical/praeco</code> do not declare a <code>bin</code> field, so
				<code>npx @happyvertical/caelus</code> / <code>npx @happyvertical/praeco</code> exits with &quot;could
				not determine executable to run.&quot;
			</li>
			<li>
				<strong>No local workflow shim.</strong> The template does not ship
				<code>template/src/workflows/caelus.ts</code> or
				<code>template/src/workflows/praeco.ts</code>
				files that would import the upstream package and invoke the workflow programmatically. A
				<code>tsx</code>-based script would work fine once such a shim exists.
			</li>
		</ol>
		<p>
			Once upstream ships CLI bins, the stubs can be replaced with
			<code>npx @happyvertical/caelus --config smrt.config.js</code> and
			<code>npx @happyvertical/praeco --config smrt.config.js</code> (note the scoped names — the
			unscoped <code>caelus</code> package is a 404 on the public registry). Alternatively, add a
			<code>template/src/workflows/&lt;name&gt;.ts</code> shim that imports the upstream main export
			and invokes the workflow, then point the script at
			<code>tsx src/workflows/&lt;name&gt;.ts</code>. Until either lands, callers who need these
			workflows should write the shim themselves in their generated project.
		</p>
	</section>

	<section id="configuration">
		<h2>Configuration</h2>
		<p>Edit <code>smrt.config.js</code> to customize. Key sections:</p>
		<ul>
			<li>
				<strong><code>site</code></strong> -- name, description, location, navigation links, theme colors
			</li>
			<li>
				<strong><code>categories</code></strong> -- content categories for routing (e.g.,
				<code>politics/local</code>)
			</li>
			<li>
				<strong><code>modules.praeco</code></strong> -- council meeting sources and report configurations
			</li>
			<li>
				<strong><code>modules.caelus</code></strong> -- weather location (set automatically from
				<code>--lat</code>/<code>--lon</code> flags)
			</li>
		</ul>
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
					<td><code>GEMINI_API_KEY</code></td>
					<td>Yes</td>
					<td>Google Gemini API key for Praeco article generation</td>
				</tr>
				<tr>
					<td><code>PUBLIC_GTM_ID</code></td>
					<td>No</td>
					<td>Google Tag Manager container ID</td>
				</tr>
				<tr>
					<td><code>CUSTOM_DOMAIN</code></td>
					<td>No</td>
					<td>Custom domain for deployment</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section id="scripts">
		<h2>Available Scripts</h2>
		<table>
			<thead>
				<tr>
					<th>Script</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>pnpm dev</code></td>
					<td>Start development server</td>
				</tr>
				<tr>
					<td><code>pnpm build</code></td>
					<td>Build static site to <code>./build</code></td>
				</tr>
				<tr>
					<td><code>pnpm preview</code></td>
					<td>Preview the built site</td>
				</tr>
				<tr>
					<td><code>pnpm run init-data</code></td>
					<td>Initialize JSON data files</td>
				</tr>
				<tr>
					<td><code>pnpm run workflow:caelus</code></td>
					<td
						><strong>Stub.</strong> Prints &quot;upstream package needs a CLI bin&quot; and exits 1 (see
						Workflow Scripts).</td
					>
				</tr>
				<tr>
					<td><code>pnpm run workflow:praeco</code></td>
					<td
						><strong>Stub.</strong> Prints &quot;upstream package needs a CLI bin&quot; and exits 1 (see
						Workflow Scripts).</td
					>
				</tr>
				<tr>
					<td><code>pnpm run validate:json</code></td>
					<td>Validate JSON data files</td>
				</tr>
				<tr>
					<td><code>pnpm run validate:slugs</code></td>
					<td>Validate content slugs</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section id="placeholders">
		<h2>Placeholder Substitution</h2>
		<p>During <code>smrt gnode create</code>, placeholders are replaced from CLI flags:</p>
		<p>
			<code>{'{{SITE_NAME}}'}</code>, <code>{'{{LOCATION_NAME}}'}</code>,
			<code>{'{{LATITUDE}}'}</code>, <code>{'{{LONGITUDE}}'}</code>,
			<code>{'{{TIMEZONE}}'}</code>. See <code>template.config.js</code> for the full mapping.
		</p>
	</section>

	<section id="deployment">
		<h2>Deployment</h2>
		<p>Build and deploy to any static host:</p>
		<CodeBlock
			code={`pnpm build
# Deploy ./build to S3, Netlify, Vercel, Cloudflare Pages, etc.`}
			language="bash"
		/>
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
			<a href="/modules/template-sveltekit" class="link-card">
				<h3>template-sveltekit</h3>
				<p>Full-stack SvelteKit template</p>
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
