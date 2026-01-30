<script lang="ts">
	import { Icon } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const smrtIconProps = [
		{
			name: 'name',
			type: 'string',
			default: 'undefined',
			description: 'Preset icon name (menu, search, close, chevron-right, chevron-left, chevron-down, check, add, mic)'
		},
		{
			name: 'path',
			type: 'string',
			default: 'undefined',
			description: 'Custom SVG path data (d attribute)'
		},
		{
			name: 'size',
			type: 'string | number',
			default: '24',
			description: 'Icon size in pixels (number) or CSS value (string)'
		},
		{
			name: 'color',
			type: 'string',
			default: "'currentColor'",
			description: 'Icon fill color'
		},
		{
			name: 'viewBox',
			type: 'string',
			default: "'0 0 24 24'",
			description: 'SVG viewBox attribute'
		}
	];

	// Custom path example
	const starPath =
		'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
</script>

<svelte:head>
	<title>Icon | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/display">Display</a>
		<span>/</span>
		<span>Icon</span>
	</nav>

	<h1>Icon</h1>
	<p class="lead">
		A flexible SVG icon component with preset icons and support for custom SVG paths. Uses Material
		Design 3 style paths and inherits color from parent by default.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Icon } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Preset Icons</h2>
	<p>Built-in icons available via the <code>name</code> prop.</p>

	<ComponentExample
		code={`<Icon name="menu" />
<Icon name="search" />
<Icon name="close" />
<Icon name="check" />
<Icon name="add" />
<Icon name="mic" />`}
	>
		<div class="icon-grid">
			<div class="icon-item">
				<Icon name="menu" />
				<span class="icon-label">menu</span>
			</div>
			<div class="icon-item">
				<Icon name="search" />
				<span class="icon-label">search</span>
			</div>
			<div class="icon-item">
				<Icon name="close" />
				<span class="icon-label">close</span>
			</div>
			<div class="icon-item">
				<Icon name="check" />
				<span class="icon-label">check</span>
			</div>
			<div class="icon-item">
				<Icon name="add" />
				<span class="icon-label">add</span>
			</div>
			<div class="icon-item">
				<Icon name="mic" />
				<span class="icon-label">mic</span>
			</div>
		</div>
	</ComponentExample>

	<h2>Chevron Icons</h2>
	<p>Directional chevron icons for navigation and accordions.</p>

	<ComponentExample
		code={`<Icon name="chevron-right" />
<Icon name="chevron-left" />
<Icon name="chevron-down" />`}
	>
		<div class="icon-grid">
			<div class="icon-item">
				<Icon name="chevron-right" />
				<span class="icon-label">chevron-right</span>
			</div>
			<div class="icon-item">
				<Icon name="chevron-left" />
				<span class="icon-label">chevron-left</span>
			</div>
			<div class="icon-item">
				<Icon name="chevron-down" />
				<span class="icon-label">chevron-down</span>
			</div>
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Size can be a number (pixels) or a CSS value string.</p>

	<ComponentExample
		code={`<Icon name="check" size={16} />
<Icon name="check" size={24} />
<Icon name="check" size={32} />
<Icon name="check" size={48} />
<Icon name="check" size="2rem" />`}
	>
		<div class="icon-row">
			<div class="icon-item">
				<Icon name="check" size={16} />
				<span class="icon-label">16px</span>
			</div>
			<div class="icon-item">
				<Icon name="check" size={24} />
				<span class="icon-label">24px</span>
			</div>
			<div class="icon-item">
				<Icon name="check" size={32} />
				<span class="icon-label">32px</span>
			</div>
			<div class="icon-item">
				<Icon name="check" size={48} />
				<span class="icon-label">48px</span>
			</div>
			<div class="icon-item">
				<Icon name="check" size="2rem" />
				<span class="icon-label">2rem</span>
			</div>
		</div>
	</ComponentExample>

	<h2>Colors</h2>
	<p>
		By default, icons use <code>currentColor</code> and inherit from the parent. Use the
		<code>color</code> prop for explicit colors.
	</p>

	<ComponentExample
		code={`<Icon name="check" color="#16a34a" />
<Icon name="close" color="#dc2626" />
<Icon name="search" color="#2563eb" />
<Icon name="add" color="#9333ea" />`}
	>
		<div class="icon-row">
			<Icon name="check" color="#16a34a" size={32} />
			<Icon name="close" color="#dc2626" size={32} />
			<Icon name="search" color="#2563eb" size={32} />
			<Icon name="add" color="#9333ea" size={32} />
		</div>
	</ComponentExample>

	<h2>Inheriting Color</h2>
	<p>
		When using <code>currentColor</code> (default), the icon inherits its color from the parent
		element.
	</p>

	<ComponentExample
		code={`<span style="color: #16a34a"><Icon name="check" /> Success</span>
<span style="color: #dc2626"><Icon name="close" /> Error</span>
<span style="color: #2563eb"><Icon name="search" /> Search</span>`}
	>
		<div class="inherit-examples">
			<span class="inherit-item" style="color: #16a34a">
				<Icon name="check" /> Success
			</span>
			<span class="inherit-item" style="color: #dc2626">
				<Icon name="close" /> Error
			</span>
			<span class="inherit-item" style="color: #2563eb">
				<Icon name="search" /> Search
			</span>
		</div>
	</ComponentExample>

	<h2>Custom Path</h2>
	<p>Use the <code>path</code> prop for custom SVG path data.</p>

	<ComponentExample
		code={`const starPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

<Icon path={starPath} />
<Icon path={starPath} color="#f59e0b" size={32} />
<Icon path={starPath} color="#f59e0b" size={48} />`}
	>
		<div class="icon-row">
			<Icon path={starPath} />
			<Icon path={starPath} color="#f59e0b" size={32} />
			<Icon path={starPath} color="#f59e0b" size={48} />
		</div>
	</ComponentExample>

	<h2>Custom ViewBox</h2>
	<p>
		For icons with non-standard viewBox, use the <code>viewBox</code> prop.
	</p>

	<ComponentExample
		code={`<Icon path="M0 0h16v16H0z" viewBox="0 0 16 16" size={24} />
<Icon path="M0 0h32v32H0z" viewBox="0 0 32 32" size={24} />`}
	>
		<div class="icon-row">
			<div class="icon-item">
				<Icon path="M2 2h12v12H2z" viewBox="0 0 16 16" size={24} color="#666" />
				<span class="icon-label">16x16 viewBox</span>
			</div>
			<div class="icon-item">
				<Icon path="M4 4h24v24H4z" viewBox="0 0 32 32" size={24} color="#666" />
				<span class="icon-label">32x32 viewBox</span>
			</div>
		</div>
	</ComponentExample>

	<h2>All Preset Icons</h2>
	<p>Complete list of available preset icons.</p>

	<ComponentExample
		code={`// Available preset names:
// menu, search, close, chevron-right, chevron-left, chevron-down, check, add, mic`}
	>
		<div class="icon-grid large">
			<div class="icon-item">
				<Icon name="menu" size={28} />
				<span class="icon-label">menu</span>
			</div>
			<div class="icon-item">
				<Icon name="search" size={28} />
				<span class="icon-label">search</span>
			</div>
			<div class="icon-item">
				<Icon name="close" size={28} />
				<span class="icon-label">close</span>
			</div>
			<div class="icon-item">
				<Icon name="chevron-right" size={28} />
				<span class="icon-label">chevron-right</span>
			</div>
			<div class="icon-item">
				<Icon name="chevron-left" size={28} />
				<span class="icon-label">chevron-left</span>
			</div>
			<div class="icon-item">
				<Icon name="chevron-down" size={28} />
				<span class="icon-label">chevron-down</span>
			</div>
			<div class="icon-item">
				<Icon name="check" size={28} />
				<span class="icon-label">check</span>
			</div>
			<div class="icon-item">
				<Icon name="add" size={28} />
				<span class="icon-label">add</span>
			</div>
			<div class="icon-item">
				<Icon name="mic" size={28} />
				<span class="icon-label">mic</span>
			</div>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={smrtIconProps} />

	<h2>Accessibility</h2>
	<CodeBlock
		code={`<!-- Icons are decorative by default (aria-hidden="true") -->
<svg aria-hidden="true" ...>
  <path d="..." />
</svg>

<!-- For meaningful icons, wrap with accessible label -->
<span role="img" aria-label="Search">
  <Icon name="search" />
</span>`}
		language="html"
	/>
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

	.prose h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 12px;
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

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 16px;
	}

	.icon-grid.large {
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	}

	.icon-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 12px;
		border-radius: 8px;
		background: #fafafa;
	}

	.icon-label {
		font-size: 0.7rem;
		font-family: var(--font-mono);
		color: #999;
	}

	.icon-row {
		display: flex;
		align-items: center;
		gap: 24px;
		flex-wrap: wrap;
	}

	.icon-row .icon-item {
		background: transparent;
		padding: 8px;
	}

	.inherit-examples {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.inherit-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 500;
	}
</style>
