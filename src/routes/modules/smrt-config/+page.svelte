<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-config"
	description="Configuration management with cosmiconfig, secret sanitization, and SSG-safe export. Loads smrt.config.{js,ts,json} with globalThis caching for cross-module sharing."
	badges={['v0.20.44', 'Core Foundation', 'ESM']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			The smrt-config package provides centralized configuration for the SMRT framework.
			It uses <a href="https://github.com/cosmiconfig/cosmiconfig">cosmiconfig</a> to load
			<code>smrt.config.{'{'}js,ts,json{'}'}</code> files, with secret sanitization and SSG-safe export.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li><strong>cosmiconfig loader</strong> - Searches for <code>smrt.config.{'{'}js,ts,json{'}'}</code> files</li>
			<li>
				<strong>Type-safe config</strong> - <code>defineConfig()</code> helper for IDE autocomplete
			</li>
			<li><strong>Secret sanitization</strong> - Strips keys matching apiKey, password, secret, token, credential, private, auth, key</li>
			<li><strong>SSG-safe export</strong> - Export config without secrets for static site generation</li>
			<li><strong>globalThis caching</strong> - All modules share one config instance via <code>globalThis.__smrtConfigCache</code></li>
			<li><strong>Three-tier scoping</strong> - Global (<code>smrt</code>), package (<code>packages</code>), and module (<code>modules</code>) sections</li>
			<li><strong>Runtime overrides</strong> - <code>setConfig()</code> takes highest priority</li>
		</ul>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock
			code={`npm install @happyvertical/smrt-config
# or
pnpm add @happyvertical/smrt-config
# or
bun add @happyvertical/smrt-config`}
		/>
	</section>

	<section id="quick-start">
		<h2>Quick Start (5 Minutes)</h2>

		<h3>1. Create Configuration File</h3>
		<p>Create <code>smrt.config.js</code> in your project root:</p>
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
		/>

		<h3>2. Load Configuration</h3>
		<p>In your application entry point:</p>
		<CodeBlock
			code={`import { loadConfig } from '@happyvertical/smrt-config';

// Load config at startup
await loadConfig();

console.log('Configuration loaded successfully');`}
		/>

		<h3>3. Use Configuration</h3>
		<p>Access config in your modules or packages:</p>
		<CodeBlock
			code={`import { getPackageConfig, getModuleConfig, setConfig } from '@happyvertical/smrt-config';

// Get package-scoped config with defaults
const aiConfig = getPackageConfig('ai', {
  defaultProvider: 'openai',
  defaultModel: 'gpt-4',
});

// Get module-scoped config with defaults
const scraperConfig = getModuleConfig('town-scraper', {
  cronSchedule: '0 0 * * *',
  maxPages: 50,
});

// Runtime overrides (highest priority)
setConfig({
  packages: {
    ai: { defaultModel: 'gpt-4-turbo' },
  },
});`}
		/>
	</section>

	<section id="architecture">
		<h2>Architecture</h2>

		<h3>Configuration Scopes</h3>
		<p>smrt-config supports three hierarchical scopes:</p>
		<ul>
			<li>
				<strong>Global scope</strong> (<code>smrt.*</code>) -- Framework-wide settings like log
				level, cache directory
			</li>
			<li>
				<strong>Package scope</strong> (<code>packages.*</code>) -- Per-package settings (used by
				<code>@happyvertical/smrt-*</code> packages)
			</li>
			<li>
				<strong>Module scope</strong> (<code>modules.*</code>) -- Application-specific module
				configurations
			</li>
		</ul>

		<h3>Merging Priority</h3>
		<p>Configuration sources are merged with this priority (highest to lowest):</p>
		<ol>
			<li><strong>Runtime overrides</strong> - Set via <code>setConfig()</code></li>
			<li><strong>Config file</strong> - <code>smrt.config.{'{'}js,ts,json{'}'}</code></li>
			<li><strong>Environment variables</strong></li>
			<li><strong>Package/module defaults</strong> - Provided in code via <code>getPackageConfig()</code> / <code>getModuleConfig()</code></li>
		</ol>

		<h3>File Discovery</h3>
		<p>
			Uses cosmiconfig to search upward from the current directory for <code>smrt.config.*</code> files:
		</p>
		<ul>
			<li><code>.js</code>, <code>.mjs</code>, <code>.cjs</code> -- JavaScript</li>
			<li><code>.ts</code> -- TypeScript (auto-compiled)</li>
			<li><code>.json</code> -- JSON</li>
		</ul>
	</section>

	<section id="api-reference">
		<h2>API Reference</h2>

		<h3>Core Functions</h3>

		<h4><code>loadConfig(options?): Promise&lt;SmrtConfig&gt;</code></h4>
		<p>Load configuration from file via cosmiconfig. Result is stored in <code>globalThis.__smrtConfigCache</code>.</p>
		<CodeBlock
			code={`import { loadConfig } from '@happyvertical/smrt-config';

// Typical app startup
await loadConfig();

// Load a specific file (tests / scripts)
const config = await loadConfig({
  configPath: './fixtures/smrt.config.js',
  cache: false
});`}
		/>

		<h4><code>getConfig(): SmrtConfig | null</code></h4>
		<p>Get the currently loaded configuration from cache.</p>
		<CodeBlock
			code={`import { getConfig } from '@happyvertical/smrt-config';

const config = getConfig();
if (config) {
  console.log('Log level:', config.smrt?.logLevel);
}`}
		/>

		<h4><code>getModuleConfig&lt;T&gt;(moduleName, defaults?): T</code></h4>
		<p>Get module-specific configuration with defaults.</p>
		<CodeBlock
			code={`import { getModuleConfig } from '@happyvertical/smrt-config';

interface MyModuleConfig {
  enabled: boolean;
  cronSchedule: string;
  maxRetries: number;
}

const config = getModuleConfig<MyModuleConfig>('my-module', {
  enabled: true,
  cronSchedule: '0 0 * * *',
  maxRetries: 3
});

// Merges: defaults < global config < module config < runtime config`}
		/>

		<h4><code>getPackageConfig&lt;T&gt;(packageName, defaults?): T</code></h4>
		<p>Get package-specific configuration with defaults.</p>
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
  temperature: 0.7
});`}
		/>

		<h4><code>setConfig(config): void</code></h4>
		<p>Set runtime configuration (highest priority).</p>
		<CodeBlock
			code={`import { setConfig } from '@happyvertical/smrt-config';

