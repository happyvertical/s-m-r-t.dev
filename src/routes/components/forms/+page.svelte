<script lang="ts">
	const components = [
		{
			name: 'TextInput',
			href: '/components/forms/text-input',
			description: 'Material Design 3 text input with optional voice input support in SMRT mode.'
		},
		{
			name: 'Select',
			href: '/components/forms/smrt-select',
			description: 'Styled select dropdown with support for voice selection in SMRT mode.'
		},
		{
			name: 'CheckboxInput',
			href: '/components/forms/checkbox',
			description: 'Checkbox with ripple effect and voice control support in SMRT mode.'
		},
		{
			name: 'DateTimeInput',
			href: '/components/forms/datetime',
			description: 'Date and time picker with natural language parsing via chrono-node.'
		},
		{
			name: 'AddressInput',
			href: '/components/forms/address',
			description: 'Comprehensive address input with intelligent address parsing.'
		},
		{
			name: 'MoneyInput',
			href: '/components/forms/money',
			description: 'Monetary input storing values in cents for precision calculations.'
		}
	];
</script>

<svelte:head>
	<title>Forms | SMRT Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<span>Forms</span>
	</nav>

	<h1>SMRT Form Components</h1>
	<p class="lead">
		Voice-enabled form components that work in both standard and SMRT modes. In SMRT mode,
		users can interact with forms using natural speech, making data entry faster and more accessible.
	</p>

	<section class="install">
		<h2>Installation</h2>
		<pre><code>npm install @happyvertical/smrt-svelte</code></pre>
		<pre><code>{`import { TextInput, Select, CheckboxInput } from '@happyvertical/smrt-svelte';`}</code></pre>
	</section>

	<section class="components">
		<h2>Components</h2>
		<div class="component-grid">
			{#each components as component}
				<a href={component.href} class="component-card">
					<h3>{component.name}</h3>
					<p>{component.description}</p>
				</a>
			{/each}
		</div>
	</section>

	<section class="modes">
		<h2>Operating Modes</h2>
		<p>
			SMRT form components automatically adapt based on the application mode:
		</p>

		<div class="mode-grid">
			<div class="mode-card">
				<h3>Standard Mode</h3>
				<p>Traditional keyboard and mouse input with native browser controls for date/time pickers.</p>
			</div>
			<div class="mode-card">
				<h3>SMRT Mode</h3>
				<p>Voice input enabled. Hold the microphone button to speak naturally. Speech is processed locally using Whisper for privacy.</p>
			</div>
		</div>
	</section>

	<section class="form-context">
		<h2>Form Context</h2>
		<p>
			Wrap your form components in <code>Form</code> to enable automatic field registration
			and voice-to-form processing:
		</p>
		<pre><code>{`<script>
  import { Form, TextInput, Select } from '@happyvertical/smrt-svelte';

  let formData = $state({
    name: '',
    email: '',
    country: ''
  });
</script>

<Form>
  <TextInput name="name" label="Full Name" bind:value={formData.name} />
  <TextInput name="email" label="Email" type="email" bind:value={formData.email} />
  <Select name="country" label="Country" options={countries} bind:value={formData.country} />
</Form>`}</code></pre>
	</section>
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

	.install,
	.components,
	.modes,
	.form-context {
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.form-context {
		border-bottom: none;
	}

	h2 {
		font-size: 1.1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 16px;
	}

	.prose p {
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
	}

	pre {
		background: #1a1a1a;
		color: #f0f0f0;
		padding: 16px 20px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		margin-bottom: 16px;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}

	.component-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.component-card {
		padding: 20px;
		background: #fafafa;
		text-decoration: none;
		transition: all 0.2s;
	}

	.component-card:hover {
		background: #f0f0f0;
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.component-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 8px;
		color: #1a1a1a;
	}

	.component-card:hover h3 {
		color: var(--color-accent);
	}

	.component-card p {
		font-size: 0.85rem;
		color: #666;
		line-height: 1.5;
	}

	.mode-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.mode-card {
		padding: 20px;
		background: #fafafa;
	}

	.mode-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.mode-card p {
		font-size: 0.85rem;
		color: #666;
		line-height: 1.5;
	}

	@media (max-width: 800px) {
		.component-grid,
		.mode-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
