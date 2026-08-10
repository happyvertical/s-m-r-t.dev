<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import Callout from '$lib/components/Callout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PlaygroundEmbed from '$lib/components/PlaygroundEmbed.svelte';
	import PrevNext from '$lib/components/PrevNext.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { toAnchorId } from '$lib/data/anchors';
	import { packageStatusLabels, type SmrtPackage } from '$lib/data/packages';
	import { getPlaygroundEntries, playgroundModules } from '$lib/data/playgrounds';
	import { packageNeighbors } from '$lib/data/track';

	type Tab = 'overview' | 'components' | 'playground' | 'rest' | 'mcp' | 'webmcp' | 'cli';

	interface Props {
		pkg: SmrtPackage;
	}

	let { pkg }: Props = $props();
	let activeTab = $state<Tab>('overview');
	const tabs: { id: Tab; label: string }[] = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'components', label: 'Components' },
		{ id: 'playground', label: 'Playground' },
		{ id: 'rest', label: 'REST' },
		{ id: 'mcp', label: 'MCP' },
		{ id: 'webmcp', label: 'WebMCP' },
		{ id: 'cli', label: 'CLI' }
	];

	const hasGeneratedSurface = $derived(Boolean(pkg.exampleResource));
	const resource = $derived(pkg.exampleResource ?? 'resource');
	const packagePlaygroundModules = $derived(
		playgroundModules.filter((module) => module.packageName === pkg.name)
	);
	const packagePlaygroundEntries = $derived(getPlaygroundEntries(pkg.slug));
	const neighbors = $derived(packageNeighbors(pkg.slug));
	const sourceInstallCode =
		'# Distributed from the s-m-r-t source tree\n# See the package README for Gradle/SPM setup';
	const sourceDirectory = $derived(
		[
			'smrt-android',
			'smrt-app-mcp',
			'smrt-dev-mcp',
			'smrt-ios',
			'smrt-mobile',
			'smrt-mobile-contract',
			'smrt-playground',
			'smrt-svelte',
			'smrt-ui',
			'smrt-web'
		].includes(pkg.slug)
			? pkg.slug
			: pkg.slug.replace('smrt-', '')
	);

	// `afterNavigate` also fires on first mount, and unlike `onMount` it re-runs
	// when a link lands on the same package with a different `?tab=` — which is
	// how a component result from the ⌘K palette opens the Components tab.
	afterNavigate(() => {
		const requested = new URL(window.location.href).searchParams.get('tab') as Tab | null;
		activeTab = requested && tabs.some((tab) => tab.id === requested) ? requested : 'overview';
	});

	function selectTab(tab: Tab) {
		activeTab = tab;
		const url = new URL(window.location.href);
		if (tab === 'overview') url.searchParams.delete('tab');
		else url.searchParams.set('tab', tab);
		window.history.replaceState({}, '', url);
	}
</script>

<SEO title={pkg.name} description={pkg.summary} url={`https://s-m-r-t.dev/packages/${pkg.slug}`} />

