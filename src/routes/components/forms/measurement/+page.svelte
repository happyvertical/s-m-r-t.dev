<script lang="ts">
	import { MeasurementInput } from '@happyvertical/smrt-svelte';
	import type { MeasurementUnit } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	let heightValue = $state<number | null>(null);
	let heightUnit = $state<MeasurementUnit>('cm');
	let lengthValue = $state<number | null>(2);
	let lengthUnit = $state<MeasurementUnit>('m');
	let interactiveValue = $state<number | null>(null);
	let interactiveUnit = $state<MeasurementUnit>('m');

	const measurementProps = [
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
			description: 'Description text for voice extraction context'
		},
		{
			name: 'value',
			type: 'number | null',
			default: 'null',
			description: 'Current numeric value (bindable)'
		},
		{
			name: 'unit',
			type: 'MeasurementUnit',
			default: 'undefined',
			description: "Currently selected unit, e.g. 'cm' or 'ft' (bindable)"
		},
		{
			name: 'units',
			type: 'MeasurementUnit[]',
			default: 'undefined',
			description: 'Available units to choose from'
		},
		{
			name: 'placeholder',
			type: 'string',
			default: 'undefined',
			description: 'Placeholder text shown when empty'
		},
		{
			name: 'min',
			type: 'number',
			default: 'undefined',
			description: 'Minimum allowed value'
		},
		{
			name: 'max',
			type: 'number',
			default: 'undefined',
			description: 'Maximum allowed value'
		},
		{
			name: 'step',
			type: 'number',
			default: 'undefined',
			description: 'Step increment for the numeric value'
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
			name: 'error',
			type: 'string',
			default: 'undefined',
			description: 'Error message to display'
		},
		{
			name: 'onchange',
			type: '(measurement: MeasurementValue | null) => void',
			default: 'undefined',
			description: 'Callback when value or unit changes'
		}
	];

	const heightUnits: MeasurementUnit[] = ['cm', 'm', 'in', 'ft'];

	const distanceUnits: MeasurementUnit[] = ['m', 'cm', 'mm', 'ft', 'in', 'yd'];
</script>

<svelte:head>
	<title>MeasurementInput | s-m-r-t Forms</title>
	<meta
		name="description"
		content="Measurement input component with unit selection for physical quantities like length, weight, and temperature."
	/>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>MeasurementInput</span>
	</nav>

	<h1>MeasurementInput</h1>
	<p class="lead">
		A measurement input component combining a numeric value with a unit selector. The supported
		units are length units (<code>ft</code>, <code>in</code>, <code>m</code>, <code>cm</code>,
		<code>mm</code>, <code>yd</code>), making it ideal for heights, distances, and dimensions.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { MeasurementInput } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage - Height</h2>
	<p>Measure height with common length units like centimeters, meters, inches, or feet.</p>

	<ComponentExample
		code={`<script lang="ts">
  import type { MeasurementUnit } from '@happyvertical/smrt-svelte';

  const heightUnits: MeasurementUnit[] = ['cm', 'm', 'in', 'ft'];

  let value = $state<number | null>(null);
  let unit = $state<MeasurementUnit>('cm');
</script>

<MeasurementInput
  name="height"
  label="Height"
  units={heightUnits}
  bind:value
  bind:unit
/>`}
	>
		<MeasurementInput
			name="height"
			label="Height"
			units={heightUnits}
			bind:value={heightValue}
			bind:unit={heightUnit}
		/>
	</ComponentExample>

	<h2>With Default Value</h2>
	<p>Pre-populate the numeric value and unit.</p>

	<ComponentExample
		code={`<MeasurementInput
  name="length"
  label="Length"
  units={distanceUnits}
  value={2}
  unit="m"
/>`}
	>
		<MeasurementInput
			name="length"
			label="Length"
			units={distanceUnits}
			bind:value={lengthValue}
			bind:unit={lengthUnit}
		/>
	</ComponentExample>

	<h2>With Step and Range</h2>
	<p>
		Use <code>step</code> to control the numeric increment and <code>min</code>/<code>max</code> to constrain
		the value.
	</p>

	<ComponentExample
		code={`<MeasurementInput
  name="thickness"
  label="Thickness"
  units={distanceUnits}
  step={0.1}
  min={0}
  max={1000}
/>`}
	>
		<MeasurementInput
			name="thickness"
			label="Thickness"
			units={distanceUnits}
			step={0.1}
			min={0}
			max={1000}
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark the field as required.</p>

	<ComponentExample
		code={`<MeasurementInput
  name="distance"
  label="Distance"
  units={distanceUnits}
  required
/>`}
	>
		<MeasurementInput name="distance" label="Distance" units={distanceUnits} required />
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<MeasurementInput
  name="recorded"
  label="Recorded Length"
  units={distanceUnits}
  value={68.5}
  unit="cm"
  disabled