// Override for testing or dynamic configuration
setConfig({
  smrt: { logLevel: 'debug' },
  packages: {
    ai: { defaultModel: 'gpt-4-turbo' }
  }
});`}
		/>

		<h4><code>clearCache(): void</code></h4>
		<p>Clear all cached configuration.</p>
		<CodeBlock
			code={`import { clearCache } from '@happyvertical/smrt-config';

// Useful for testing or hot-reload
clearCache();`}
		/>

		<h4><code>defineConfig(config): SmrtConfig</code></h4>
		<p>Identity function that provides TypeScript type-checking and IDE autocomplete for config files.</p>
		<CodeBlock
			code={`import { defineConfig } from '@happyvertical/smrt-config';

// smrt.config.ts
export default defineConfig({
  smrt: { logLevel: 'info' },
  site: { name: 'My Site' },
  packages: {
    ai: { defaultProvider: 'anthropic' },
  },
});`}
		/>

		<h3>Export Utilities</h3>

		<h4><code>sanitizeConfig(config): unknown</code></h4>
		<p>Strip keys matching secret-like patterns (apiKey, password, secret, token, credential, private, auth, key).</p>
		<CodeBlock
			code={`import { sanitizeConfig } from '@happyvertical/smrt-config';

const sanitized = sanitizeConfig(config);
// Keys matching secret patterns are removed`}
		/>

		<h4><code>exportConfig(options?): string</code></h4>
		<p>SSG-safe export (defaults to no secrets).</p>
		<CodeBlock
			code={`import { exportConfig } from '@happyvertical/smrt-config';

// Export without secrets (default)
const safeConfig = exportConfig({ includeSecrets: false });

// Must explicitly opt in to include secrets
const fullConfig = exportConfig({ includeSecrets: true });`}
		/>
	</section>

	<section id="ssg-export">
		<h2>SSG-Safe Export</h2>
		<p>Export config without secrets for static site generation:</p>
		<CodeBlock
			code={`import { exportConfig, sanitizeConfig } from '@happyvertical/smrt-config';

// Export config without secrets (safe for static site generation)
const safeConfig = exportConfig({ includeSecrets: false });

// Or manually sanitize — strips keys matching:
// apiKey, password, secret, token, credential, private, auth, key
const sanitized = sanitizeConfig(config);`}
		/>
	</section>

	<section id="tutorials">
		<h2>Tutorials</h2>

		<h3>Tutorial 1: Type-Safe Configuration</h3>
		<p>Use <code>defineConfig()</code> for full TypeScript type-checking and IDE autocomplete.</p>

		<h4>Step 1: Create typed config file</h4>
		<CodeBlock
			code={`// smrt.config.ts
import { defineConfig } from '@happyvertical/smrt-config';

export default defineConfig({
  smrt: {
    logLevel: 'info',
  },
  packages: {
    ai: {
      defaultProvider: 'anthropic',
    },
  },
});`}
		/>

		<h4>Step 2: Load and use</h4>
		<CodeBlock
			code={`import { loadConfig, getPackageConfig } from '@happyvertical/smrt-config';

await loadConfig();

const aiConfig = getPackageConfig('ai', {
  defaultProvider: 'openai',
  defaultModel: 'gpt-4',
});
console.log(\`Using: \${aiConfig.defaultProvider}\`);`}
		/>

		<h3>Tutorial 2: Testing with Configuration</h3>
		<p>Use runtime configuration for test-specific settings.</p>

		<CodeBlock
			code={`import { beforeEach, afterEach, test } from 'vitest';
import { setConfig, clearCache, getPackageConfig } from '@happyvertical/smrt-config';

beforeEach(() => {
  // Set test-specific config
  setConfig({
    packages: {
      ai: {
        defaultProvider: 'mock',
        defaultModel: 'test-model'
      }
    }
  });
});

afterEach(() => {
  // Clear cache between tests
  clearCache();
});

test('uses test configuration', () => {
  const config = getPackageConfig('ai');
  expect(config.defaultProvider).toBe('mock');
});`}
		/>
	</section>

	<section id="integration">
		<h2>Integration with SMRT Modules</h2>

		<h3>smrt-core Integration</h3>
		<p>The <code>smrt</code> section holds framework-wide settings, and <code>packages</code> holds per-package config:</p>
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
    },
  },
};`}
		/>

		<h3>Custom Package Integration</h3>
		<p>Use configuration in your own packages:</p>
		<CodeBlock
			code={`// In your package
