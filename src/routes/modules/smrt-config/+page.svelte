<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-config"
	description="Configuration management with cosmiconfig, secret sanitization, and SSG-safe export. Loads smrt.config.{(js,
	ts,
	json)} with globalThis caching so every package sees one config instance."
	badges={['v0.29.34', 'Core Foundation', 'ESM']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<code>@happyvertical/smrt-config</code> is the configuration backbone for the SMRT framework.
			It uses <a href="https://github.com/cosmiconfig/cosmiconfig">cosmiconfig</a> to load
			<code>smrt.config.{'{'}js,ts,json{'}'}</code> from the project root, deep-merges runtime
			overrides on top, and caches the result on <code>globalThis</code> so every package -- and every
			module instance -- sees the same merged config.
		</p>

		<h3>How It Works</h3>
		<ol>
			<li>
				<code>loadConfig()</code> uses cosmiconfig to find
				<code>smrt.config.{'{'}js,ts,json{'}'}</code>
			</li>
			<li>
				Merge priority (highest → lowest): runtime overrides (<code>setConfig()</code>) &gt;
				<code>packages</code>/<code>modules</code> section &gt; global <code>smrt</code> section &gt;
				caller defaults
			</li>
			<li>
				The merged result is cached on <code>globalThis.__smrtConfigCache</code> -- every
				<code>getConfig()</code> / <code>getPackageConfig()</code> / <code>getModuleConfig()</code>
				call returns the same object
			</li>
		</ol>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-config`} language="bash" />
	</section>

	<section id="quick-start">
		<h2>Quick Start</h2>

		<h3>1. Create Configuration File</h3>
		<p>
			Create <code>smrt.config.js</code> (or <code>.ts</code> / <code>.json</code>) in your project
			root:
		</p>
		<CodeBlock
			code={`// smrt.config.js
export default {
  smrt: {
    cacheDir: '.cache',
    logLevel: 'info',
  },

  packages: {
    ai: {
      defaultProvider: 'anthropic',
      defaultModel: 'claude-sonnet-4-20250514',
      apiKeys: {
        anthropic: process.env.ANTHROPIC_API_KEY,
      },
    },
  },

  modules: {
    'town-scraper': {
      cronSchedule: '0 0 * * *',
      maxPages: 100,
    },
  },
};`}
			language="javascript"
		/>

		<h3>2. Load Configuration</h3>
		<CodeBlock
			code={`import { loadConfig } from '@happyvertical/smrt-config';

// Call once at app startup -- result is cached on globalThis
await loadConfig();`}
			language="typescript"
		/>

		<h3>3. Use Configuration</h3>
		<CodeBlock
			code={`import { getPackageConfig, getModuleConfig, setConfig } from '@happyvertical/smrt-config';

// Package-scoped (used by every @happyvertical/smrt-* package)
const aiConfig = getPackageConfig('ai', {
  defaultProvider: 'openai',
  defaultModel: 'gpt-4',
});

// Module-scoped (per-app modules)
const scraperConfig = getModuleConfig('town-scraper', {
  cronSchedule: '0 0 * * *',
  maxPages: 50,
});

// Runtime override -- highest priority
setConfig({
  packages: {
    ai: { defaultModel: 'gpt-4-turbo' },
  },
});`}
			language="typescript"
		/>
	</section>

	<section id="api-reference">
		<h2>API Reference</h2>

		<table>
			<thead>
				<tr>
					<th>Function</th>
					<th>Purpose</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>loadConfig(options?)</code></td>
					<td>Async load from file via cosmiconfig</td>
				</tr>
				<tr>
					<td><code>getConfig()</code></td>
					<td>Get the full merged config</td>
				</tr>
				<tr>
					<td><code>getPackageConfig(name, defaults?)</code></td>
					<td>
						Package-scoped config section (used by all <code>@happyvertical/smrt-*</code> packages)
					</td>
				</tr>
				<tr>
					<td><code>getModuleConfig(name, defaults?)</code></td>
					<td>Module-scoped config section (per-app modules)</td>
				</tr>
				<tr>
					<td><code>setConfig(overrides)</code></td>
					<td>Runtime overrides (highest priority)</td>
				</tr>
				<tr>
					<td><code>clearCache()</code></td>
					<td>Reset cached config -- affects all modules</td>
				</tr>
				<tr>
					<td><code>defineConfig(config)</code></td>
					<td>Type-safe config-file helper</td>
				</tr>
				<tr>
					<td><code>exportConfig(options?)</code></td>
					<td>SSG-safe export (defaults to no secrets)</td>
				</tr>
				<tr>
					<td><code>sanitizeConfig(config)</code></td>
					<td>
						Strip keys matching: apiKey, password, secret, token, credential, private, auth, key
					</td>
				</tr>
			</tbody>
		</table>

		<h3><code>getPackageConfig&lt;T&gt;()</code></h3>
		<p>
			This is the canonical pattern that <code>@happyvertical/smrt-*</code> packages use to read their
			own config section (you'll see it in smrt-prompts, smrt-languages, smrt-features, smrt-core, and
			many more):
		</p>
		<CodeBlock
			code={`import { getPackageConfig } from '@happyvertical/smrt-config';

interface AIConfig {
  defaultProvider: string;
  defaultModel: string;
  temperature: number;
}

const aiConfig = getPackageConfig<AIConfig>('ai', {
  defaultProvider: 'openai',
  defaultModel: 'gpt-4',
  temperature: 0.7,
});`}
			language="typescript"
		/>

		<h3><code>defineConfig()</code> for type-safe config files</h3>
		<CodeBlock
			code={`// smrt.config.ts
import { defineConfig } from '@happyvertical/smrt-config';

export default defineConfig({
  smrt: { logLevel: 'info' },
  packages: {
    ai: { defaultProvider: 'anthropic' },
  },
});`}
			language="typescript"
		/>
	</section>

	<section id="ssg-export">
		<h2>SSG-Safe Export</h2>
		<p>
			<code>exportConfig()</code> is designed for static site generation -- it strips secrets by default
			so you can safely inline config into bundled output:
		</p>
		<CodeBlock
			code={`import { exportConfig, sanitizeConfig } from '@happyvertical/smrt-config';

// Default: secrets stripped
const safe = exportConfig();

// Opt-in to keep secrets (rare -- typically only for internal CLIs)
const full = exportConfig({ includeSecrets: true });

// Manual sanitization (strips keys matching:
//   apiKey, password, secret, token, credential, private, auth, key)
const sanitized = sanitizeConfig(config);`}
			language="typescript"
		/>
	</section>

	<section id="testing">
		<h2>Testing</h2>
		<p>
			Use <code>setConfig()</code> to inject test-specific values and <code>clearCache()</code> in
			<code>afterEach</code> to reset state between tests:
		</p>
		<CodeBlock
			code={`import { beforeEach, afterEach, test, expect } from 'vitest';
import { setConfig, clearCache, getPackageConfig } from '@happyvertical/smrt-config';

beforeEach(() => {
  setConfig({
    packages: {
      ai: { defaultProvider: 'mock', defaultModel: 'test-model' },
    },
  });
});

afterEach(() => {
  clearCache(); // reset shared state
});

test('uses test configuration', () => {
  const config = getPackageConfig('ai');
  expect(config.defaultProvider).toBe('mock');
});`}
			language="typescript"
		/>
	</section>

	<section id="key-files">
		<h2>Key Files</h2>
		<ul>
			<li><code>src/loader.ts</code> -- cosmiconfig integration and file discovery</li>
			<li><code>src/merge.ts</code> -- deep-merge logic and runtime config store</li>
			<li><code>src/export.ts</code> -- sanitization and JSON/JS export formatting</li>
			<li><code>src/types.ts</code> -- full config schema (~800 lines)</li>
		</ul>
	</section>

	<section id="gotchas">
		<h2>Gotchas</h2>
		<ul>
			<li>
				<strong><code>clearCache()</code> is global</strong>: it affects every package and module
				reading from <code>globalThis.__smrtConfigCache</code>. Call it carefully outside of tests.
			</li>
			<li>
				<strong>SSG export defaults to no secrets</strong>: you must explicitly pass
				<code>{'{'} includeSecrets: true {'}'}</code> to keep them.
			</li>
			<li>
				<strong>Deep merge</strong>: later values override earlier ones at each key level (objects
				merge, scalars/arrays replace).
			</li>
			<li>
				<strong>Reference via env vars</strong>: keep secrets in <code>process.env</code> and
				reference them from <code>smrt.config.js</code>. Don't hardcode secrets in the config file.
			</li>
		</ul>
	</section>

	<section id="used-by">
		<h2>Used By</h2>
		<p>
			Every <code>@happyvertical/smrt-*</code> package that needs configuration reads its section
			via
			<code>getPackageConfig()</code>. Recent consumers include:
		</p>
		<ul>
			<li><a href="/modules/smrt-core">smrt-core</a> -- AI provider, database defaults</li>
			<li><a href="/modules/smrt-cli">smrt-cli</a> -- CLI entry point and DB config</li>
			<li>
				<a href="/modules/smrt-prompts">smrt-prompts</a>,
				<a href="/modules/smrt-languages">smrt-languages</a>,
				<a href="/modules/smrt-features">smrt-features</a> -- prompts/locales/feature flags
			</li>
		</ul>
	</section>

	<section id="next-steps">
		<h2>Next Steps</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>← smrt-core</h3>
				<p>Core framework with @smrt decorator</p>
			</a>
			<a href="/modules/smrt-cli" class="link-card">
				<h3>smrt-cli →</h3>
				<p>Developer CLI commands</p>
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

	ul,
	ol {
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
