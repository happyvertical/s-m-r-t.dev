<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-playground"
	description="Shared playground discovery, runtime helpers, and host components for SMRT UI packages. Discovers per-package ./playground modules and renders them under a unified host."
	badges={['v0.24.12', 'Playground Host', 'UI Discovery', 'Vite Plugin']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-playground</strong> is the canonical playground host for SMRT UI packages. Each
			UI-shipping package exports a <code>./playground</code> subpath; the host discovers them at
			build time, merges them into a unified registry, and renders the entries through a shared
			<code>PlaygroundHost</code> Svelte component.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Discovers workspace and <code>node_modules</code> packages that expose a <code>./playground</code> subpath</li>
				<li>Runtime registry merges discovered modules</li>
				<li>Generates SvelteKit route templates for app- and package-level hosts</li>
				<li><code>PlaygroundHost.svelte</code> renders entries with live/mock toggles and fixtures</li>
				<li>Vite plugin wires discovery, virtual modules, and HMR</li>
				<li><code>smrt playground</code> CLI commands consume this runtime</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-playground`} language="bash" />
	</section>

	<section>
		<h2>The ./playground Subpath Contract</h2>
		<p>
			Each UI-shipping package opts in by exporting a <code>./playground</code> subpath that
			resolves to a module shaped like <code>SmrtPlaygroundModule</code>:
		</p>
		<CodeBlock
			code={`// packages/<name>/src/svelte/playground.ts
import type { SmrtPlaygroundModule } from '@happyvertical/smrt-playground';

export const playground: SmrtPlaygroundModule = {
  packageName: '@happyvertical/smrt-<name>',
  entries: [
    {
      id: '<name>:component-id',
      label: 'Human-readable label',
      load: () => import('./components/MyComponent.svelte'),
      // Optional:
      fixtures: { default: { ... }, withData: { ... } },
      modes: ['live', 'mock'],
    },
  ],
};`}
			language="typescript"
		/>
		<p>
			The package's <code>package.json</code> exports map must point <code>./playground</code> at
			the compiled module:
		</p>
		<CodeBlock
			code={`{
  "exports": {
    "./playground": {
      "types": "./dist/svelte/playground.d.ts",
      "import": "./dist/svelte/playground.js"
    }
  }
}`}
			language="json"
		/>
	</section>

	<section>
		<h2>Quick Start (Vite Plugin)</h2>
		<CodeBlock
			code={`// vite.config.ts in your playground host app
import { smrtPlaygroundPlugin } from '@happyvertical/smrt-playground/vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default {
  plugins: [
    sveltekit(),
    smrtPlaygroundPlugin({
      // Where to look for ./playground exports
      // Defaults to workspace packages + installed node_modules
      include: ['@happyvertical/*'],
    }),
  ],
};`}
			language="typescript"
		/>

		<h3>Render the Host</h3>
		<CodeBlock
			code={'<!-- src/routes/+page.svelte -->\n<' +
				`script lang="ts">
  import PlaygroundHost from '@happyvertical/smrt-playground/svelte/PlaygroundHost.svelte';
  import { registry } from 'virtual:smrt-playground';
</` +
				'script>\n\n<PlaygroundHost {registry} />'}
			language="svelte"
		/>
	</section>

	<section>
		<h2>CLI Commands</h2>
		<p>
			The <code>smrt playground</code> commands are owned by <code>@happyvertical/smrt-cli</code> but
			delegate to this runtime:
		</p>
		<CodeBlock
			code={`# Scaffold a playground host app
npx smrt playground init

# Run the playground in dev mode
npx smrt playground dev

# List discovered playground entries
npx smrt playground list`}
			language="bash"
		/>
	</section>

	<section>
		<h2>Module Anatomy</h2>
		<ul>
			<li><code>discovery.ts</code> — finds package-owned <code>./playground</code> modules across workspace and <code>node_modules</code></li>
			<li><code>runtime.ts</code> — coerces and merges discovered modules into a unified registry consumed by the host</li>
			<li><code>templates.ts</code> — generates Svelte route templates for app-level and package-level playground hosts</li>
			<li><code>svelte/PlaygroundHost.svelte</code> — the host component that renders discovered playground entries</li>
			<li><code>vite.ts</code> — Vite plugin used by the SvelteKit playground host to wire everything together</li>
		</ul>
	</section>

	<section>
		<h2>UI Surface Levels</h2>
		<p>
			<code>smrt-playground</code> is one of three UI surfaces a SMRT package may expose. From the
			monorepo's <code>docs/ui-surfaces.md</code>:
		</p>
		<ul>
			<li><code>./svelte</code> — reusable components (<code>ContentEditor</code>, <code>ArticleCard</code>, etc.)</li>
			<li><code>./playground</code> — preview metadata for the shared playground host (the standard for SMRT packages with Svelte components)</li>
			<li><code>./routes</code> — package-owned page/workflow surfaces (not standardized for this release)</li>
		</ul>
		<p>
			<code>smrt-playground</code> only <em>discovers and renders</em>. Component code and theming
			live in individual packages (<code>smrt-content/svelte</code>, <code>smrt-jobs/svelte</code>,
			etc.) or in <code>smrt-svelte</code> for shared primitives.
		</p>
	</section>

	<section>
		<h2>Gotchas</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Keep playground modules tiny — only metadata + dynamic <code>load()</code></li>
				<li>Use the <code>id</code> prefix convention <code>{`<package-name>:<component>`}</code> for uniqueness</li>
				<li>Provide fixtures for components that require non-trivial input</li>
				<li>Expose <code>./playground</code> in <code>package.json</code> exports — discovery relies on it</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't ship component source from <code>smrt-playground</code> — it's a host, not a component library</li>
				<li>Don't import <code>smrt-playground</code> internals from individual packages — only the type surface is public</li>
				<li>Don't rely on the private <code>host/</code> directory — it's a Playwright e2e harness, not published</li>
				<li>Don't conflate <code>./playground</code> with <code>./routes</code> — the former is preview metadata, the latter would be reusable app surfaces</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-svelte">
				<h3>smrt-svelte</h3>
				<p>Shared Svelte primitives, theme system, provider</p>
			</a>
			<a href="/modules/smrt-cli">
				<h3>smrt-cli</h3>
				<p>Owns the <code>smrt playground</code> subcommands</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Example of a package that ships <code>./playground</code> entries</p>
			</a>
			<a href="/modules/smrt-jobs">
				<h3>smrt-jobs</h3>
				<p>Example of a package that ships <code>./playground</code> entries</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
