<script lang="ts">
	import { SMRTMeasurement } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	let heightValue = $state<{ value: number | null, unit: string }>({ value: null, unit: 'cm' });
	let weightValue = $state<{ value: number | null, unit: string }>({ value: 75, unit: 'kg' });
	let temperatureValue = $state<{ value: number | null, unit: string }>({ value: null, unit: 'C' });
	let interactiveValue = $state<{ value: number | null, unit: string }>({ value: null, unit: 'm' });

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
			type: '{ value: number | null, unit: string }',
			default: '{ value: null, unit: "" }',
			description: 'Current measurement with value and unit (bindable)'
		},
		{
			name: 'units',
			type: 'Array<{value: string, label: string}>',
			description: 'Available units for measurement type',
			required: true
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
			name: 'decimals',
			type: 'number',
			default: '2',
			description: 'Number of decimal places'
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
			type: '(value: { value: number | null, unit: string }) => void',
			default: 'undefined',
			description: 'Callback when value or unit changes'
		}
	];

	const heightUnits = [
		{ value: 'cm', label: 'Centimeters' },
		{ value: 'm', label: 'Meters' },
		{ value: 'in', label: 'Inches' },
		{ value: 'ft', label: 'Feet' }
	];

	const weightUnits = [
		{ value: 'kg', label: 'Kilograms' },
		{ value: 'g', label: 'Grams' },
		{ value: 'lb', label: 'Pounds' },
		{ value: 'oz', label: 'Ounces' }
	];

	const temperatureUnits = [
		{ value: 'C', label: '°C' },
		{ value: 'F', label: '°F' },
		{ value: 'K', label: 'Kelvin' }
	];

	const distanceUnits = [
		{ value: 'm', label: 'Meters' },
		{ value: 'km', label: 'Kilometers' },
		{ value: 'mi', label: 'Miles' },
		{ value: 'ft', label: 'Feet' }
	];
</script>

<svelte:head>
	<title>SMRTMeasurement | SMRT Forms</title>
	<meta name="description" content="Measurement input component with unit selection for physical quantities like length, weight, and temperature." />
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>SMRTMeasurement</span>
	</nav>

	<h1>SMRTMeasurement</h1>
	<p class="lead">
		A measurement input component combining a numeric value with a unit selector. Perfect for
		physical quantities like height, weight, distance, temperature, and more.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { SMRTMeasurement } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage - Height</h2>
	<p>Measure height with common units like centimeters, meters, inches, or feet.</p>

	<ComponentExample
		code={`<script lang="ts">
  const heightUnits = [
    { value: 'cm', label: 'Centimeters' },
    { value: 'm', label: 'Meters' },
    { value: 'in', label: 'Inches' },
    { value: 'ft', label: 'Feet' }
  ];

  let value = $state({ value: null, unit: 'cm' });
</script>

<SMRTMeasurement
  name="height"
  label="Height"
  units={heightUnits}
  bind:value
/>`}
	>
		<SMRTMeasurement
			name="height"
			label="Height"
			units={heightUnits}
			bind:value={heightValue}
		/>
	</ComponentExample>

	<h2>Weight Measurement</h2>
	<p>Weight with default value and common units.</p>

	<ComponentExample
		code={`<SMRTMeasurement
  name="weight"
  label="Weight"
  units={weightUnits}
  value={{ value: 75, unit: 'kg' }}
/>`}
	>
		<SMRTMeasurement
			name="weight"
			label="Weight"
			units={weightUnits}
			bind:value={weightValue}
		/>
	</ComponentExample>

	<h2>Temperature with Precision</h2>
	<p>Temperature measurement with 1 decimal place precision.</p>

	<ComponentExample
		code={`<SMRTMeasurement
  name="temperature"
  label="Temperature"
  units={temperatureUnits}
  decimals={1}
  min={-273.15}
  max={1000}
  bind:value
/>`}
	>
		<SMRTMeasurement
			name="temperature"
			label="Temperature"
			units={temperatureUnits}
			decimals={1}
			min={-273.15}
			max={1000}
			bind:value={temperatureValue}
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark the field as required.</p>

	<ComponentExample
		code={`<SMRTMeasurement
  name="distance"
  label="Distance"
  units={distanceUnits}
  required
/>`}
	>
		<SMRTMeasurement
			name="distance"
			label="Distance"
			units={distanceUnits}
			required
		/>
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<SMRTMeasurement
  name="recorded"
  label="Recorded Weight"
  units={weightUnits}
  value={{ value: 68.5, unit: 'kg' }}
  disabled