import { getPackageConfig } from '@happyvertical/smrt-config';

interface MyPackageConfig {
  enabled: boolean;
  timeout: number;
  retries: number;
}

export function initializeMyPackage() {
  const config = getPackageConfig<MyPackageConfig>('my-package', {
    enabled: true,
    timeout: 30000,
    retries: 3
  });

  if (!config.enabled) {
    console.log('Package is disabled');
    return;
  }

  // Use config values...
}`}
		/>
	</section>

	<section id="best-practices">
		<h2>Best Practices</h2>

		<h3>Do</h3>
		<ul>
			<li>Keep secrets in environment variables, reference via <code>process.env</code> in config files</li>
			<li>Use sensible defaults in <code>getPackageConfig()</code> / <code>getModuleConfig()</code></li>
			<li>Use <code>defineConfig()</code> for TypeScript type safety and autocomplete</li>
			<li>Call <code>clearCache()</code> between tests to reset shared state</li>
			<li>Remember <code>clearCache()</code> is global -- it affects all modules sharing the config instance</li>
		</ul>

		<h3>Don't</h3>
		<ul>
			<li>Hardcode API keys or secrets in configuration files</li>
			<li>Call <code>loadConfig()</code> multiple times unnecessarily (result is cached in globalThis)</li>
			<li>Forget that <code>exportConfig()</code> defaults to no secrets -- must explicitly set <code>includeSecrets: true</code></li>
			<li>Forget that deep merge means later values override earlier ones at each key level</li>
		</ul>
	</section>

	<section id="troubleshooting">
		<h2>Troubleshooting</h2>

		<h3>Config file not found</h3>
		<p>
			<strong>Problem:</strong> Configuration file is not being detected.
		</p>
		<p>
			<strong>Solution:</strong> Ensure <code>smrt.config.{'{'}js,ts,json{'}'}</code> is in your project root, or
			specify <code>configPath</code> explicitly:
		</p>
		<CodeBlock code={`await loadConfig({ configPath: './config/smrt.config.js' });`} />

		<h3>Config not shared across packages in monorepo</h3>
		<p><strong>Problem:</strong> Different packages see different configurations.</p>
		<p>
			<strong>Solution:</strong> Ensure <code>loadConfig()</code> is called early in your application
			lifecycle. The package uses <code>globalThis.__smrtConfigCache</code> to share config across all package instances.
		</p>

		<h3>TypeScript errors in config file</h3>
		<p><strong>Problem:</strong> Getting type errors in <code>smrt.config.ts</code>.</p>
		<p><strong>Solution:</strong> Use the <code>defineConfig()</code> helper for full type safety and autocomplete.</p>
	</section>

	<section id="api-summary">
		<h2>API Quick Reference</h2>
		<table>
			<thead>
				<tr>
					<th>Function</th>
					<th>Purpose</th>
					<th>Returns</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>loadConfig(options?)</code></td>
					<td>Async load from file via cosmiconfig</td>
					<td><code>Promise&lt;SmrtConfig&gt;</code></td>
				</tr>
				<tr>
					<td><code>getConfig()</code></td>
					<td>Get full merged config</td>
					<td><code>SmrtConfig | null</code></td>
				</tr>
				<tr>
					<td><code>getPackageConfig(name, defaults?)</code></td>
					<td>Get package-scoped config section</td>
					<td><code>T</code></td>
				</tr>
				<tr>
					<td><code>getModuleConfig(name, defaults?)</code></td>
					<td>Get module-scoped config section</td>
					<td><code>T</code></td>
				</tr>
				<tr>
					<td><code>getSiteConfig()</code></td>
					<td>Get site-level config</td>
					<td><code>SiteConfig | null</code></td>
				</tr>
				<tr>
					<td><code>setConfig(config)</code></td>
					<td>Runtime overrides (highest priority)</td>
					<td><code>void</code></td>
				</tr>
				<tr>
					<td><code>clearCache()</code></td>
					<td>Reset cached config (global)</td>
					<td><code>void</code></td>
				</tr>
				<tr>
					<td><code>defineConfig(config)</code></td>
					<td>Type-safe config file helper</td>
					<td><code>SmrtConfig</code></td>
				</tr>
				<tr>
					<td><code>exportConfig(options?)</code></td>
					<td>SSG-safe export (no secrets by default)</td>
					<td><code>string</code></td>
				</tr>
				<tr>
					<td><code>sanitizeConfig(config)</code></td>
					<td>Strip secret-matching keys</td>
					<td><code>unknown</code></td>
				</tr>
				<tr>
					<td><code>mergeExportedConfig(configs)</code></td>
					<td>Merge multiple exported configs</td>
					<td><code>SmrtConfig</code></td>
				</tr>
				<tr>
					<td><code>parseExportedConfig(raw)</code></td>
					<td>Parse an exported config string</td>
					<td><code>SmrtConfig</code></td>
				</tr>
			</tbody>
		</table>
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

	h4 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 24px;
		margin-bottom: 12px;
		font-family: var(--font-mono);
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
</style>
