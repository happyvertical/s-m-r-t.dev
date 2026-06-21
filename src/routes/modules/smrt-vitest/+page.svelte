<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-vitest"
	description="Vitest plugin for SMRT projects -- required for every SMRT test. Auto-generates the build-time manifest, loads cross-package class metadata, and provides transaction-isolated test database utilities."
	badges={['v0.29.34', 'Testing', 'Vitest', 'Required']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-vitest</strong> ships the <code>smrtVitestPlugin()</code> Vite
			plugin that <strong>every SMRT project must include</strong> in its
			<code>vitest.config.ts</code>. Without it, tests fail with
			<code>"No field metadata found"</code>
			or
			<code>"unregistered class"</code> errors.
		</p>
		<p>
			At test startup, the plugin scans <code>src/**/*.ts</code> for <code>@smrt()</code> classes,
			discovers every <code>@happyvertical/smrt-*</code> dependency in your
			<code>package.json</code>, loads their manifests via <code>ManifestManager</code>, and
			registers all classes in
			<code>ObjectRegistry</code>. The package also provides transaction-isolated test database
			utilities with automatic adapter detection (PostgreSQL via <code>DATABASE_URL</code>,
			otherwise SQLite temp files).
		</p>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add -D @happyvertical/smrt-vitest`} language="bash" />
	</section>

	<section id="plugin-setup">
		<h2>Required Plugin Setup</h2>
		<CodeBlock
			code={`// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { smrtVitestPlugin } from '@happyvertical/smrt-vitest';

export default defineConfig({
  plugins: [smrtVitestPlugin()],
  test: {
    setupFiles: ['@happyvertical/smrt-vitest/setup'] // optional: globalThis isolation
  }
});`}
			language="typescript"
		/>

		<h3>What the Plugin Does</h3>
		<ol>
			<li>Scans <code>src/**/*.ts</code> for SMRT classes via ManifestBuilder</li>
			<li>Discovers <code>@happyvertical/smrt-*</code> dependencies from package.json</li>
			<li>Loads external manifests via ManifestManager</li>
			<li>Registers all classes in ObjectRegistry</li>
		</ol>
		<aside>
			<p>
				<strong>Watch-mode caveat:</strong> the manifest is generated
				<strong>once at startup</strong>. Restart vitest after adding new <code>@smrt()</code> classes
				or fields.
			</p>
		</aside>
	</section>

	<section id="test-db">
		<h2>Test Database Utilities</h2>
		<p>
			<strong>Adapter auto-detection:</strong> if <code>DATABASE_URL</code> is set, tests use PostgreSQL;
			otherwise they use SQLite temp files.
		</p>

		<table>
			<thead>
				<tr>
					<th>Function</th>
					<th>Use Case</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>createIsolatedTestDbFromManifest()</code></td>
					<td>
						Multi-table tests -- auto-creates schema from manifest with FK ordering and STI dedup
						<strong>(recommended)</strong>
					</td>
				</tr>
				<tr>
					<td><code>createIsolatedTestDb({'{ schema }'})</code></td>
					<td>Single-table tests -- pass raw DDL with transaction isolation</td>
				</tr>
				<tr>
					<td><code>createTestDb()</code></td>
					<td>No transaction isolation (legacy)</td>
				</tr>
				<tr>
					<td><code>getTestDbConfig()</code></td>
					<td>Get DB config for current environment</td>
				</tr>
			</tbody>
		</table>

		<h3>Manifest-Driven Schema (recommended)</h3>
		<CodeBlock
			code={`import { createIsolatedTestDbFromManifest } from '@happyvertical/smrt-vitest';

let db, cleanup;

beforeEach(async () => {
  // Filter to just the classes this test needs
  ({ db, cleanup } = await createIsolatedTestDbFromManifest({
    includeObjects: ['Product', 'Category'],
  }));
});

afterEach(async () => {
  await cleanup(); // rolls back the transaction
});

it('should insert and query', async () => {
  await db.insert('products', { id: '1', name: 'Widget' });
  const product = await db.get('products', { id: '1' });
  expect(product?.name).toBe('Widget');
});`}
			language="typescript"
		/>

		<h3>Raw-Schema Variant</h3>
		<CodeBlock
			code={`import { createIsolatedTestDb } from '@happyvertical/smrt-vitest';

let db, cleanup;

beforeEach(async () => {
  ({ db, cleanup } = await createIsolatedTestDb({
    schema: \`CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT NOT NULL)\`
  }));
});

afterEach(async () => { await cleanup(); });`}
			language="typescript"
		/>
	</section>

	<section id="imperative-setup">
		<h2>Imperative Setup</h2>
		<p>
			For non-Vite setups (e.g., a <code>globalSetup</code> file or a custom bootstrap), use
			<code>setupSmrtManifests()</code> directly. It loads existing manifests but does not auto-generate
			them:
		</p>
		<CodeBlock
			code={`import { setupSmrtManifests } from '@happyvertical/smrt-vitest';

await setupSmrtManifests({ verbose: true });`}
			language="typescript"
		/>
	</section>

	<section id="rules">
		<h2>Testing Rules</h2>
		<ul>
			<li>
				<strong>Use real in-memory SQLite</strong> for <code>SmrtObject</code> /
				<code>SmrtCollection</code> tests. Don't mock the database -- it's fast enough.
			</li>
			<li>
				<strong>Mock only external API calls</strong> (<code>@happyvertical/ai</code>, HTTP
				fetches). Never mock <code>Agent</code> instances, <code>SmrtObject</code>,
				<code>SmrtCollection</code>, or business logic.
			</li>
			<li>
				<strong>Use <code>createIsolatedTestDb*</code></strong> for transaction-isolated tests -- cleanup
				rolls the transaction back, so tests are independent.
			</li>
			<li>
				<strong>Test generators, not generated output</strong>. Assert the produced manifest /
				routes / commands, not snapshots of the rendered code.
			</li>
			<li>
				<strong>File naming</strong>: <code>*.test.ts</code> for unit, <code>*.spec.ts</code> for
				integration, <code>*.optional.test.ts</code> for tests that require external APIs (skipped in
				CI).
			</li>
		</ul>
	</section>

	<section id="singleton-cache">
		<h2>Singleton Cache Gotcha</h2>
		<p>
			Module-level singleton caches (common in SMRT collections) persist across tests and ignore new
			mocks. The fix is to <code>vi.resetModules()</code> in <code>beforeEach</code> and use a
			dynamic
			<code>await import(...)</code> inside each test instead of a top-level import:
		</p>
		<CodeBlock
			code={`import { beforeEach, vi, it, expect } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

it('reads fresh module each time', async () => {
  const { getCollection } = await import('./my-module');
  // ...
});`}
			language="typescript"
		/>
	</section>

	<section id="key-files">
		<h2>Key Files</h2>
		<ul>
			<li>
				<code>src/index.ts</code> -- Vite plugin, manifest generation, all exports
			</li>
			<li>
				<code>src/setup.ts</code> -- globalThis isolation setup file
			</li>
			<li>
				<code>src/test-db.ts</code> -- createIsolatedTestDb, createIsolatedTestDbFromManifest, createTestDb
			</li>
		</ul>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Core framework being tested</p>
			</a>
			<a href="/modules/smrt-scanner" class="link-card">
				<h3>smrt-scanner</h3>
				<p>AST scanner used for manifest generation</p>
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

	aside {
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 16px;
		border-radius: 8px;
		margin: 16px 0;
		border-left: 4px solid var(--smrt-color-primary, #1976d2);
	}

	aside p {
		margin: 0;
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