/>`}
	>
		<MeasurementInput
			name="recorded"
			label="Recorded Length"
			units={distanceUnits}
			value={68.5}
			unit="cm"
			disabled
		/>
	</ComponentExample>

	<h2>With Error</h2>
	<p>Display validation errors using the <code>error</code> prop.</p>

	<ComponentExample
		code={`<MeasurementInput
  name="invalid"
  label="Height"
  units={heightUnits}
  value={500}
  unit="cm"
  error="Height seems unusually high. Please verify."
/>`}
	>
		<MeasurementInput
			name="invalid"
			label="Height"
			units={heightUnits}
			value={500}
			unit="cm"
			error="Height seems unusually high. Please verify."
		/>
	</ComponentExample>

	<h2>Voice Input (smrt Mode)</h2>
	<p>In smrt mode, users can speak measurements with units naturally:</p>
	<ul>
		<li>"one hundred seventy five centimeters" → {'{'} value: 175, unit: 'cm' {'}'}</li>
		<li>"five foot ten" → {'{'} value: 5.83, unit: 'ft' {'}'} (converts 5'10" to decimal)</li>
		<li>"two point five meters" → {'{'} value: 2.5, unit: 'm' {'}'}</li>
		<li>"twelve inches" → {'{'} value: 12, unit: 'in' {'}'}</li>
		<li>"three yards" → {'{'} value: 3, unit: 'yd' {'}'}</li>
	</ul>

	<CodeBlock
		code={`<!-- Voice example: "one hundred seventy five centimeters" -->
<MeasurementInput
  name="voice"
  label="Height"
  description="A height measurement with units"
  units={heightUnits}
/>`}
		language="svelte"
	/>

	<h2>Interactive Example</h2>
	<p>Enter a measurement to see the combined value and unit:</p>

	<ComponentExample
		code={`<script lang="ts">
  import type { MeasurementUnit } from '@happyvertical/smrt-svelte';

  let value = $state<number | null>(null);
  let unit = $state<MeasurementUnit>('m');
</script>

<MeasurementInput
  name="interactive"
  label="Distance"
  units={distanceUnits}
  bind:value
  bind:unit
/>
<p>Value: {value ?? '(empty)'} {unit}</p>`}
	>
		<MeasurementInput
			name="interactive"
			label="Distance"
			units={distanceUnits}
			bind:value={interactiveValue}
			bind:unit={interactiveUnit}
		/>
		<p style="margin-top: 1rem; color: #666;">
			Value: {interactiveValue ?? '(empty)'}
			{interactiveUnit}
		</p>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={measurementProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { MeasurementInput } from '@happyvertical/smrt-svelte';
import type { MeasurementUnit, MeasurementValue } from '@happyvertical/smrt-svelte';

// Supported units (length only)
type MeasurementUnit = 'ft' | 'in' | 'm' | 'cm' | 'mm' | 'yd';

// Value emitted by onchange
interface MeasurementValue {
  value: number;
  unit: MeasurementUnit;
}

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  value?: number | null;   // bindable
  unit?: MeasurementUnit;  // bindable
  units?: MeasurementUnit[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onchange?: (measurement: MeasurementValue | null) => void;
}`}
		language="typescript"
	/>

	<h2>Supported Units</h2>
	<p>
		<code>units</code> is a list of <code>MeasurementUnit</code> values. The component supports length
		units only; pass any subset you want to offer:
	</p>

	<CodeBlock
		code={`import type { MeasurementUnit } from '@happyvertical/smrt-svelte';

// All supported units:
// 'ft' | 'in' | 'm' | 'cm' | 'mm' | 'yd'

// Metric height
const heightUnits: MeasurementUnit[] = ['cm', 'm', 'in', 'ft'];

// Full length set
const distanceUnits: MeasurementUnit[] = ['m', 'cm', 'mm', 'ft', 'in', 'yd'];

// Small dimensions
const dimensionUnits: MeasurementUnit[] = ['mm', 'cm', 'in'];`}
		language="typescript"
	/>

	<h2>Form Submission</h2>
	<p>The component submits two hidden fields for form integration:</p>
	<ul>
		<li><code>{`{name}_value`}</code> - The numeric value</li>
		<li><code>{`{name}_unit`}</code> - The selected unit</li>
	</ul>
	<p>
		For example, <code>name="height"</code> creates <code>height_value</code> and
		<code>height_unit</code> fields.
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
