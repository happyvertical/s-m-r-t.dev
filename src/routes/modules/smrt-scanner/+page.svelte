<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-scanner"
	description="AST-based scanner using oxc-parser (Rust, 2-3x faster than tsc) for class/field metadata extraction. Powers manifest generation for code generators, the vitest plugin, and the CLI."
	badges={['v0.24.12', 'Core Foundation', 'Rust-powered', 'ESM-only']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<code>@happyvertical/smrt-scanner</code> reads your TypeScript source with the Rust-based
			<a href="https://oxc.rs/">OXC parser</a> and extracts the metadata that <code>smrt-core</code>'s
			code generators need: <code>@smrt()</code> config, class hierarchy, field defaults (with the
			<code>0</code> vs <code>0.0</code> heuristic for INTEGER vs DECIMAL), relationships, and static
			properties like <code>uiSlots</code> and <code>adminRoutes</code>.
		</p>
		<p>It outputs a manifest JSON consumed downstream by code generators, the vitest plugin, and the CLI.</p>

		<aside>
			<p>
				<strong>ESM-only since PR <a href="https://github.com/happyvertical/smrt/pull/1219">#1219</a></strong>
				(<code>fix(core): resolve ESM-only scanner package</code>). The scanner ships only ESM
				exports -- CJS consumers should switch to ESM or wrap behind dynamic <code>import()</code>.
				The companion change in <code>smrt-core</code> updates
				<code>import-workspace-module</code> so workspace imports stay ESM-only.
			</p>
		</aside>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add @happyvertical/smrt-scanner`} language="bash" />
		<p>
			Usually you don't install this directly -- it's a dependency of
			<a href="/modules/smrt-vitest">smrt-vitest</a> and <a href="/modules/smrt-cli">smrt-cli</a>.
		</p>
	</section>

	<section id="key-exports">
		<h2>Key Exports</h2>
		<ul>
			<li>
				<code>ManifestBuilder</code> -- scans source files and builds a <code>SmartObjectManifest</code>
				via <code>.generate()</code>
			</li>
			<li>
				<code>discoverBaseClasses({'{'} cwd {'}'})</code> -- finds SMRT base classes inside
				<code>node_modules</code> (always pass <code>cwd</code> if you're not running from the project
				root)
			</li>
			<li>
				<code>SmartObjectDefinition</code>, <code>FieldDefinition</code> -- scanned class metadata
				types
			</li>
		</ul>
	</section>

	<section id="how-it-works">
		<h2>How It Works</h2>
		<ol>
			<li><code>fast-glob</code> finds <code>.ts</code> files matching include/exclude patterns</li>
			<li><code>oxc-parser</code> parses each file's AST</li>
			<li>
				The scanner extracts: <code>@smrt()</code> config, class hierarchy, field defaults
				(<code>0</code> vs <code>0.0</code> heuristic), relationships, and static properties
				(<code>uiSlots</code>, <code>adminRoutes</code>)
			</li>
			<li>
				The output is a manifest JSON consumed by <strong>code generators</strong>, the
				<strong>vitest plugin</strong>, and the <strong>CLI</strong>
			</li>
		</ol>

		<h3>Key Files</h3>
		<ul>
			<li><code>src/oxc-scanner.ts</code> -- core AST scanning logic</li>
			<li><code>src/manifest-builder.ts</code> -- orchestrates scanning → manifest</li>
			<li><code>src/base-class-discovery.ts</code> -- resolves base classes from node_modules</li>
		</ul>
	</section>

	<section id="quick-start">
		<h2>Quick Start</h2>

		<h3>Generate a Manifest</h3>
		<CodeBlock
			code={`import { ManifestBuilder } from '@happyvertical/smrt-scanner';

const builder = new ManifestBuilder({
  include: ['src/**/*.ts'],
  exclude: ['**/*.test.ts', '**/*.spec.ts'],
  output: '.smrt/manifest.json',
});

await builder.generate();`}
			language="typescript"
		/>

		<aside>
			<p>
				<strong>cwd-relative:</strong> <code>ManifestBuilder.generate()</code> resolves all paths
				relative to <code>process.cwd()</code> -- not relative to any <code>projectRoot</code> option.
				If you call it from a different working directory, wrap with
				<code>process.chdir(projectRoot)</code> / restore.
			</p>
		</aside>

		<h3>Discover Base Classes</h3>
		<CodeBlock
			code={`import { discoverBaseClasses } from '@happyvertical/smrt-scanner';

// Always pass cwd when projectRoot != process.cwd()
const bases = await discoverBaseClasses({ cwd: projectRoot });`}
			language="typescript"
		/>
	</section>

	<section id="field-inference">
		<h2>Field Type Inference</h2>
		<p>The scanner infers field types in this priority order:</p>
		<ol>
			<li>
				<strong>Helper functions</strong>: <code>text()</code>, <code>integer()</code>,
				<code>decimal()</code>, <code>foreignKey()</code>
			</li>
			<li>
				<strong>Field decorators</strong>: <code>@field({'{'} type: '...' {'}'})</code>
			</li>
			<li>
				<strong>TypeScript annotations</strong>, using the
				<code>0</code> vs <code>0.0</code> heuristic to distinguish INTEGER from DECIMAL
			</li>
			<li>Default: <code>text</code></li>
		</ol>

		<CodeBlock
			code={`class Product extends SmrtObject {
  name: string = '';        // → TEXT
  quantity: number = 0;     // → INTEGER  (no decimal point)
  price: number = 0.0;      // → DECIMAL  (has decimal point)
  active: boolean = true;   // → BOOLEAN
  tags: string[] = [];      // → JSON
  createdAt: Date = new Date(); // → DATETIME
}`}
			language="typescript"
		/>
	</section>

	<section id="used-by">
		<h2>Used By</h2>
		<ul>
			<li>
				<a href="/modules/smrt-vitest">smrt-vitest</a> -- <code>smrtVitestPlugin()</code> calls
				<code>ManifestBuilder</code> at vitest startup
			</li>
			<li>
				<a href="/modules/smrt-cli">smrt-cli</a> -- introspection and code-generation commands
			</li>
			<li>
				<a href="/modules/smrt-core">smrt-core</a> -- the vite-plugin loads scanner modules from
				<code>dist/</code> (see core's "Vite plugin loads scanner from dist first" gotcha, #1139)
			</li>
		</ul>
	</section>

	<section id="gotchas">
		<h2>Gotchas</h2>
		<ul>
			<li>
				<strong>CWD-relative</strong>: <code>ManifestBuilder.generate()</code> resolves all paths
				relative to <code>process.cwd()</code>. Wrap with a <code>process.chdir(projectRoot)</code> /
				restore if you're not at the project root.
			</li>
			<li>
				<strong>ESM-only (PR #1219)</strong>: the package ships only ESM exports. CJS consumers must
				switch to ESM or use dynamic <code>import()</code>.
			</li>
			<li>
				<strong>Static property capture</strong>: the scanner captures <code>uiSlots</code> and
				<code>adminRoutes</code> for agent manifest generation -- if these properties aren't picked
				up, check they're declared as <code>static</code> with an initializer.
			</li>
			<li>
				<strong>pnpm symlinks resolve to workspace paths</strong>: in a monorepo, pnpm symlinks
				resolve to actual workspace directories rather than via <code>node_modules</code>, so any
				<code>filePath.includes('node_modules')</code> filter will miss them.
			</li>
		</ul>
	</section>

	<section id="next-steps">
		<h2>Next Steps</h2>
		<div class="link-grid">
			<a href="/modules/smrt-vitest" class="link-card">
				<h3>smrt-vitest →</h3>
				<p>Required plugin that uses ManifestBuilder</p>
			</a>
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core →</h3>
				<p>Consumes the manifest to power code generators</p>
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
