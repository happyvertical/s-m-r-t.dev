<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { SMRT_VERSION_LABEL } from '$lib/version';
</script>

<svelte:head>
	<title>Testing | SMRT Concepts</title>
	<meta
		name="description"
		content="Test SMRT objects with Vitest. The smrtVitestPlugin() generates the manifest your tests need, plus isolated-database helpers from @happyvertical/smrt-vitest."
	/>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/docs">Docs</a>
		<span>/</span>
		<span>Concepts</span>
		<span>/</span>
		<span>Testing</span>
	</nav>

	<h1>Testing</h1>
	<p class="lead">
		SMRT objects are plain classes, so they test like any TypeScript code. The one thing they need
		is a <strong>manifest</strong> — the field metadata produced by the build-time scanner. The
		<code>smrtVitestPlugin()</code> generates it for you, so a Vitest run has everything it needs without
		a separate build step.
	</p>

	<section>
		<h2>Why the plugin is required</h2>
		<p>
			SMRT does not read field types from the live class at runtime. Schema generation, queries, and
			AI methods all read from a manifest built by the AST scanner at build time. In a test run,
			there is no build, so the manifest is missing — and the first database operation throws:
		</p>
		<CodeBlock
			code={`Error: No field metadata found for class 'Task'. The class is registered
(decorator ran) but has no field definitions. This usually means the
manifest file is missing or stale.`}
			language="text"
		/>
		<p>
			The plugin closes that gap. It builds the local manifest once at Vitest startup and loads the
			manifests shipped by every <code>@happyvertical/smrt-*</code> dependency, so cross-package classes
			are registered too.
		</p>
		<Callout variant="note" title="One line of setup">
			Adding <code>smrtVitestPlugin()</code> to your Vitest config is the only test-specific setup SMRT
			needs. There is no global setup file to register, and no fixture to import.
		</Callout>
	</section>

	<section>
		<h2>Setup</h2>
		<p>
			Add the plugin to <code>vitest.config.ts</code>. With the default
			<code>generateManifest: true</code>, the manifest is generated at startup — you do not need to
			run a build or <code>smrt test</code> first.
		</p>
		<CodeBlock
			code={`// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { smrtVitestPlugin } from '@happyvertical/smrt-vitest';

export default defineConfig({
  plugins: [smrtVitestPlugin()],
  test: {
    globals: true,
    environment: 'node'
  }
});`}
			language="typescript"
		/>
		<CodeBlock code={`pnpm add -D @happyvertical/smrt-vitest vitest`} language="bash" />
		<p>That is the whole setup. Write tests as you normally would:</p>
		<CodeBlock
			code={`// src/models/Task.test.ts
import { describe, it, expect } from 'vitest';
import { TaskCollection } from './TaskCollection.js';

describe('Task', () => {
  it('creates and reads a task', async () => {
    const tasks = await TaskCollection.create({ db: ':memory:' });
    const task = await tasks.create({ title: 'Write tests' });

    expect(task.id).toBeTruthy();
    expect(task.title).toBe('Write tests');

    const found = await tasks.get(task.id);
    expect(found?.title).toBe('Write tests');
  });
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Plugin options</h2>
		<p>
			The defaults work for a typical single-package project. Override these when you need to tune
			manifest generation or widen the scan.
		</p>
		<table>
			<thead>
				<tr><th>Option</th><th>Type</th><th>Default</th><th>Purpose</th></tr>
			</thead>
			<tbody>
				<tr>
					<td><code>generateManifest</code></td>
					<td>boolean</td>
					<td><code>true</code></td>
					<td
						>Generate the local manifest at startup. Set false to use an existing manifest only.</td
					>
				</tr>
				<tr>
					<td><code>packages</code></td>
					<td>string[]</td>
					<td><code>[]</code></td>
					<td
						>Extra <code>@happyvertical/smrt-*</code> packages to load beyond those auto-discovered from
						package.json.</td
					>
				</tr>
				<tr>
					<td><code>verbose</code></td>
					<td>boolean</td>
					<td><code>false</code></td>
					<td
						>Log each manifest discovered, loaded, or skipped — useful when debugging "No field
						metadata".</td
					>
				</tr>
				<tr>
					<td><code>root</code></td>
					<td>string</td>
					<td><code>process.cwd()</code></td>
					<td>Project root used to locate package.json and resolve manifest paths.</td>
				</tr>
			</tbody>
		</table>
		<Callout variant="note" title="Watch mode">
			The manifest is generated once at startup and cached for the session. In watch mode, restart
			Vitest after adding new <code>@smrt()</code> classes or fields so the new metadata is picked up.
		</Callout>
	</section>

	<section>
		<h2>Isolated test databases</h2>
		<p>
			For the simplest unit tests, point a collection at an in-memory SQLite database — fast, and
			discarded when the process exits:
		</p>
		<CodeBlock
			code={`const tasks = await TaskCollection.create({ db: ':memory:' });`}
			language="typescript"
		/>
		<p>
			For suites that need transaction isolation between tests,
			<code>@happyvertical/smrt-vitest</code> ships
			<code>createIsolatedTestDbFromManifest()</code>. It derives the schema from the manifest the
			plugin already generated, runs each test inside a transaction, and rolls back on
			<code>cleanup()</code> — so no data leaks between tests and tables are never re-created.
		</p>
		<CodeBlock
			code={`import { beforeEach, afterEach, describe, it, expect } from 'vitest';
import { createIsolatedTestDbFromManifest } from '@happyvertical/smrt-vitest';
import { TaskCollection } from './TaskCollection.js';

describe('Task isolation', () => {
  let db, cleanup;

  beforeEach(async () => {
    // Restrict schema creation to the objects this suite touches
    ({ db, cleanup } = await createIsolatedTestDbFromManifest({
      includeObjects: ['Task']
    }));
  });

  afterEach(async () => {
    await cleanup(); // Rolls back the transaction — nothing persists
  });

  it('does not leak rows between tests', async () => {
    const tasks = await TaskCollection.create({ db });
    await tasks.create({ title: 'isolated' });
    expect(await tasks.count({})).toBe(1);
  });
});`}
			language="typescript"
		/>
		<p>Other helpers exported from the same package:</p>
		<table>
			<thead><tr><th>Export</th><th>Purpose</th></tr></thead>
			<tbody>
				<tr
					><td><code>createIsolatedTestDbFromManifest()</code></td><td
						>Transaction-isolated database whose schema is built from the generated manifest.
						Returns <code>db</code>, <code>config</code>, and <code>cleanup()</code>.</td
					></tr
				>
				<tr
					><td><code>createIsolatedTestDb()</code></td><td
						>Transaction-isolated database from raw <code>schema</code> DDL you pass in. Use when you
						are testing SQL directly, not SMRT objects.</td
					></tr
				>
				<tr
					><td><code>createTestDb()</code></td><td
						>Non-transactional test database (file is deleted on cleanup).</td
					></tr
				>
				<tr
					><td><code>isPostgresAvailable()</code></td><td
						>Gate Postgres-only suites so they skip cleanly on machines without a database.</td
					></tr
				>
			</tbody>
		</table>
		<Callout variant="note" title="Skipping Postgres-only suites">
			Transaction isolation needs an adapter that implements <code>beginTransaction()</code>. Gate
			Postgres integration tests with a guard such as
			<code>describe.skipIf(!(await isPostgresAvailable()))</code> so the suite is skipped — not failed
			— where no Postgres is reachable.
		</Callout>
	</section>

	<section>
		<h2>Testing component packages</h2>
		<p>
			For Svelte component tests, add <code>@happyvertical/smrt-vitest/svelte-setup</code> to your
			<code>setupFiles</code>. It wires up jest-dom matchers, Testing Library auto-cleanup, and a
			<code>&lt;dialog&gt;</code> polyfill for jsdom. It is safe to list alongside node tests — the
			DOM pieces only load when a <code>document</code> is present.
		</p>
		<CodeBlock
			code={`// vitest.config.ts (component package)
import { defineConfig } from 'vitest/config';
import { smrtVitestPlugin } from '@happyvertical/smrt-vitest';

export default defineConfig({
  plugins: [smrtVitestPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['@happyvertical/smrt-vitest/svelte-setup']
  }
});`}
			language="typescript"
		/>
		<p>
			Accessibility assertions are available from the <code>/a11y</code> subpath via
			<code>expectNoA11yViolations()</code>.
		</p>
	</section>

	<section>
		<h2>Alternative: smrt test</h2>
		<p>
			If you prefer to run tests through the SMRT CLI instead of wiring the plugin, the
			<code>smrt test</code> command generates the manifest and then invokes Vitest for you. The
			Vitest plugin is the better default for app projects because plain
			<code>vitest</code> and <code>vitest --watch</code> just work once it is installed.
		</p>
	</section>

	<section>
		<h2>Related</h2>
		<ul>
			<li>
				<a href="/modules/smrt-vitest">@happyvertical/smrt-vitest</a> — the module reference for the plugin
				and database helpers.
			</li>
			<li>
				<a href="/docs/concepts/configuration">Configuration</a> — where the database type used by tests
				is resolved.
			</li>
			<li><a href="/docs/objects">Objects</a> — what the manifest describes.</li>
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