<article class="workbench">
	<header class="package-hero">
		<div>
			<a class="back-link" href="/packages">← All packages</a>
			<div class="package-meta">
				<span>{pkg.category}</span>
				<span>v{pkg.version}</span>
				{#if pkg.status === 'new'}<span class="new">New</span>{/if}
				{#if pkg.status === 'private'}<span>Source distribution</span>{/if}
				{#if pkg.status === 'stub'}<span class="stub">{packageStatusLabels.stub}</span>{/if}
			</div>
			<h1>{pkg.name}</h1>
			<p>{pkg.summary}</p>
		</div>
		<a
			class="source-link"
			href={`https://github.com/happyvertical/smrt/tree/main/packages/${sourceDirectory}`}
			target="_blank"
			rel="noreferrer"
		>
			<span>Source</span>
			<b>↗</b>
		</a>
	</header>

	{#if pkg.notice}
		<div class="package-notice">
			<Callout variant={pkg.notice.variant} title={pkg.notice.title} body={pkg.notice.body} />
		</div>
	{/if}

	<div class="tabs-wrap">
		<div class="tabs" role="tablist" aria-label={`${pkg.name} documentation`}>
			{#each tabs as tab (tab.id)}
				<button
					type="button"
					role="tab"
					aria-selected={activeTab === tab.id}
					aria-controls={`panel-${tab.id}`}
					class:active={activeTab === tab.id}
					onclick={() => selectTab(tab.id)}>{tab.label}</button
				>
			{/each}
		</div>
	</div>

	<div class="panel" id={`panel-${activeTab}`} role="tabpanel">
		{#if activeTab === 'overview'}
			<div class="overview-layout">
				<div class="overview-grid">
					<div class="overview-copy">
						<p class="kicker">What it gives you</p>
						<h2>{pkg.summary}</h2>
						{#if pkg.highlights.length}
							<ol class="highlights">
								{#each pkg.highlights as highlight, index (highlight)}
									<li><span>{String(index + 1).padStart(2, '0')}</span>{highlight}</li>
								{/each}
							</ol>
						{:else if pkg.surfaceNote}
							<p class="overview-note">{pkg.surfaceNote}</p>
						{:else}
							<p class="overview-note">
								This package is one focused part of the s-m-r-t stack. Its decorated models
								participate in the same manifest, tenancy, persistence, and generated-interface
								conventions as the rest of the framework.
							</p>
						{/if}
					</div>
					<aside class="install-panel">
						<p>Install</p>
						{#if pkg.status === 'private'}
							<CodeBlock code={sourceInstallCode} language="bash" />
						{:else}
							<CodeBlock code={`pnpm add ${pkg.name}`} language="bash" />
						{/if}
						<dl>
							<div>
								<dt>Layer</dt>
								<dd>{pkg.category}</dd>
							</div>
							<div>
								<dt>Shape</dt>
								<dd>{pkg.kind}</dd>
							</div>
							<div>
								<dt>Release</dt>
								<dd>{pkg.version}</dd>
							</div>
						</dl>
					</aside>
				</div>

				{#if pkg.details.length}
					<div class="package-details" aria-label="Package guide">
						{#each pkg.details as detail (detail.title)}
							<section>
								<h3>{detail.title}</h3>
								<p>{detail.body}</p>
								{#if detail.href}
									<a href={detail.href}>{detail.linkLabel ?? 'Read the guide'} →</a>
								{/if}
							</section>
						{/each}
					</div>
				{/if}
			</div>
		{:else if activeTab === 'components'}
			<div class="components-panel">
				<div class="panel-heading">
					<div>
						<p class="kicker">Package UI</p>
						<h2>
							{pkg.components.length
								? pkg.componentGroups.length
									? 'Component catalog and public contracts'
									: 'Components in this package'
								: 'No UI layer to carry'}
						</h2>
					</div>
					<p>
						{pkg.componentGroups.length
							? 'Browse by the job you are doing. Each group shows its focused import path; the Playground tab renders the working controls and composed patterns.'
							: pkg.components.length
								? 'Import these public components directly. When the package also exports playground entries, the next tab renders its real components with package-owned example data.'
								: 'This package stays focused on models, runtime behavior, or tooling. Build its interface with smrt-ui, or use a related domain package that exposes a /svelte entry point.'}
					</p>
				</div>
				{#if pkg.components.length}
					{#if pkg.componentGroups.length > 1}
						<nav class="group-toc" aria-label="On this page">
							<strong>On this page</strong>
							<div>
								{#each pkg.componentGroups as group (group.title)}
									<a href={`#${toAnchorId(group.title)}`}
										>{group.title}<span>{group.components.length}</span></a
									>
								{/each}
							</div>
						</nav>
					{/if}
					{#if pkg.componentGroups.length}
						<div class="component-groups">
							{#each pkg.componentGroups as group (group.title)}
								<section id={toAnchorId(group.title)}>
									<header>
										<div>
											<h3>{group.title}</h3>
											<p>{group.description}</p>
										</div>
										<code>{group.importPath}</code>
									</header>
									<div class="component-index">
										{#each group.components as component (component)}
											<div>
												<samp>{component}</samp><span>Exported from {group.importPath}</span>
											</div>
										{/each}
									</div>
								</section>
							{/each}
						</div>
					{:else}
						<div class="component-index">
							{#each pkg.components as component (component)}
								<div>
									<samp>{component}</samp><span>Exported from {pkg.componentImport}</span>
								</div>
							{/each}
						</div>
					{/if}
					{#if packagePlaygroundEntries.length}<button
							class="playground-link"
							type="button"
							onclick={() => selectTab('playground')}
							>Try {packagePlaygroundEntries.length} package previews in the Playground tab →</button
						>{/if}
				{:else}
					<div class="empty-surface">
						<span>UI</span>
						<p>Intentionally headless</p>
					</div>
				{/if}
			</div>
		{:else if activeTab === 'playground'}
			<div class="playground-panel">
				<div class="panel-heading">
					<div>
						<p class="kicker">Package previews</p>
						<h2>
							{packagePlaygroundEntries.length
								? 'Try the working views'
								: pkg.playgroundNote
									? 'Not rendered here yet'
									: 'No playground module yet'}
						</h2>
					</div>
					<p>
						{packagePlaygroundEntries.length
							? 'These previews are owned by the package and use its public components. Mock mode is intended for safe browsing; live mode appears only where the package supports it.'
							: (pkg.playgroundNote ??
								'This package does not currently export a ./playground module. Its component names and import path remain available in the Components tab.')}
					</p>
				</div>
				{#if packagePlaygroundModules.length}
					<PlaygroundEmbed modules={packagePlaygroundModules} compact />
				{:else if packagePlaygroundEntries.length}
					<div class="entry-list">
						{#each packagePlaygroundEntries as entry (entry)}<span>{entry}</span>{/each}
						<p>The interactive module is part of the next component release.</p>
					</div>
				{:else}
					<div class="empty-surface">
						<span>Preview</span>
						<p>Intentionally not registered</p>
					</div>
				{/if}
			</div>
		{:else if activeTab === 'rest'}
			<div class="surface-panel">
				<div class="panel-heading">
					<div>
						<p class="kicker">Generated interface</p>
						<h2>REST</h2>
					</div>
					<p>
						The exact route set comes from each model's <code>@smrt(&#123; api &#125;)</code> policy and
						the application manifest—not from a second controller definition.
					</p>
				</div>
				{#if hasGeneratedSurface}
					<div class="surface-example">
						<CodeBlock
							code={`GET    /api/${resource}\nGET    /api/${resource}/:id\nPOST   /api/${resource}\nPATCH  /api/${resource}/:id`}
							language="http"
						/>
						<div>
							<h3>What stays consistent</h3>
							<ul>
								<li>Tenant scope and operation permissions run before model access.</li>
								<li>OpenAPI and generated clients use the same manifest fields.</li>
								<li>Packages can expose read-only or custom action sets.</li>
							</ul>
						</div>
					</div>
				{:else}
					<div class="empty-surface">
						<span>REST</span>
						{#if pkg.surfaceNote}
							<p>{pkg.surfaceNote}</p>
						{:else}
							<p>
								This package supports the runtime or build pipeline; it does not define a
								representative CRUD resource of its own.
							</p>
						{/if}
					</div>
				{/if}
			</div>
		{:else if activeTab === 'mcp'}
			<div class="surface-panel">
				<div class="panel-heading">
					<div>
						<p class="kicker">Generated interface</p>
						<h2>MCP</h2>
					</div>
					<p>
						AI tools are generated from the methods you explicitly include. Their inputs are
						validated against the same model metadata used by REST and CLI.
					</p>
				</div>
				{#if hasGeneratedSurface}
					<div class="surface-example">
						<CodeBlock
							code={`${resource}_list({ where, limit, orderBy })\n${resource}_get({ id })\n${resource}_create({ data })\n${resource}_update({ id, data })`}
							language="text"
						/>
						<div>
							<h3>Agent-safe by construction</h3>
							<ul>
								<li>Tool availability can be narrower than the HTTP API.</li>
								<li>Principal execution intersects RBAC, agent ceilings, and persona tools.</li>
								<li>Descriptions and schemas are emitted from source metadata.</li>
							</ul>
						</div>
					</div>
				{:else}
					<div class="empty-surface">
						<span>MCP</span>
						{#if pkg.surfaceNote}
							<p>{pkg.surfaceNote}</p>
						{:else}
							<p>
								This package is itself infrastructure, UI, or tooling. Its capabilities are consumed
								by generated app MCP servers rather than exposed as a model resource.
							</p>
						{/if}
					</div>
				{/if}
			</div>
		{:else if activeTab === 'webmcp'}
			<div class="surface-panel">
				<div class="panel-heading">
					<div>
						<p class="kicker">Browser-native agent interface</p>
						<h2>WebMCP</h2>
					</div>
					<p>
						The generated web definitions carry the same tool names, descriptions, and JSON Schema
						inputs as MCP. smrt-web registers them with <code>document.modelContext</code>.
					</p>
				</div>
				{#if hasGeneratedSurface || pkg.slug === 'smrt-web' || pkg.slug === 'smrt-core'}
					<div class="surface-example">
						<CodeBlock
							code={`import { collectionDefinitions } from '@happyvertical/smrt-virt-web';\nimport { registerWebMcpTools } from '@happyvertical/smrt-web';\n\nconst dispose = registerWebMcpTools(\n  Object.values(collectionDefinitions),\n  { filter: (_definition, tool) => tool.readOnly }\n);`}
							language="typescript"
						/>
						<div>
							<h3>The page keeps its security boundary</h3>
							<ul>
								<li>Tools execute through generated REST fetchers as the signed-in page user.</li>
								<li>
									Authentication, tenant gates, permissions, and field policy stay server-side.
								</li>
								<li>
									Feature detection makes registration a safe no-op outside supported browsers.
								</li>
							</ul>
						</div>
					</div>
				{:else}
					<div class="empty-surface">
						<span>WebMCP</span>
						{#if pkg.surfaceNote}
							<p>{pkg.surfaceNote}</p>
						{:else}
							<p>
								This package does not define a representative browser tool itself. Its models can
								still participate when an application exposes them through generated web
								collections.
							</p>
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			<div class="surface-panel">
				<div class="panel-heading">
					<div>
						<p class="kicker">Generated interface</p>
						<h2>CLI</h2>
					</div>
					<p>
						The app CLI turns manifest resources into predictable operator commands while keeping
						package-specific actions close to their models.
					</p>
				</div>
				{#if hasGeneratedSurface}
					<div class="surface-example">
						<CodeBlock
							code={`smrt ${resource} list --limit 25 --order-by created_at:desc\nsmrt ${resource} get <id>\nsmrt ${resource} create --from-file ./record.json`}
							language="bash"
						/>
						<div>
							<h3>Made for automation</h3>
							<ul>
								<li>Machine-readable output and file-based input.</li>
								<li>The same include/exclude policy as other surfaces.</li>
								<li>
									Migration, introspection, dispatch, and knowledge commands stay in smrt-cli.
								</li>
							</ul>
						</div>
					</div>
				{:else}
					<div class="empty-surface">
						<span>CLI</span>
						{#if pkg.surfaceNote}
							<p>{pkg.surfaceNote}</p>
						{:else}
							<p>
								Use this package through its documented build or runtime entry points. It does not
								contribute a representative generated resource command.
							</p>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="package-prev-next">
		<PrevNext {neighbors} />
	</div>
</article>

<style>
	.workbench {
		padding-bottom: 100px;
	}

	.package-hero,
	.package-notice,
	.package-prev-next,
	.panel,
	.tabs {
		width: min(1180px, calc(100% - 40px));
		margin-inline: auto;
	}

	.package-hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 40px;
		align-items: end;
		padding: 42px 0 34px;
	}

	.back-link {
		display: inline-block;
		margin-bottom: 26px;
		color: var(--site-muted);
		font-family: var(--site-font-mono);
		font-size: 0.72rem;
		text-decoration: none;
	}

	.package-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 20px;
	}

	.package-meta span {
		padding: 5px 9px;
		border: 1px solid var(--site-line-strong);
		border-radius: 999px;
		font-family: var(--site-font-mono);
		font-size: 0.64rem;
	}

	.package-meta span.new {
		border-color: var(--site-accent-strong);
		background: var(--site-accent-soft);
	}

	.package-meta span.stub {
		border-color: var(--site-warn);
		background: var(--site-warn-soft);
		color: var(--site-warn);
		font-weight: 700;
	}

	.package-notice {
		margin-bottom: 26px;
	}

	h1 {
		font-family: var(--site-font-mono);
		font-size: clamp(1.65rem, 4vw, 2.45rem);
		font-weight: 650;
		letter-spacing: -0.04em;
		line-height: 1.1;
		overflow-wrap: anywhere;
	}

	.package-hero > div > p {
		max-width: 760px;
		margin-top: 14px;
		color: var(--site-muted);
		font-size: 0.92rem;
		line-height: 1.65;
	}

	.source-link {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 12px 0;
		border-bottom: 1px solid var(--site-ink);
		color: var(--site-ink);
		font-family: var(--site-font-mono);
		font-size: 0.72rem;
		text-decoration: none;
	}

	.source-link b {
		font-size: 1rem;
	}

	.tabs-wrap {
		position: sticky;
		top: var(--site-header-height);
		z-index: 20;
		border-block: 1px solid var(--site-line);
		background: color-mix(in srgb, var(--site-paper) 92%, transparent);
		backdrop-filter: blur(14px);
	}

	.tabs {
		display: flex;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.tabs button {
		flex: 0 0 auto;
		padding: 12px 16px;
		border: 0;
		border-right: 1px solid var(--site-line);
		background: transparent;
		color: var(--site-muted);
		font-family: var(--site-font-mono);
		font-size: 0.7rem;
		font-weight: 650;
		cursor: pointer;
	}

	.tabs button:first-child {
		border-left: 1px solid var(--site-line);
	}

	.tabs button:hover,
	.tabs button.active {
		--site-ink: #11150f;
		--site-paper: #f3efe5;
		background: var(--site-ink);
		color: var(--site-paper);
	}

	.panel {
		min-height: 460px;
		padding: 44px 0;
	}

	.overview-layout {
		display: grid;
		gap: 58px;
	}

	.overview-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(300px, 0.7fr);
		gap: clamp(48px, 9vw, 120px);
	}

	.kicker {
		margin-bottom: 18px;
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.68rem;
		font-weight: 750;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.overview-copy h2,
	.panel-heading h2 {
		font-size: clamp(1.35rem, 3vw, 1.85rem);
		letter-spacing: -0.03em;
		line-height: 1.15;
	}

	.highlights {
		margin: 28px 0 0;
		padding: 0;
		list-style: none;
	}

	.highlights li {
		display: grid;
		grid-template-columns: 44px 1fr;
		gap: 16px;
		padding: 20px 0;
		border-top: 1px solid var(--site-line);
		font-size: 0.88rem;
		line-height: 1.5;
	}

	.highlights span {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.68rem;
	}

	.overview-note {
		max-width: 660px;
		margin-top: 32px;
		color: var(--site-muted);
		font-size: 1.04rem;
		line-height: 1.75;
	}

	.package-details {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		border-top: 1px solid var(--site-line);
	}

	.package-details section {
		min-width: 0;
		padding: 25px 28px 25px 0;
		border-bottom: 1px solid var(--site-line);
	}

	.package-details section:nth-child(odd) {
		border-right: 1px solid var(--site-line);
	}

	.package-details section:nth-child(even) {
		padding-left: 28px;
	}

	.package-details h3 {
		font-size: 0.95rem;
	}

	.package-details p {
		margin-top: 9px;
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.65;
	}

	.package-details a {
		display: inline-block;
		margin-top: 14px;
		color: var(--site-ink);
		font-size: 0.74rem;
		font-weight: 650;
	}

	.install-panel {
		align-self: start;
		padding: 24px;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	.install-panel > p {
		font-family: var(--site-font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.install-panel :global(.code-block) {
		margin: 16px 0 24px;
	}

	.install-panel dl {
		margin: 0;
	}

	.install-panel dl div {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		padding: 10px 0;
		border-top: 1px solid var(--site-line);
		font-family: var(--site-font-mono);
		font-size: 0.68rem;
	}

	.install-panel dt {
		color: var(--site-muted);
	}

	.panel-heading {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(280px, 0.65fr);
		gap: clamp(40px, 8vw, 100px);
		align-items: end;
		margin-bottom: 28px;
	}

	.panel-heading > p {
		color: var(--site-muted);
		font-size: 0.84rem;
		line-height: 1.7;
	}

	.entry-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding: 22px;
		border: 1px solid var(--site-line-strong);
		background: var(--site-surface);
	}

	.entry-list span {
		padding: 7px 9px;
		border: 1px solid var(--site-line-strong);
		border-radius: 5px;
		font: 0.68rem var(--site-font-mono);
	}

	.entry-list p {
		width: 100%;
		margin-top: 8px;
		color: var(--site-muted);
		font-size: 0.75rem;
	}

	.panel-heading code {
		font-size: 0.86em;
	}

	.component-index {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		margin-top: 0;
		border-top: 1px solid var(--site-line);
	}

	.group-toc {
		margin-bottom: 38px;
		padding: 16px 18px;
		border: 1px solid var(--site-line);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	.group-toc strong {
		color: var(--site-muted);
		font: 700 0.63rem var(--site-font-mono);
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.group-toc div {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
		margin-top: 12px;
	}

	.group-toc a {
		display: inline-flex;
		align-items: baseline;
		gap: 7px;
		padding: 6px 10px;
		border: 1px solid var(--site-line-strong);
		border-radius: 999px;
		color: var(--site-ink);
		font-size: 0.74rem;
		text-decoration: none;
	}

	.group-toc a:hover {
		border-color: var(--site-accent-strong);
		background: var(--site-accent-soft);
	}

	.group-toc a span {
		color: var(--site-muted);
		font-family: var(--site-font-mono);
		font-size: 0.62rem;
	}

	.component-groups {
		display: grid;
		gap: 42px;
	}

	.component-groups > section {
		scroll-margin-top: calc(var(--site-header-height) + 70px);
	}

	.component-groups > section > header {
		display: flex;
		justify-content: space-between;
		gap: 32px;
		align-items: end;
		margin-bottom: 16px;
	}

	.component-groups h3 {
		font-size: 1rem;
	}

	.component-groups header p {
		max-width: 580px;
		margin-top: 6px;
		color: var(--site-muted);
		font-size: 0.78rem;
		line-height: 1.55;
	}

	.component-groups header code {
		flex: 0 0 auto;
		color: var(--site-accent-strong);
		font-size: 0.68rem;
	}

	.component-index > div {
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding: 18px 20px 18px 0;
		border-bottom: 1px solid var(--site-line);
	}

	.component-index > div:nth-child(odd) {
		border-right: 1px solid var(--site-line);
	}

	.component-index > div:nth-child(even) {
		padding-left: 20px;
	}

	.component-index samp {
		font-size: 0.8rem;
		font-weight: 700;
		font-family: var(--site-font-mono);
	}

	.component-index span {
		color: var(--site-muted);
		font-size: 0.72rem;
	}

	.playground-link {
		display: inline-block;
		margin-top: 20px;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--site-ink);
		font-size: 0.76rem;
		font-weight: 650;
		text-decoration: underline;
		cursor: pointer;
	}

	.surface-example {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
		gap: clamp(40px, 7vw, 90px);
		align-items: start;
	}

	.surface-example :global(.code-block) {
		margin-top: 0;
	}

	.surface-example h3 {
		font-size: 1rem;
	}

	.surface-example ul {
		margin: 18px 0 0;
		padding: 0;
		list-style: none;
	}

	.surface-example li {
		padding: 14px 0;
		border-top: 1px solid var(--site-line);
		color: var(--site-muted);
		font-size: 0.86rem;
		line-height: 1.5;
	}

	.empty-surface {
		min-height: 280px;
		display: grid;
		place-items: center;
		align-content: center;
		gap: 16px;
		padding: 40px;
		border: 1px dashed var(--site-line-strong);
		border-radius: var(--site-radius-md);
		text-align: center;
	}

	.empty-surface span {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.7rem;
		font-weight: 750;
		letter-spacing: 0.12em;
	}

	.empty-surface p {
		max-width: 560px;
		color: var(--site-muted);
		line-height: 1.65;
	}

	@media (max-width: 800px) {
		.package-hero,
		.panel,
		.tabs {
			width: min(100% - 28px, 1180px);
		}

		.package-hero,
		.overview-grid,
		.panel-heading,
		.surface-example {
			grid-template-columns: 1fr;
		}

		.source-link {
			justify-self: start;
		}

		.component-index {
			grid-template-columns: 1fr;
		}

		.package-details {
			grid-template-columns: 1fr;
		}

		.package-details section:nth-child(odd) {
			border-right: 0;
		}

		.package-details section:nth-child(even) {
			padding-left: 0;
		}

		.component-groups > section > header {
			align-items: start;
			flex-direction: column;
			gap: 10px;
		}

		.component-index > div:nth-child(odd) {
			border-right: 0;
		}

		.component-index > div:nth-child(even) {
			padding-left: 0;
		}
	}
</style>