/>`}
	>
		<SMRTMeasurement
			name="recorded"
			label="Recorded Weight"
			units={weightUnits}
			value={{ value: 68.5, unit: 'kg' }}
			disabled
		/>
	</ComponentExample>

	<h2>With Error</h2>
	<p>Display validation errors using the <code>error</code> prop.</p>

	<ComponentExample
		code={`<SMRTMeasurement
  name="invalid"
  label="Height"
  units={heightUnits}
  value={{ value: 500, unit: 'cm' }}
  error="Height seems unusually high. Please verify."
/>`}
	>
		<SMRTMeasurement
			name="invalid"
			label="Height"
			units={heightUnits}
			value={{ value: 500, unit: 'cm' }}
			error="Height seems unusually high. Please verify."
		/>
	</ComponentExample>

	<h2>Voice Input (SMRT Mode)</h2>
	<p>
		In SMRT mode, users can speak measurements with units naturally:
	</p>
	<ul>
		<li>"one hundred seventy five centimeters" → {'{'} value: 175, unit: 'cm' {'}'}</li>
		<li>"five foot ten" → {'{'} value: 5.83, unit: 'ft' {'}'} (converts 5'10" to decimal)</li>
		<li>"seventy five kilograms" → {'{'} value: 75, unit: 'kg' {'}'}</li>
		<li>"twenty two point five degrees celsius" → {'{'} value: 22.5, unit: 'C' {'}'}</li>
		<li>"ten miles" → {'{'} value: 10, unit: 'mi' {'}'}</li>
	</ul>

	<CodeBlock
		code={`<!-- Voice example: "one hundred seventy five centimeters" -->
<SMRTMeasurement
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
  let value = $state({ value: null, unit: 'm' });
</script>

<SMRTMeasurement
  name="interactive"
  label="Distance"
  units={distanceUnits}
  bind:value
/>
<p>Value: {value.value ?? '(empty)'} {value.unit}</p>`}
	>
		<SMRTMeasurement
			name="interactive"
			label="Distance"
			units={distanceUnits}
			bind:value={interactiveValue}
		/>
		<p style="margin-top: 1rem; color: #666;">
			Value: {interactiveValue.value ?? '(empty)'} {interactiveValue.unit}
		</p>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={measurementProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { SMRTMeasurement } from '@happyvertical/smrt-svelte';

// Measurement value interface
interface MeasurementValue {
  value: number | null;
  unit: string;
}

// Unit option interface
interface Unit {
  value: string;
  label: string;
}

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  value?: MeasurementValue;
  units: Unit[];
  min?: number;
  max?: number;
  decimals?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onchange?: (value: MeasurementValue) => void;
}`}
		language="typescript"
	/>

	<h2>Common Unit Sets</h2>
	<p>Pre-defined unit arrays for common measurement types:</p>

	<CodeBlock
		code={`// Length/Height
const heightUnits = [
  { value: 'cm', label: 'Centimeters' },
  { value: 'm', label: 'Meters' },
  { value: 'in', label: 'Inches' },
  { value: 'ft', label: 'Feet' }
];

// Weight/Mass
const weightUnits = [
  { value: 'kg', label: 'Kilograms' },
  { value: 'g', label: 'Grams' },
  { value: 'lb', label: 'Pounds' },
  { value: 'oz', label: 'Ounces' }
];

// Temperature
const temperatureUnits = [
  { value: 'C', label: '°C' },
  { value: 'F', label: '°F' },
  { value: 'K', label: 'Kelvin' }
];

// Distance
const distanceUnits = [
  { value: 'm', label: 'Meters' },
  { value: 'km', label: 'Kilometers' },
  { value: 'mi', label: 'Miles' },
  { value: 'ft', label: 'Feet' }
];

// Volume
const volumeUnits = [
  { value: 'ml', label: 'Milliliters' },
  { value: 'l', label: 'Liters' },
  { value: 'cup', label: 'Cups' },
  { value: 'gal', label: 'Gallons' }
];`}
		language="typescript"
	/>

	<h2>Form Submission</h2>
	<p>
		The component submits two hidden fields for form integration:
	</p>
	<ul>
		<li><code>{`{name}_value`}</code> - The numeric value</li>
		<li><code>{`{name}_unit`}</code> - The selected unit</li>
	</ul>
	<p>
		For example, <code>name="height"</code> creates <code>height_value</code> and <code>height_unit</code> fields.
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
