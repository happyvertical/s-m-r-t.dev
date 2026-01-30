<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage 
  name="smrt-config" 
  description="Centralized configuration management for SMRT modules and applications with support for multiple file formats, environment variables, and powerful orchestration via top-level await."
  badges={['v0.19.0', 'Core Foundation', 'ESM']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			The smrt-config package provides a flexible, type-safe configuration system for SMRT
			applications and modules. It supports multiple configuration file formats, environment
			variables, runtime overrides, and seamless integration across monorepos.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li><strong>Multi-format support</strong> - JS, TS, JSON, YAML, TOML with auto-detection</li>
			<li><strong>Type-safe TypeScript</strong> - Full type safety with <code>defineConfig()</code></li>
			<li><strong>Secure secrets handling</strong> - Auto-detects and sanitizes sensitive data</li>
			<li><strong>Remote configuration</strong> - Load from APIs with top-level await</li>
			<li><strong>Configuration merging</strong> - Priority hierarchy for flexible overrides</li>
			<li><strong>Monorepo support</strong> - globalThis-based caching for package sharing</li>
			<li><strong>Three-tier scoping</strong> - Global, package-level, and module-level configs</li>
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
			code={`export default {
  smrt: {
    logLevel: 'info',
    cacheDir: '.cache',
    environment: 'development'
  },
  packages: {
    ai: {
      defaultProvider: 'anthropic',
      defaultModel: 'claude-3-5-sonnet-20241022'
    }
  },
  modules: {
    'my-scraper': {
      cronSchedule: '0 0 * * *',
      maxPages: 100
    }
  }
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
			code={`import { getPackageConfig, getModuleConfig } from '@happyvertical/smrt-config';

// Get package-level config with defaults
const aiConfig = getPackageConfig('ai', {
  defaultProvider: 'openai',
  defaultModel: 'gpt-4'
});

// Get module-level config with defaults
const scraperConfig = getModuleConfig('my-scraper', {
  cronSchedule: '0 6 * * *',
  maxPages: 50
});

console.log(\`Using AI model: \${aiConfig.defaultModel}\`);
console.log(\`Scraper runs at: \${scraperConfig.cronSchedule}\`);`}
		/>
	</section>

	<section id="architecture">
		<h2>Architecture</h2>

		<h3>Configuration Scopes</h3>
		<p>smrt-config supports three hierarchical scopes:</p>
		<ul>
			<li>
				<strong>Global scope</strong> (<code>smrt.*</code>) - Framework-wide settings like log level,
				cache directory
			</li>
			<li>
				<strong>Package scope</strong> (<code>packages.*</code>) - Per-package settings for reusable
				packages
			</li>
			<li>
				<strong>Module scope</strong> (<code>modules.*</code>) - Application-specific module configurations
			</li>
		</ul>

		<h3>Merging Priority</h3>
		<p>Configuration sources are merged with this priority (highest to lowest):</p>
		<ol>
			<li><strong>Runtime config</strong> - Set via <code>setConfig()</code></li>
			<li><strong>Environment variables</strong> - <code>SMRT_*</code> prefix</li>
			<li><strong>File-based config</strong> - <code>smrt.config.*</code> files</li>
			<li><strong>Module/package defaults</strong> - Provided in code</li>
		</ol>

		<h3>File Discovery</h3>
		<p>
			Searches upward from current directory for <code>smrt.config.*</code> files. Supports
			multiple formats:
		</p>
		<ul>
			<li><code>.js</code>, <code>.mjs</code> - JavaScript with ESM</li>
			<li><code>.ts</code> - TypeScript (auto-compiled)</li>
			<li><code>.json</code> - JSON</li>
			<li><code>.yaml</code>, <code>.yml</code> - YAML</li>
			<li><code>.toml</code> - TOML</li>
		</ul>
	</section>

	<section id="api-reference">
		<h2>API Reference</h2>

		<h3>Core Functions</h3>

		<h4><code>loadConfig(options?): Promise&lt;SmrtConfig&gt;</code></h4>
		<p>Load configuration from file and cache it.</p>
		<CodeBlock
			code={`import { loadConfig } from '@happyvertical/smrt-config';

// Basic usage
await loadConfig();

// With options
await loadConfig({
  configPath: './custom.config.js',  // Custom path
  searchParents: true,                // Search up directory tree
  cache: true                         // Cache the result
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
		<p>Helper for type-safe configuration in TypeScript.</p>
		<CodeBlock
			code={`import { defineConfig } from '@happyvertical/smrt-config';

// In smrt.config.ts
export default defineConfig({
  smrt: {
    logLevel: 'info',  // TypeScript autocomplete works here
    cacheDir: '.cache'
  }
});`}
		/>

		<h3>Export Utilities</h3>

		<h4><code>sanitizeConfig(config): unknown</code></h4>
		<p>Remove secrets from configuration.</p>
		<CodeBlock
			code={`import { sanitizeConfig } from '@happyvertical/smrt-config';

const config = {
  apiKey: 'secret-key',
  password: 'secret-password',
  normalValue: 'safe'
};

const clean = sanitizeConfig(config);
// Result: { apiKey: '[REDACTED]', password: '[REDACTED]', normalValue: 'safe' }`}
		/>

		<h4><code>exportConfig(config, options?): string</code></h4>
		<p>Export configuration as string (JSON or JS).</p>
		<CodeBlock
			code={`import { exportConfig } from '@happyvertical/smrt-config';

const config = { /* your config */ };

// Export as JSON (secrets removed by default)
const jsonStr = exportConfig(config);

// Export as JS module with secrets
const jsStr = exportConfig(config, {
  includeSecrets: true,
  format: 'js',
  indent: 2
});`}
		/>
	</section>

	<section id="environment-variables">
		<h2>Environment Variables</h2>
		<p>Use <code>SMRT_</code> prefix with double underscore for nesting:</p>
		<CodeBlock
			code={`# Global config
SMRT_LOG_LEVEL=debug
SMRT_CACHE_DIR=/tmp/cache
SMRT_ENVIRONMENT=production

# Package config
SMRT_AI__DEFAULT_MODEL=gpt-4-turbo
SMRT_AI__TEMPERATURE=0.8

# Module config
SMRT_MODULES__MY_SCRAPER__ENABLED=true
SMRT_MODULES__MY_SCRAPER__MAX_PAGES=500`}
		/>
	</section>

	<section id="tutorials">
		<h2>Tutorials</h2>

		<h3>Tutorial 1: Multi-Environment Configuration</h3>
		<p>Configure your application for different environments.</p>

		<h4>Step 1: Create base configuration</h4>
		<CodeBlock
			code={`// smrt.config.js
export default {
  smrt: {
    logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    cacheDir: '.cache'
  },
  packages: {
    ai: {
      defaultProvider: 'anthropic',
      defaultModel: 'claude-3-5-sonnet-20241022'
    }
  }
};`}
		/>

		<h4>Step 2: Environment-specific overrides</h4>
		<CodeBlock
			code={`# Development (.env.development)
SMRT_LOG_LEVEL=debug
SMRT_AI__DEFAULT_MODEL=claude-3-haiku-20240307

# Production (.env.production)
SMRT_LOG_LEVEL=error
SMRT_AI__DEFAULT_MODEL=claude-3-5-sonnet-20241022
SMRT_CACHE_DIR=/var/cache/smrt`}
		/>

		<h4>Step 3: Load and verify</h4>
		<CodeBlock
			code={`import { loadConfig, getPackageConfig } from '@happyvertical/smrt-config';

await loadConfig();

const aiConfig = getPackageConfig('ai');
console.log(\`Running with \${aiConfig.defaultModel}\`);
// Development: claude-3-haiku-20240307
// Production: claude-3-5-sonnet-20241022`}
		/>

		<h3>Tutorial 2: Remote Configuration Loading</h3>
		<p>Load configuration from a remote API at startup using top-level await.</p>

		<h4>Step 1: Fetch remote config</h4>
		<CodeBlock
			code={`// smrt.config.js
const remoteConfig = await fetch('https://api.example.com/config')
  .then(res => res.json())
  .catch(err => {
    console.error('Failed to load remote config:', err);
    return {}; // Fallback to empty config
  });

export default {
  smrt: {
    logLevel: remoteConfig.logLevel || 'info',
    ...remoteConfig.global
  },
  packages: remoteConfig.packages || {},
  modules: remoteConfig.modules || {}
};`}
		/>

		<h4>Step 2: Merge with local overrides</h4>
		<CodeBlock
			code={`// smrt.config.js
const remoteConfig = await fetch('https://api.example.com/config')
  .then(res => res.json())
  .catch(() => ({}));

export default {
  smrt: {
    ...remoteConfig.global,
    // Local overrides take precedence
    cacheDir: './.cache',
    logLevel: process.env.LOG_LEVEL || remoteConfig.logLevel || 'info'
  },
  packages: {
    ...remoteConfig.packages,
    // Keep secrets local, never remote
    ai: {
      ...remoteConfig.packages?.ai,
      apiKey: process.env.ANTHROPIC_API_KEY
    }
  }
};`}
		/>

		<h3>Tutorial 3: Testing with Configuration</h3>
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
		<p>Configure core framework behavior:</p>
		<CodeBlock
			code={`// smrt.config.js
export default {
  smrt: {
    // Schema migration strategy
    schemaMigration: 'auto-add', // or 'warn'

    // Inheritance cache for performance
    inheritance: {
      cacheSize: 1000,
      ttl: 3600
    },

    // Embedding provider
    embeddings: {
      provider: 'local', // 'local' | 'ai' | 'auto'
      model: 'all-MiniLM-L6-v2'
    }
  }
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

		<h3>✅ DO</h3>
		<ul>
			<li>Keep secrets in environment variables, never hardcoded in config files</li>
			<li>Use sensible defaults in <code>getPackageConfig()</code> / <code>getModuleConfig()</code></li>
			<li>Validate remote configurations before using them</li>
			<li>Cache remote configs with appropriate TTL for performance</li>
			<li>Use <code>defineConfig()</code> for TypeScript type safety</li>
			<li>Handle fetch errors gracefully with fallback configurations</li>
			<li>Test configuration loading in CI/CD pipeline</li>
			<li>Document expected configuration structure for your modules</li>
		</ul>

		<h3>❌ DON'T</h3>
		<ul>
			<li>Hardcode API keys or secrets in configuration files</li>
			<li>Call <code>loadConfig()</code> multiple times unnecessarily</li>
			<li>Store sensitive data in version control</li>
			<li>Share credentials across different environments</li>
			<li>Rely on undocumented internal configuration structure</li>
			<li>Mix configuration scopes incorrectly (use appropriate scope)</li>
			<li>Forget to call <code>clearCache()</code> between tests</li>
		</ul>
	</section>

	<section id="troubleshooting">
		<h2>Troubleshooting</h2>

		<h3>Config file not found</h3>
		<p>
			<strong>Problem:</strong> Configuration file is not being detected.
		</p>
		<p>
			<strong>Solution:</strong> Ensure <code>smrt.config.*</code> is in your project root, or specify
			<code>configPath</code> explicitly:
		</p>
		<CodeBlock code={`await loadConfig({ configPath: './config/smrt.config.js' });`} />

		<h3>Environment variables not working</h3>
		<p><strong>Problem:</strong> Environment variables are not being applied.</p>
		<p>
			<strong>Solution:</strong> Verify you're using the <code>SMRT_</code> prefix and double underscore
			for nesting:
		</p>
		<CodeBlock
			code={`# Correct
SMRT_AI__DEFAULT_MODEL=gpt-4

# Incorrect (missing SMRT_ prefix)
AI__DEFAULT_MODEL=gpt-4`}
		/>

		<h3>TypeScript errors in config file</h3>
		<p><strong>Problem:</strong> Getting type errors in <code>smrt.config.ts</code>.</p>
		<p><strong>Solution:</strong> Use the <code>defineConfig()</code> helper:</p>
		<CodeBlock
			code={`import { defineConfig } from '@happyvertical/smrt-config';

export default defineConfig({
  // Full type safety and autocomplete here
  smrt: {
    logLevel: 'info' // TypeScript will validate this
  }
});`}
		/>

		<h3>Config not shared across packages in monorepo</h3>
		<p><strong>Problem:</strong> Different packages see different configurations.</p>
		<p>
			<strong>Solution:</strong> Ensure <code>loadConfig()</code> is called early in your application
			lifecycle. The package uses globalThis caching to share config across all package instances.
		</p>
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
					<td>Load config from file</td>
					<td><code>Promise&lt;SmrtConfig&gt;</code></td>
				</tr>
				<tr>
					<td><code>getConfig()</code></td>
					<td>Get cached config</td>
					<td><code>SmrtConfig | null</code></td>
				</tr>
				<tr>
					<td><code>getModuleConfig(name, defaults?)</code></td>
					<td>Get module config</td>
					<td><code>T</code></td>
				</tr>
				<tr>
					<td><code>getPackageConfig(name, defaults?)</code></td>
					<td>Get package config</td>
					<td><code>T</code></td>
				</tr>
				<tr>
					<td><code>getSiteConfig()</code></td>
					<td>Get site identity</td>
					<td><code>SiteConfig | null</code></td>
				</tr>
				<tr>
					<td><code>setConfig(config)</code></td>
					<td>Set runtime config</td>
					<td><code>void</code></td>
				</tr>
				<tr>
					<td><code>clearCache()</code></td>
					<td>Clear all caches</td>
					<td><code>void</code></td>
				</tr>
				<tr>
					<td><code>defineConfig(config)</code></td>
					<td>Type-safe helper</td>
					<td><code>SmrtConfig</code></td>
				</tr>
				<tr>
					<td><code>sanitizeConfig(config)</code></td>
					<td>Remove secrets</td>
					<td><code>unknown</code></td>
				</tr>
				<tr>
					<td><code>exportConfig(config, opts?)</code></td>
					<td>Export to string</td>
					<td><code>string</code></td>
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
