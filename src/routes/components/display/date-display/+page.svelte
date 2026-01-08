<script lang="ts">
	import { DateDisplay } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Sample dates for examples
	const now = new Date();
	const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
	const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
	const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
	const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

	const dateDisplayProps = [
		{
			name: 'date',
			type: 'Date | string | number | null | undefined',
			description: 'Date to display (Date object, ISO string, or timestamp)',
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
			description: 'Fallback text when date is null/undefined'
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
		Formats and displays dates with various format options including relative time. Supports Date
		objects, ISO strings, and timestamps with proper locale handling.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { DateDisplay } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Format Options</h2>
	<p>
		Four format options are available: <code>short</code>, <code>medium</code> (default),
		<code>long</code>, and <code>relative</code>.
	</p>

	<ComponentExample
		code={`<DateDisplay date={new Date()} format="short" />
<DateDisplay date={new Date()} format="medium" />
<DateDisplay date={new Date()} format="long" />
<DateDisplay date={new Date()} format="relative" />`}
	>
		<div class="format-grid">
			<div class="format-item">
				<span class="format-label">short</span>
				<DateDisplay date={now} format="short" />
			</div>
			<div class="format-item">
				<span class="format-label">medium</span>
				<DateDisplay date={now} format="medium" />
			</div>
			<div class="format-item">
				<span class="format-label">long</span>
				<DateDisplay date={now} format="long" />
			</div>
			<div class="format-item">
				<span class="format-label">relative</span>
				<DateDisplay date={now} format="relative" />
			</div>
		</div>
	</ComponentExample>

	<h2>Relative Time (Past)</h2>
	<p>The relative format shows human-friendly time differences for past dates.</p>

	<ComponentExample
		code={`<DateDisplay date={new Date()} format="relative" />
<DateDisplay date={yesterday} format="relative" />
<DateDisplay date={lastWeek} format="relative" />
<DateDisplay date={lastMonth} format="relative" />`}
	>
		<div class="format-grid">
			<div class="format-item">
				<span class="format-label">Now</span>
				<DateDisplay date={now} format="relative" />
			</div>
			<div class="format-item">
				<span class="format-label">Yesterday</span>
				<DateDisplay date={yesterday} format="relative" />
			</div>
			<div class="format-item">
				<span class="format-label">Last week</span>
				<DateDisplay date={lastWeek} format="relative" />
			</div>
			<div class="format-item">
				<span class="format-label">Last month</span>
				<DateDisplay date={lastMonth} format="relative" />
			</div>
		</div>
	</ComponentExample>

	<h2>Relative Time (Future)</h2>
	<p>Future dates show upcoming time differences.</p>

	<ComponentExample
		code={`<DateDisplay date={tomorrow} format="relative" />
<DateDisplay date={nextWeek} format="relative" />`}
	>
		<div class="format-grid">
			<div class="format-item">
				<span class="format-label">Tomorrow</span>
				<DateDisplay date={tomorrow} format="relative" />
			</div>
			<div class="format-item">
				<span class="format-label">Next week</span>
				<DateDisplay date={nextWeek} format="relative" />
			</div>
		</div>
	</ComponentExample>

	<h2>With Time</h2>
	<p>
		Use <code>showTime</code> to include the time alongside the date.
	</p>

	<ComponentExample
		code={`<DateDisplay date={new Date()} format="short" showTime />
<DateDisplay date={new Date()} format="medium" showTime />
<DateDisplay date={new Date()} format="long" showTime />`}
	>
		<div class="format-grid">
			<div class="format-item">
				<span class="format-label">short + time</span>
				<DateDisplay date={now} format="short" showTime />
			</div>
			<div class="format-item">
				<span class="format-label">medium + time</span>
				<DateDisplay date={now} format="medium" showTime />
			</div>
			<div class="format-item">
				<span class="format-label">long + time</span>
				<DateDisplay date={now} format="long" showTime />
			</div>
		</div>
	</ComponentExample>

	<h2>Input Types</h2>
	<p>Accepts Date objects, ISO strings, or timestamps.</p>

	<ComponentExample
		code={`<DateDisplay date={new Date()} />
<DateDisplay date="2024-06-15T14:30:00Z" />
<DateDisplay date={1718451000000} />`}
	>
		<div class="format-grid">
			<div class="format-item">
				<span class="format-label">Date object</span>
				<DateDisplay date={now} />
			</div>
			<div class="format-item">
				<span class="format-label">ISO string</span>
				<DateDisplay date="2024-06-15T14:30:00Z" />
			</div>
			<div class="format-item">
				<span class="format-label">Timestamp</span>
				<DateDisplay date={1718451000000} />
			</div>
		</div>
	</ComponentExample>

	<h2>Null/Undefined Handling</h2>
	<p>When the date is null or undefined, a fallback is displayed.</p>

	<ComponentExample
		code={`<DateDisplay date={null} />
<DateDisplay date={undefined} />
<DateDisplay date={null} fallback="Not set" />
<DateDisplay date={null} fallback="--" />`}
	>
		<div class="format-grid">
			<div class="format-item">
				<span class="format-label">null (default)</span>
				<DateDisplay date={null} />
			</div>
			<div class="format-item">
				<span class="format-label">undefined</span>
				<DateDisplay date={undefined} />
			</div>
			<div class="format-item">
				<span class="format-label">Custom fallback</span>
				<DateDisplay date={null} fallback="Not set" />
			</div>
			<div class="format-item">
				<span class="format-label">Dash fallback</span>
				<DateDisplay date={null} fallback="--" />
			</div>
		</div>
	</ComponentExample>

	<h2>Locale</h2>
	<p>Change the locale for different date formatting conventions.</p>

	<ComponentExample
		code={`<DateDisplay date={new Date()} locale="en-CA" />
<DateDisplay date={new Date()} locale="en-US" />
<DateDisplay date={new Date()} locale="fr-CA" />
<DateDisplay date={new Date()} locale="de-DE" />`}
	>
		<div class="format-grid">
			<div class="format-item">
				<span class="format-label">en-CA</span>
				<DateDisplay date={now} locale="en-CA" />
			</div>
			<div class="format-item">
				<span class="format-label">en-US</span>
				<DateDisplay date={now} locale="en-US" />
			</div>
			<div class="format-item">
				<span class="format-label">fr-CA</span>
				<DateDisplay date={now} locale="fr-CA" />
			</div>
			<div class="format-item">
				<span class="format-label">de-DE</span>
				<DateDisplay date={now} locale="de-DE" />
			</div>
		</div>
	</ComponentExample>

	<h2>Use Cases</h2>

	<h3>Invoice Due Dates</h3>
	<ComponentExample
		code={`<DateDisplay date={tomorrow} format="medium" />
<DateDisplay date={lastWeek} format="relative" />`}
	>
		<div class="use-case-grid">
			<div class="use-case-item">
				<span class="use-case-label">Due date</span>
				<DateDisplay date={tomorrow} format="medium" />
			</div>
			<div class="use-case-item">
				<span class="use-case-label">Last activity</span>
				<DateDisplay date={lastWeek} format="relative" />
			</div>
		</div>
	</ComponentExample>

	<h3>Activity Timestamps</h3>
	<ComponentExample
		code={`<DateDisplay date={now} format="relative" />
<DateDisplay date={now} format="short" showTime />`}
	>
		<div class="use-case-grid">
			<div class="use-case-item">
				<span class="use-case-label">Updated</span>
				<DateDisplay date={now} format="relative" />
			</div>
			<div class="use-case-item">
				<span class="use-case-label">Created</span>
				<DateDisplay date={now} format="short" showTime />
			</div>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={dateDisplayProps} />

	<h2>Semantic HTML</h2>
	<CodeBlock
		code={`<!-- Renders as <time datetime="..."> for accessibility -->
<time class="date-display" datetime="2024-06-15T14:30:00.000Z">
  Jun 15, 2024
</time>

<!-- Fallback renders as <span> -->
<span class="date-display date-fallback">N/A</span>`}
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

	.format-grid {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.format-item {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.format-label {
		font-size: 0.75rem;
		font-family: var(--font-mono);
		color: #999;
		min-width: 100px;
	}

	.use-case-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.use-case-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 8px 0;
	}

	.use-case-label {
		font-size: 0.875rem;
		color: #666;
	}
</style>
