<script lang="ts">
	import { DateTimeInput } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	let dateTimeValue = $state('');
	let dateOnlyValue = $state('');
	let presetValue = $state('2025-03-15T14:30');

	const dateTimeProps = [
		{
			name: 'name',
			type: 'string',
			description: 'Field name for form submission',
			required: true
		},
		{
			name: 'label',
			type: 'string',
			default: 'undefined',
			description: 'Field label displayed above the input'
		},
		{
			name: 'description',
			type: 'string',
			default: 'undefined',
			description: 'Description text for LLM field extraction'
		},
		{
			name: 'includeTime',
			type: 'boolean',
			default: 'true',
			description: 'Include time picker (false for date-only)'
		},
		{
			name: 'placeholder',
			type: 'string',
			default: "'e.g., next Tuesday at 3pm'",
			description: 'Placeholder text shown when empty'
		},
		{
			name: 'value',
			type: 'string',
			default: "''",
			description: 'Current value in ISO format (bindable)'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables the input'
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Marks field as required'
		},
		{
			name: 'onchange',
			type: '(value: string) => void',
			default: 'undefined',
			description: 'Callback when value changes'
		}
	];
</script>

<svelte:head>
	<title>DateTimeInput | SMRT Forms</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>DateTimeInput</span>
	</nav>

	<h1>DateTimeInput</h1>
	<p class="lead">
		A smart date and time picker with natural language support in SMRT mode. Users can speak
		dates like "next Tuesday at 3pm" and the component parses them automatically using chrono-node.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { DateTimeInput } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>A date and time picker with native browser controls in standard mode.</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state('');
</script>

<DateTimeInput
  name="appointment"
  label="Appointment Date & Time"
  bind:value
/>`}
	>
		<DateTimeInput
			name="appointment"
			label="Appointment Date & Time"
			bind:value={dateTimeValue}
		/>
	</ComponentExample>

	<h2>Date Only</h2>
	<p>Set <code>includeTime={false}</code> for a date-only picker.</p>

	<ComponentExample
		code={`<DateTimeInput
  name="birthdate"
  label="Date of Birth"
  includeTime={false}
  placeholder="e.g., March 15, 1990"
  bind:value
/>`}
	>
		<DateTimeInput
			name="birthdate"
			label="Date of Birth"
			includeTime={false}
			placeholder="e.g., March 15, 1990"
			bind:value={dateOnlyValue}
		/>
	</ComponentExample>

	<h2>With Default Value</h2>
	<p>Set an initial value in ISO format (YYYY-MM-DDTHH:mm for datetime, YYYY-MM-DD for date).</p>

	<ComponentExample
		code={`<DateTimeInput
  name="meeting"
  label="Meeting Time"
  value="2025-03-15T14:30"
/>`}
	>
		<DateTimeInput
			name="meeting"
			label="Meeting Time"
			bind:value={presetValue}
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark the field as required.</p>

	<ComponentExample
		code={`<DateTimeInput
  name="deadline"
  label="Deadline"
  required
/>`}
	>
		<DateTimeInput
			name="deadline"
			label="Deadline"
			required
		/>
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<DateTimeInput
  name="locked"
  label="Locked Date"
  value="2025-01-01T00:00"
  disabled
/>`}
	>
		<DateTimeInput
			name="locked"
			label="Locked Date"
			value="2025-01-01T00:00"
			disabled
		/>
	</ComponentExample>

	<h2>With Description</h2>
	<p>Add a <code>description</code> for additional context.</p>

	<ComponentExample
		code={`<DateTimeInput
  name="event"
  label="Event Start"
  description="When should the event begin?"
/>`}
	>
		<DateTimeInput
			name="event"
			label="Event Start"
			description="When should the event begin?"
		/>
	</ComponentExample>

	<h2>Natural Language Input (SMRT Mode)</h2>
	<p>
		In SMRT mode, users can speak natural language dates. The component uses chrono-node to parse
		phrases like:
	</p>
	<ul>
		<li>"next Tuesday at 3pm"</li>
		<li>"tomorrow morning"</li>
		<li>"March 15th 2025"</li>
		<li>"in two weeks"</li>
		<li>"last Friday"</li>
	</ul>

	<CodeBlock
		code={`<!-- In SMRT mode, users can hold the mic and say natural language dates -->
<DateTimeInput
  name="flexible"
  label="Flexible Date"
  placeholder="Say a date like 'next Tuesday at 3pm'"
  description="Date and time for the appointment"
/>`}
		language="svelte"
	/>

	<h2>Interactive Example</h2>
	<p>Select a date and time to see the ISO value:</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state('');
</script>

<DateTimeInput
  name="interactive"
  label="Pick a date and time"
  bind:value
/>
<p>ISO Value: {value || '(none)'}</p>`}
	>
		<DateTimeInput
			name="interactive"
			label="Pick a date and time"
			bind:value={dateTimeValue}
		/>
		<p style="margin-top: 1rem; color: #666;">ISO Value: {dateTimeValue || '(none)'}</p>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={dateTimeProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { DateTimeInput } from '@happyvertical/smrt-svelte';

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  includeTime?: boolean;
  placeholder?: string;
  value?: string; // ISO format: YYYY-MM-DDTHH:mm or YYYY-MM-DD
  disabled?: boolean;
  required?: boolean;
  onchange?: (value: string) => void;
}`}
		language="typescript"
	/>

	<h2>Value Format</h2>
	<p>The component uses ISO date format:</p>
	<ul>
		<li>With time: <code>2025-03-15T14:30</code> (YYYY-MM-DDTHH:mm)</li>
		<li>Date only: <code>2025-03-15</code> (YYYY-MM-DD)</li>
	</ul>
	<p>The display value is automatically formatted to the user's locale for readability.</p>
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
