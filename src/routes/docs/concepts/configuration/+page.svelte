<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { SMRT_VERSION_LABEL } from '$lib/version';
</script>

<svelte:head>
	<title>Configuration | SMRT Concepts</title>
	<meta
		name="description"
		content="Configure SMRT with smrt.config.ts and defineConfig. Understand the smrt / modules / packages sections and how getModuleConfig() and getPackageConfig() merge layered config at runtime."
	/>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/docs">Docs</a>
		<span>/</span>
		<span>Concepts</span>
		<span>/</span>
		<span>Configuration</span>
	</nav>

	<h1>Configuration</h1>
	<p class="lead">
		A SMRT project is configured by a single <code>smrt.config.ts</code> file at the project root.
		<code>defineConfig()</code> gives you typed editing of that file, and helpers like
		<code>getModuleConfig()</code> read it back — merged with runtime overrides — wherever you need it.
	</p>

	<section>
		<h2>smrt.config.ts</h2>
		<p>
			<code>smrt init</code> scaffolds the file. <code>defineConfig()</code> is an identity function —
			it returns its argument unchanged — so its only job is to type-check the object literal and power
			editor autocompletion.
		</p>
		<CodeBlock
			code={`// smrt.config.ts
import { defineConfig } from '@happyvertical/smrt-config';

export default defineConfig({
  // Global SMRT settings — the lowest-priority base for every module.
  smrt: {
    logLevel: 'info',
    environment: 'development',
    schemaMigration: { strategy: 'auto-add' },
    embeddings: { provider: 'local' }
  },

  // Package-scoped config, keyed by package name.
  packages: {
    cli: {
      database: {
        type: 'sqlite',
        url: process.env.DATABASE_URL || './data/app.db'
      }
    },
    ai: process.env.OPENAI_API_KEY
      ? { provider: 'openai', apiKey: process.env.OPENAI_API_KEY }
      : undefined
  },

  // Module-scoped config, keyed by a name you choose.
  modules: {
    'my-agent': { cronSchedule: '0 2 * * *', maxRetries: 3 }
  }
});`}
			language="typescript"
		/>
		<Callout variant="security" title="Keep secrets in the environment">
			Read API keys and database URLs from <code>process.env</code> as shown above — never hard-code
			them in <code>smrt.config.ts</code>. The file is committed to your repository.
		</Callout>
	</section>

	<section>
		<h2>The five top-level sections</h2>
		<p>Every key in <code>SmrtConfig</code> is optional. The five sections are:</p>
		<table>
			<thead><tr><th>Key</th><th>Purpose</th><th>Read with</th></tr></thead>
			<tbody>
				<tr
					><td><code>smrt</code></td><td
						>Global framework options (log level, environment, schema migration, embeddings).</td
					><td>Merged into every module/package lookup as the base layer.</td></tr
				>
				<tr
					><td><code>modules</code></td><td>Your own module configs, keyed by a name you pick.</td
					><td><code>getModuleConfig(name)</code></td></tr
				>
				<tr
					><td><code>packages</code></td><td
						>Config sections owned by <code>@happyvertical/smrt-*</code> packages.</td
					><td><code>getPackageConfig(name)</code></td></tr
				>
				<tr
					><td><code>site</code></td><td
						>Site identity for the site templates (name, navigation, theme).</td
					><td><code>getSiteConfig()</code></td></tr
				>
				<tr
					><td><code>export</code></td><td>Static-site-generation options.</td><td
						>Read by the export tooling.</td
					></tr
				>
			</tbody>
		</table>
		<Callout variant="note" title="modules vs packages">
			Both sections behave identically — they exist only to avoid name collisions. Use <code
				>packages</code
			>
			when you are a SMRT package exposing your own config section (e.g. <code>cli</code>,
			<code>ai</code>, <code>users</code>); use <code>modules</code>
			for your application's own feature config.
		</Callout>
	</section>

	<section>
		<h2>Reading config at runtime</h2>
		<p>
			<code>getModuleConfig(name, defaults)</code> returns the resolved config for a module, merging four
			layers in ascending priority:
		</p>
		<ol>
			<li><code>defaults</code> you pass at the call site (lowest priority)</li>
			<li>the global <code>smrt</code> section</li>
			<li>the <code>modules[name]</code> section of the loaded file</li>
			<li>runtime overrides set via <code>setConfig()</code> (highest priority)</li>
		</ol>
		<CodeBlock
			code={`import { getModuleConfig } from '@happyvertical/smrt-config';
import { Agent } from '@happyvertical/smrt-agents';
import { smrt } from '@happyvertical/smrt-core';

@smrt()
class MyAgent extends Agent {
  // Reads modules['my-agent'] from smrt.config.ts, falling back to defaults.
  protected config = getModuleConfig('my-agent', {
    cronSchedule: '0 2 * * *',
    maxRetries: 3
  });

  async run(): Promise<void> {
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      // ...
    }
  }
}`}
			language="typescript"
		/>
		<p>
			<code>getPackageConfig(name, defaults)</code> is identical but reads from
			<code>packages[name]</code> instead. Packages use it to expose their own section without clashing
			with your module names.
		</p>
		<CodeBlock
			code={`// Inside an @happyvertical/smrt-* package
import { getPackageConfig } from '@happyvertical/smrt-config';

const config = getPackageConfig('ai', {
  defaultModel: 'gpt-4o-mini',
  maxTokens: 2048
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Loading and overriding</h2>
		<p>
			In a Vite/SvelteKit project the bundler transpiles <code>smrt.config.ts</code> for you. Tools
			that run outside the bundler load it explicitly with <code>loadConfig()</code>, which searches
			upward from the working directory and caches the result.
		</p>
		<CodeBlock
			code={`import { loadConfig, getConfig, setConfig } from '@happyvertical/smrt-config';

// Load once at startup (e.g. in a CLI entrypoint or test setup)
await loadConfig();

// Read the whole resolved config
const config = getConfig();

// Apply a runtime override — wins over the file for subsequent reads
setConfig({ smrt: { logLevel: 'debug' } });`}
			language="typescript"
		/>
		<Callout variant="note" title="File extensions">
			<code>smrt.config.ts</code> is the convention generated by <code>smrt init</code> and is
			transpiled by your bundler. When <code>loadConfig()</code> searches on its own (outside a
			bundler), it resolves <code>smrt.config.js</code>, <code>.mjs</code>, <code>.cjs</code>, or
			<code>.json</code>.
		</Callout>
	</section>

	<section>
		<h2>Common global settings</h2>
		<table>
			<thead><tr><th>Setting</th><th>Values</th><th>Effect</th></tr></thead>
			<tbody>
				<tr
					><td><code>smrt.logLevel</code></td><td
						><code>'debug' | 'info' | 'warn' | 'error'</code></td
					><td>Framework log verbosity.</td></tr
				>
				<tr
					><td><code>smrt.environment</code></td><td
						><code>'development' | 'production' | 'test'</code></td
					><td>Environment-aware behavior.</td></tr
				>
				<tr
					><td><code>smrt.schemaMigration.strategy</code></td><td
						><code>'warn' | 'auto-add'</code></td
					><td>Whether to auto-apply additive schema changes or only warn.</td></tr
				>
				<tr
					><td><code>smrt.embeddings.provider</code></td><td
						><code>'local' | 'ai' | 'auto'</code></td
					><td>Default embedding provider for semantic search.</td></tr
				>
				<tr
					><td><code>smrt.embeddings.storage</code></td><td><code>'json' | 'native'</code></td><td
						>Store vectors as JSON (portable) or use native vector ops when available.</td
					></tr
				>
			</tbody>
		</table>
	</section>

	<section>
		<h2>Related</h2>
		<ul>
			<li><a href="/modules/smrt-config">@happyvertical/smrt-config</a> — the module reference.</li>
			<li>
				<a href="/docs/concepts/semantic-search">Semantic Search</a> — uses
				<code>smrt.embeddings</code>.
			</li>
			<li>
				<a href="/docs/concepts/multi-tenancy">Multi-tenancy</a> — packages like <code>users</code> read
				their own config section.
			</li>
		</ul>
		<p class="version-note">Verified against SMRT {SMRT_VERSION_LABEL}.</p>
	</section>
</article>

<style>
	.prose {
		max-width: 100%;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: var(--smrt-color-on-surface-variant, #666);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--smrt-color-primary, #1976d2);
	}

	.version-note {
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #888);
		font-style: italic;
		margin-top: 32px;
	}
</style>
