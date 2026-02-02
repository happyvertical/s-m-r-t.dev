<script lang="ts">
	import { DateDisplay } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const now = new Date();
	const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
	const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

	const dateDisplayProps = [
		{
			name: 'date',
			type: 'Date | string | number | null | undefined',
			description: 'Date to display (Date, ISO string, or timestamp)',
			required: true
		},
		{
			name: 'format',
			type: "'short' | 'medium' | 'long' | 'relative'",
			default: "'medium'",
			description: 'Display format'
		},
		{
			name: 'fallback',
			type: 'string',
			default: "'N/A'",
			description: 'Text shown when date is null/undefined'
		},
		{
			name: 'showTime',
			type: 'boolean',
			default: 'false',
			description: 'Show time along with date'
		},
		{
			name: 'locale',
			type: 'string',
			default: "'en-CA'",
			description: 'Locale for formatting'
		}
	];
</script>

<svelte:head>
	<title>DateDisplay | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/display">Display</a>
		<span>/</span>
		<span>DateDisplay</span>
	</nav>

	<h1>DateDisplay</h1>
	<p class="lead">
		Formatted dates with multiple format options and relative time support. Accepts Date objects,
		ISO strings, or timestamps.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { DateDisplay } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Display dates in medium format (default).</p>

	<ComponentExample code={`<DateDisplay date={new Date()} />`}>
		<DateDisplay date={now} />
	</ComponentExample>

	<h2>Format Options</h2>
	<p>Available format styles.</p>

	<ComponentExample
		code={`<DateDisplay date={date} format="short" />
<DateDisplay date={date} format="medium" />
<DateDisplay date={date} format="long" />
<DateDisplay date={date} format="relative" />`}
	>
		<div style="display: flex; flex-direction: column; gap: 12px;">
			<div style="display: flex; align-items: center; gap: 12px;">
				<span style="min-width: 80px; color: #666; font-size: 0.875rem;">Short:</span>
				<DateDisplay date={now} format="short" />
			</div>
			<div style="display: flex; align-items: center; gap: 12px;">
				<span style="min-width: 80px; color: #666; font-size: 0.875rem;">Medium:</span>
				<DateDisplay date={now} format="medium" />
			</div>
			<div style="display: flex; align-items: center; gap: 12px;">
				<span style="min-width: 80px; color: #666; font-size: 0.875rem;">Long:</span>
				<DateDisplay date={now} format="long" />
			</div>
			<div style="display: flex; align-items: center; gap: 12px;">
				<span style="min-width: 80px; color: #666; font-size: 0.875rem;">Relative:</span>
				<DateDisplay date={now} format="relative" />
			</div>
		</div>
	</ComponentExample>

	<h2>Relative Time</h2>
	<p>Human-readable relative time display.</p>

	<ComponentExample
		code={`<DateDisplay date={yesterday} format="relative" />
<DateDisplay date={lastWeek} format="relative" />
<DateDisplay date={nextWeek} format="relative" />`}
	>
		<div style="display: flex; flex-direction: column; gap: 8px;">
			<div>Yesterday: <DateDisplay date={yesterday} format="relative" /></div>
			<div>Last week: <DateDisplay date={lastWeek} format="relative" /></div>
			<div>Next week: <DateDisplay date={nextWeek} format="relative" /></div>
		</div>
	</ComponentExample>

	<h2>With Time</h2>
	<p>Include time in the display.</p>

	<ComponentExample code={`<DateDisplay date={date} showTime />`}>
		<div style="display: flex; flex-direction: column; gap: 8px;">
			<div>
				<span style="color: #666; font-size: 0.875rem;">Short with time: </span>
				<DateDisplay date={now} format="short" showTime />
			</div>
			<div>
				<span style="color: #666; font-size: 0.875rem;">Medium with time: </span>
				<DateDisplay date={now} format="medium" showTime />
			</div>
		</div>
	</ComponentExample>

	<h2>Input Formats</h2>
	<p>Accepts various date input formats.</p>

	<ComponentExample
		code={`<!-- Date object -->
<DateDisplay date={new Date()} />

<!-- ISO string -->
<DateDisplay date="2025-01-15" />

<!-- Timestamp -->
<DateDisplay date={1705276800000} />`}
	>
		<div style="display: flex; flex-direction: column; gap: 8px;">
			<div>
				<span style="color: #666; font-size: 0.875rem;">Date object: </span>
				<DateDisplay date={now} />
			</div>
			<div>
				<span style="color: #666; font-size: 0.875rem;">ISO string: </span>
				<DateDisplay date="2025-01-15" />
			</div>
			<div>
				<span style="color: #666; font-size: 0.875rem;">Timestamp: </span>
				<DateDisplay date={1705276800000} />
			</div>
		</div>
	</ComponentExample>

	<h2>Null Handling</h2>
	<p>Display fallback text when date is null or undefined.</p>

	<ComponentExample
		code={`<DateDisplay date={null} />
<DateDisplay date={null} fallback="Not set" />`}
	>
		<div style="display: flex; gap: 16px;">
			<div>
				<span style="color: #666; font-size: 0.875rem;">Default: </span>
				<DateDisplay date={null} />
			</div>
			<div>
				<span style="color: #666; font-size: 0.875rem;">Custom: </span>
				<DateDisplay date={null} fallback="Not set" />
			</div>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={dateDisplayProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { DateDisplay } from '@happyvertical/smrt-svelte';

interface Props {
  date: Date | string | number | null | undefined;
  format?: 'short' | 'medium' | 'long' | 'relative';
  fallback?: string;
  showTime?: boolean;
  locale?: string;
}`}
		language="typescript"
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
