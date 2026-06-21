<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-scanner"
	description="AST-based scanner using oxc-parser (Rust, 2-3x faster than tsc) for class/field metadata extraction. Powers manifest generation for code generators, the vitest plugin, and the CLI."
	badges={['v0.29.34', 'Core Foundation', 'Rust-powered', 'ESM-only']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<code>@happyvertical/smrt-scanner</code> reads your TypeScript source with the Rust-based
			<a href="https://oxc.rs/">OXC parser</a> and extracts the metadata that
			<code>smrt-core</code>'s code generators need: <code>@smrt()</code> config, class hierarchy,
			field defaults (with the
			<code>0</code> vs <code>0.0</code> heuristic for INTEGER vs DECIMAL), relationships, and
			static properties like <code>uiSlots</code> and <code>adminRoutes</code>.
		</p>
		<p>
			It outputs a manifest JSON consumed downstream by code generators, the vitest plugin, and the
			CLI.
		</p>

		<aside>
			<p>
				<strong
					>ESM-only since PR <a href="https://github.com/happyvertical/smrt/pull/1219">#1219</a
					></strong
				>
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
				<code>OxcScanner</code> -- scans source files with the OXC parser and returns
				<code>ScanResults</code> via <code>.scan()</code>
			</li>
			<li>
				<code>InheritanceResolver</code> -- resolves class inheritance chains across files (<code
					>.addClasses()</code
				>
				/ <code>.resolveAll()</code>)
			</li>
			<li>
				<code>ManifestAdapter</code> -- converts resolved scan results into the smrt-core manifest
				format via <code>.toManifest()</code>
			</li>
			<li>
				<code>parseFile</code>, <code>parseSource</code>, <code>extractSmrtImports</code> -- low-level
				parsing helpers for a single file or source string
			</li>
			<li>
				<code>RawClassDefinition</code>, <code>RawFieldDefinition</code>,
				<code>ResolvedClassDefinition</code>, <code>ScanResults</code>,
				<code>OxcScannerOptions</code> -- scanned class metadata types
			</li>
		</ul>
		<aside>
			<p>
				<strong>Manifest generation lives in smrt-core, not here.</strong> The
				<code>ManifestBuilder</code> / <code>discoverBaseClasses</code> helpers are exported from
				<code>@happyvertical/smrt-core/manifest</code> (they build on this scanner). The scanner package
				itself ships only the parsing/resolution/adapter primitives listed above.
			</p>
		</aside>
	</section>

	<section id="how-it-works">
		<h2>How It Works</h2>
		<ol>
			<li><code>fast-glob</code> finds <code>.ts</code> files matching include/exclude patterns</li>
			<li><code>oxc-parser</code> parses each file's AST</li>
			<li>
				The scanner extracts: <code>@smrt()</code> config, class hierarchy, field defaults (<code
					>0</code
				>
				vs <code>0.0</code> heuristic), relationships, and static properties (<code>uiSlots</code>,
				<code>adminRoutes</code>)
			</li>
			<li>
				The output is a manifest JSON consumed by <strong>code generators</strong>, the
				<strong>vitest plugin</strong>, and the <strong>CLI</strong>
			</li>
		</ol>

		<h3>Key Files</h3>
		<ul>
			<li>
				<code>src/oxc-parser.ts</code> -- low-level OXC parsing (<code>parseFile</code>,
				<code>parseSource</code>)
			</li>
			<li><code>src/scanner.ts</code> -- <code>OxcScanner</code>, glob-based scanning logic</li>
			<li>
				<code>src/inheritance-resolver.ts</code> -- <code>InheritanceResolver</code>, resolves
				inheritance chains
			</li>
			<li>
				<code>src/manifest-adapter.ts</code> -- <code>ManifestAdapter</code>, scan results →
				manifest format
			</li>
		</ul>
	</section>

	<section id="quick-start">
		<h2>Quick Start</h2>

		<h3>Generate a Manifest</h3>
		<CodeBlock
			code={`import {
  OxcScanner,
  InheritanceResolver,
  ManifestAdapter,
} from '@happyvertical/smrt-scanner';

// 1. Scan source files for @smrt() classes
const scanner = new OxcScanner({
  include: ['src/**/*.ts'],
  exclude: ['**/*.test.ts', '**/*.spec.ts'],
});
const results = await scanner.scan();

// 2. Resolve inheritance chains across files
const resolver = new InheritanceResolver();
resolver.addClasses(results.classes);
const resolved = resolver.resolveAll();

// 3. Convert to the smrt-core manifest format
const adapter = new ManifestAdapter();
const manifest = adapter.toManifest(resolved);`}
			language="typescript"
		/>

		<aside>
			<p>
				<strong>cwd-relative:</strong> <code>OxcScanner</code> resolves include/exclude globs
				relative to its <code>cwd</code> option, which defaults to <code>process.cwd()</code>. Pass
				<code>cwd</code> explicitly (or use the <code>scanFromDir(dir, options)</code> helper) when scanning
				from a different directory.
			</p>
		</aside>

		<h3>Discover Base Classes</h3>
		<p>
			Base-class discovery lives in <code>@happyvertical/smrt-core/manifest</code>.
			<code>discoverBaseClasses()</code> returns an array of base class names (e.g.
			<code>['SmrtObject', 'SmrtCollection', ...]</code>) that you feed into
			<code>OxcScanner</code>'s <code>baseClasses</code> option so it can resolve classes that extend
			framework or cross-package bases.
		</p>
		<CodeBlock
			code={`import { discoverBaseClasses } from '@happyvertical/smrt-core/manifest';
import { OxcScanner } from '@happyvertical/smrt-scanner';

// Always pass cwd when projectRoot != process.cwd()
const baseClasses = await discoverBaseClasses({ cwd: projectRoot });
const scanner = new OxcScanner({ baseClasses, cwd: projectRoot });`}
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
				<a href="/modules/smrt-vitest">smrt-vitest</a> -- <code>smrtVitestPlugin()</code> generates
				manifests at vitest startup via smrt-core's <code>ManifestBuilder</code>, which scans
				through this package
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
				<strong>CWD-relative</strong>: <code>OxcScanner</code> resolves globs relative to its
				<code>cwd</code> option (default <code>process.cwd()</code>). Pass <code>cwd</code>
				explicitly (or use <code>scanFromDir</code>) when you're not at the project root.
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
