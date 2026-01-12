<script lang="ts">
	import { SMRTDateRange } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let basicRange = $state({ start: '', end: '' });
	let vacationRange = $state({ start: '2025-07-01', end: '2025-07-14' });
	let flexibleRange = $state({ start: '', end: '' });

	const dateRangeProps = [
		{
			name: 'name',
			type: 'string',
			description: 'Field name prefix for form submission',
			required: true
		},
		{
			name: 'label',
			type: 'string',
			default: 'undefined',
			description: 'Field label displayed above the range'
		},
		{
			name: 'description',
			type: 'string',
			default: 'undefined',
			description: 'Description text for voice extraction context'
		},
		{
			name: 'value',
			type: '{ start: string, end: string }',
			default: "{ start: '', end: '' }",
			description: 'Current date range in ISO format (bindable)'
		},
		{
			name: 'min',
			type: 'string',
			default: 'undefined',
			description: 'Minimum allowed date (ISO format)'
		},
		{
			name: 'max',
			type: 'string',
			default: 'undefined',
			description: 'Maximum allowed date (ISO format)'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables both inputs'
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Marks both fields as required'
		},
		{
			name: 'error',
			type: 'string',
			default: 'undefined',
			description: 'Error message to display'
		},
		{
			name: 'onchange',
			type: '(value: { start: string, end: string }) => void',
			default: 'undefined',
			description: 'Callback when either date changes'
		}
	];
</script>

<svelte:head>
	<title>SMRTDateRange | SMRT Forms</title>
	<meta name="description" content="Date range picker component for selecting start and end dates with validation." />
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>SMRTDateRange</span>
	</nav>

	<h1>SMRTDateRange</h1>
	<p class="lead">
		A date range picker with start and end date inputs. Automatically validates that end date
		comes after start date, with support for natural language in SMRT mode.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { SMRTDateRange } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>A simple date range picker with start and end date fields.</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state({ start: '', end: '' });
</script>

<SMRTDateRange
  name="daterange"
  label="Select Date Range"
  bind:value
/>`}
	>
		<SMRTDateRange
			name="daterange"
			label="Select Date Range"
			bind:value={basicRange}
		/>
	</ComponentExample>

	<h2>With Default Values</h2>
	<p>Pre-populate with start and end dates.</p>

	<ComponentExample
		code={`<SMRTDateRange
  name="vacation"
  label="Vacation Period"
  value={{ start: '2025-07-01', end: '2025-07-14' }}
/>`}
	>
		<SMRTDateRange
			name="vacation"
			label="Vacation Period"
			bind:value={vacationRange}
		/>
	</ComponentExample>

	<h2>With Constraints</h2>
	<p>Use <code>min</code> and <code>max</code> to limit the selectable date range.</p>

	<ComponentExample
		code={`<SMRTDateRange
  name="booking"
  label="Booking Dates"
  min="2025-01-01"
  max="2025-12-31"
  description="Select dates within 2025"
/>`}
	>
		<SMRTDateRange
			name="booking"
			label="Booking Dates"
			min="2025-01-01"
			max="2025-12-31"
			description="Select dates within 2025"
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark both dates as required.</p>

	<ComponentExample
		code={`<SMRTDateRange
  name="availability"
  label="Availability Period"
  required
/>`}
	>
		<SMRTDateRange
			name="availability"
			label="Availability Period"
			required
		/>
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<SMRTDateRange
  name="confirmed"
  label="Confirmed Period"
  value={{ start: '2025-03-01', end: '2025-03-15' }}
  disabled
/>`}
	>
		<SMRTDateRange
			name="confirmed"
			label="Confirmed Period"
			value={{ start: '2025-03-01', end: '2025-03-15' }}
			disabled
		/>
	</ComponentExample>

	<h2>With Error</h2>
	<p>Display validation errors using the <code>error</code> prop.</p>

	<ComponentExample
		code={`<SMRTDateRange
  name="invalid"
  label="Date Range"
  value={{ start: '2025-03-15', end: '2025-03-01' }}
  error="End date must be after start date"
/>`}
	>
		<SMRTDateRange
			name="invalid"
			label="Date Range"
			value={{ start: '2025-03-15', end: '2025-03-01' }}
			error="End date must be after start date"
		/>
	</ComponentExample>

	<h2>Voice Input (SMRT Mode)</h2>
	<p>
		In SMRT mode, users can speak date ranges naturally. Examples:
	</p>
	<ul>
		<li>"from March first to March fifteenth"</li>
		<li>"July first through July fourteenth"</li>
		<li>"next week Monday to Friday"</li>
		<li>"from tomorrow to next Thursday"</li>
		<li>"January through March" (first and last day of months)</li>
	</ul>

	<CodeBlock
		code={`<!-- Voice example: "from March first to March fifteenth" -->
<SMRTDateRange
  name="voice"
  label="Date Range"
  description="A range with start and end dates"
/>`}
		language="svelte"
	/>

	<h2>Interactive Example</h2>
	<p>Select dates to see the range and calculated duration:</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state({ start: '', end: '' });

  $: duration = value.start && value.end
    ? Math.ceil((new Date(value.end).getTime() - new Date(value.start).getTime()) / (1000 * 60 * 60 * 24))
    : null;
</script>

<SMRTDateRange
  name="interactive"
  label="Select Range"
  bind:value
/>
<p>Range: {value.start || '(none)'} to {value.end || '(none)'}</p>
<p>Duration: {duration ? \`\${duration} days\` : 'N/A'}</p>`}
	>
		<SMRTDateRange
			name="interactive"
			label="Select Range"
			bind:value={flexibleRange}
		/>
		<div style="margin-top: 1rem; color: #666;">
			<p>Range: {flexibleRange.start || '(none)'} to {flexibleRange.end || '(none)'}</p>
			<p>Duration: {flexibleRange.start && flexibleRange.end
				? `${Math.ceil((new Date(flexibleRange.end).getTime() - new Date(flexibleRange.start).getTime()) / (1000 * 60 * 60 * 24))} days`
				: 'N/A'}</p>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={dateRangeProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { SMRTDateRange } from '@happyvertical/smrt-svelte';

// DateRange interface
interface DateRange {
  start: string; // ISO date format (YYYY-MM-DD)
  end: string;   // ISO date format (YYYY-MM-DD)
}

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  value?: DateRange;
  min?: string; // ISO date format
  max?: string; // ISO date format
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onchange?: (value: DateRange) => void;
}`}
		language="typescript"
	/>

	<h2>Validation</h2>
	<p>
		The component automatically validates:
	</p>
	<ul>
		<li>End date must be after or equal to start date</li>
		<li>Dates must be within <code>min</code>/<code>max</code> bounds if specified</li>
		<li>Both dates required when <code>required</code> is true</li>
		<li>ISO date format (YYYY-MM-DD)</li>
	</ul>
	<p>
		Form submission includes two fields: <code>{`{name}_start`}</code> and <code>{`{name}_end`}</code>.
	</p>
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

	.prose ul {
		color: #666;
		margin-bottom: 16px;
		padding-left: 24px;
	}

	.prose li {
		margin-bottom: 8px;
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
