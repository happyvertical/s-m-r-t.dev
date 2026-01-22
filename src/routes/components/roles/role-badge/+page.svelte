<script lang="ts">
	import { RoleBadge } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const badgeProps = [
		{ name: 'role', type: 'string', description: 'Role name to display', required: true },
		{ name: 'variant', type: "'primary' | 'secondary' | 'outline'", default: "'primary'", description: 'Visual style variant' },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Badge size' }
	];
</script>

<svelte:head>
	<title>RoleBadge | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<span>RoleBadge</span>
	</nav>

	<h1>RoleBadge</h1>
	<p class="lead">Display user roles as styled badges with automatic color coding.</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { RoleBadge } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<ComponentExample code={`<RoleBadge role="Admin" />\n<RoleBadge role="Editor" />\n<RoleBadge role="Viewer" />`}>
		<div style="display: flex; gap: 8px; flex-wrap: wrap;">
			<RoleBadge role="Admin" />
			<RoleBadge role="Editor" />
			<RoleBadge role="Viewer" />
		</div>
	</ComponentExample>

	<h2>Variants</h2>
	<ComponentExample code={`<RoleBadge role="Admin" variant="primary" />\n<RoleBadge role="Admin" variant="secondary" />\n<RoleBadge role="Admin" variant="outline" />`}>
		<div style="display: flex; gap: 8px;">
			<RoleBadge role="Admin" variant="primary" />
			<RoleBadge role="Admin" variant="secondary" />
			<RoleBadge role="Admin" variant="outline" />
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<ComponentExample code={`<RoleBadge role="Admin" size="sm" />\n<RoleBadge role="Admin" size="md" />\n<RoleBadge role="Admin" size="lg" />`}>
		<div style="display: flex; gap: 8px; align-items: center;">
			<RoleBadge role="Admin" size="sm" />
			<RoleBadge role="Admin" size="md" />
			<RoleBadge role="Admin" size="lg" />
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={badgeProps} />

	<h2>TypeScript</h2>
	<CodeBlock code={`interface Props {\n  role: string;\n  variant?: 'primary' | 'secondary' | 'outline';\n  size?: 'sm' | 'md' | 'lg';\n}`} language="typescript" />
</article>

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: #666;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--color-accent);
	}

	.breadcrumb span:not(:last-child) {
		color: #ccc;
	}

	.prose h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.prose .lead {
		font-size: 1.1rem;
		color: #666;
		margin-bottom: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid var(--color-grid);
	}

	.prose h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
	}

	.prose p {
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}
</style>
