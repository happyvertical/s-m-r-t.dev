<script lang="ts">
	import { TextInput, SelectInput, CheckboxInput, DateTimeInput } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';

	let textValue = $state('');
	let selectValue = $state('');
	let checked = $state(false);
	let dateValue = $state('');

	const selectOptions = [
		{ value: 'option1', label: 'Option 1' },
		{ value: 'option2', label: 'Option 2' },
		{ value: 'option3', label: 'Option 3' }
	];
</script>

<svelte:head>
	<title>Form Components | s-m-r-t Framework</title>
</svelte:head>

<div class="page">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<span>Forms</span>
	</nav>

	<header class="page-header">
		<h1>Form Components</h1>
		<p class="subtitle">Input components with smrt mode voice support</p>
	</header>

	<section class="intro">
		<p>
			Form components extend standard HTML inputs with Material Design 3 styling and
			voice input capabilities in smrt mode. All components support natural language
			input when voice mode is active.
		</p>
	</section>

	<section class="component-section">
		<h2>TextInput</h2>
		<p>Text input with voice support in smrt mode.</p>

		<ComponentExample
			code={`<TextInput
  name="example"
  label="Full Name"
  description="Your first and last name"
  bind:value
/>`}
		>
			<TextInput
				name="example"
				label="Full Name"
				description="Your first and last name"
				bind:value={textValue}
			/>
		</ComponentExample>

		<p class="docs-link">
			<a href="/components/forms/text-input">View TextInput documentation →</a>
		</p>
	</section>

	<section class="component-section">
		<h2>SelectInput</h2>
		<p>Dropdown select with voice selection support.</p>

		<ComponentExample
			code={`<SelectInput
  name="country"
  label="Country"
  options={selectOptions}
  bind:value
/>`}
		>
			<SelectInput
				name="country"
				label="Country"
				options={selectOptions}
				bind:value={selectValue}
			/>
		</ComponentExample>

		<p class="docs-link">
			<a href="/components/forms/smrt-select">View SelectInput documentation →</a>
		</p>
	</section>

	<section class="component-section">
		<h2>CheckboxInput</h2>
		<p>Checkbox with voice control support.</p>

		<ComponentExample
			code={`<CheckboxInput
  name="agree"
  label="I agree to the terms"
  description="Say yes or no"
  bind:checked
/>`}
		>
			<CheckboxInput
				name="agree"
				label="I agree to the terms"
				description="Say yes or no"
				bind:checked={checked}
			/>
		</ComponentExample>

		<p class="docs-link">
			<a href="/components/forms/checkbox">View CheckboxInput documentation →</a>
		</p>
	</section>

	<section class="component-section">
		<h2>DateTimeInput</h2>
		<p>Date and time picker with natural language support.</p>

		<ComponentExample
			code={`<DateTimeInput
  name="appointment"
  label="Appointment Time"
  description="Say something like 'next Tuesday at 3pm'"
  bind:value
/>`}
		>
			<DateTimeInput
				name="appointment"
				label="Appointment Time"
				description="Say something like 'next Tuesday at 3pm'"
				bind:value={dateValue}
			/>
		</ComponentExample>

		<p class="docs-link">
			<a href="/components/forms/datetime">View DateTimeInput documentation →</a>
		</p>
	</section>

	<section class="all-components">
		<h2>All Form Components</h2>
		<div class="component-grid">
			<a href="/components/forms/text-input" class="component-link">TextInput</a>
			<a href="/components/forms/smrt-select" class="component-link">SelectInput</a>
			<a href="/components/forms/checkbox" class="component-link">CheckboxInput</a>
			<a href="/components/forms/datetime" class="component-link">DateTimeInput</a>
			<a href="/components/forms/address" class="component-link">AddressInput</a>
			<a href="/components/forms/money" class="component-link">MoneyInput</a>
		</div>
	</section>

	<section class="voice-section">
		<h2>Voice Input</h2>
		<p>
			In smrt mode, form inputs display a microphone button. Users can hold the button
			and speak naturally to fill in values. Each component type has specific voice
			command patterns - see individual component docs for details.
		</p>
		<CodeBlock
			code={`<!-- Example voice commands for TextInput -->
"John Smith"           → fills text input
"yes" / "no"           → toggles checkbox
"next Tuesday at 3pm"  → sets date/time
"Canada"               → selects from dropdown`}
			language="text"
		/>
	</section>
</div>

<style>
	.page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 48px 24px;
	}

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

	.page-header {
		margin-bottom: 32px;
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.subtitle {
		color: #666;
		font-size: 1.1rem;
	}

	section {
		margin-bottom: 64px;
	}

	.intro p {
		font-size: 1.1rem;
		color: #666;
		line-height: 1.6;
		max-width: 700px;
	}

	.component-section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.component-section > p {
		color: #666;
		margin-bottom: 24px;
	}

	.docs-link {
		margin-top: 16px;
	}

	.docs-link a {
		color: var(--color-accent);
		text-decoration: none;
		font-weight: 500;
	}

	.docs-link a:hover {
		text-decoration: underline;
	}

	.all-components h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.component-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 12px;
	}

	.component-link {
		display: block;
		padding: 16px 20px;
		background: #f5f5f5;
		border-radius: 8px;
		color: var(--color-text);
		text-decoration: none;
		font-weight: 500;
		transition: background 0.2s;
	}

	.component-link:hover {
		background: #e8e8e8;
	}

	.voice-section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.voice-section > p {
		color: #666;
		line-height: 1.6;
		margin-bottom: 24px;
	}
</style>
